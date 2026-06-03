from pydantic import BaseModel, Field


class ChatSendRequest(BaseModel):
    user_id: int
    message: str = Field(min_length=1, max_length=4000)


class ChatHistoryResponse(BaseModel):
    messages: list[dict]
