from flask import Blueprint, jsonify, send_file
from services.hallticket_service import generate_hallticket
from utils.mongo_utils import find_student_by_pin

student_bp = Blueprint("student_bp", __name__)

@student_bp.route("/searchStudent/<pin>", methods=["GET"])
def search_student(pin):
    s = find_student_by_pin(pin)
    if not s:
        return jsonify({"error": "Not found"}), 404
    s["_id"] = str(s["_id"])
    return jsonify(s)

@student_bp.route("/generateHallticket/<pin>", methods=["GET"])
def generate_hallticket_by_pin(pin):
    pdf = generate_hallticket(pin)
    if not pdf:
        return jsonify({"error": "Student not found"}), 400
    return send_file(pdf, as_attachment=True, download_name=f"hallticket_{pin}.pdf", mimetype="application/pdf")
