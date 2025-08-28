from config import students_collection
from utils.mongo_utils import find_student_by_pin, update_student_due

def get_student(pin):
    return find_student_by_pin(pin)

def set_due(pin, due):
    update_student_due(pin, due)
