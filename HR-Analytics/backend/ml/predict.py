"""
Machine Learning Inference & Prediction Engine for Employee Attrition.
Loads serialized model bundle and evaluates real-time risk scores for employee input.
"""

import os
import pandas as pd
import numpy as np
import joblib
import logging
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE_PATH = os.path.join(MODEL_DIR, "model.pkl")

class AttritionPredictor:
    """Predictor service wrapping trained ML model bundle."""
    
    def __init__(self, model_path: str = MODEL_FILE_PATH):
        self.model_path = model_path
        self.bundle = None
        self._load_bundle()
        
    def _load_bundle(self):
        """Load joblib serialized model bundle if available."""
        if os.path.exists(self.model_path):
            try:
                self.bundle = joblib.load(self.model_path)
                logger.info(f"Loaded ML Model Bundle: {self.bundle.get('model_name')}")
            except Exception as e:
                logger.error(f"Error loading model bundle: {e}")
                self.bundle = None
        else:
            logger.warning(f"Model file not found at {self.model_path}. Predictor will run in heuristic fallback mode.")

    def predict_single(self, employee_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict attrition probability and risk tier for a single employee payload."""
        if self.bundle is not None:
            return self._predict_with_ml(employee_data)
        else:
            return self._predict_heuristic(employee_data)

    def _predict_with_ml(self, data: Dict[str, Any]) -> Dict[str, Any]:
        model = self.bundle["model"]
        scaler = self.bundle["scaler"]
        encoders = self.bundle["encoders"]
        feature_names = self.bundle["feature_names"]
        
        df_input = pd.DataFrame([data])
        
        # 1. Feature Engineering
        # Calculate domain features
        age = float(data.get("Age", 35))
        income = float(data.get("MonthlyIncome", 5000))
        twy = float(data.get("TotalWorkingYears", 5))
        yac = float(data.get("YearsAtCompany", 3))
        yslp = float(data.get("YearsSinceLastPromotion", 1))
        overtime = str(data.get("OverTime", "No"))
        
        df_input['TenureRatio'] = yac / twy if twy > 0 else 0.0
        df_input['IncomeToAgeRatio'] = income / age if age > 0 else 0.0
        
        sat_vals = [
            float(data.get("EnvironmentSatisfaction", 3)),
            float(data.get("JobSatisfaction", 3)),
            float(data.get("RelationshipSatisfaction", 3)),
            float(data.get("WorkLifeBalance", 3))
        ]
        df_input['OverallSatisfaction'] = float(np.mean(sat_vals))
        df_input['StagnationIndex'] = yslp / yac if yac > 0 else 0.0
        df_input['OverTimeRisk'] = 1 if overtime.capitalize() == "Yes" else 0
        
        # 2. Encode Categoricals
        for col, le in encoders.items():
            if col in df_input.columns:
                val = str(df_input[col].iloc[0])
                if val in le.classes_:
                    df_input[col] = le.transform([val])[0]
                else:
                    df_input[col] = 0
                    
        # Align features to model expectation
        for col in feature_names:
            if col not in df_input.columns:
                df_input[col] = 0.0
                
        X_df = df_input[feature_names]
        X_scaled = scaler.transform(X_df)
        
        # 3. Model Inference
        prob = float(model.predict_proba(X_scaled)[0, 1])
        prediction = "Yes" if prob >= 0.50 else "No"
        
        # Risk Classification Tiers
        if prob < 0.25:
            risk_level = "Low Risk"
        elif prob <= 0.60:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"
            
        risk_factors = self._extract_risk_factors(data)
        
        return {
            "prediction": prediction,
            "probability": round(prob, 4),
            "risk_level": risk_level,
            "risk_score": round(prob * 100, 1),
            "risk_factors": risk_factors,
            "model_version": self.bundle.get("model_name", "ML Model")
        }

    def _predict_heuristic(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Rule-based risk score estimation if ML model bundle is uninitialized."""
        prob = 0.10
        factors = []
        
        if data.get("OverTime") == "Yes":
            prob += 0.20
            factors.append("Frequent Overtime Working Hours")
        if int(data.get("JobSatisfaction", 3)) <= 2:
            prob += 0.15
            factors.append("Low Job Satisfaction Rating (<= 2)")
        if int(data.get("MonthlyIncome", 5000)) < 3500:
            prob += 0.12
            factors.append("Below-Average Monthly Compensation")
        if int(data.get("YearsSinceLastPromotion", 0)) >= 5:
            prob += 0.12
            factors.append("Promotion Stagnation (> 5 Years)")
        if int(data.get("DistanceFromHome", 5)) > 20:
            prob += 0.08
            factors.append("Long Daily Commute Distance (> 20 km)")
        if int(data.get("WorkLifeBalance", 3)) == 1:
            prob += 0.12
            factors.append("Poor Work-Life Balance Rating")
            
        prob = min(0.95, max(0.05, prob))
        prediction = "Yes" if prob >= 0.50 else "No"
        
        if prob < 0.25:
            risk_level = "Low Risk"
        elif prob <= 0.60:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"
            
        return {
            "prediction": prediction,
            "probability": round(prob, 4),
            "risk_level": risk_level,
            "risk_score": round(prob * 100, 1),
            "risk_factors": factors if factors else ["Standard Risk Factors"],
            "model_version": "Heuristic Rules (Fallback)"
        }

    def _extract_risk_factors(self, data: Dict[str, Any]) -> List[str]:
        factors = []
        if data.get("OverTime") == "Yes":
            factors.append("Mandatory Overtime")
        if int(data.get("JobSatisfaction", 3)) <= 2:
            factors.append("Low Job Satisfaction")
        if int(data.get("EnvironmentSatisfaction", 3)) <= 2:
            factors.append("Low Work Environment Score")
        if int(data.get("YearsSinceLastPromotion", 0)) >= 4:
            factors.append("Promotion Bottleneck")
        if int(data.get("WorkLifeBalance", 3)) <= 2:
            factors.append("Sub-optimal Work-Life Balance")
        if int(data.get("MonthlyIncome", 5000)) < 4000:
            factors.append("Compensation Gap")
        return factors if factors else ["Good Overall Retention Indicators"]

# Singleton Predictor Instance
predictor_service = AttritionPredictor()
