import os
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 

# ---------------------------------------------------------
# 1. PASSWORD HASHING (Native Bcrypt)
# ---------------------------------------------------------
def get_password_hash(password: str) -> str:
    """Takes a plain text password and returns a scrambled hash."""
    # Bcrypt requires bytes, so we encode the string first
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    # Return as a normal string so it saves to the database easily
    return hashed_password.decode('utf-8')

# ---------------------------------------------------------
# 2. PASSWORD VERIFICATION (Native Bcrypt)
# ---------------------------------------------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Checks if the typed password matches the scrambled hash in the DB."""
    pwd_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password=pwd_bytes, hashed_password=hash_bytes)

# ---------------------------------------------------------
# 3. CREATE JWT TOKEN
# ---------------------------------------------------------
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ---------------------------------------------------------
# 4. DECODE JWT TOKEN
# ---------------------------------------------------------
def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None