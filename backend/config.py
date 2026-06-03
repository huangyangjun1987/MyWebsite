import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


def _normalize_cors_origins(raw_origins: str) -> list[str]:
    origins: list[str] = []

    for origin in raw_origins.split(","):
        value = origin.strip()
        if not value or value in origins:
            continue
        origins.append(value)

        if "://localhost:" in value:
            loopback = value.replace("://localhost:", "://127.0.0.1:")
            if loopback not in origins:
                origins.append(loopback)
        elif "://127.0.0.1:" in value:
            localhost = value.replace("://127.0.0.1:", "://localhost:")
            if localhost not in origins:
                origins.append(localhost)

    return origins

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./studypal.db")

CORS_ORIGINS = _normalize_cors_origins(
    os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,https://huangyangjun1987.github.io",
    )
)

AUTH_ENABLED = os.getenv("AUTH_ENABLED", "true").lower() == "true"

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

CHAT_MAX_MESSAGE_LENGTH = int(os.getenv("CHAT_MAX_MESSAGE_LENGTH", "4000"))
CHAT_TIMEOUT_SECONDS = int(os.getenv("CHAT_TIMEOUT_SECONDS", "30"))
