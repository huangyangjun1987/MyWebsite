from typing import Optional
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from services.auth import decode_token


def get_current_user(
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    token_str = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token_str)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        user_id = int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user
