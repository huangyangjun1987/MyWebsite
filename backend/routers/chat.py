from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.chat import ChatSendRequest
from services.chat import save_message, get_history, build_system_prompt
from models.chat import ChatMessage
from config import (
    CHAT_MAX_MESSAGE_LENGTH, DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL, DEEPSEEK_MODEL,
)

router = APIRouter(prefix="/api/chat", tags=["chat"])
CONTEXT_WINDOW = 20


def _get_client():
    try:
        from openai import OpenAI
    except ImportError:
        raise HTTPException(status_code=502, detail="AI 服务暂时不可用")
    return OpenAI(api_key=DEEPSEEK_API_KEY, base_url=DEEPSEEK_BASE_URL, timeout=60)


@router.post("/send")
def send_message(req: ChatSendRequest, db: Session = Depends(get_db)):
    if not req.message.strip():
        raise HTTPException(status_code=422, detail="Message cannot be empty")
    if len(req.message) > CHAT_MAX_MESSAGE_LENGTH:
        raise HTTPException(status_code=422, detail="Message too long")

    save_message(db, req.user_id, "user", req.message)

    system_prompt = build_system_prompt(db, req.user_id)
    history = get_history(db, req.user_id)

    messages = [{"role": "system", "content": system_prompt}]
    recent = history[-(CONTEXT_WINDOW * 2):]
    for m in recent:
        messages.append({"role": m["role"], "content": m["content"]})

    try:
        client = _get_client()
        resp = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=messages,
            stream=False,
        )
        reply = resp.choices[0].message.content
        save_message(db, req.user_id, "assistant", reply)
        return {"reply": reply}
    except Exception:
        raise HTTPException(status_code=502, detail="AI 服务暂时不可用")


@router.delete("/history/{user_id}")
def clear_chat_history(user_id: int, db: Session = Depends(get_db)):
    db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
    db.commit()
    return {"detail": "ok"}


@router.get("/history/{user_id}")
def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    messages = get_history(db, user_id)
    return {"messages": messages}
