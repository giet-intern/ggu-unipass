def student_schema(pin, name, department, year, clg, due=0, hallticket_id=None, receipts=None):
    return {
        "pin": pin,
        "name": name,
        "department": department,
        "year": int(year),
        "college": clg,
        "due": float(due),
        "hallticket_id": hallticket_id,
        "receipts": receipts or []
    }
