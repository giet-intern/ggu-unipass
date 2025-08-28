from flask import Blueprint, request, jsonify, send_file, current_app
from services.hallticket_service import generate_hallticket_pdf
from services.faculty_service import faculty_register, faculty_login, process_mid_excel
from utils.mongo_utils import find_student_by_pin
from datetime import datetime, timezone, timedelta
import jwt

faculty_bp = Blueprint("faculty_bp", __name__)

@faculty_bp.route("/register", methods=["POST"])
def register_faculty():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    dept = data.get("dept")
    if not username or not password or not email or not dept:
        return jsonify({"error": "All fields are required"}), 400
    faculty_register(username, password, email, dept)
    return jsonify({"message": "Faculty registered successfully"}), 201

@faculty_bp.route("/login", methods=["POST"])
def login_faculty():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    login_result = faculty_login(username, password)
    
    if login_result["status"] == "success":
        user_data = login_result["data"]
        
        payload = {
            "sub": user_data["username"],
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
            "role": user_data.get("role", "faculty"),
        }
        
        try:
            token = jwt.encode(
                payload,
                current_app.config["SECRET_KEY"],
                algorithm="HS256"
            )
            
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "token": token,
                "user": user_data
            }), 200
            
        except Exception as e:
            print(f"Error generating token: {e}")
            return jsonify({"status": "error", "message": "Could not generate token"}), 500

    else:
        return jsonify(login_result), 401
    
    
@faculty_bp.route("/generateHallticket/<pin>", methods=["GET"])
def generate_hallticket(pin):
    student = find_student_by_pin(pin)
    if not student:
        return jsonify({"error": "Student not found"}), 400
    pdf = generate_hallticket_pdf(pin)
    return send_file(pdf, as_attachment=True, download_name=f"hallticket_{pin}.pdf", mimetype="application/pdf")

@faculty_bp.route("/uploadSheet", methods=["POST"])
def upload_sheet():
    file = request.files.get("file")
    username = request.form.get("username")
    if not file or not username:
        return jsonify({"error": "File and username are required"}), 400
    path = f"./{file.filename}"
    file.save(path)
    result = process_mid_excel(path, username)
    return jsonify({"message": "Data updated", "updated_count": result["updated"], "not_found_pins": result["not_found"]})
