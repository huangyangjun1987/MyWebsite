from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Date
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True, nullable=False, index=True)
    password_hash = Column(String(128), nullable=False)
    avatar_url = Column(String(512), nullable=True)
    bio = Column(String(200), nullable=True)
    level = Column(Integer, default=1)
    consecutive_days = Column(Integer, default=0)
    last_checkin_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(512), unique=True, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
