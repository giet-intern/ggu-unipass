import uuid
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.pdfgen import canvas
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from io import BytesIO
from utils.mongo_utils import find_student_by_pin
import os
from datetime import datetime
import pytz # Required for timezone conversion
from config import exams_collection

# ========================================================================
# Helper Functions for Formatting
# ========================================================================

def format_time_local(iso_string, default="N/A"):
    if not iso_string:
        return default
    try:
        dt_utc = datetime.fromisoformat(iso_string.replace('Z', '+00:00'))
        ist = pytz.timezone('Asia/Kolkata')
        dt_ist = dt_utc.astimezone(ist)
        return dt_ist.strftime('%I:%M %p')
    except (ValueError, TypeError):
        return default

# --- CORRECTED FUNCTION ---
def format_date_readable(iso_string, default="N/A"):
    if not iso_string:
        return default
    try:
        dt_utc = datetime.fromisoformat(iso_string.replace('Z', '+00:00'))
        # Convert the date back to the local timezone before formatting
        ist = pytz.timezone('Asia/Kolkata')
        dt_ist = dt_utc.astimezone(ist)
        return dt_ist.strftime('%d-%m-%Y') # e.g., "28-08-2025"
    except (ValueError, TypeError):
        return default
# --- END OF CORRECTION ---

# ========================================================================
# Main PDF Generation Function
# ========================================================================

def generate_hallticket_pdf(pin: str, mid_no: int = 1):
    student = find_student_by_pin(pin)
    if not student:
        return None

    hallticket_id = student.get("hallticket_id") or str(uuid.uuid4()).split("-")[0].upper()
    dept = student.get("department", "").upper()
    year = int(student.get("year", 0))

    mid_exam_details = exams_collection.find_one({"year": year, "dept": dept, "mid": mid_no})
    if not mid_exam_details:
        mid_exam_details = exams_collection.find_one({"year": year, "dept": "ALL", "mid": mid_no})

    if not mid_exam_details:
        print(f"Error: No Mid {mid_no} schedule found for Year {year}, Dept {dept}.")
        return None

    exam_title = mid_exam_details.get("exam_title", f"Hall Ticket: Mid-{mid_no} Examinations")
    
    time_data = mid_exam_details.get("time", {})
    start_time = format_time_local(time_data.get("start"))
    end_time = format_time_local(time_data.get("end"))
    exam_time = f"Time: {start_time} - {end_time}"
    
    subjects_from_db = mid_exam_details.get("subjects", [])
    subjects = [
        (format_date_readable(item.get('date')), item.get('subject'), "") 
        for item in subjects_from_db
    ]

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # ... The rest of your PDF drawing code remains the same ...

    if year == 2:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        logo_path = os.path.join(base_dir, "assets", "ggu-logo.png")
    else:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        logo_path = os.path.join(base_dir, "assets", "giet-logo.jpg")

    try:
        logo_width = 40 * mm
        logo_height = 40 * mm
        c.drawImage(logo_path, (width - logo_width) / 2, height - 55 * mm,
                    width=logo_width, height=logo_height, preserveAspectRatio=True, mask="auto")
    except Exception as e:
        print(f"Could not draw image. Error: {e}")

    y = height - 60 * mm
    title_style = ParagraphStyle(name="Title", fontName="Times-Bold", fontSize=16, alignment=TA_CENTER, leading=15)
    subtitle_style = ParagraphStyle(name="Sub", fontName="Times-Roman", fontSize=12, alignment=TA_CENTER, leading=13)

    if year == 2:
        para = Paragraph("GODAVARI GLOBAL UNIVERSITY", title_style)
        w, h = para.wrap(width - 80, 100)
        para.drawOn(c, 40, y)
        y -= h + 4
    else:
        para = Paragraph("GODAVARI INSTITUTE OF ENGINEERING & TECHNOLOGY", title_style)
        w, h = para.wrap(width - 80, 100)
        para.drawOn(c, 40, y)
        y -= h + 4

        para = Paragraph("Approved By AICTE | NAAC ‘A++’ | Recognized by UGC,", subtitle_style)
        w, h = para.wrap(width - 80, 100)
        para.drawOn(c, 40, y)
        y -= h + 2

        para = Paragraph("U/Sec. 2(f) & 12(B) | Permanently Affiliated to JNTUK, Kakinada", subtitle_style)
        w, h = para.wrap(width - 80, 100)
        para.drawOn(c, 40, y)
        y -= h

    c.setStrokeColor(colors.black)
    c.setLineWidth(0.8)
    c.line(40, y, width - 40, y)
    y -= 12

    dept_line = "Electronics & Communication Engineering" if dept == "ECE" else f"Computer Science & Engineering({student['department']})"
    c.setFont("Times-Bold", 12)
    c.drawCentredString(width / 2, y, dept_line)
    y -= 16
    
    c.setFont("Times-Bold", 12)
    c.drawCentredString(width / 2, y, exam_title)
    y -= 20

    student_info = [
        ["Hall Ticket No:", student["pin"], "ID:", hallticket_id],
        ["Name:", student["name"], "", ""],
        ["Branch:", student["department"], "Year:", str(student["year"])],
    ]

    table = Table(student_info, colWidths=[35*mm, 50*mm, 25*mm, 50*mm])
    table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Times-Roman"), ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("LINEBELOW", (0, 0), (-1, -1), 0.25, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("SPAN", (1, 1), (3, 1)),
        ("FONTNAME", (0, 0), (0, -1), "Times-Bold"), ("FONTNAME", (2, 0), (2, -1), "Times-Bold"),
    ]))

    tw, th = table.wrapOn(c, width - 80, y)
    table.drawOn(c, 40, y - th)
    y -= th + 18

    c.setFont("Times-Roman", 11)
    c.drawString(40, y, exam_time)
    y -= 18

    c.setFont("Times-Bold", 12)
    c.drawString(40, y, "Exam Schedule:")
    y -= 16

    table_data = [["Date", "Subject Name", "Signature of Invigilator"]] + subjects
    col_widths = [40*mm, width - 40*2 - 90*mm, 50*mm]
    subj_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    subj_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"), ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey), ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("FONTSIZE", (0, 0), (-1, -1), 10),
    ]))
    tw, th = subj_table.wrapOn(c, width - 80, y)
    subj_table.drawOn(c, 40, y - th)
    y -= th + 65

    c.setFont("Times-Roman", 11)
    c.drawString(60, y, "Signature of Student")
    c.drawRightString(width - 60, y, "Signature of HOD/Class Teacher")
    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer
    
