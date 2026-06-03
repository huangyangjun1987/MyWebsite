from openai import OpenAI
from config import DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL


def get_client() -> OpenAI:
    return OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url=DEEPSEEK_BASE_URL,
        timeout=30,
    )


def chat(messages: list[dict]) -> str:
    client = get_client()
    resp = client.chat.completions.create(
        model=DEEPSEEK_MODEL,
        messages=messages,
        stream=False,
    )
    return resp.choices[0].message.content
