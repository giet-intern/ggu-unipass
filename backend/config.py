import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

try:
    client = MongoClient(os.getenv("MONGO_URI"))
    print("Connected to MongoDB")
    db = client["hallticket_db"]
    students_collection = db["students"]
    faculty_collection = db["faculty"]
    receipts_collection = db["receipts"]
    exams_collection = db["exams"]
except Exception as e:
    print("Error connecting to MongoDB:", e)
