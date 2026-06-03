from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ProfileUpdateRequest(BaseModel):
    bio: str | None = Field(default=None, max_length=200)
    avatar_url: str | None = Field(default=None, max_length=512)


class UserResponse(BaseModel):
    id: int
    username: str
    avatar_url: str | None = None
    bio: str | None = None
    level: int
    consecutive_days: int
    created_at: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str
    user: UserResponse


class CheckinResponse(BaseModel):
    consecutive_days: int
    level: int
    checked_in_today: bool = True


class ErrorResponse(BaseModel):
    detail: str
