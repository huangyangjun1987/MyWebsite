from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.analytics import (
    OverviewResponse, TrendResponse, CalendarResponse,
    GoalsResponse, GoalToggleResponse, AchievementsResponse,
)
from services.analytics import (
    get_overview, get_trends, get_calendar,
    get_goals, toggle_goal, get_achievements,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/overview", response_model=OverviewResponse)
def overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_overview(db, current_user.id)
    return OverviewResponse(**data)


@router.get("/trends", response_model=TrendResponse)
def trends(
    type: str = Query("weekly", pattern="^(weekly|monthly)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_trends(db, current_user.id, type)
    return TrendResponse(**data)


@router.get("/calendar", response_model=CalendarResponse)
def calendar(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_calendar(db, current_user.id, year, month)
    return CalendarResponse(**data)


@router.get("/goals", response_model=GoalsResponse)
def goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_goals(db, current_user.id)
    return GoalsResponse(**data)


@router.patch("/goals/{goal_id}/toggle", response_model=GoalToggleResponse)
def goals_toggle(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = toggle_goal(db, current_user.id, goal_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    return GoalToggleResponse(**result)


@router.get("/achievements", response_model=AchievementsResponse)
def achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = get_achievements(db, current_user.id)
    return AchievementsResponse(**data)
