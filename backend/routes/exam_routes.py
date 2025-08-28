from flask import Blueprint, request, jsonify
from services.exam_service import create_exam, get_exams, update_exam, delete_exam

exam_bp = Blueprint("exam_bp", __name__)

@exam_bp.route("/", methods=["POST"])
def create_exam_route():
    data = request.json or {}
    username = data.get("username") or data.get("faculty_username")
    if not username:
        return jsonify({"status": "error", "message": "username required"}), 400
    payload = {
        "mid": data.get("mid"),
        "time": data.get("time") or {},
        "dept": data.get("dept"),
        "year": data.get("year"),
        "subjects": data.get("subjects", [])
    }
    res = create_exam(username, payload)
    return jsonify(res), 201 if res.get("status") == "success" else 400

@exam_bp.route("/", methods=["GET"])
def list_all_exams():
    docs = get_exams()
    return jsonify(docs), 200

@exam_bp.route("/<username>/mids", methods=["GET"])
def list_user_exams(username):
    docs = get_exams(username)
    return jsonify(docs), 200

@exam_bp.route("/<username>/mids/<exam_id>", methods=["PUT"])
def update_exam_route(username, exam_id):
    data = request.json or {}
    res = update_exam(username, exam_id, data)
    return jsonify(res), 200 if res.get("status") == "success" else 400

@exam_bp.route("/<username>/mids/<exam_id>", methods=["DELETE"])
def delete_exam_route(username, exam_id):
    res = delete_exam(username, exam_id)
    return jsonify(res), 200 if res.get("status") == "success" else 404
