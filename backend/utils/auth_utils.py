import bcrypt

def hash_password(pw):
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(pw, hashed):
    return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
