import uuid
from typing import List, Dict
from datetime import datetime, timezone

def generate_certificate(file_hashes: List[Dict], analysis: Dict) -> Dict:
    cert_id = "OBJ-" + str(uuid.uuid4()).replace("-", "").upper()[:7]
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    score = analysis.get("confidence_score", 50)
    label = analysis.get("reliability_label", "Uncertain")

    if score >= 80:
        qualifier = "corroborated by documentary evidence"
    elif score >= 60:
        qualifier = "supported by documentary evidence"
    else:
        qualifier = "accompanied by documentary evidence"

    attribution = (
        f"The source's account was {qualifier} verified via Objection's independent "
        f"certification process (Certificate {cert_id}, issued {timestamp}, "
        f"confidence score: {score}%)."
    )

    return {
        "cert_id": cert_id,
        "timestamp": timestamp,
        "confidence_score": score,
        "reliability_label": label,
        "file_count": len(file_hashes),
        "files": [{"name": f["name"], "hash": f["hash"], "size_bytes": f["size_bytes"]} for f in file_hashes],
        "analysis_summary": analysis.get("summary", ""),
        "consistency": analysis.get("consistency", ""),
        "corroboration": analysis.get("corroboration", ""),
        "red_flags": analysis.get("red_flags", "None detected"),
        "attribution": attribution,
    }
