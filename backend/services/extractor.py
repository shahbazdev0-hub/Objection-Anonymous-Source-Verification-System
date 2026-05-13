import io
import os
import base64
from typing import List, Dict
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

async def extract_text_from_files(file_data: List[Dict]) -> List[Dict]:
    extracted = []
    for f in file_data:
        name = f["name"]
        content = f["content"]
        ctype = f.get("content_type", "")
        text = ""
        try:
            if ctype == "application/pdf" or name.lower().endswith(".pdf"):
                text = _extract_pdf(content)

            elif ctype.startswith("image/") or name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                text = f"[IMAGE: {name}] base64:{base64.b64encode(content).decode()[:500]}..."

            elif ctype.startswith("audio/") or name.lower().endswith((".mp3", ".mp4", ".wav")):
                try:
                    sync_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
                    audio_buffer = io.BytesIO(content)
                    audio_buffer.name = name
                    transcript = sync_client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_buffer
                    )
                    text = f"[AUDIO TRANSCRIPT: {name}]\n{transcript.text}"
                except Exception as e:
                    text = f"[AUDIO FILE: {name}] — Transcription failed: {str(e)}"

            else:
                text = content.decode("utf-8", errors="replace")

        except Exception as e:
            text = f"[Could not extract content from {name}: {str(e)}]"

        extracted.append({"name": name, "content_type": ctype, "text": text[:8000]})
    return extracted


def _extract_pdf(content: bytes) -> str:
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(content))
        return "\n\n".join(page.extract_text() or "" for page in reader.pages)
    except ImportError:
        return "[pypdf not installed. Run: pip install pypdf]"
    except Exception as e:
        return f"[PDF extraction failed: {str(e)}]"