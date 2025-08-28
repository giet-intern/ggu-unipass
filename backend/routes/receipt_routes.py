from flask import Blueprint, request, jsonify
from services.receipt_service import save_receipt, get_receipt

receipt_bp = Blueprint("receipt_bp", __name__)

@receipt_bp.route("/", methods=["POST"])
def create_receipt():
    data = request.json or {}
    save_receipt(data.get("receipt_id"), data.get("pin"), data.get("amount"), data.get("url"))
    return jsonify({"status": "success"})

@receipt_bp.route("/<receipt_id>", methods=["GET"])
def fetch_receipt(receipt_id):
    r = get_receipt(receipt_id)
    if not r:
        return jsonify({"error": "Not found"}), 404
    r["_id"] = str(r["_id"])
    return jsonify(r)
