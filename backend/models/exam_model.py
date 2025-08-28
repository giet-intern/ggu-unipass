def exam_schema(mid_no, time, dept, year, subjects, created_by):
    return {
        "mid": int(mid_no),
        "time": {
            "start": time.get("start"),
            "end": time.get("end"),
        },
        "dept": dept,
        "year": int(year),
        "subjects": subjects,
        "faculty_username": created_by,
        "created_at": None,
        "updated_at": None
    }
