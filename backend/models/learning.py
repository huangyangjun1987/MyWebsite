from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, UniqueConstraint
from database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(256), nullable=False)
    course = Column(String(128), default="")
    completed = Column(Integer, default=0)  # 0 = not completed, 1 = completed
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class LearningActivity(Base):
    __tablename__ = "learning_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    study_duration_minutes = Column(Integer, default=0)
    goals_completed = Column(Integer, default=0)
    chat_interactions = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="uq_user_learning_date"),
    )


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    description = Column(String(256), nullable=False)
    icon = Column(String(64), nullable=False)
    category = Column(String(64), nullable=False)
    threshold = Column(Integer, nullable=True)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False, index=True)
    unlocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )
