from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/tags", tags=["Guardian Tags"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_tag(data: schemas.TagCreate, db: Session = Depends(get_db)):

    existing = db.get(models.GuardianTag, data.tag_id)
    if existing:
        return {"error": "Tag already exists"}

    tag = models.GuardianTag(tag_id=data.tag_id)
    db.add(tag)
    db.commit()

    return {"msg": "Tag registered"}

@router.post("/assign")
def assign_tag(data: schemas.TagAssign, db: Session = Depends(get_db)):

    tag = db.get(models.GuardianTag, data.tag_id)
    if not tag:
        return {"error": "Tag not found"}

    if tag.status == "assigned":
        return {"error": "Tag already assigned"}

    tag.status = "assigned"
    tag.assigned_to = data.installer
    tag.meter_id = data.meter_id
    tag.last_seen = datetime.now(timezone.utc)

    db.commit()

    return {"msg": "Tag assigned"}

@router.post("/return/{tag_id}")
def return_tag(tag_id: str, db: Session = Depends(get_db)):

    tag = db.get(models.GuardianTag, tag_id)
    if not tag:
        return {"error": "Tag not found"}

    tag.status = "returned"
    tag.assigned_to = None
    tag.meter_id = None
    tag.active = False

    db.commit()

    return {"msg": "Tag returned to inventory"}

@router.post("/mark-lost/{tag_id}")
def mark_lost(tag_id: str, db: Session = Depends(get_db)):

    tag = db.get(models.GuardianTag, tag_id)
    if not tag:
        return {"error": "Tag not found"}

    tag.status = "lost"
    tag.active = False

    db.commit()

    return {"msg": "Tag marked as lost"}

@router.get("/offline")
def check_offline(db: Session = Depends(get_db)):

    threshold = datetime.now(timezone.utc) - timedelta(hours=2)

    offline_tags = db.query(models.GuardianTag)\
        .filter(models.GuardianTag.last_seen < threshold)\
        .filter(models.GuardianTag.status == "assigned")\
        .all()

    return offline_tags

@router.get("/inventory")
def inventory(db: Session = Depends(get_db)):

    available = db.query(models.GuardianTag)\
        .filter(models.GuardianTag.status == "available")\
        .count()

    assigned = db.query(models.GuardianTag)\
        .filter(models.GuardianTag.status == "assigned")\
        .count()

    lost = db.query(models.GuardianTag)\
        .filter(models.GuardianTag.status == "lost")\
        .count()

    return {
        "available": available,
        "assigned": assigned,
        "lost": lost
    }