/**
 * ==============================================================================
 * CCIS CLASS IX STUDENT PERFORMANCE & TARGET TRACKER - GOOGLE APPS SCRIPT v4
 * ==============================================================================
 * 
 * UNIFIED MASTER SHEET (Class-IX):
 * Maintains ONE consolidated master tab for all Class IX students across
 * sections (AURA, ZEN, NEO) with 5-exam tracking and automated target
 * achievement comparison.
 * 
 * 5-EXAM STRUCTURE:
 *   E1 = Pre Mid Term (/20)  — 10% weight
 *   E2 = Mid Term (/20)      — 10% weight
 *   E3 = Half Yearly (/80)   — 20% weight
 *   E4 = PT-2 (/20)          — 10% weight
 *   E5 = Final Exam (/80)    — 50% weight
 * 
 * COLUMN STRUCTURE (Row 1):
 *   [A] S.NO
 *   [B] ENROLLMENT NUMBER
 *   [C] STUDENT NAME
 *   [D] SECTION (AURA / ZEN / NEO)
 *   [E] TARGET %
 *   [F - K]   E1-ENG | E1-MATH | E1-SST | E1-HSF | E1-SCI | E1-IT  (Pre Mid Term /20)
 *   [L - Q]   E2-ENG | E2-MATH | E2-SST | E2-HSF | E2-SCI | E2-IT  (Mid Term /20)
 *   [R - W]   E3-ENG | E3-MATH | E3-SST | E3-HSF | E3-SCI | E3-IT  (Half Yearly /80)
 *   [X - AC]  E4-ENG | E4-MATH | E4-SST | E4-HSF | E4-SCI | E4-IT  (PT-2 /20)
 *   [AD - AI] E5-ENG | E5-MATH | E5-SST | E5-HSF | E5-SCI | E5-IT  (Final /80)
 * 
 * INSTRUCTIONS:
 * 1. In your Google Sheet, click "Extensions" -> "Apps Script".
 * 2. Replace any existing code in Code.gs with this entire script.
 * 3. Click "Save" (Ctrl+S).
 * 4. Refresh your Google Sheet. You will see a new menu: "🎓 CCIS Portal Sync".
 * 5. Run "📤 Push Portal Data to Sheet" to populate the single Class-IX tab.
 * 6. To enable automatic live sync on edit:
 *    - Click "Triggers" (alarm clock icon on left sidebar).
 *    - Click "+ Add Trigger".
 *    - Choose function: "handleInstallableEdit".
 *    - Event source: "From spreadsheet".
 *    - Event type: "On edit".
 *    - Click Save.
 * ==============================================================================
 */

// Default Configuration
const CONFIG = {
  DEFAULT_ENDPOINT: "https://us-central1-skillizee-products.cloudfunctions.net/syncClass9Performance",
  DEFAULT_SECRET: "ccis-alumni-sync-2026",
  MASTER_TAB_NAME: "Class-IX",
  LEGACY_TABS: ["IX-AURA", "IX-ZEN", "IX-NEO"],
};

/**
 * Safely retrieve UI context without crashing when run from the Apps Script editor console
 */
function safeGetUi() {
  try {
    return SpreadsheetApp.getUi();
  } catch (e) {
    return null;
  }
}

/**
 * Creates custom menu in Google Sheets
 */
function onOpen() {
  var ui = safeGetUi();
  if (!ui) return;
  ui.createMenu("🎓 CCIS Portal Sync")
    .addItem("⚡ Sync Sheet Data to Portal", "syncMasterSheet")
    .addSeparator()
    .addItem("📤 Push Portal Data to Sheet (Single Master Tab)", "pushCurrentDataToSheet")
    .addSeparator()
    .addItem("⚙️ Check Connection & Setup", "checkConnection")
    .addToUi();
}

/**
 * Get endpoint and secret from Script Properties or defaults
 */
function getSettings() {
  const props = PropertiesService.getScriptProperties();
  const endpoint = props.getProperty("SYNC_ENDPOINT") || CONFIG.DEFAULT_ENDPOINT;
  const secret = props.getProperty("SYNC_SECRET") || CONFIG.DEFAULT_SECRET;
  return { endpoint, secret };
}

/**
 * Helper to locate column indices by header names in Row 1.
 */
function getColumnMapping(headerRow) {
  const mapping = {
    sNo: undefined,
    enrollment: undefined,
    name: undefined,
    section: undefined,
    target: undefined,
    overall: undefined,
    exam1: {},
    exam2: {},
    exam3: {},
    exam4: {},
    exam5: {},
  };

  for (var c = 0; c < headerRow.length; c++) {
    var val = String(headerRow[c] || "").trim().toUpperCase();
    if (!val) continue;

    // ─── Exam-1 prefixed columns (E1-...) ───
    if (val.match(/^E1[\-\s]/)) {
      var subj1 = val.replace(/^E1[\-\s]+/, "");
      if (subj1.includes("ENG")) mapping.exam1.english = c;
      else if (subj1.includes("MATH")) mapping.exam1.maths = c;
      else if (subj1.includes("SST") || subj1.includes("S.ST") || subj1.includes("S ST")) mapping.exam1.sSt = c;
      else if (subj1.includes("HSF") || subj1.includes("H/S/F") || subj1.includes("HINDI") || subj1.includes("FRENCH") || subj1.includes("SANSKRIT")) mapping.exam1.hsf = c;
      else if (subj1.includes("SCI")) mapping.exam1.science = c;
      else if (subj1 === "IT" || subj1.includes("INFO")) mapping.exam1.it = c;
      continue;
    }

    // ─── Exam-2 prefixed columns (E2-...) ───
    if (val.match(/^E2[\-\s]/)) {
      var subj2 = val.replace(/^E2[\-\s]+/, "");
      if (subj2.includes("ENG")) mapping.exam2.english = c;
      else if (subj2.includes("MATH")) mapping.exam2.maths = c;
      else if (subj2.includes("SST") || subj2.includes("S.ST") || subj2.includes("S ST")) mapping.exam2.sSt = c;
      else if (subj2.includes("HSF") || subj2.includes("H/S/F") || subj2.includes("HINDI") || subj2.includes("FRENCH") || subj2.includes("SANSKRIT")) mapping.exam2.hsf = c;
      else if (subj2.includes("SCI")) mapping.exam2.science = c;
      else if (subj2 === "IT" || subj2.includes("INFO")) mapping.exam2.it = c;
      continue;
    }

    // ─── Exam-3 prefixed columns (E3-...) ───
    if (val.match(/^E3[\-\s]/)) {
      var subj3 = val.replace(/^E3[\-\s]+/, "");
      if (subj3.includes("ENG")) mapping.exam3.english = c;
      else if (subj3.includes("MATH")) mapping.exam3.maths = c;
      else if (subj3.includes("SST") || subj3.includes("S.ST") || subj3.includes("S ST")) mapping.exam3.sSt = c;
      else if (subj3.includes("HSF") || subj3.includes("H/S/F") || subj3.includes("HINDI") || subj3.includes("FRENCH") || subj3.includes("SANSKRIT")) mapping.exam3.hsf = c;
      else if (subj3.includes("SCI")) mapping.exam3.science = c;
      else if (subj3 === "IT" || subj3.includes("INFO")) mapping.exam3.it = c;
      continue;
    }

    // ─── Exam-4 prefixed columns (E4-...) ───
    if (val.match(/^E4[\-\s]/)) {
      var subj4 = val.replace(/^E4[\-\s]+/, "");
      if (subj4.includes("ENG")) mapping.exam4.english = c;
      else if (subj4.includes("MATH")) mapping.exam4.maths = c;
      else if (subj4.includes("SST") || subj4.includes("S.ST") || subj4.includes("S ST")) mapping.exam4.sSt = c;
      else if (subj4.includes("HSF") || subj4.includes("H/S/F") || subj4.includes("HINDI") || subj4.includes("FRENCH") || subj4.includes("SANSKRIT")) mapping.exam4.hsf = c;
      else if (subj4.includes("SCI")) mapping.exam4.science = c;
      else if (subj4 === "IT" || subj4.includes("INFO")) mapping.exam4.it = c;
      continue;
    }

    // ─── Exam-5 prefixed columns (E5-...) ───
    if (val.match(/^E5[\-\s]/)) {
      var subj5 = val.replace(/^E5[\-\s]+/, "");
      if (subj5.includes("ENG")) mapping.exam5.english = c;
      else if (subj5.includes("MATH")) mapping.exam5.maths = c;
      else if (subj5.includes("SST") || subj5.includes("S.ST") || subj5.includes("S ST")) mapping.exam5.sSt = c;
      else if (subj5.includes("HSF") || subj5.includes("H/S/F") || subj5.includes("HINDI") || subj5.includes("FRENCH") || subj5.includes("SANSKRIT")) mapping.exam5.hsf = c;
      else if (subj5.includes("SCI")) mapping.exam5.science = c;
      else if (subj5 === "IT" || subj5.includes("INFO")) mapping.exam5.it = c;
      continue;
    }

    // ─── Standard columns ───
    if (val.includes("S") && val.includes("NO") && !val.includes("SCI")) mapping.sNo = c;
    else if (val.includes("ENROLL")) mapping.enrollment = c;
    else if (val.includes("STUDENT") && val.includes("NAME")) mapping.name = c;
    else if (val === "NAME") mapping.name = c;
    else if (val === "SECTION" || val === "SEC" || val === "GROUP") mapping.section = c;
    else if (val.includes("TARGET")) mapping.target = c;
    else if (val.includes("OVERALL")) mapping.overall = c;

    // Backward compatibility: unprefixed subject columns map to exam1
    else if (val === "ENGLISH" || (val.includes("ENG") && !val.match(/^E\d/))) mapping.exam1.english = c;
    else if ((val === "MATHS" || val.includes("MATH")) && !val.match(/^E\d/)) mapping.exam1.maths = c;
    else if ((val.includes("S") && val.includes("ST") && !val.includes("STUDENT")) && !val.match(/^E\d/)) mapping.exam1.sSt = c;
    else if ((val.includes("H/S/F") || val.includes("HINDI") || val.includes("FRENCH")) && !val.match(/^E\d/)) mapping.exam1.hsf = c;
    else if ((val === "SCIENCE" || val.includes("SCI")) && !val.match(/^E\d/)) mapping.exam1.science = c;
    else if ((val === "IT" || val.includes("INFORMATION")) && !val.match(/^E\d/)) mapping.exam1.it = c;
  }
  return mapping;
}

/**
 * Helper to extract exam subject marks from a row
 */
function extractExamMarks(rowVals, examMapping) {
  if (!examMapping || Object.keys(examMapping).length === 0) return null;

  var hasAny = false;
  var result = {};
  var fields = ["english", "maths", "sSt", "hsf", "science", "it"];

  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    if (examMapping[f] !== undefined) {
      var v = rowVals[examMapping[f]];
      result[f] = (v !== null && v !== undefined && v !== "") ? v : null;
      if (v !== null && v !== undefined && v !== "") hasAny = true;
    } else {
      result[f] = null;
    }
  }

  return hasAny ? result : null;
}

/**
 * Formats a single row object from a sheet
 */
function parseRow(sheetName, rowVals, mapping, rowIndex) {
  var name = String(rowVals[mapping.name] || "").trim();
  if (!name) return null;

  var section = mapping.section !== undefined && rowVals[mapping.section]
    ? String(rowVals[mapping.section]).trim().toUpperCase()
    : sheetName.replace(/^IX-?/, "").toUpperCase();

  var e1 = extractExamMarks(rowVals, mapping.exam1);
  var e2 = extractExamMarks(rowVals, mapping.exam2);
  var e3 = extractExamMarks(rowVals, mapping.exam3);
  var e4 = extractExamMarks(rowVals, mapping.exam4);
  var e5 = extractExamMarks(rowVals, mapping.exam5);

  var row = {
    sNo: mapping.sNo !== undefined ? rowVals[mapping.sNo] : rowIndex - 1,
    enrollmentNumber: mapping.enrollment !== undefined ? rowVals[mapping.enrollment] : null,
    name: name,
    group: section,
    section: section,
    target: mapping.target !== undefined ? rowVals[mapping.target] : null,
    exam1: e1,
    // flat fields for backward compatibility
    english: e1 ? e1.english : null,
    maths: e1 ? e1.maths : null,
    sSt: e1 ? e1.sSt : null,
    hsf: e1 ? e1.hsf : null,
    science: e1 ? e1.science : null,
    it: e1 ? e1.it : null,
    exam2: e2,
    exam3: e3,
    exam4: e4,
    exam5: e5,
    sourceRow: rowIndex,
    sheetName: sheetName,
  };

  return row;
}

/**
 * Synchronizes the Master Sheet (Class-IX) or all section tabs
 */
function syncMasterSheet() {
  var ui = safeGetUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var settings = getSettings();

  var masterSheet = ss ? ss.getSheetByName(CONFIG.MASTER_TAB_NAME) : null;
  var sheetsToSync = [];

  if (masterSheet) {
    sheetsToSync.push(masterSheet);
  } else if (ss) {
    // Fallback: Check if legacy tabs exist
    CONFIG.LEGACY_TABS.forEach(function (tabName) {
      var s = ss.getSheetByName(tabName);
      if (s) sheetsToSync.push(s);
    });
  }

  if (sheetsToSync.length === 0) {
    var errNoSheet = "Neither '" + CONFIG.MASTER_TAB_NAME + "' nor section tabs were found in this spreadsheet.";
    Logger.log("⚠️ " + errNoSheet);
    if (ui) ui.alert("⚠️ " + errNoSheet);
    return;
  }

  var allRows = [];
  var errors = [];

  sheetsToSync.forEach(function (sheet) {
    var sName = sheet.getName();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return;

    var mapping = getColumnMapping(data[0]);
    if (mapping.name === undefined) {
      errors.push("Column 'STUDENT NAME' missing in " + sName);
      return;
    }

    for (var r = 1; r < data.length; r++) {
      var parsed = parseRow(sName, data[r], mapping, r + 1);
      if (parsed) allRows.push(parsed);
    }
  });

  if (allRows.length === 0) {
    var errNoRows = "No student records found to synchronize.";
    Logger.log("⚠️ " + errNoRows);
    if (ui) ui.alert("⚠️ " + errNoRows);
    return;
  }

  var e1Count = allRows.filter(function(r) { return r.exam1; }).length;
  var e2Count = allRows.filter(function(r) { return r.exam2; }).length;
  var e3Count = allRows.filter(function(r) { return r.exam3; }).length;
  var e4Count = allRows.filter(function(r) { return r.exam4; }).length;
  var e5Count = allRows.filter(function(r) { return r.exam5; }).length;

  try {
    var response = UrlFetchApp.fetch(settings.endpoint, {
      method: "post",
      contentType: "application/json",
      headers: { "x-sync-secret": settings.secret },
      payload: JSON.stringify({
        students: allRows,
        syncSource: "Google Apps Script v4 — 5-Exam Master Sheet Sync",
        timestamp: new Date().toISOString(),
      }),
      muteHttpExceptions: true,
    });

    var code = response.getResponseCode();
    var result = JSON.parse(response.getContentText() || "{}");

    if (code === 200 && result.success) {
      var msg = "✅ Sync Complete!\n\n" +
        "Students Synced: " + allRows.length + "\n" +
        "E1 - Pre Mid Term (/20): " + e1Count + " students with marks\n" +
        "E2 - Mid Term (/20): " + e2Count + " students with marks\n" +
        "E3 - Half Yearly (/80): " + e3Count + " students with marks\n" +
        "E4 - PT-2 (/20): " + e4Count + " students with marks\n" +
        "E5 - Final (/80): " + e5Count + " students with marks\n\n" +
        "Predictions & targets updated in CCIS Portal.";
      Logger.log(msg);
      if (ui) ui.alert("✅ Sync Complete!", msg, ui.ButtonSet.OK);
    } else {
      var syncErr = "Sync Error (" + code + "): " + (result.error || result.details || response.getContentText());
      Logger.log("❌ " + syncErr);
      if (ui) ui.alert("❌ Sync Error (" + code + ")", result.error || result.details || response.getContentText(), ui.ButtonSet.OK);
    }
  } catch (err) {
    Logger.log("❌ Network Error: " + err.message);
    if (ui) ui.alert("❌ Network Error", err.message, ui.ButtonSet.OK);
  }
}

/**
 * Live change detection via Installable On-Edit trigger.
 */
function handleInstallableEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();

  // Watch master tab or legacy tabs
  var isTarget = sheetName === CONFIG.MASTER_TAB_NAME || CONFIG.LEGACY_TABS.includes(sheetName);
  if (!isTarget) return;

  var editedRow = e.range.getRow();
  if (editedRow <= 1) return;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var mapping = getColumnMapping(headers);
  if (mapping.name === undefined) return;

  var rowData = sheet.getRange(editedRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  var parsedStudent = parseRow(sheetName, rowData, mapping, editedRow);
  if (!parsedStudent) return;

  var settings = getSettings();

  try {
    UrlFetchApp.fetch(settings.endpoint, {
      method: "post",
      contentType: "application/json",
      headers: { "x-sync-secret": settings.secret },
      payload: JSON.stringify({
        singleStudent: parsedStudent,
        syncSource: "Live Edit on " + sheetName + " (Row " + editedRow + ") — Master Sheet v4",
      }),
      muteHttpExceptions: true,
    });
  } catch (err) {
    console.error("Live edit sync failed:", err.message);
  }
}

/**
 * PUSH CURRENT DATA TO SHEET (Unified Master Tab: Class-IX)
 * Fetches all student records from portal and builds a single consolidated tab.
 * Now supports 5-exam structure.
 */
function pushCurrentDataToSheet() {
  var ui = safeGetUi();
  var settings = getSettings();

  if (ui) {
    var confirm = ui.alert(
      "📤 Push Current Data to Sheet",
      "This will create/update a single master tab named '" + CONFIG.MASTER_TAB_NAME + "' with all Class IX students.\n\n" +
      "• Column D: SECTION (AURA, ZEN, NEO)\n" +
      "• Column E: TARGET %\n" +
      "• Columns F-K:  E1 marks (Pre Mid Term /20)\n" +
      "• Columns L-Q:  E2 marks (Mid Term /20)\n" +
      "• Columns R-W:  E3 marks (Half Yearly /80)\n" +
      "• Columns X-AC: E4 marks (PT-2 /20)\n" +
      "• Columns AD-AI: E5 marks (Final /80)\n\n" +
      "Do you want to proceed?",
      ui.ButtonSet.YES_NO
    );

    if (confirm !== ui.Button.YES) return;
  }

  try {
    Logger.log("Fetching student records from " + settings.endpoint + "...");
    var exportUrl = settings.endpoint + "?action=export";
    var response = UrlFetchApp.fetch(exportUrl, {
      method: "get",
      headers: { "x-sync-secret": settings.secret },
      muteHttpExceptions: true,
    });

    var code = response.getResponseCode();
    if (code !== 200) {
      var errExport = "Export failed (" + code + "): " + response.getContentText();
      Logger.log("❌ " + errExport);
      if (ui) ui.alert("❌ " + errExport);
      return;
    }

    var result = JSON.parse(response.getContentText() || "{}");
    if (!result.success || !result.students || result.students.length === 0) {
      var errNoData = "No student data returned from portal.";
      Logger.log("⚠️ " + errNoData);
      if (ui) ui.alert("⚠️ " + errNoData);
      return;
    }

    var students = result.students;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var sheet = ss.getSheetByName(CONFIG.MASTER_TAB_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.MASTER_TAB_NAME, 0);
    }

    // 35 Clean Headers (5 base + 6 subjects × 5 exams = 35)
    var headers = [
      "S.NO", "ENROLLMENT NUMBER", "STUDENT NAME", "SECTION", "TARGET %",
      "E1-ENG", "E1-MATH", "E1-SST", "E1-HSF", "E1-SCI", "E1-IT",
      "E2-ENG", "E2-MATH", "E2-SST", "E2-HSF", "E2-SCI", "E2-IT",
      "E3-ENG", "E3-MATH", "E3-SST", "E3-HSF", "E3-SCI", "E3-IT",
      "E4-ENG", "E4-MATH", "E4-SST", "E4-HSF", "E4-SCI", "E4-IT",
      "E5-ENG", "E5-MATH", "E5-SST", "E5-HSF", "E5-SCI", "E5-IT"
    ];

    sheet.clear();

    // Set headers with styling
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#172853");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");

    var rows = [];
    for (var j = 0; j < students.length; j++) {
      var st = students[j];
      var exams = st.exams || {};

      var e1 = exams["exam-1"];
      var e2 = exams["exam-2"];
      var e3 = exams["exam-3"];
      var e4 = exams["exam-4"];
      var e5 = exams["exam-5"];

      var targetPct = st.schoolTarget && st.schoolTarget.overall
        ? (st.schoolTarget.overall.displayValue || "")
        : "";

      var enrollNo = st.enrollmentNumber || ("CCIS-IX-" + (st.group || "AURA") + "-" + (j + 1 < 10 ? "0" : "") + (j + 1));

      rows.push([
        j + 1,
        enrollNo,
        st.name || "",
        (st.group || "AURA").toUpperCase(),
        targetPct,
        // Exam 1 (Pre Mid Term /20)
        extractSubjectMark(e1, "english"),
        extractSubjectMark(e1, "maths"),
        extractSubjectMark(e1, "socialScience"),
        extractSubjectMark(e1, "secondLanguage"),
        extractSubjectMark(e1, "science"),
        extractSubjectMark(e1, "it"),
        // Exam 2 (Mid Term /20)
        extractSubjectMark(e2, "english"),
        extractSubjectMark(e2, "maths"),
        extractSubjectMark(e2, "socialScience"),
        extractSubjectMark(e2, "secondLanguage"),
        extractSubjectMark(e2, "science"),
        extractSubjectMark(e2, "it"),
        // Exam 3 (Half Yearly /80)
        extractSubjectMark(e3, "english"),
        extractSubjectMark(e3, "maths"),
        extractSubjectMark(e3, "socialScience"),
        extractSubjectMark(e3, "secondLanguage"),
        extractSubjectMark(e3, "science"),
        extractSubjectMark(e3, "it"),
        // Exam 4 (PT-2 /20)
        extractSubjectMark(e4, "english"),
        extractSubjectMark(e4, "maths"),
        extractSubjectMark(e4, "socialScience"),
        extractSubjectMark(e4, "secondLanguage"),
        extractSubjectMark(e4, "science"),
        extractSubjectMark(e4, "it"),
        // Exam 5 (Final /80)
        extractSubjectMark(e5, "english"),
        extractSubjectMark(e5, "maths"),
        extractSubjectMark(e5, "socialScience"),
        extractSubjectMark(e5, "secondLanguage"),
        extractSubjectMark(e5, "science"),
        extractSubjectMark(e5, "it"),
      ]);
    }

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }

    // Freeze header row and key columns
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(4); // Freeze S.NO, Enrollment, Name, Section

    var doneMsg = "Populated single tab '" + CONFIG.MASTER_TAB_NAME + "' with all " + students.length + " students.\n\n" +
      "• E1-ENG to E1-IT: Pre Mid Term marks (/20)\n" +
      "• E2-ENG to E2-IT: Mid Term marks (/20)\n" +
      "• E3: Half Yearly (/80) — Ready for entry\n" +
      "• E4: PT-2 (/20) — Ready for entry\n" +
      "• E5: Final (/80) — Ready for entry\n" +
      "• Section: Identified in Column D (AURA, ZEN, NEO)";

    Logger.log("✅ Master Sheet Created: " + doneMsg);
    if (ui) {
      ui.alert("📤 Master Sheet Created!", doneMsg, ui.ButtonSet.OK);
    }
  } catch (err) {
    Logger.log("❌ Push Failed: " + err.message);
    if (ui) {
      ui.alert("❌ Push Failed", err.message, ui.ButtonSet.OK);
    }
  }
}

/**
 * Helper: Extract a subject's raw mark from an exam entry.
 * Note: Predicted exams return empty string so entry columns stay clean!
 */
function extractSubjectMark(examEntry, subjectKey) {
  if (!examEntry || !examEntry.subjects) return "";
  if (examEntry.isPredicted) return ""; // Keep predicted exams empty for user entry!
  var subj = examEntry.subjects[subjectKey];
  if (!subj) return "";
  if (subj.type === "exempt") return "-";
  if (subj.type === "exact" && subj.value !== undefined) return subj.value;
  if (subj.displayValue === "Absent (AB)") return "AB";
  return "";
}

/**
 * Connection & Setup Diagnostics
 */
function checkConnection() {
  var ui = safeGetUi();
  var settings = getSettings();

  try {
    var resp = UrlFetchApp.fetch(settings.endpoint, { muteHttpExceptions: true });
    var code = resp.getResponseCode();
    var text = resp.getContentText();

    if (code === 200) {
      Logger.log("✅ Cloud Function Online: " + text);
      if (ui) {
        ui.alert(
          "✅ Cloud Function Online",
          "Endpoint reachable!\n\nResponse:\n" + text,
          ui.ButtonSet.OK
        );
      }
    } else {
      Logger.log("⚠️ Unexpected Response (" + code + "): " + text);
      if (ui) {
        ui.alert(
          "⚠️ Unexpected Response (" + code + ")",
          text,
          ui.ButtonSet.OK
        );
      }
    }
  } catch (err) {
    Logger.log("❌ Connection Error: " + err.message);
    if (ui) {
      ui.alert("❌ Connection Error", err.message, ui.ButtonSet.OK);
    }
  }
}
