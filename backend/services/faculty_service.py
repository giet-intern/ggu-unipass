from datetime import datetime
from config import faculty_collection
from utils.auth_utils import hash_password, verify_password
from utils.excel_utils import process_fee_excel

def faculty_register(username, password, email, dept):
    hashed = hash_password(password)
    faculty_collection.insert_one({
        "username": username,
        "password": hashed,
        "email": email,
        "department": dept,
        "mids": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })

def faculty_login(username, password):
    fac = faculty_collection.find_one({"username": username})
    if not fac:
        return {"status": "error", "message": "Invalid username or password"}
    if not verify_password(password, fac["password"]):
        return {"status": "error", "message": "Invalid username or password"}
    fac["_id"] = str(fac["_id"])
    fac.pop("password", None)
    return {"status": "success", "data": fac}

def process_mid_excel(file_path, username):
    return process_fee_excel(file_path)
