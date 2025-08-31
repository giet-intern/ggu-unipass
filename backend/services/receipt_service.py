import fitz
from datetime import datetime
import base64
from utils.mongo_utils import (
    find_student_by_pin, 
    update_student_due, 
    save_receipt,
    get_receipt
)

DATE_FORMAT = "%d-%b-%Y"
MIN_DATE = datetime.strptime("28-Aug-2025", DATE_FORMAT)

def process_receipt_pdf(file_storage, user_pin):
    pdf_bytes = file_storage.read()
    file_storage.seek(0)
    
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = "\n".join(page.get_text() for page in doc)
    doc.close()
    print(text)
    lines = text.splitlines()
    roll_no = None
    amount_paid = None
    payment_date = None
    receipt_no = None

    for i, line in enumerate(lines):
        line_lower = line.lower()
        if "receipt number" in line_lower:
            parts = line.split(":", 1)
            if len(parts) > 1 and parts[1].strip():
                receipt_no = parts[1].strip()
        if "roll no" in line_lower:
            parts = line.split(":", 1)
            if len(parts) > 1 and parts[1].strip():
                roll_no = parts[1].strip()
            elif i + 1 < len(lines):
                roll_no = lines[i + 1].strip()
        if "amount paid" in line_lower or ("amount" in line_lower and "paid" not in line_lower):
            try:
                amount_str = line.split(":", 1)[-1].replace(",", "").strip()
                amount_paid = float(amount_str)
            except Exception:
                pass
        if "date" in line_lower:
            parts = line.split(":", 1)
            if len(parts) > 1 and parts[1].strip():
                try:
                    payment_date = datetime.strptime(parts[1].strip(), DATE_FORMAT)
                except Exception as e:
                    print(f"Date parsing error: {e}")

    if not receipt_no or not roll_no or amount_paid is None or payment_date is None:
        return {"success": False, "message": "Could not read required fields from receipt"}
    
    if payment_date < MIN_DATE:
        return {"success": False, "message": "Date is older than current updated date"}

    if roll_no.strip().lower() != user_pin.strip().lower():
        return {"success": False, "message": "PIN in receipt does not match your PIN"}

    student = find_student_by_pin(user_pin)
    if not student:
        return {"success": False, "message": "Student not found"}

    if get_receipt(receipt_no):
        return {"success": False, "message": f"Receipt {receipt_no} already processed"}

    pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')

    save_receipt(
        receipt_id=receipt_no,
        pin=user_pin,
        amount=amount_paid,
        file_data=pdf_base64
    )

    due = student.get("due", 0)
    new_due = max(0, due - amount_paid)
    update_student_due(user_pin, new_due)
    print(f"Previous due amount for {user_pin}: {due}\nAmount paid: {amount_paid}\nUpdated due amount for {user_pin}: {new_due}")
    return {
        "success": True,
        "message": f"Due amount updated successfully with receipt {receipt_no}"
    }
