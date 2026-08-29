import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib

def generate_synthetic_geotechnical_dataset(n_samples=5000, random_seed=42):
    """
    Generates realistic landslide triggering dataset based on North-Eastern terrain:
    - 48h Cumulative Rainfall (mm)
    - Slope Incline (degrees)
    - Antecedent Moisture Index / Pore Pressure (kPa)
    - InSAR Ground Creep Velocity (mm/day)
    - Soil Cohesion (kPa)
    """
    np.random.seed(random_seed)
    
    # 1. Feature distributions typical for East Khasi Hills / NH-6
    rainfall_48h = np.random.gamma(shape=3.5, scale=35.0, size=n_samples) # mm (0 to 350+ mm)
    slope_angle = np.random.normal(loc=37.0, scale=8.0, size=n_samples)    # degrees (15 to 60)
    slope_angle = np.clip(slope_angle, 15.0, 65.0)
    
    pore_pressure = np.random.normal(loc=115.0, scale=25.0, size=n_samples) # kPa (50 to 200)
    pore_pressure = np.clip(pore_pressure, 40.0, 220.0)
    
    insar_creep = np.random.exponential(scale=3.0, size=n_samples)         # mm/day (0 to 25)
    soil_cohesion = np.random.normal(loc=12.0, scale=3.0, size=n_samples)   # kPa (5 to 25)
    soil_cohesion = np.clip(soil_cohesion, 5.0, 25.0)
    
    # 2. Geotechnical Failure Discriminant (Physics-Informed ground truth)
    # Failure condition driven by high rain, steep slope, high pore water, and creep
    z_score = (
        0.025 * rainfall_48h + 
        0.065 * slope_angle + 
        0.030 * pore_pressure + 
        0.180 * insar_creep - 
        0.120 * soil_cohesion - 
        5.80
    )
    
    # Sigmoidal probability of failure
    prob_failure = 1.0 / (1.0 + np.exp(-z_score))
    labels = (prob_failure > 0.50).astype(int)
    
    df = pd.DataFrame({
        "rainfall_48h": np.round(rainfall_48h, 2),
        "slope_angle": np.round(slope_angle, 2),
        "pore_pressure": np.round(pore_pressure, 2),
        "insar_creep": np.round(insar_creep, 2),
        "soil_cohesion": np.round(soil_cohesion, 2),
        "landslide_occurred": labels
    })
    
    return df

def train_and_export_model():
    print("[*] Generating synthetic physical & meteorological training data...")
    df = generate_synthetic_geotechnical_dataset(n_samples=6000)
    
    X = df[["rainfall_48h", "slope_angle", "pore_pressure", "insar_creep", "soil_cohesion"]]
    y = df["landslide_occurred"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("[*] Training Gradient Boosting Early Warning Classifier...")
    model = GradientBoostingClassifier(
        n_estimators=150,
        learning_rate=0.08,
        max_depth=4,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluation
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    print("\n--- Model Evaluation Report ---")
    print(classification_report(y_test, y_pred, target_names=["Stable", "Landslide Triggered"]))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")
    
    # Feature Importances (Global SHAP Proxy)
    importances = model.feature_importances_
    features = X.columns
    print("\n--- Global Feature Importance ---")
    for feat, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True):
        print(f"{feat:18s}: {imp * 100:.2f}%")
        
    # Export model artifact
    artifact_filename = "landslide_model.joblib"
    joblib.dump(model, artifact_filename)
    print(f"\n[+] Successfully saved trained model artifact to '{artifact_filename}'!")

if __name__ == "__main__":
    train_and_export_model()