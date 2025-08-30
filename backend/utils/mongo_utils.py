from config import students_collection, receipts_collection

def find_student_by_pin(pin):
    return students_collection.find_one({"pin": pin})

def update_student_due(pin, due):
    students_collection.update_one({"pin": pin}, {"$set": {"due": float(due)}})

def get_students_by_year(year):
    return list(students_collection.find({"year": int(year)}))

def save_receipt(receipt_id, pin, amount, file_data):
    receipts_collection.insert_one({
        "receipt_id": receipt_id, 
        "pin": pin, 
        "amount": float(amount), 
        "file_data": file_data
    })

def get_receipt(receipt_id):
    return receipts_collection.find_one({"receipt_id": receipt_id})
