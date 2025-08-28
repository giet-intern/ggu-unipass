from config import students_collection

def find_student_by_pin(pin):
    return students_collection.find_one({"pin": pin})

def update_student_due(pin, due):
    students_collection.update_one({"pin": pin}, {"$set": {"due": float(due)}})

def get_students_by_year(year):
    return list(students_collection.find({"year": int(year)}))
