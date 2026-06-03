from datetime import datetime, timedelta, timezone, date
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, RefreshToken
from schemas.auth import (
    RegisterRequest, LoginRequest, RefreshRequest, ProfileUpdateRequest,
    UserResponse, TokenResponse, CheckinResponse,
)
from services.auth import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, decode_token, calculate_level,
)
from dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def user_to_response(user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "level": user.level,
        "consecutive_days": user.consecutive_days,
        "created_at": user.created_at.isoformat() if user.created_at else "",
    }


@router.post("/register", status_code=201)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")
    user = User(
        username=req.username,
        password_hash=hash_password(req.password),
        level=1,
        consecutive_days=0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user_to_response(user)


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(user.id)
    refresh_token_str = create_refresh_token()
    refresh_expires = datetime.now(timezone.utc) + timedelta(days=7)
    db.add(RefreshToken(token=refresh_token_str, user_id=user.id, expires_at=refresh_expires))
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        user=UserResponse(**user_to_response(user)),
    )


@router.post("/refresh")
def refresh(req: RefreshRequest, db: Session = Depends(get_db)):
    rt = db.query(RefreshToken).filter(RefreshToken.token == req.refresh_token).first()
    if not rt or rt.expires_at < datetime.utcnow():
        if rt:
            db.delete(rt)
            db.commit()
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    db.delete(rt)
    new_access = create_access_token(rt.user_id)
    new_refresh = create_refresh_token()
    new_expires = datetime.now(timezone.utc) + timedelta(days=7)
    db.add(RefreshToken(token=new_refresh, user_id=rt.user_id, expires_at=new_expires))
    db.commit()

    return {"access_token": new_access, "token_type": "bearer", "refresh_token": new_refresh}


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return user_to_response(user)


@router.patch("/me")
def update_me(req: ProfileUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.bio is not None:
        user.bio = req.bio
    if req.avatar_url is not None:
        user.avatar_url = req.avatar_url
    db.commit()
    db.refresh(user)
    return user_to_response(user)


@router.patch("/checkin")
def checkin(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    if user.last_checkin_date == today:
        raise HTTPException(status_code=409, detail="Already checked in today")

    yesterday = today - timedelta(days=1)
    if user.last_checkin_date == yesterday:
        user.consecutive_days += 1
    else:
        user.consecutive_days = 1

    user.last_checkin_date = today
    user.level = calculate_level(user.consecutive_days)
    db.commit()
    db.refresh(user)

    return CheckinResponse(
        consecutive_days=user.consecutive_days,
        level=user.level,
        checked_in_today=True,
    )
