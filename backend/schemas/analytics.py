from pydantic import BaseModel, Field
from datetime import date, datetime


# --- Overview ---

class OverviewResponse(BaseModel):
    today_duration_minutes: int = 0
    goals_completed: int = 0
    goals_total: int = 0
    streak_days: int = 0
    streak_record: int = 0
    course_progress_pct: int = 0


# --- Trends ---

class TrendPoint(BaseModel):
    label: str
    value: float


class TrendResponse(BaseModel):
    type: str
    data: list[TrendPoint]


# --- Calendar ---

class CalendarDay(BaseModel):
    date: date
    duration_minutes: int = 0


class CalendarResponse(BaseModel):
    year: int
    month: int
    days: list[CalendarDay]


# --- Goals ---

class GoalItemResponse(BaseModel):
    id: str
    title: str
    course: str = ""
    completed: bool = False


class GoalsResponse(BaseModel):
    goals: list[GoalItemResponse]
    completed_count: int = 0
    total_count: int = 0


class GoalToggleResponse(BaseModel):
    id: str
    completed: bool


# --- Achievements ---

class AchievementItemResponse(BaseModel):
    id: int
    key: str
    name: str
    description: str
    icon: str
    category: str
    unlocked: bool = False
    unlocked_at: datetime | None = None


class AchievementsResponse(BaseModel):
    achievements: list[AchievementItemResponse]
