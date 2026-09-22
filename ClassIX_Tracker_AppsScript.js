/**
 * ==============================================================================
 * CCIS CLASS IX STUDENT PERFORMANCE & TARGET TRACKER - GOOGLE APPS SCRIPT v2
 * ==============================================================================
 * 
 * MULTI-EXAM SUPPORT:
 * This script now supports 4 exams per student (PT-1, Mid Term, PT-2, Final).
 * 
 * EXPECTED SHEET COLUMNS (Row 1 headers):
 *   S.NO | STUDENT NAME | ENGLISH | MATHS | S.ST | H/S/F | SCIENCE | IT | OVERALL | TARGET
 *   | E2-ENG | E2-MATH | E2-SST | E2-HSF | E2-SCI | E2-IT
 *   | E3-ENG | E3-MATH | E3-SST | E3-HSF | E3-SCI | E3-IT
 *   | E4-ENG | E4-MATH | E4-SST | E4-HSF | E4-SCI | E4-IT
 * 
 * Exam-1 (PT-1 /20): Uses the original flat columns (ENGLISH, MATHS, etc.)
 * Exam-2 (Mid Term /80): E2-ENG, E2-MATH, E2-SST, E2-HSF, E2-SCI, E2-IT
 * Exam-3 (PT-2 /20): E3-ENG, E3-MATH, E3-SST, E3-HSF, E3-SCI, E3-IT
 * Exam-4 (Final /80): E4-ENG, E4-MATH, E4-SST, E4-HSF, E4-SCI, E4-IT
 * 
 * INSTRUCTIONS:
 * 1. In your Google Sheet, click "Extensions" -> "Apps Script".
 * 2. Replace any existing code in Code.gs with this entire script.
 * 3. Click "Save" (Ctrl+S).
 * 4. Refresh your Google Sheet. You will see a new menu: "🎓 CCIS Portal Sync".
 * 5. To enable automatic live sync on edit:
 *    - Click "Triggers" (alarm clock icon on left sidebar).
 *    - Click "+ Add Trigger".
 *    - Choose function: "handleInstallableEdit".
 *    - Event source: "From spreadsheet".
 *    - Event type: "On edit".
 *    - Click Save.
 * ==============================================================================
 */

// Default Configuration (Can also be overridden via ScriptProperties)
const CONFIG = {
  DEFAULT_ENDPOINT: "https://us-central1-skillizee-products.cloudfunctions.net/syncClass9Performance",
  DEFAULT_SECRET: "ccis-alumni-sync-2026",
  TARGET_TABS: ["IX-AURA", "IX-ZEN", "IX-NEO"],
};

/**
 * Creates custom menu in Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🎓 CCIS Portal Sync")
    .addItem("⚡ Sync All Sections (AURA, ZEN, NEO)", "syncAllSections")
    .addItem("📄 Sync Current Section Only", "syncCurrentSection")
    .addSeparator()
    .addItem("📤 Push Current Data to Sheet", "pushCurrentDataToSheet")
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
 * Now supports multi-exam prefixed columns: E2-ENG, E3-MATH, E4-SCI, etc.
 */
function getColumnMapping(headerRow) {
  const mapping = {
    // Exam-1 flat columns (backward compatible)
    sNo: undefined,
    name: undefined,
    english: undefined,
    maths: undefined,
    sSt: undefined,
    hsf: undefined,
    science: undefined,
    it: undefined,
    overall: undefined,
    target: undefined,
    // Multi-exam columns
    exam2: {},  // { english: colIdx, maths: colIdx, ... }
    exam3: {},
    exam4: {},
  };

  for (var c = 0; c < headerRow.length; c++) {
    var val = String(headerRow[c] || "").trim().toUpperCase();
    if (!val) continue;

    // ─── Exam-2 prefixed columns (E2-...) ───
    if (val.match(/^E2[\-\s]/)) {
      var subj = val.replace(/^E2[\-\s]+/, "");
      if (subj.includes("ENG")) mapping.exam2.english = c;
      else if (subj.includes("MATH")) mapping.exam2.maths = c;
      else if (subj.includes("SST") || subj.includes("S.ST") || subj.includes("S ST")) mapping.exam2.sSt = c;
      else if (subj.includes("HSF") || subj.includes("H/S/F") || subj.includes("HINDI") || subj.includes("FRENCH")) mapping.exam2.hsf = c;
      else if (subj.includes("SCI")) mapping.exam2.science = c;
      else if (subj === "IT" || subj.includes("INFO")) mapping.exam2.it = c;
      continue;
    }

    // ─── Exam-3 prefixed columns (E3-...) ───
    if (val.match(/^E3[\-\s]/)) {
      var subj3 = val.replace(/^E3[\-\s]+/, "");
      if (subj3.includes("ENG")) mapping.exam3.english = c;
      else if (subj3.includes("MATH")) mapping.exam3.maths = c;
      else if (subj3.includes("SST") || subj3.includes("S.ST") || subj3.includes("S ST")) mapping.exam3.sSt = c;
      else if (subj3.includes("HSF") || subj3.includes("H/S/F") || subj3.includes("HINDI") || subj3.includes("FRENCH")) mapping.exam3.hsf = c;
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
      else if (subj4.includes("HSF") || subj4.includes("H/S/F") || subj4.includes("HINDI") || subj4.includes("FRENCH")) mapping.exam4.hsf = c;
      else if (subj4.includes("SCI")) mapping.exam4.science = c;
      else if (subj4 === "IT" || subj4.includes("INFO")) mapping.exam4.it = c;
      continue;
    }

    // ─── Exam-1 flat columns (backward compatible) ───
    if (val.includes("S") && val.includes("NO") && !val.includes("SCI")) mapping.sNo = c;
    else if (val.includes("STUDENT") && val.includes("NAME")) mapping.name = c;
    else if (val === "ENGLISH" || (val.includes("ENG") && !val.match(/^E\d/))) mapping.english = c;
    else if ((val === "MATHS" || val.includes("MATH")) && !val.match(/^E\d/)) mapping.maths = c;
    else if ((val.includes("S") && val.includes("ST") && !val.includes("STUDENT")) && !val.match(/^E\d/)) mapping.sSt = c;
    else if ((val.includes("H/S/F") || val.includes("HINDI") || val.includes("FRENCH")) && !val.match(/^E\d/)) mapping.hsf = c;
    else if ((val === "SCIENCE" || val.includes("SCI")) && !val.match(/^E\d/)) mapping.science = c;
    else if ((val === "IT" || val.includes("INFORMATION")) && !val.match(/^E\d/)) mapping.it = c;
    else if (val.includes("OVERALL")) mapping.overall = c;
    else if (val.includes("TARGET")) mapping.target = c;
  }
  return mapping;
}

/**
 * Helper to extract exam subject marks from a row using exam column indices
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
 * Formats a single row object from a sheet (with multi-exam support)
 */
function parseRow(sheetName, rowVals, mapping, rowIndex) {
  var name = String(rowVals[mapping.name] || "").trim();
  if (!name) return null;

  var group = sheetName.replace(/^IX-?/, "").toUpperCase();

  var row = {
    sNo: mapping.sNo !== undefined ? rowVals[mapping.sNo] : rowIndex - 1,
    name: name,
    group: group,
    // Exam-1 (PT-1) flat fields
    english: mapping.english !== undefined ? rowVals[mapping.english] : null,
    maths: mapping.maths !== undefined ? rowVals[mapping.maths] : null,
    sSt: mapping.sSt !== undefined ? rowVals[mapping.sSt] : null,
    hsf: mapping.hsf !== undefined ? rowVals[mapping.hsf] : null,
    science: mapping.science !== undefined ? rowVals[mapping.science] : null,
    it: mapping.it !== undefined ? rowVals[mapping.it] : null,
    overall: mapping.overall !== undefined ? rowVals[mapping.overall] : null,
    target: mapping.target !== undefined ? rowVals[mapping.target] : null,
    sourceRow: rowIndex,
    sheetName: sheetName,
  };

  // Extract multi-exam marks
  var e2 = extractExamMarks(rowVals, mapping.exam2);
  var e3 = extractExamMarks(rowVals, mapping.exam3);
  var e4 = extractExamMarks(rowVals, mapping.exam4);

  if (e2) row.exam2 = e2;
  if (e3) row.exam3 = e3;
  if (e4) row.exam4 = e4;

  return row;
}

/**
 * Synchronizes all Class IX tabs (IX-AURA, IX-ZEN, IX-NEO)
 */
function syncAllSections() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var settings = getSettings();

  var allRows = [];
  var errors = [];

  CONFIG.TARGET_TABS.forEach(function (tabName) {
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      errors.push("Tab not found: " + tabName);
      return;
    }

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return;

    var mapping = getColumnMapping(data[0]);
    if (mapping.name === undefined) {
      errors.push("Column 'STUDENT NAME' missing in " + tabName);
      return;
    }

    for (var r = 1; r < data.length; r++) {
      var parsed = parseRow(tabName, data[r], mapping, r + 1);
      if (parsed) allRows.push(parsed);
    }
  });

  if (allRows.length === 0) {
    ui.alert("⚠️ No student records found to synchronize.", SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  // Count multi-exam data
  var e2Count = allRows.filter(function(r) { return r.exam2; }).length;
  var e3Count = allRows.filter(function(r) { return r.exam3; }).length;
  var e4Count = allRows.filter(function(r) { return r.exam4; }).length;

  try {
    var response = UrlFetchApp.fetch(settings.endpoint, {
      method: "post",
      contentType: "application/json",
      headers: { "x-sync-secret": settings.secret },
      payload: JSON.stringify({
        students: allRows,
        syncSource: "Google Apps Script v2 — Multi-Exam Sync",
        timestamp: new Date().toISOString(),
      }),
      muteHttpExceptions: true,
    });

    var code = response.getResponseCode();
    var result = JSON.parse(response.getContentText() || "{}");

    if (code === 200 && result.success) {
      var msg = "✅ Sync Complete!\n\n" +
        "Students synced: " + allRows.length + "\n" +
        "Exam-1 (PT-1): All students\n" +
        "Exam-2 (Mid Term): " + e2Count + " students with marks\n" +
        "Exam-3 (PT-2): " + e3Count + " students with marks\n" +
        "Exam-4 (Final): " + e4Count + " students with marks\n\n" +
        "Predictions recalculated server-side.";
      ui.alert("✅ Sync Complete!", msg, SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      ui.alert("❌ Sync Error (" + code + ")", result.error || result.details || response.getContentText(), SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (err) {
    ui.alert("❌ Network / Fetch Error", err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Synchronizes only the active sheet
 */
function syncCurrentSection() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSheet();
  var sheetName = sheet.getName();
  var settings = getSettings();

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    ui.alert("Sheet contains no student data rows.");
    return;
  }

  var mapping = getColumnMapping(data[0]);
  if (mapping.name === undefined) {
    ui.alert("Could not locate 'STUDENT NAME' header in row 1.");
    return;
  }

  var rows = [];
  for (var r = 1; r < data.length; r++) {
    var parsed = parseRow(sheetName, data[r], mapping, r + 1);
    if (parsed) rows.push(parsed);
  }

  try {
    var response = UrlFetchApp.fetch(settings.endpoint, {
      method: "post",
      contentType: "application/json",
      headers: { "x-sync-secret": settings.secret },
      payload: JSON.stringify({
        students: rows,
        syncSource: "Google Apps Script v2 Section Sync (" + sheetName + ")",
      }),
      muteHttpExceptions: true,
    });

    var code = response.getResponseCode();
    var result = JSON.parse(response.getContentText() || "{}");

    if (code === 200 && result.success) {
      ui.alert("✅ " + sheetName + " Synced!", "Updated " + rows.length + " students with prediction engine.", SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      ui.alert("❌ Sync Error (" + code + ")", result.error || response.getContentText(), SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (err) {
    ui.alert("❌ Network Error", err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Live change detection via Installable On-Edit trigger.
 * Now sends multi-exam data for the edited student row.
 */
function handleInstallableEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();

  if (!CONFIG.TARGET_TABS.includes(sheetName)) return;

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
        syncSource: "Live Edit on " + sheetName + " (Row " + editedRow + ") — Multi-Exam v2",
      }),
      muteHttpExceptions: true,
    });
  } catch (err) {
    console.error("Live onEdit sync failed for row " + editedRow + ":", err);
  }
}

/**
 * Push current data from CCIS Portal (Firestore) into the Google Sheet.
 * Populates Exam-1 marks, targets, and creates empty columns for Exam-2/3/4.
 */
function pushCurrentDataToSheet() {
  var ui = SpreadsheetApp.getUi();
  var settings = getSettings();

  // Fetch all student data from the Cloud Function export endpoint
  var exportUrl = settings.endpoint + "?action=export&secret=" + encodeURIComponent(settings.secret);

  try {
    var response = UrlFetchApp.fetch(exportUrl, {
      method: "get",
      muteHttpExceptions: true,
    });

    var code = response.getResponseCode();
    if (code !== 200) {
      ui.alert("❌ Export Error (" + code + ")", response.getContentText(), SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }

    var result = JSON.parse(response.getContentText() || "{}");
    if (!result.success || !result.students || result.students.length === 0) {
      ui.alert("⚠️ No student data returned from the portal.");
      return;
    }

    var students = result.students;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Group students by section
    var groups = { "AURA": [], "ZEN": [], "NEO": [] };
    for (var i = 0; i < students.length; i++) {
      var s = students[i];
      var g = (s.group || "AURA").toUpperCase();
      if (!groups[g]) groups[g] = [];
      groups[g].push(s);
    }

    var tabsUpdated = 0;

    for (var groupName in groups) {
      var groupStudents = groups[groupName];
      if (groupStudents.length === 0) continue;

      var tabName = "IX-" + groupName;
      var sheet = ss.getSheetByName(tabName);
      if (!sheet) {
        sheet = ss.insertSheet(tabName);
      }

      // Build headers
      var headers = [
        "S.NO", "STUDENT NAME",
        "ENGLISH", "MATHS", "S.ST", "H/S/F", "SCIENCE", "IT", "OVERALL", "TARGET",
        "E2-ENG", "E2-MATH", "E2-SST", "E2-HSF", "E2-SCI", "E2-IT",
        "E3-ENG", "E3-MATH", "E3-SST", "E3-HSF", "E3-SCI", "E3-IT",
        "E4-ENG", "E4-MATH", "E4-SST", "E4-HSF", "E4-SCI", "E4-IT"
      ];

      // Clear existing data
      sheet.clear();

      // Write headers
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");

      // Write student data
      var rows = [];
      for (var j = 0; j < groupStudents.length; j++) {
        var st = groupStudents[j];
        var exams = st.exams || {};

        // Extract Exam-1 marks (from exam-1 subjects or currentPerformance)
        var e1 = exams["exam-1"];
        var e1Eng = extractSubjectMark(e1, "english") || extractPerfMark(st, "english");
        var e1Math = extractSubjectMark(e1, "maths") || extractPerfMark(st, "maths");
        var e1SSt = extractSubjectMark(e1, "socialScience") || extractPerfMark(st, "socialScience");
        var e1Hsf = extractSubjectMark(e1, "secondLanguage") || extractPerfMark(st, "secondLanguage");
        var e1Sci = extractSubjectMark(e1, "science") || extractPerfMark(st, "science");
        var e1It = extractSubjectMark(e1, "it") || extractPerfMark(st, "it");

        // Overall and target
        var overall = st.currentPerformance && st.currentPerformance.overall
          ? (st.currentPerformance.overall.displayValue || "")
          : "";
        var target = st.schoolTarget && st.schoolTarget.overall
          ? (st.schoolTarget.overall.displayValue || "")
          : "";

        // Exam-2, 3, 4 marks
        var e2 = exams["exam-2"];
        var e3 = exams["exam-3"];
        var e4 = exams["exam-4"];

        rows.push([
          j + 1,
          st.name || "",
          e1Eng, e1Math, e1SSt, e1Hsf, e1Sci, e1It, overall, target,
          extractSubjectMark(e2, "english") || "",
          extractSubjectMark(e2, "maths") || "",
          extractSubjectMark(e2, "socialScience") || "",
          extractSubjectMark(e2, "secondLanguage") || "",
          extractSubjectMark(e2, "science") || "",
          extractSubjectMark(e2, "it") || "",
          extractSubjectMark(e3, "english") || "",
          extractSubjectMark(e3, "maths") || "",
          extractSubjectMark(e3, "socialScience") || "",
          extractSubjectMark(e3, "secondLanguage") || "",
          extractSubjectMark(e3, "science") || "",
          extractSubjectMark(e3, "it") || "",
          extractSubjectMark(e4, "english") || "",
          extractSubjectMark(e4, "maths") || "",
          extractSubjectMark(e4, "socialScience") || "",
          extractSubjectMark(e4, "secondLanguage") || "",
          extractSubjectMark(e4, "science") || "",
          extractSubjectMark(e4, "it") || "",
        ]);
      }

      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      }

      tabsUpdated++;
    }

    ui.alert(
      "📤 Data Pushed Successfully!",
      "Updated " + tabsUpdated + " section tabs with " + students.length + " total students.\n\n" +
      "Columns created: Exam-1 (PT-1), Exam-2 (Mid Term), Exam-3 (PT-2), Exam-4 (Final).\n" +
      "Teachers can now enter marks in the E2/E3/E4 columns.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (err) {
    ui.alert("❌ Push Failed", err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Helper: Extract a subject's raw mark from an exam entry
 */
function extractSubjectMark(examEntry, subjectKey) {
  if (!examEntry || !examEntry.subjects) return "";
  var subj = examEntry.subjects[subjectKey];
  if (!subj) return "";
  if (subj.type === "exempt") return "-";
  if (subj.type === "exact" && subj.value !== undefined) return subj.value;
  if (subj.displayValue === "Absent (AB)") return "AB";
  return "";
}

/**
 * Helper: Extract a subject's mark from currentPerformance (legacy fallback)
 */
function extractPerfMark(student, subjectKey) {
  if (!student || !student.currentPerformance || !student.currentPerformance.subjects) return "";
  var subj = student.currentPerformance.subjects[subjectKey];
  if (!subj) return "";
  if (subj.type === "exempt") return "-";
  if (subj.type === "exact" && subj.value !== undefined) return subj.value;
  return "";
}

/**
 * Connection check utility
 */
function checkConnection() {
  var ui = SpreadsheetApp.getUi();
  var settings = getSettings();

  try {
    var res = UrlFetchApp.fetch(settings.endpoint, { method: "get", muteHttpExceptions: true });
    var code = res.getResponseCode();
    if (code === 200) {
      var body = JSON.parse(res.getContentText() || "{}");
      ui.alert(
        "✅ Connection Verified!",
        "Portal endpoint is online and reachable:\n" + settings.endpoint +
        "\n\nVersion: " + (body.version || "unknown") +
        "\nTimestamp: " + (body.timestamp || ""),
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } else {
      ui.alert("⚠️ Status Check (" + code + ")", res.getContentText(), SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (err) {
    ui.alert("❌ Could not connect to endpoint", err.message + "\n\nMake sure your endpoint URL is accessible.", SpreadsheetApp.getUi().ButtonSet.OK);
  }
}
