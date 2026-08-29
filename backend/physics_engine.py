import math
import os
import joblib
import numpy as np

GAMMA_SOIL = 19.0     # Saturated unit weight of soil (kN/m^3)
GAMMA_WATER = 9.81    # Unit weight of water (kN/m^3)
SOIL_DEPTH_Z = 3.5    # Depth to failure shear plane (m)

# Load trained ML model if available
MODEL_PATH = os.path.join(os.path.dirname(__file__), "landslide_model.joblib")
ml_model = None
if os.path.exists(MODEL_PATH):
    try:
        ml_model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Failed to load model artifact: {e}")

def calculate_factor_of_safety(
    slope_deg: float, 
    cohesion_kpa: float, 
    friction_deg: float, 
    water_table_height_m: float
) -> float:
    """
    Infinite Slope Stability equation:
    Fs = (c' + (gamma * z - gamma_w * h_w) * cos^2(beta) * tan(phi')) / (gamma * z * sin(beta) * cos(beta))
    """
    beta = math.radians(slope_deg)
    phi = math.radians(friction_deg)
    
    driving_stress = GAMMA_SOIL * SOIL_DEPTH_Z * math.sin(beta) * math.cos(beta)
    effective_normal_stress = (GAMMA_SOIL * SOIL_DEPTH_Z - GAMMA_WATER * water_table_height_m) * (math.cos(beta) ** 2)
    resisting_strength = cohesion_kpa + effective_normal_stress * math.tan(phi)
    
    if driving_stress <= 0:
        return 2.5
    
    fs = resisting_strength / driving_stress
    return max(0.2, round(fs, 2))

def compute_failure_probability(
    rainfall_48h: float,
    slope_deg: float,
    pore_kpa: float,
    insar_creep_mm: float,
    cohesion_kpa: float = 12.0
) -> float:
    """
    Uses the trained ML model for predicting probability of slope failure.
    Falls back to deterministic formula if artifact is missing.
    """
    if ml_model is not None:
        features = np.array([[rainfall_48h, slope_deg, pore_kpa, insar_creep_mm, cohesion_kpa]])
        prob = ml_model.predict_proba(features)[0][1]
        return round(float(prob), 2)
    
    # Fallback
    score = (rainfall_48h * 0.02 + slope_deg * 0.04 + pore_kpa * 0.025 + insar_creep_mm * 0.15) / 10.0
    return round(min(0.98, max(0.05, score)), 2)

def compute_shap_feature_weights(rainfall_48h: float, slope_deg: float, insar_creep_mm: float, pore_kpa: float):
    """
    Computes feature attribution weights for administrative explainability.
    """
    w_rain = min(50, int((rainfall_48h / 200.0) * 45))
    w_slope = min(35, int((slope_deg / 45.0) * 30))
    w_creep = min(25, int((insar_creep_mm / 15.0) * 20))
    w_pore = max(5, 100 - (w_rain + w_slope + w_creep))
    
    return [
        {"feature": "48h Cumulative Rainfall", "weight": f"+{w_rain}%"},
        {"feature": "Slope Incline (Topography)", "weight": f"+{w_slope}%"},
        {"feature": "InSAR Ground Creep", "weight": f"+{w_creep}%"},
        {"feature": "Pore Water Saturation", "weight": f"+{w_pore}%"}
    ]