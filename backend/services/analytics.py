from datetime import date, timedelta, datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.user import User
from models.learning import LearningActivity, Achievement, UserAchievement, Goal


# --- Overview ---

def get_overview(db: Session, user_id: int) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    today = date.today()

    activity = (
        db.query(LearningActivity)
        .filter(LearningActivity.user_id == user_id, LearningActivity.date == today)
        .first()
    )

    today_goals = (
        db.query(Goal)
        .filter(Goal.user_id == user_id, Goal.date == today)
        .all()
    )

    goals_total = len(today_goals)
    goals_completed = sum(1 for g in today_goals if g.completed)

    return {
        "today_duration_minutes": activity.study_duration_minutes if activity else 0,
        "goals_completed": goals_completed,
        "goals_total": goals_total,
        "streak_days": user.consecutive_days if user else 0,
        "streak_record": 21,  # fixed for now; could be persisted on user table
        "course_progress_pct": 68,  # fixed for now; requires courses table
    }


# --- Trends ---

_WEEKDAY_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]


def get_trends(db: Session, user_id: int, trend_type: str) -> dict:
    today = date.today()

    if trend_type == "weekly":
        days = 7
        start = today - timedelta(days=6)
        labels = _WEEKDAY_LABELS
    else:
        days = 30
        start = today - timedelta(days=29)
        labels = [str((start + timedelta(days=i)).day) for i in range(days)]

    activities = (
        db.query(LearningActivity)
        .filter(
            LearningActivity.user_id == user_id,
            LearningActivity.date >= start,
            LearningActivity.date <= today,
        )
        .all()
    )
    activity_map = {a.date: a.study_duration_minutes / 60.0 for a in activities}

    data = []
    for i in range(days):
        d = start + timedelta(days=i)
        value = round(activity_map.get(d, 0), 1)
        data.append({"label": labels[i], "value": value})

    return {"type": trend_type, "data": data}


# --- Calendar ---

def get_calendar(db: Session, user_id: int, year: int, month: int) -> dict:
    import calendar

    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])

    activities = (
        db.query(LearningActivity)
        .filter(
            LearningActivity.user_id == user_id,
            LearningActivity.date >= first_day,
            LearningActivity.date <= last_day,
        )
        .all()
    )
    activity_map = {a.date: a.study_duration_minutes for a in activities}

    days = []
    current = first_day
    while current <= last_day:
        days.append({
            "date": current.isoformat(),
            "duration_minutes": activity_map.get(current, 0),
        })
        current += timedelta(days=1)

    return {"year": year, "month": month, "days": days}


# --- Goals ---

def _ensure_daily_goals(db: Session, user_id: int) -> list[Goal]:
    """Create default goals for today if none exist."""
    today = date.today()
    existing = (
        db.query(Goal)
        .filter(Goal.user_id == user_id, Goal.date == today)
        .all()
    )
    if existing:
        return existing

    defaults = [
        {"title": "完成 React 19 新特性学习", "course": "React 进阶"},
        {"title": "阅读 Tailwind CSS v4 文档", "course": "CSS 工程化"},
        {"title": "完成算法练习 3 题", "course": "数据结构与算法"},
        {"title": "整理学习笔记", "course": "学习方法论"},
    ]
    goals = []
    for item in defaults:
        g = Goal(
            user_id=user_id,
            title=item["title"],
            course=item["course"],
            completed=False,
            date=today,
        )
        db.add(g)
        goals.append(g)
    db.commit()
    for g in goals:
        db.refresh(g)
    return goals


def get_goals(db: Session, user_id: int) -> dict:
    goals = _ensure_daily_goals(db, user_id)
    goal_items = [
        {
            "id": str(g.id),
            "title": g.title,
            "course": g.course or "",
            "completed": bool(g.completed),
        }
        for g in goals
    ]
    completed_count = sum(1 for g in goals if g.completed)
    return {
        "goals": goal_items,
        "completed_count": completed_count,
        "total_count": len(goals),
    }


def toggle_goal(db: Session, user_id: int, goal_id: int) -> dict:
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
    if not goal:
        return None

    goal.completed = not goal.completed
    db.commit()
    db.refresh(goal)

    # Update learning activity goals_completed count
    _sync_goals_completed(db, user_id)

    # Check achievements after goal toggle
    check_and_unlock_achievements(db, user_id)

    return {"id": str(goal.id), "completed": bool(goal.completed)}


def _sync_goals_completed(db: Session, user_id: int) -> None:
    today = date.today()
    completed = (
        db.query(Goal)
        .filter(Goal.user_id == user_id, Goal.date == today, Goal.completed == True)
        .count()
    )
    activity = (
        db.query(LearningActivity)
        .filter(LearningActivity.user_id == user_id, LearningActivity.date == today)
        .first()
    )
    if activity:
        activity.goals_completed = completed
    else:
        activity = LearningActivity(
            user_id=user_id,
            date=today,
            goals_completed=completed,
        )
        db.add(activity)
    db.commit()


# --- Achievements ---

def get_achievements(db: Session, user_id: int) -> dict:
    all_achievements = db.query(Achievement).all()
    user_unlocked = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == user_id)
        .all()
    )
    unlocked_map = {ua.achievement_id: ua.unlocked_at for ua in user_unlocked}

    items = []
    for a in all_achievements:
        ua_time = unlocked_map.get(a.id)
        items.append({
            "id": a.id,
            "key": a.key,
            "name": a.name,
            "description": a.description,
            "icon": a.icon,
            "category": a.category,
            "unlocked": a.id in unlocked_map,
            "unlocked_at": ua_time.isoformat() if ua_time else None,
        })

    return {"achievements": items}


def check_and_unlock_achievements(db: Session, user_id: int) -> list[dict]:
    """Check all achievements and unlock any that the user has earned but doesn't have yet."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return []

    all_achievements = db.query(Achievement).all()
    unlocked = set(
        ua.achievement_id
        for ua in db.query(UserAchievement)
        .filter(UserAchievement.user_id == user_id)
        .all()
    )

    newly_unlocked = []
    for a in all_achievements:
        if a.id in unlocked:
            continue

        if _check_condition(db, user, a):
            ua = UserAchievement(
                user_id=user_id,
                achievement_id=a.id,
                unlocked_at=datetime.now(timezone.utc),
            )
            db.add(ua)
            db.commit()
            db.refresh(ua)
            newly_unlocked.append({
                "id": a.id,
                "key": a.key,
                "name": a.name,
                "unlocked_at": ua.unlocked_at.isoformat(),
            })
            unlocked.add(a.id)

    return newly_unlocked


def _check_condition(db: Session, user: User, achievement: Achievement) -> bool:
    key = achievement.key

    if key == "first_checkin":
        return user.consecutive_days >= 1

    if key == "streak_7":
        return user.consecutive_days >= 7

    if key == "study_10h":
        total = (
            db.query(func.sum(LearningActivity.study_duration_minutes))
            .filter(LearningActivity.user_id == user.id)
            .scalar()
        ) or 0
        return total >= 600  # 10 hours = 600 minutes

    if key == "goals_20":
        total = (
            db.query(func.sum(LearningActivity.goals_completed))
            .filter(LearningActivity.user_id == user.id)
            .scalar()
        ) or 0
        return total >= 20

    if key == "chat_50":
        from models.chat import ChatMessage
        count = (
            db.query(ChatMessage)
            .filter(ChatMessage.user_id == user.id, ChatMessage.role == "user")
            .count()
        )
        return count >= 50

    return False
