from flask import Flask
from flask_cors import CORS
from routes.student_routes import student_bp
from routes.faculty_routes import faculty_bp
from routes.exam_routes import exam_bp
from routes.receipt_routes import receipt_bp
import os

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24).hex()
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.register_blueprint(student_bp, url_prefix="/student")
app.register_blueprint(faculty_bp, url_prefix="/faculty")
app.register_blueprint(exam_bp, url_prefix="/exams")
app.register_blueprint(receipt_bp, url_prefix="/receipts")

@app.route("/")
def home():
    return "OK"

