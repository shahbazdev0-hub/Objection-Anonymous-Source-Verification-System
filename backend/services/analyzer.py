import os
import json
from typing import List, Dict
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are an expert evidence analyst for investigative journalism.
You are given a set of documents or files submitted by an anonymous source.
Your job is to assess the evidence WITHOUT identifying or exposing the source.

Analyse for:
1. Internal consistency — do facts, dates, names, and figures align across documents?
2. Corroboration — do multiple independent files support the same claims?
3. Plausibility — are the events, language, and format consistent with what is claimed?
4. Red flags — any signs of fabrication, tampering, or inconsistency?

Return ONLY a JSON object with this exact structure (no markdown, no preamble):
{
  "confidence_score": <integer 0-100>,
  "reliability_label": "<Verified | Plausible | Uncertain | Unreliable>",
  "summary": "<2-3 sentence plain English summary suitable for certificate>",
  "consistency": "<one sentence assessment>",
  "corroboration": "<one sentence assessment>",
  "red_flags": "<none detected | brief description>",
  "file_notes": [
    {"name": "<filename>", "note": "<brief note about this specific file>"}
  ]
}"""

async def analyze_evidence(extracted_files: List[Dict]) -> Dict:
    """
    Send all extracted file content to OpenAI gpt-4o for cross-document analysis.
    Returns structured assessment dict.
    """
    if not extracted_files:
        return _default_analysis()

    # Build the user message with all file contents
    user_content = "Analyse the following evidence package:\n\n"
    for i, f in enumerate(extracted_files, 1):
        user_content += f"--- FILE {i}: {f['name']} ({f['content_type']}) ---\n"
        user_content += f"{f['text']}\n\n"

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content}
            ],
            max_tokens=1000,
            temperature=0.2
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        analysis = json.loads(raw)
        return analysis

    except json.JSONDecodeError:
        return _default_analysis(summary="Analysis completed but structured output could not be parsed.")
    except Exception as e:
        return _default_analysis(summary=f"Analysis error: {str(e)}")


def _default_analysis(summary: str = "Evidence received and hashed. Manual review recommended.") -> Dict:
    return {
        "confidence_score": 50,
        "reliability_label": "Uncertain",
        "summary": summary,
        "consistency": "Unable to assess.",
        "corroboration": "Unable to assess.",
        "red_flags": "Analysis incomplete.",
        "file_notes": []
    }