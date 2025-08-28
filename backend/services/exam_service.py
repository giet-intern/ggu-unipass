from datetime import datetime
from bson import ObjectId
from config import exams_collection, faculty_collection

def create_exam(created_by, data):
    payload = {
        "mid": int(data["mid"]),
        "time": {
            "start": data["time"]["start"],
            "end": data["time"]["end"],
        },
        "dept": data["dept"],
        "year": int(data["year"]),
        "subjects": data.get("subjects", []),
        "faculty_username": created_by,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    existing = exams_collection.find_one({"faculty_username": created_by, "mid": payload["mid"]})
    if existing:
        return {"status": "error", "message": f"Mid {payload['mid']} already exists for this faculty"}
    res = exams_collection.insert_one(payload)
    exam_id = str(res.inserted_id)
    faculty_collection.update_one(
        {"username": created_by},
        {"$push": {"mids": exam_id}, "$set": {"updated_at": datetime.utcnow()}}
    )
    return {"status": "success", "exam_id": exam_id}

def get_exams(username=None):
    if username:
        fac = faculty_collection.find_one({"username": username}, {"mids": 1, "_id": 0})
        if not fac:
            return []
        ids = [ObjectId(x) for x in fac.get("mids", [])]
        docs = list(exams_collection.find({"_id": {"$in": ids}}))
    else:
        docs = list(exams_collection.find())
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs

def update_exam(username, exam_id, data):
    try:
        obj_id = ObjectId(exam_id)
    except Exception:
        return {"status": "error", "message": "Invalid exam id"}
    owned = exams_collection.find_one({"_id": obj_id, "faculty_username": username})
    if not owned:
        return {"status": "error", "message": "Exam not found or not owned by faculty"}
    update = {}
    if "mid" in data:
        try:
            mid_val = int(data["mid"])
        except Exception:
            return {"status": "error", "message": "Invalid mid number"}
        dup = exams_collection.find_one({"faculty_username": username, "mid": mid_val, "_id": {"$ne": obj_id}})
        if dup:
            return {"status": "error", "message": f"Mid {mid_val} already exists for this faculty"}
        update["mid"] = mid_val
    if "time" in data:
        update["time"] = {
            "obj_start": data["time"].get("obj_start", owned["time"].get("obj_start")),
            "obj_end": data["time"].get("obj_end", owned["time"].get("obj_end")),
            "desc_start": data["time"].get("desc_start", owned["time"].get("desc_start")),
            "desc_end": data["time"].get("desc_end", owned["time"].get("desc_end"))
        }
    if "dept" in data:
        update["dept"] = data["dept"]
    if "year" in data:
        update["year"] = int(data["year"])
    if "subjects" in data:
        update["subjects"] = data["subjects"]
    update["updated_at"] = datetime.utcnow()
    exams_collection.update_one({"_id": obj_id}, {"$set": update})
    return {"status": "success", "message": "Exam updated successfully"}

def delete_exam(username, exam_id):
    try:
        obj_id = ObjectId(exam_id)
    except Exception:
        return {"status": "error", "message": "Invalid exam id"}
    owned = exams_collection.find_one({"_id": obj_id, "faculty_username": username})
    if not owned:
        return {"status": "error", "message": "Exam not found or not owned by faculty"}
    exams_collection.delete_one({"_id": obj_id})
    faculty_collection.update_one({"username": username}, {"$pull": {"mids": exam_id}})
    return {"status": "success"}
