from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from config import CORS_ORIGINS
from routers.auth import router as auth_router
from routers.chat import router as chat_router
from routers.analytics import router as analytics_router
from models.learning import Achievement

app = FastAPI(title="StudyPal API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    _seed_achievements()


def _seed_achievements():
    db = SessionLocal()
    try:
        existing = db.query(Achievement).count()
        if existing > 0:
            return

        defaults = [
            Achievement(key="first_checkin", name="初次签到", description="完成首次签到", icon="star", category="checkin", threshold=1),
            Achievement(key="streak_7", name="连续 7 天", description="连续签到 7 天", icon="fire", category="checkin", threshold=7),
            Achievement(key="study_10h", name="学习 10 小时", description="累计学习达到 10 小时", icon="clock", category="duration", threshold=600),
            Achievement(key="goals_20", name="目标达成者", description="累计完成 20 个学习目标", icon="target", category="goals", threshold=20),
            Achievement(key="chat_50", name="AI 对话者", description="累计 50 次 AI 对话", icon="chat", category="chat", threshold=50),
        ]
        db.add_all(defaults)
        db.commit()
    finally:
        db.close()


app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(analytics_router)


@app.get("/")
def root():
    return {"message": "StudyPal API is running"}
