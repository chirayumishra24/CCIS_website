"""
CCIS 5-Exam Student Roster Builder
===================================
Reads:
  - Pre mid term data.xlsx   → Exam-1 (E1, /20): English, Maths, Science, Social Science, IT
  - Mid term revised.xlsx    → Exam-2 (E2, /20): English, Hindi, Sanskrit, French, Maths, Science, Social Science, IT
  - CLASS IX TARGET SHEET.xlsx → Target percentages per student

Produces:
  - scripts/roster_5exam.json           — raw merged roster
  - scripts/full_records_5exam.json     — Firestore-ready student records
  - src/lib/initialClass9Data.ts        — TypeScript embedded data
"""

import json
import re
import openpyxl
from datetime import datetime

NOW_ISO = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')

# ══════════════════════════════════════════════════════════════
# 5-EXAM CONFIG
# ══════════════════════════════════════════════════════════════
EXAM_CONFIG = {
    'exam-1': {'weight': 0.10, 'label': 'Pre Mid Term',  'shortLabel': 'E1', 'maxMarks': 20},
    'exam-2': {'weight': 0.10, 'label': 'Mid Term',      'shortLabel': 'E2', 'maxMarks': 20},
    'exam-3': {'weight': 0.20, 'label': 'Half Yearly',   'shortLabel': 'E3', 'maxMarks': 80},
    'exam-4': {'weight': 0.10, 'label': 'PT-2',          'shortLabel': 'E4', 'maxMarks': 20},
    'exam-5': {'weight': 0.50, 'label': 'Final Exam',    'shortLabel': 'E5', 'maxMarks': 80},
}
EXAM_ORDER = ['exam-1', 'exam-2', 'exam-3', 'exam-4', 'exam-5']

# ══════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════
def norm_name(n):
    """Normalize a name for fuzzy matching."""
    return re.sub(r'[^A-Z0-9]', '', n.upper().replace('\xa0', ''))

ALIASES = {
    'NAGEND4AYADAV': 'NAGENDRAYADAV',
    'AYAANAAGARWAL': 'AYANAAGARWAL',
    'GAVYACHOUDHARY': 'GAVYACHAUDHARY',
    'ROUNAKJEPHHINDI': 'ROUNAKJEPH',
    'ROUNAKJEPH': 'ROUNAKJEPH',
    'PANKHURI': 'PANKHURIBHARDWAJ',
    'HIMANSHU': 'HIMANSHUGURJAR',
    'AADHYAKHANDELWAL': 'AADYAKHANDELWAL',
    'AKSHOBHYA': 'AKSHOBHYATIWARI',
    'ARAVCHITRANSH': 'ARAVCHITRANSH',
    'AARAVCHITRANSH': 'ARAVCHITRANSH',
    'DIVYANNMITTAL': 'DIVYANMITTAL',
    'SURYAPRATAPSINGH': 'SURYAPRATAPSINGHNATHAWAT',
    'KRISHNAJANGIR': 'KRISHANAJANGIR',
}

def resolve_key(name_raw):
    key = norm_name(name_raw)
    return ALIASES.get(key, key)

def safe_float(val):
    """Parse a value to float, return None if not possible."""
    if val is None:
        return None
    s = str(val).strip()
    if not s or s in ['-', '--', 'None', 'none']:
        return None
    if s.lower() == 'ab':
        return 0.0  # Absent = 0
    try:
        return float(s)
    except ValueError:
        return None

def normalize_val(raw_val, max_marks=100, is_marks=False):
    """Normalize a value into the NormalizedValue structure."""
    if raw_val is None:
        return {
            'rawValue': None, 'type': 'empty',
            'displayValue': 'Pending',
            'unit': 'marks' if is_marks else 'percent'
        }
    
    val_str = str(raw_val).strip()
    if not val_str or val_str in ['-', '--']:
        return {
            'rawValue': raw_val, 'type': 'exempt',
            'displayValue': 'Exempt (-)',
            'unit': 'marks' if is_marks else 'percent'
        }
    
    if val_str.lower() in ['ab', 'absent']:
        return {
            'rawValue': 'ab', 'type': 'exact', 'value': 0,
            'displayValue': 'Absent (AB)',
            'unit': 'marks' if is_marks else 'percent',
            'statusNote': 'Absent'
        }
    
    if val_str.lower() == 'new':
        return {
            'rawValue': 'new', 'type': 'invalid',
            'displayValue': 'New Admission',
            'unit': 'marks' if is_marks else 'percent',
            'statusNote': 'New Admission'
        }
    
    # Range check
    range_match = re.search(r'(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)', val_str)
    if range_match:
        mn = float(range_match.group(1))
        mx = float(range_match.group(2))
        return {
            'rawValue': raw_val, 'type': 'range',
            'min': mn, 'max': mx,
            'displayValue': f"{int(mn) if mn == int(mn) else mn}–{int(mx) if mx == int(mx) else mx}%",
            'unit': 'percent'
        }
    
    # Numeric
    clean_num = val_str.replace('%', '').strip()
    try:
        num = float(clean_num)
        if not is_marks and 0 < num <= 1.0 and '.' in clean_num:
            num = round(num * 100, 2)
        return {
            'rawValue': raw_val, 'type': 'exact', 'value': num,
            'displayValue': f"{int(num) if num == int(num) else num}{' / ' + str(max_marks) if is_marks else '%'}",
            'unit': 'marks' if is_marks else 'percent'
        }
    except ValueError:
        return {
            'rawValue': raw_val, 'type': 'invalid',
            'displayValue': val_str,
            'unit': 'marks' if is_marks else 'percent'
        }


# ══════════════════════════════════════════════════════════════
# 1. PARSE PRE MID TERM (Exam-1) — 5 subjects, no 2nd language split
# ══════════════════════════════════════════════════════════════
print("═══ Parsing Pre Mid Term data.xlsx (Exam-1 /20) ═══")
wb_pmt = openpyxl.load_workbook(r'Pre mid term data.xlsx', data_only=True)

pmt_by_key = {}  # key -> {section, english, maths, science, socialScience, it}

for sheet_name in wb_pmt.sheetnames:
    ws = wb_pmt[sheet_name]
    section = sheet_name.upper()
    
    # Determine start row: Aura has header in rows 1-2, data from row 3
    # ZEN has header in row 1, data from row 2
    # NEO has header in row 1, data from row 2
    if section == 'AURA':
        start_row = 3  # rows 1-2 are headers
    else:
        start_row = 2  # row 1 is header
    
    for r in range(start_row, ws.max_row + 1):
        name_raw = ws.cell(row=r, column=1).value
        if not name_raw or not str(name_raw).strip():
            continue
        name_raw = str(name_raw).strip()
        key = resolve_key(name_raw)
        
        pmt_by_key[key] = {
            'name': name_raw,
            'section': section,
            'english': ws.cell(row=r, column=2).value,
            'maths': ws.cell(row=r, column=3).value,
            'science': ws.cell(row=r, column=4).value,
            'socialScience': ws.cell(row=r, column=5).value,
            'it': ws.cell(row=r, column=6).value,
        }

print(f"  Parsed {len(pmt_by_key)} Pre Mid Term records.")


# ══════════════════════════════════════════════════════════════
# 2. PARSE MID TERM REVISED (Exam-2) — 8 subjects with lang split
# ══════════════════════════════════════════════════════════════
print("═══ Parsing Mid term revised.xlsx (Exam-2 /20) ═══")
wb_mt = openpyxl.load_workbook(r'Mid term revised.xlsx', data_only=True)

mt_by_key = {}

for sheet_name in wb_mt.sheetnames:
    ws = wb_mt[sheet_name]
    section = sheet_name.upper()
    
    # Row 1: title, Row 2: headers, Row 3+: data
    # Cols: S.no, Name, English, Hindi, Sanskrit, French, Maths, Science, Social Science, IT
    for r in range(3, ws.max_row + 1):
        name_raw = ws.cell(row=r, column=2).value
        if not name_raw or not str(name_raw).strip():
            continue
        name_str = str(name_raw).strip()
        
        # Skip non-student rows (like "active total 34")
        if name_str.lower().startswith('active') or name_str.lower().startswith('total'):
            continue
        
        key = resolve_key(name_str)
        
        mt_by_key[key] = {
            'name': name_str,
            'section': section,
            'english': ws.cell(row=r, column=3).value,
            'hindi': ws.cell(row=r, column=4).value,
            'sanskrit': ws.cell(row=r, column=5).value,
            'french': ws.cell(row=r, column=6).value,
            'maths': ws.cell(row=r, column=7).value,
            'science': ws.cell(row=r, column=8).value,
            'socialScience': ws.cell(row=r, column=9).value,
            'it': ws.cell(row=r, column=10).value,
        }

print(f"  Parsed {len(mt_by_key)} Mid Term records.")


# ══════════════════════════════════════════════════════════════
# 3. PARSE TARGET SHEET
# ══════════════════════════════════════════════════════════════
print("═══ Parsing CLASS IX TARGET SHEET.xlsx (Targets) ═══")
wb_target = openpyxl.load_workbook(r'CLASS IX TARGET SHEET.xlsx', data_only=True)
target_sections = {'IX-AURA': 'AURA', 'IX-ZEN': 'ZEN', 'IX-NEO': 'NEO'}

target_by_key = {}

for sheet_name, section in target_sections.items():
    if sheet_name not in wb_target.sheetnames:
        print(f"  WARNING: Sheet '{sheet_name}' not found in target workbook")
        continue
    ws = wb_target[sheet_name]
    for row in ws.iter_rows(min_row=2, values_only=True):
        s_no = row[0]
        name = str(row[1] or '').strip()
        if not name or s_no is None:
            continue
        key = resolve_key(name)
        target_by_key[key] = {
            'sNo': int(s_no) if s_no else 0,
            'name': name,
            'section': section,
            'english': row[2],
            'maths': row[3],
            'socialScience': row[4],
            'hsf': row[5],
            'science': row[6],
            'it': row[7],
            'overall': row[8],
        }

print(f"  Parsed {len(target_by_key)} target records.")


# ══════════════════════════════════════════════════════════════
# 4. BUILD UNIFIED ROSTER — union of all unique students
# ══════════════════════════════════════════════════════════════
print("\n═══ Building unified student roster ═══")

# Collect all unique student keys with their preferred name and section
all_keys = set()
key_meta = {}  # key -> {name, section}

# Mid Term has the most complete roster, use it as primary
for key, data in mt_by_key.items():
    all_keys.add(key)
    key_meta[key] = {'name': data['name'].upper(), 'section': data['section']}

# Add any students from Pre Mid Term not in Mid Term
for key, data in pmt_by_key.items():
    if key not in all_keys:
        all_keys.add(key)
        key_meta[key] = {'name': data['name'].upper(), 'section': data['section']}

# Add any students from Target Sheet not in either
for key, data in target_by_key.items():
    if key not in all_keys:
        all_keys.add(key)
        key_meta[key] = {'name': data['name'].upper(), 'section': data['section']}

print(f"  Total unique students: {len(all_keys)}")

# Sort by section then name
sorted_keys = sorted(all_keys, key=lambda k: (key_meta[k]['section'], key_meta[k]['name']))


# ══════════════════════════════════════════════════════════════
# 5. BUILD FULL STUDENT RECORDS
# ══════════════════════════════════════════════════════════════
student_records = []
section_counters = {'AURA': 0, 'ZEN': 0, 'NEO': 0}

for key in sorted_keys:
    meta = key_meta[key]
    name = meta['name']
    section = meta['section']
    
    section_counters[section] = section_counters.get(section, 0) + 1
    s_no = section_counters[section]
    
    enr_no = f"CCIS-IX-{section}-{s_no:02d}"
    student_id = f"ccis-ix-{section.lower()}-{re.sub(r'[^a-z0-9-]', '', name.lower().replace(' ', '-'))}"
    
    pmt = pmt_by_key.get(key)
    mt = mt_by_key.get(key)
    tgt = target_by_key.get(key)
    
    # ── Detect 2nd language from Mid Term data ──
    chosen_lang = "Hindi"
    if mt:
        h_val = str(mt.get('hindi') or '').strip()
        s_val = str(mt.get('sanskrit') or '').strip()
        f_val = str(mt.get('french') or '').strip()
        
        if f_val and f_val not in ['-', '--', 'None', '']:
            chosen_lang = "French"
        elif s_val and s_val not in ['-', '--', 'None', '']:
            chosen_lang = "Sanskrit"
        elif h_val and h_val not in ['-', '--', 'None', '']:
            chosen_lang = "Hindi"
    
    # ── Exam-1 (Pre Mid Term /20) — 5 subjects, no lang split ──
    e1_subjects = {}
    e1_marks = []
    if pmt:
        for sub_key in ['english', 'maths', 'science', 'socialScience', 'it']:
            nv = normalize_val(pmt[sub_key], max_marks=20, is_marks=True)
            e1_subjects[sub_key] = nv
            if nv['type'] == 'exact' and nv.get('value') is not None:
                e1_marks.append(nv['value'])
        # Pre Mid Term doesn't have 2nd language data; mark as Pending
        e1_subjects['secondLanguage'] = normalize_val(None, max_marks=20, is_marks=True)
    
    # ── Exam-2 (Mid Term /20) — 8 subjects, with lang split ──
    e2_subjects = {}
    e2_marks = []
    if mt:
        for sub_key in ['english', 'maths', 'science', 'socialScience', 'it']:
            nv = normalize_val(mt[sub_key], max_marks=20, is_marks=True)
            e2_subjects[sub_key] = nv
            if nv['type'] == 'exact' and nv.get('value') is not None:
                e2_marks.append(nv['value'])
        
        # 2nd language: pick the one that matches chosen_lang
        lang_val = mt.get(chosen_lang.lower())
        nv_lang = normalize_val(lang_val, max_marks=20, is_marks=True)
        e2_subjects['secondLanguage'] = nv_lang
        if nv_lang['type'] == 'exact' and nv_lang.get('value') is not None:
            e2_marks.append(nv_lang['value'])
    
    # ── Build exam entries ──
    exams = {}
    
    # Exam-1 
    if pmt and e1_marks:
        e1_pct = round((sum(e1_marks) / (len(e1_marks) * 20)) * 100, 2)
        e1_overall = {
            'rawValue': e1_pct, 'type': 'exact', 'value': e1_pct,
            'displayValue': f'{e1_pct}%', 'unit': 'percent'
        }
        
        subject_list = [
            {'id': 'english', 'code': 'ENG', 'label': 'English Language & Lit', 'normalized': e1_subjects.get('english', normalize_val(None, 20, True))},
            {'id': 'maths', 'code': 'MATH', 'label': 'Mathematics', 'normalized': e1_subjects.get('maths', normalize_val(None, 20, True))},
            {'id': 'socialScience', 'code': 'SST', 'label': 'Social Science', 'normalized': e1_subjects.get('socialScience', normalize_val(None, 20, True))},
            {'id': 'secondLanguage', 'code': chosen_lang[:3].upper(), 'label': f'2nd Lang: {chosen_lang}', 'normalized': e1_subjects.get('secondLanguage', normalize_val(None, 20, True))},
            {'id': 'science', 'code': 'SCI', 'label': 'Science', 'normalized': e1_subjects.get('science', normalize_val(None, 20, True))},
            {'id': 'it', 'code': 'IT', 'label': 'Information Technology', 'normalized': e1_subjects.get('it', normalize_val(None, 20, True))},
        ]
        
        exams['exam-1'] = {
            'id': 'exam-1',
            'label': EXAM_CONFIG['exam-1']['label'],
            'maxMarksPerSubject': 20,
            'overall': e1_overall,
            'totalMarksScored': sum(e1_marks),
            'totalMaxMarks': len(e1_marks) * 20,
            'isPredicted': False,
            'secondLanguageTaken': chosen_lang,
            'subjects': {
                'english': e1_subjects.get('english', normalize_val(None, 20, True)),
                'secondLanguage': e1_subjects.get('secondLanguage', normalize_val(None, 20, True)),
                'maths': e1_subjects.get('maths', normalize_val(None, 20, True)),
                'science': e1_subjects.get('science', normalize_val(None, 20, True)),
                'socialScience': e1_subjects.get('socialScience', normalize_val(None, 20, True)),
                'it': e1_subjects.get('it', normalize_val(None, 20, True)),
            },
            'subjectList': subject_list,
        }
    
    # Exam-2
    if mt and e2_marks:
        e2_pct = round((sum(e2_marks) / (len(e2_marks) * 20)) * 100, 2)
        e2_overall = {
            'rawValue': e2_pct, 'type': 'exact', 'value': e2_pct,
            'displayValue': f'{e2_pct}%', 'unit': 'percent'
        }
        
        subject_list_e2 = [
            {'id': 'english', 'code': 'ENG', 'label': 'English Language & Lit', 'normalized': e2_subjects.get('english', normalize_val(None, 20, True))},
            {'id': 'maths', 'code': 'MATH', 'label': 'Mathematics', 'normalized': e2_subjects.get('maths', normalize_val(None, 20, True))},
            {'id': 'socialScience', 'code': 'SST', 'label': 'Social Science', 'normalized': e2_subjects.get('socialScience', normalize_val(None, 20, True))},
            {'id': 'secondLanguage', 'code': chosen_lang[:3].upper(), 'label': f'2nd Lang: {chosen_lang}', 'normalized': e2_subjects.get('secondLanguage', normalize_val(None, 20, True))},
            {'id': 'science', 'code': 'SCI', 'label': 'Science', 'normalized': e2_subjects.get('science', normalize_val(None, 20, True))},
            {'id': 'it', 'code': 'IT', 'label': 'Information Technology', 'normalized': e2_subjects.get('it', normalize_val(None, 20, True))},
        ]
        
        exams['exam-2'] = {
            'id': 'exam-2',
            'label': EXAM_CONFIG['exam-2']['label'],
            'maxMarksPerSubject': 20,
            'overall': e2_overall,
            'totalMarksScored': sum(e2_marks),
            'totalMaxMarks': len(e2_marks) * 20,
            'isPredicted': False,
            'secondLanguageTaken': chosen_lang,
            'subjects': {
                'english': e2_subjects.get('english', normalize_val(None, 20, True)),
                'secondLanguage': e2_subjects.get('secondLanguage', normalize_val(None, 20, True)),
                'maths': e2_subjects.get('maths', normalize_val(None, 20, True)),
                'science': e2_subjects.get('science', normalize_val(None, 20, True)),
                'socialScience': e2_subjects.get('socialScience', normalize_val(None, 20, True)),
                'it': e2_subjects.get('it', normalize_val(None, 20, True)),
            },
            'subjectList': subject_list_e2,
        }
    
    # ── Current Performance (latest available exam) ──
    latest_exam = exams.get('exam-2') or exams.get('exam-1')
    if latest_exam:
        current_overall = latest_exam['overall']
        current_subjects = latest_exam['subjects']
        current_subject_list = latest_exam['subjectList']
    else:
        current_overall = normalize_val(None)
        current_subjects = {
            'english': normalize_val(None, 20, True),
            'secondLanguage': normalize_val(None, 20, True),
            'maths': normalize_val(None, 20, True),
            'science': normalize_val(None, 20, True),
            'socialScience': normalize_val(None, 20, True),
            'it': normalize_val(None, 20, True),
        }
        current_subject_list = []
    
    # ── Target ──
    if tgt:
        target_overall = normalize_val(tgt['overall'])
        target_subjects = {
            'english': normalize_val(tgt['english']),
            'secondLanguage': normalize_val(tgt['hsf']),
            'maths': normalize_val(tgt['maths']),
            'science': normalize_val(tgt['science']),
            'socialScience': normalize_val(tgt['socialScience']),
            'it': normalize_val(tgt['it']),
        }
        if target_overall['type'] == 'empty' or target_overall.get('displayValue', '') in ['Not Assigned', 'Pending']:
            target_status = 'NOT_ASSIGNED'
        else:
            target_status = 'IN_PROGRESS'
    else:
        target_overall = normalize_val(None)
        target_subjects = None
        target_status = 'NOT_ASSIGNED'
    
    # ── Build full record ──
    rec = {
        'studentId': student_id,
        'enrollmentNumber': enr_no,
        'name': name,
        'class': 'IX',
        'group': section,
        'school': 'CCIS',
        'secondLanguage': chosen_lang,
        'currentPerformance': {
            'overall': current_overall,
            'subjects': current_subjects,
            'subjectList': current_subject_list,
        },
        'schoolTarget': {
            'overall': target_overall,
            'subjects': target_subjects,
            'targetStatus': target_status,
        },
        'exams': exams,
        'examOrder': EXAM_ORDER,
        'source': {
            'sheetName': f'IX-{section}',
            'sourceRow': s_no + 1,
            'serialNo': s_no,
            'lastSyncedAt': NOW_ISO,
        },
        'updatedAt': NOW_ISO,
    }
    student_records.append(rec)

print(f"\n═══ SUMMARY ═══")
print(f"Total students: {len(student_records)}")
for sec in ['AURA', 'ZEN', 'NEO']:
    count = sum(1 for r in student_records if r['group'] == sec)
    e1_count = sum(1 for r in student_records if r['group'] == sec and 'exam-1' in r['exams'])
    e2_count = sum(1 for r in student_records if r['group'] == sec and 'exam-2' in r['exams'])
    tgt_count = sum(1 for r in student_records if r['group'] == sec and r['schoolTarget']['targetStatus'] != 'NOT_ASSIGNED')
    print(f"  {sec}: {count} students | E1: {e1_count} | E2: {e2_count} | Targets: {tgt_count}")


# ══════════════════════════════════════════════════════════════
# 6. WRITE OUTPUTS
# ══════════════════════════════════════════════════════════════

# Raw roster JSON
with open('scripts/roster_5exam.json', 'w', encoding='utf-8') as f:
    json.dump(student_records, f, indent=2, ensure_ascii=False)
print(f"\n[OK] Written scripts/roster_5exam.json")

# Full records JSON (Firestore-ready)
with open('scripts/full_records_5exam.json', 'w', encoding='utf-8') as f:
    json.dump(student_records, f, indent=2, ensure_ascii=False)
print(f"[OK] Written scripts/full_records_5exam.json")

# TypeScript initialClass9Data
ts_content = f"""import {{ StudentRecord }} from './academicNormalizer';

export const INITIAL_CLASS_IX_STUDENTS: StudentRecord[] = {json.dumps(student_records, indent=2, ensure_ascii=False)};
"""

with open('src/lib/initialClass9Data.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)
print(f"[OK] Written src/lib/initialClass9Data.ts")

print(f"\n✅ Done! {len(student_records)} student records built with 5-exam structure.")
