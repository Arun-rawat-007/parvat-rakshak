from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from database import Base

class DBHazardZone(Base):
    __tablename__ = "hazard_zones"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    risk_level = Column(String, default="HIGH")
    p_failure = Column(Float, default=0.75)
    exposed_population = Column(Integer, default=500)
    lead_time_hours = Column(Integer, default=24)
    slope_angle = Column(Float, default=38.5) # Slope inclination beta in degrees
    cohesion = Column(Float, default=12.5)    # Effective cohesion c' in kPa
    friction_angle = Column(Float, default=28.0) # Effective friction angle phi' in degrees

class DBIncidentSOS(Base):
    __tablename__ = "incidents_sos"

    id = Column(String, primary_key=True, index=True)
    location_name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    people_count = Column(Integer, default=1)
    medical_urgency = Column(String, default="HIGH")
    priority_score = Column(Float, default=50.0)
    is_mesh_relayed = Column(Boolean, default=False)
    status = Column(String, default="UNALLOCATED")
    assigned_team = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBSensorTelemetry(Base):
    __tablename__ = "sensor_telemetry"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    zone_id = Column(String, nullable=False)
    pore_pressure = Column(Float, nullable=False)
    piezometer_depth = Column(Float, nullable=False)
    rainfall_rate = Column(Float, nullable=False)
    insar_creep = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)