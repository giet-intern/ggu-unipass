from utils.pdf_utils import generate_hallticket_pdf
from utils.mongo_utils import find_student_by_pin

def generate_hallticket(pin):
    s = find_student_by_pin(pin)
    if not s:
        return None
    return generate_hallticket_pdf(pin)
