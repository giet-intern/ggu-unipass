import pandas as pd
from utils.mongo_utils import find_student_by_pin, update_student_due, get_students_by_year

def process_fee_excel(file_path):
    updated_count = 0
    not_found = []
    dues_map = {}
    xl = pd.ExcelFile(file_path)
    sheet4yr_name = xl.sheet_names[1]
    df4 = pd.read_excel(file_path, sheet_name=sheet4yr_name, header=2)
    df4.columns = df4.columns.str.strip().str.lower()
    for _, row in df4.iterrows():
        pin = str(row.get("roll no", "")).strip().upper()
        if not pin or pin.lower() == "nan":
            continue
        try:
            due1 = float(row.get("iv yr i sem due", 0) or 0)
            due2 = float(row.get("upto iii yr due", 0) or 0)
            total_due = due1 + due2
        except ValueError:
            total_due = 0
        dues_map[pin] = dues_map.get(pin, 0) + total_due
    for pin, total_due in dues_map.items():
        student = find_student_by_pin(pin)
        if student:
            update_student_due(pin, total_due)
            updated_count += 1
        else:
            not_found.append(pin)
    all_y4 = get_students_by_year(4)
    for s in all_y4:
        if s.get("pin") not in dues_map:
            update_student_due(s.get("pin"), 0)
    return {"updated": updated_count, "not_found": not_found}
