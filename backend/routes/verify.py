from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from services.hasher import hash_files
from services.extractor import extract_text_from_files
from services.analyzer import analyze_evidence
from services.certificate import generate_certificate
from database import db
from datetime import datetime, timezone

router = APIRouter()

@router.post("/verify")
async def verify_evidence(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files per submission")

    file_data = []
    for f in files:
        content = await f.read()
        file_data.append({
            "name": f.filename,
            "content": content,
            "content_type": f.content_type
        })

    file_hashes = hash_files(file_data)
    extracted = await extract_text_from_files(file_data)
    analysis = await analyze_evidence(extracted)
    cert = generate_certificate(file_hashes=file_hashes, analysis=analysis)

    await db.certificates.insert_one({
        **cert,
        "created_at": datetime.now(timezone.utc)
    })

    return cert
