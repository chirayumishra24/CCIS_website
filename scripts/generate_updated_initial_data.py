import json
import re
import openpyxl

# ─── 1. Load Mid-Term marks (Exam-1 / PT-1, out of 20) ───
wb_mt = openpyxl.load_workbook(r'mid-term.xlsx', data_only=True)
sections_map = {
    'Table 1': 'AURA',
    'Table 2': 'ZEN',
    'Table 3': 'NEO',
}

def norm_name(n):
    return re.sub(r'[^A-Z0-9]', '', n.upper().replace('HINDI', '').replace('\xa0', ''))

aliases = {
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

# Parse mid-term.xlsx — Table 1 (AURA) and Table 3 (NEO) have clean columns
# Table 2 (ZEN) has merged/messy columns — need special handling
mid_term_by_name = {}

for sheet_name, section in sections_map.items():
    ws = wb_mt[sheet_name]
    rows = list(ws.iter_rows(min_row=3, values_only=True))  # skip title + header
    
    if sheet_name in ['Table 1', 'Table 3']:
        # Clean format: (SrNo, EnrNo, Name, Eng, Hindi, Sanskrit, French, Maths, Science, SocialSci, IT)
        for r in rows:
            name_raw = str(r[2] or '').strip().replace('\xa0', ' ')
            if not name_raw:
                continue
            key = norm_name(name_raw)
            if key in aliases:
                key = aliases[key]
            
            mid_term_by_name[key] = {
                'name': name_raw,
                'section': section,
                'english': r[3],
                'hindi': r[4],
                'sanskrit': r[5],
                'french': r[6],
                'maths': r[7],
                'science': r[8],
                'socialScience': r[9],
                'it': r[10] if len(r) > 10 else None,
            }
    else:
        # ZEN (Table 2) has messy merged columns — parse carefully
        # Need to handle multi-line names in cells
        for r in rows:
            name_raw = str(r[2] or '').strip().replace('\xa0', ' ')
            if not name_raw:
                continue
            # Some cells have multiple names with newlines — take first
            names = [n.strip() for n in name_raw.split('\n') if n.strip()]
            
            # For single-name rows, parse normally
            if len(names) == 1:
                key = norm_name(names[0])
                if key in aliases:
                    key = aliases[key]
                
                # Columns may be shifted for ZEN — try to parse best we can
                # Col 3: Eng, Col 4: Hindi, Col 6: Sanskrit, Col 7: French, Col 9: Maths, Col 11: Science, Col 12: SocSci, Col 14: IT
                mid_term_by_name[key] = {
                    'name': names[0],
                    'section': section,
                    'english': r[3],
                    'hindi': r[4],
                    'sanskrit': r[6] if len(r) > 6 else None,
                    'french': r[7] if len(r) > 7 else None,
                    'maths': r[9] if len(r) > 9 else None,
                    'science': r[11] if len(r) > 11 else None,
                    'socialScience': r[12] if len(r) > 12 else None,
                    'it': r[14] if len(r) > 14 else None,
                }

print(f"Parsed {len(mid_term_by_name)} mid-term records.")

# ─── 2. Load Target Sheet (CLASS IX TARGET SHEET.xlsx) ───
wb_target = openpyxl.load_workbook(r'CLASS IX TARGET SHEET.xlsx', data_only=True)
target_sections = {'IX-AURA': 'AURA', 'IX-ZEN': 'ZEN', 'IX-NEO': 'NEO'}

target_by_name = {}

for sheet_name, section in target_sections.items():
    ws = wb_target[sheet_name]
    # Row 1: Header (S NO, STUDENT NAME, ENGLISH, MATHS, S ST, H/S/F, SCIENCE, IT, OVERALL %)
    for row in ws.iter_rows(min_row=2, values_only=True):
        s_no = row[0]
        name = str(row[1] or '').strip()
        if not name or s_no is None:
            continue
        
        key = norm_name(name)
        if key in aliases:
            key = aliases[key]
            
        target_by_name[key] = {
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

print(f"Parsed {len(target_by_name)} target records.")

# ─── 3. Normalize value helper ───
def normalize_val(raw_val, max_marks=100, is_marks=False):
    if raw_val is None:
        return {
            'rawValue': None,
            'type': 'empty',
            'displayValue': 'Pending',
            'unit': 'marks' if is_marks else 'percent'
        }
    
    val_str = str(raw_val).strip()
    if not val_str or val_str in ['-', '--']:
        return {
            'rawValue': raw_val,
            'type': 'exempt',
            'displayValue': 'Exempt (-)',
            'unit': 'marks' if is_marks else 'percent'
        }
    
    if val_str.lower() == 'ab':
        return {
            'rawValue': 'ab',
            'type': 'invalid',
            'displayValue': 'Absent (AB)',
            'unit': 'marks' if is_marks else 'percent',
            'statusNote': 'Absent'
        }
        
    if val_str.lower() == 'new':
        return {
            'rawValue': 'new',
            'type': 'invalid',
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
            'rawValue': raw_val,
            'type': 'range',
            'min': mn,
            'max': mx,
            'displayValue': f"{int(mn) if mn == int(mn) else mn}–{int(mx) if mx == int(mx) else mx}%",
            'unit': 'percent'
        }
        
    # Numeric
    clean_num = val_str.replace('%', '').strip()
    try:
        num = float(clean_num)
        # Decimal proportion (e.g. 0.85 -> 85%)
        if not is_marks and 0 < num <= 1.0 and '.' in clean_num:
            num = round(num * 100, 2)
            
        return {
            'rawValue': raw_val,
            'type': 'exact',
            'value': num,
            'displayValue': f"{int(num) if num == int(num) else num}{' / ' + str(max_marks) if is_marks else '%'}",
            'unit': 'marks' if is_marks else 'percent'
        }
    except ValueError:
        return {
            'rawValue': raw_val,
            'type': 'invalid',
            'displayValue': val_str,
            'unit': 'marks' if is_marks else 'percent'
        }

# ─── 4. Build student records ───
student_records = []
matched = 0
unmatched = []

for key, t in target_by_name.items():
    s_no = t['sNo']
    sec = t['section']
    name = t['name']
    enr_no = f"CCIS-IX-{sec}-{s_no:02d}"
    student_id = f"ccis-ix-{sec.lower()}-{name.lower().replace(' ', '-')}"
    # Clean student_id
    student_id = re.sub(r'[^a-z0-9-]', '', student_id)
    
    # Find mid-term marks
    mt = mid_term_by_name.get(key)
    if not mt:
        # Fuzzy prefix match
        for mk, mv in mid_term_by_name.items():
            if key.startswith(mk) or mk.startswith(key):
                mt = mv
                break
    
    if mt:
        matched += 1
    
    # Detect 2nd language from mid-term data
    chosen_lang = "Hindi"  # default
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
    
    # ─── Exam-1 (PT-1 Baseline, out of 20) ───
    if mt:
        e1_eng = normalize_val(mt['english'], max_marks=20, is_marks=True)
        e1_lang = normalize_val(mt[chosen_lang.lower()], max_marks=20, is_marks=True)
        e1_math = normalize_val(mt['maths'], max_marks=20, is_marks=True)
        e1_sci = normalize_val(mt['science'], max_marks=20, is_marks=True)
        e1_sst = normalize_val(mt['socialScience'], max_marks=20, is_marks=True)
        e1_it = normalize_val(mt['it'], max_marks=20, is_marks=True)
        
        # Calculate overall % for exam-1
        active_marks = []
        for sub_key in ['english', chosen_lang.lower(), 'maths', 'science', 'socialScience', 'it']:
            val_str = str(mt.get(sub_key) or '').strip()
            try:
                m = float(val_str)
                active_marks.append(m)
            except:
                pass
        
        if active_marks:
            e1_sum = sum(active_marks)
            e1_max = len(active_marks) * 20.0
            e1_pct = round((e1_sum / e1_max) * 100, 2)
            e1_overall = {
                'rawValue': f'{e1_pct}%',
                'type': 'exact',
                'value': e1_pct,
                'displayValue': f'{e1_pct}%',
                'unit': 'percent'
            }
        else:
            e1_overall = normalize_val(None)
    else:
        e1_eng = normalize_val(None, max_marks=20, is_marks=True)
        e1_lang = normalize_val(None, max_marks=20, is_marks=True)
        e1_math = normalize_val(None, max_marks=20, is_marks=True)
        e1_sci = normalize_val(None, max_marks=20, is_marks=True)
        e1_sst = normalize_val(None, max_marks=20, is_marks=True)
        e1_it = normalize_val(None, max_marks=20, is_marks=True)
        e1_overall = normalize_val(None)
    
    e1_subject_list = [
        {'id': 'eng', 'code': 'ENG', 'label': 'English Language & Lit', 'normalized': e1_eng},
        {'id': 'lang2', 'code': chosen_lang[:3].upper(), 'label': f'2nd Lang: {chosen_lang}', 'normalized': e1_lang},
        {'id': 'math', 'code': 'MATH', 'label': 'Mathematics', 'normalized': e1_math},
        {'id': 'sci', 'code': 'SCI', 'label': 'General Science', 'normalized': e1_sci},
        {'id': 'sst', 'code': 'S.ST', 'label': 'Social Science', 'normalized': e1_sst},
        {'id': 'it', 'code': 'IT', 'label': 'Information Technology', 'normalized': e1_it},
    ]
    
    # ─── Target scores (from TARGET SHEET) ───
    target_eng = normalize_val(t['english'])
    target_math = normalize_val(t['maths'])
    target_sst = normalize_val(t['socialScience'])
    target_hsf = normalize_val(t['hsf'])  # H/S/F column = 2nd lang target
    target_sci = normalize_val(t['science'])
    target_it = normalize_val(t['it'])
    target_overall = normalize_val(t['overall'])
    
    if target_overall['type'] == 'empty' or target_overall.get('displayValue', '') in ['Not Assigned', 'Pending']:
        target_status = 'NOT_ASSIGNED'
    else:
        target_status = 'IN_PROGRESS'
    
    # ─── Build record ───
    rec = {
        'studentId': student_id,
        'enrollmentNumber': enr_no,
        'name': name,
        'class': 'IX',
        'group': sec,
        'school': 'CCIS',
        'secondLanguage': chosen_lang,
        'currentPerformance': {
            'overall': e1_overall,
            'subjects': {
                'english': e1_eng,
                'secondLanguage': e1_lang,
                'maths': e1_math,
                'science': e1_sci,
                'socialScience': e1_sst,
                'it': e1_it,
            },
            'subjectList': e1_subject_list,
        },
        'schoolTarget': {
            'overall': target_overall,
            'subjects': {
                'english': target_eng,
                'secondLanguage': target_hsf,
                'maths': target_math,
                'science': target_sci,
                'socialScience': target_sst,
                'it': target_it,
            },
            'targetStatus': target_status,
        },
        'exams': {
            'exam-1': {
                'id': 'exam-1',
                'label': 'PT-1 (Baseline)',
                'maxMarksPerSubject': 20,
                'overall': e1_overall,
                'secondLanguageTaken': chosen_lang,
                'subjects': {
                    'english': e1_eng,
                    'secondLanguage': e1_lang,
                    'maths': e1_math,
                    'science': e1_sci,
                    'socialScience': e1_sst,
                    'it': e1_it,
                },
                'subjectList': e1_subject_list,
            },
        },
        'examOrder': ['exam-1'],
        'source': {
            'sheetName': f'IX-{sec}',
            'sourceRow': s_no + 1,
            'serialNo': s_no,
            'lastSyncedAt': '2026-09-22T10:00:00.000Z'
        },
        'updatedAt': '2026-09-22T10:00:00.000Z'
    }
    student_records.append(rec)

print(f"Built {len(student_records)} student records ({matched} with exam marks).")

# Sort by section, then serial number
student_records.sort(key=lambda r: (r['group'], r['source']['serialNo']))

# ─── 5. Write outputs ───
# full_records.json
with open('scripts/full_records.json', 'w', encoding='utf-8') as f:
    json.dump(student_records, f, indent=2)

# initialClass9Data.ts
ts_content = f"""import {{ StudentRecord }} from './academicNormalizer';

export const INITIAL_CLASS_IX_STUDENTS: StudentRecord[] = {json.dumps(student_records, indent=2)};
"""

with open('src/lib/initialClass9Data.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"[OK] Generated scripts/full_records.json ({len(student_records)} records)")
print(f"[OK] Generated src/lib/initialClass9Data.ts")
