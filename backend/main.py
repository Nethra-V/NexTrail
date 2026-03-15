from fastapi import FastAPI

from database import engine, Base
import models
import schemas

from fastapi import Depends
from sqlalchemy.orm import Session
from database import SessionLocal

from schemas import TelemetryIn

from services.risk import calculate_risk
from services.alerts import generate_alerts
from services.zone import detect_zone

from datetime import datetime, timezone

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def include_routers(app: FastAPI):
    from routers.tags import router as tags_router
    app.include_router(tags_router)

include_routers(app)

@app.get("/")
def home():
    return {"message": "Smart Meter Tracking Backend Running"}

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/telemetry")
def telemetry(data: TelemetryIn, db: Session = Depends(get_db)):

    risk = calculate_risk(data.battery, data.tamper, data.mode)

    device = models.Device(
        device_id=data.device_id,
        lat=data.lat,
        lon=data.lon,
        battery=data.battery,
        mode=data.mode,
        tamper=data.tamper,
        risk_score=risk
    )

    db.merge(device)

    history = models.LocationHistory(
        device_id=data.device_id,
        lat=data.lat,
        lon=data.lon
    )

    db.add(history)
    db.commit()

    generate_alerts(device, db)
    device.zone = detect_zone(data.lat, data.lon)

    tag = db.get(models.GuardianTag, data.device_id)
    if tag:
        tag.last_seen = datetime.now(timezone.utc)

    return {"status": "ok", "risk": risk}

@app.get("/devices")
def get_devices(db: Session = Depends(get_db)):
    return db.query(models.Device).all()

@app.get("/device/{device_id}")
def device_detail(device_id: str, db: Session = Depends(get_db)):

    device = db.query(models.Device).filter_by(device_id=device_id).first()

    history = db.query(models.LocationHistory)\
        .filter_by(device_id=device_id)\
        .all()

    return {
        "device": device,
        "history": history
    }

@app.post("/simulate-theft/{device_id}")
def simulate_theft(device_id: str, db: Session = Depends(get_db)):

    device = db.query(models.Device).filter_by(device_id=device_id).first()

    device.lat += 0.5
    device.lon += 0.5
    device.tamper = True
    device.risk_score = 95

    db.commit()

    return {"msg": "theft simulated"}

@app.post("/leaderboard/add")
def add_score(installer: str, meters: int, score: int):

    db = SessionLocal()

    entry = models.InstallerScore(
        installer=installer,
        meters=meters,
        score=score
    )

    db.add(entry)
    db.commit()

    return {"status": "added"}

@app.get("/leaderboard")
def get_leaderboard():
    db = SessionLocal()
    results = db.query(models.InstallerScore).all()
    return results

@app.post("/lifecycle/{device_id}/{stage}")
def update_lifecycle(device_id: str, stage: str, db: Session = Depends(get_db)):

    allowed = [
        "factory",
        "transit",
        "installed_uncommissioned",
        "commissioned"
    ]

    if stage not in allowed:
        return {"error": "invalid stage"}

    device = db.get(models.Device, device_id)
    if not device:
        return {"error": "not found"}

    device.lifecycle = stage
    db.commit()

    return {"msg": "updated"}

@app.post("/carbon/add/{kg}")
def add_carbon(kg: float, db: Session = Depends(get_db)):

    stat = db.query(models.CarbonStat).first()
    if not stat:
        stat = models.CarbonStat(saved_kg=0)

    stat.saved_kg += kg
    db.merge(stat)
    db.commit()

    return {"total_saved": stat.saved_kg}

@app.get("/ai-query")
def ai_query(q: str, db: Session = Depends(get_db)):

    if "high risk" in q.lower():
        return db.query(models.Device)\
            .filter(models.Device.risk_score > 70)\
            .all()

    if "battery low" in q.lower():
        return db.query(models.Device)\
            .filter(models.Device.battery < 20)\
            .all()

    return {"msg": "query not recognized"}

@app.post("/bulk-telemetry")
def bulk(data: list[schemas.TelemetryIn],
         db: Session = Depends(get_db)):

    for d in data:
        device = models.Device(**d.model_dump())
        db.merge(device)

    db.commit()
    return {"count": len(data)}

@app.get("/kpis")
def kpis(db: Session = Depends(get_db)):

    total_devices = db.query(models.Device).count()
    total_tags = db.query(models.GuardianTag).count()
    total_alerts = db.query(models.Alert).count()

    carbon = db.query(models.CarbonStat).first()
    carbon_saved = carbon.saved_kg if carbon else 0

    return {
        "devices": total_devices,
        "tags": total_tags,
        "alerts": total_alerts,
        "carbon": carbon_saved
    }

@app.post("/alerts/add")
def add_alert(device_id: str, message: str, db: Session = Depends(get_db)):

    alert = models.Alert(
        device_id=device_id,
        message=message
    )

    db.add(alert)
    db.commit()

    return {"status": "alert added"}

@app.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).order_by(models.Alert.id.desc()).all()
    return alerts