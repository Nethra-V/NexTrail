from pydantic import BaseModel
from datetime import datetime

class TelemetryIn(BaseModel):
    device_id: str
    lat: float
    lon: float
    battery: float
    mode: str
    tamper: bool

    model_config = {
        "extra": "forbid"  # v2 syntax for disallowing extra fields
    }

class DeviceOut(BaseModel):
    device_id: str
    lat: float
    lon: float
    battery: float
    mode: str
    tamper: bool
    risk_score: int

    model_config = {
        "extra": "forbid"
    }

class TagCreate(BaseModel):
    tag_id: str

class TagAssign(BaseModel):
    tag_id: str
    installer: str
    meter_id: str

class TagStatusOut(BaseModel):
    tag_id: str
    status: str
    assigned_to: str | None
    meter_id: str | None
    last_seen: datetime | None