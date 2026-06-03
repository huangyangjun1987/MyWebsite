from sqlalchemy.orm import Session
from models.chat import ChatMessage
from models.user import User


def save_message(db: Session, user_id: int, role: str, content: str) -> ChatMessage:
    msg = ChatMessage(user_id=user_id, role=role, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_history(db: Session, user_id: int) -> list[dict]:
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat() if m.created_at else "",
        }
        for m in messages
    ]


def build_system_prompt(db: Session, user_id: int) -> str:
    user = db.query(User).filter(User.id == user_id).first()

    parts = ["你是一个 AI 学习助手，帮助用户制定学习计划、解答学习问题、提供学习建议。"]

    if user:
        parts.append(f"用户等级：{user.level}（1=新手, 2=学徒, 3=进阶者, 4=专家）")
        parts.append(f"连续学习天数：{user.consecutive_days} 天")
        if user.bio:
            parts.append(f"用户简介：{user.bio}")

    parts.append("请基于以上信息为用户提供个性化的学习建议。回答应简洁、具体、可操作。")

    return "\n".join(parts)
