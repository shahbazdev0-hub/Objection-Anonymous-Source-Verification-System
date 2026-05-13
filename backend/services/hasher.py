import hashlib
from typing import List, Dict
from datetime import datetime, timezone
# In hasher.py, after hashing, call a timestamp API
import requests

def get_trusted_timestamp(hash_value: str) -> str:
    # Free option: worldtimeapi.org or OriginStamp
    res = requests.get("https://worldtimeapi.org/api/timezone/UTC")
    return res.json()["utc_datetime"]

def hash_files(file_data: List[Dict]) -> List[Dict]:
    results = []
    for f in file_data:
        content = f["content"]
        sha256 = hashlib.sha256(content).hexdigest()
        results.append({
            "name": f["name"],
            "hash": sha256[:16],
            "hash_full": sha256,
            "size_bytes": len(content),
            "received_at": datetime.now(timezone.utc).isoformat()
        })
    return results
