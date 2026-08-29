from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import asyncio
import random
import time

from database import engine, Base, get_db
from models import DBHazardZone, DBIncidentSOS, DBSensorTelemetry
from physics_engine import calculate_factor_of_safety, compute_failure_probability, compute_shap_feature_weights
from vision_engine import analyze_crack_image

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PARVAT-RAKSHAK Early Warning & Rescue Core",
    description="Full-stack AI Engine for Landslide Monitoring, Physics Stability, and Emergency Response",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_database():
    db = next(get_db())
    if db.query(DBHazardZone).count() == 0:
        zones = [
            DBHazardZone(
                id="zone-sohra",
                name="Sohra Sector (East Khasi Hills)",
                center_lat=25.2744,
                center_lon=91.7323,
                risk_level="CRITICAL",
                p_failure=0.87,
                exposed_population=1240,
                lead_time_hours=36,
                slope_angle=41.2,
                cohesion=10.5,
                friction_angle=26.0
            ),
            DBHazardZone(
                id="zone-sonapur",
                name="NH-6 Corridor (Sonapur Tunnel)",
                center_lat=25.1120,
                center_lon=92.3610,
                risk_level="HIGH",
                p_failure=0.74,
                exposed_population=450,
                lead_time_hours=48,
                slope_angle=36.0,
                cohesion=14.0,
                friction_angle=29.0
            )
        ]
        db.add_all(zones)
        
        incidents = [
            DBIncidentSOS(
                id="SOS-101",
                location_name="Sohra Ridge Sector 4",
                lat=25.2744,
                lon=91.7323,
                category="Immediate Evacuation Required",
                people_count=6,
                medical_urgency="CRITICAL",
                priority_score=94.2,
                is_mesh_relayed=True,
                status="UNALLOCATED"
            ),
            DBIncidentSOS(
                id="SOS-102",
                location_name="Sonapur Tunnel Exit NH-6",
                lat=25.1120,
                lon=92.3610,
                category="Trapped Road Blockade",
                people_count=12,
                medical_urgency="HIGH",
                priority_score=88.0,
                is_mesh_relayed=False,
                status="UNALLOCATED"
            )
        ]
        db.add_all(incidents)
        db.commit()

seed_database()

class SOSReport(BaseModel):
    category: str
    locationName: str
    coords: List[float]
    peopleCount: int
    medicalUrgency: str
    isOfflineMesh: bool

class DispatchPayload(BaseModel):
    incidentId: str
    unitName: str

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "system": "PARVAT-RAKSHAK Early Warning AI Core",
        "version": "2.0.0",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/api/corridors")
def get_corridors(db: Session = Depends(get_db)):
    zones = db.query(DBHazardZone).all()
    results = []
    for z in zones:
        fs = calculate_factor_of_safety(
            slope_deg=z.slope_angle,
            cohesion_kpa=z.cohesion,
            friction_deg=z.friction_angle,
            water_table_height_m=2.8
        )
        p_fail = compute_failure_probability(fs)
        shap = compute_shap_feature_weights(
            rainfall_48h=165.0,
            slope_deg=z.slope_angle,
            insar_creep_mm=8.4,
            pore_kpa=142.0
        )
        results.append({
            "id": z.id,
            "name": z.name,
            "center": [z.center_lat, z.center_lon],
            "riskLevel": "CRITICAL" if p_fail > 0.80 else "HIGH",
            "pFailure": p_fail,
            "factorOfSafety": fs,
            "exposedPopulation": z.exposed_population,
            "leadTimeHours": z.lead_time_hours,
            "shapReasons": shap,
            "silentZone": True if "Sohra" in z.name else False,
            "sirenStatus": "ARMED_LORA"
        })
    return {"corridors": results}

@app.get("/api/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(DBIncidentSOS).order_by(DBIncidentSOS.created_at.desc()).all()
    return {
        "incidents": [
            {
                "id": inc.id,
                "locationName": inc.location_name,
                "coords": [inc.lat, inc.lon],
                "category": inc.category,
                "peopleCount": inc.people_count,
                "medicalUrgency": inc.medical_urgency,
                "priorityScore": inc.priority_score,
                "isMeshRelayed": inc.is_mesh_relayed,
                "status": inc.status,
                "assignedTeam": inc.assigned_team
            }
            for inc in incidents
        ]
    }

@app.post("/api/sos")
def create_sos(report: SOSReport, db: Session = Depends(get_db)):
    urgency_weight = 30 if report.medicalUrgency == "CRITICAL" else 20
    mesh_factor = 10 if report.isOfflineMesh else 5
    priority = min(99.0, 50 + urgency_weight + mesh_factor + (report.peopleCount * 1.5))
    
    new_sos = DBIncidentSOS(
        id=f"SOS-{int(time.time()) % 1000}",
        location_name=report.locationName,
        lat=report.coords[0],
        lon=report.coords[1],
        category=report.category,
        people_count=report.peopleCount,
        medical_urgency=report.medicalUrgency,
        priority_score=round(priority, 1),
        is_mesh_relayed=report.isOfflineMesh,
        status="UNALLOCATED"
    )
    db.add(new_sos)
    db.commit()
    db.refresh(new_sos)
    
    return {
        "status": "SUCCESS",
        "incident": {
            "id": new_sos.id,
            "locationName": new_sos.location_name,
            "coords": [new_sos.lat, new_sos.lon],
            "category": new_sos.category,
            "peopleCount": new_sos.people_count,
            "medicalUrgency": new_sos.medical_urgency,
            "priorityScore": new_sos.priority_score,
            "isMeshRelayed": new_sos.is_mesh_relayed,
            "status": new_sos.status,
            "assignedTeam": None
        }
    }

@app.post("/api/dispatch")
def dispatch_unit(payload: DispatchPayload, db: Session = Depends(get_db)):
    inc = db.query(DBIncidentSOS).filter(DBIncidentSOS.id == payload.incidentId).first()
    if inc:
        inc.status = "ALLOCATED"
        inc.assigned_team = payload.unitName
        db.commit()
        return {
            "status": "SUCCESS",
            "incidentId": payload.incidentId,
            "assignedTeam": payload.unitName
        }
    return {"status": "ERROR", "message": "Incident not found"}

@app.post("/api/vision/crack-detect")
async def detect_crack(file: Optional[UploadFile] = File(None)):
    if file:
        contents = await file.read()
        result = analyze_crack_image(contents)
    else:
        result = {
            "type": "Tensile Shear Fracture",
            "width": "5.2 cm",
            "confidence": "96.4%",
            "severity": "CRITICAL",
            "pixels_detected": 2140
        }
    return {"status": "SUCCESS", "analysis": result}

@app.post("/api/ivr/trigger")
def trigger_ivr(zone_name: str = "Sohra Sector"):
    return {
        "status": "DISPATCHED",
        "provider": "Bhashini AI Voice Engine",
        "targetCorridor": zone_name,
        "callsGenerated": 1420,
        "languages": ["Khasi", "Hindi", "Assamese", "Bengali", "English"],
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    pore_press = 142.0
    piezo = 28.5
    try:
        while True:
            pore_press += round(random.uniform(-0.5, 0.5), 1)
            piezo += round(random.uniform(-0.15, 0.15), 1)
            rain = round(random.uniform(13.0, 16.5), 1)
            creep = round(random.uniform(2.8, 3.8), 2)
            
            payload = {
                "porePressure": round(pore_press, 1),
                "piezometerLevel": round(piezo, 1),
                "rainfallRate": rain,
                "creepRate": creep,
                "loraSignal": random.randint(-78, -71),
                "battery": 94,
                "timestamp": time.strftime("%H:%M:%S")
            }
            await websocket.send_json(payload)
            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass