from flask import Blueprint, request, jsonify
from services.receipt_service import process_receipt_pdf

receipt_bp = Blueprint("receipt_bp", __name__)

@receipt_bp.route("/", methods=["POST"])
def create_receipt():
    file_storage = request.files.get("file")
    user_pin = request.form.get("pin")
    if not file_storage or not user_pin:
        return jsonify({"error": "File and PIN are required"}), 400

    result = process_receipt_pdf(file_storage, user_pin)
    return jsonify(result)
