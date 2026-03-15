from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime
from database import Base
from sqlalchemy.sql import func

class Device(Base):
    __tablename__ = "devices"

    device_id = Column(String, primary_key=True)
    lat = Column(Float)
    lon = Column(Float)
    battery = Column(Float)
    mode = Column(String)  # factory/transit/installed
    lifecycle = Column(String, default="factory")
    tamper = Column(Boolean)
    risk_score = Column(Integer, default=0)
    installer = Column(String, default="Unassigned")
    zone = Column(String, default="unknown")
    gps_available = Column(Boolean, default=True)

class LocationHistory(Base):
    __tablename__ = "location_history"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String)
    lat = Column(Float)
    lon = Column(Float)

class InstallerScore(Base):
    __tablename__ = "installer_score"

    installer = Column(String, primary_key=True)
    score = Column(Integer)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    device_id = Column(String)
    message = Column(String)

class CarbonStat(Base):
    __tablename__ = "carbon_stats"

    id = Column(Integer, primary_key=True)
    saved_kg = Column(Float, default=0)

class InstallerScore(Base):
    __tablename__ = "installer_scores"

    installer = Column(String, primary_key=True)
    meters = Column(Integer)
    score = Column(Integer)

class GuardianTag(Base):
    __tablename__ = "guardian_tags"

    tag_id = Column(String, primary_key=True)
    status = Column(String, default="available")
    # available | assigned | returned | lost

    assigned_to = Column(String, nullable=True)
    meter_id = Column(String, nullable=True)

    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    active = Column(Boolean, default=True)