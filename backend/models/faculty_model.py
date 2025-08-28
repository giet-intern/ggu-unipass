def faculty_schema(username, password_hash, email, department):
    return {
        "username": username,
        "password": password_hash,
        "email": email,
        "department": department,
        "mids": [],
        "created_at": None,
        "updated_at": None
    }
