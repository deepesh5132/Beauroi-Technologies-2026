"""
Machine Learning Training Pipeline for HR Employee Attrition Prediction.
Trains, evaluates, and compares Logistic Regression, Decision Tree, Random Forest, and XGBoost / GradientBoosting.
Saves the best-performing model to disk using Joblib.
"""

import os
import pandas as pd
import numpy as np
import joblib
import logging
from typing import Dict, Any, Tuple

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

# Attempt XGBoost import with safe exception handling for macOS OpenMP runtime
try:
    from xgboost import XGBClassifier
    # Test instantiate to verify library link
    _dummy = XGBClassifier()
    HAS_XGBOOST = True
except Exception as e:
    HAS_XGBOOST = False

from backend.preprocessing.cleaning import run_etl_cleaning_pipeline
from backend.preprocessing.feature_engineering import add_hr_domain_features, encode_features, scale_features

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE_PATH = os.path.join(MODEL_DIR, "model.pkl")

def get_candidate_models() -> Dict[str, Any]:
    """Define dictionary of machine learning classifiers to evaluate."""
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    }
    
    if HAS_XGBOOST:
        models["XGBoost"] = XGBClassifier(
            n_estimators=100, max_depth=4, learning_rate=0.08, eval_metric='logloss', random_state=42
        )
    else:
        models["XGBoost (GradientBoosting)"] = GradientBoostingClassifier(
            n_estimators=100, max_depth=4, learning_rate=0.08, random_state=42
        )
        
    return models

def evaluate_model(model, X_test, y_test) -> Dict[str, Any]:
    """Calculate comprehensive classification metrics."""
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else y_pred
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    return {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": cm
    }

def train_and_evaluate_pipeline(data_path: str) -> Dict[str, Any]:
    """Execute complete model training, hyperparameter comparison, and persistence pipeline."""
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset path '{data_path}' does not exist.")
        
    df_raw = pd.read_csv(data_path)
    
    # 1. ETL Cleaning
    df_clean, etl_summary = run_etl_cleaning_pipeline(df_raw)
    
    # 2. Feature Engineering
    df_fe = add_hr_domain_features(df_clean)
    
    # 3. Categorical Encoding
    df_encoded, encoders = encode_features(df_fe)
    
    # 4. Feature Scaling
    df_scaled, scaler = scale_features(df_encoded, target_col='Attrition')
    
    # Prepare X, y
    X = df_scaled.drop(columns=['Attrition', 'EmployeeNumber'], errors='ignore')
    y = df_scaled['Attrition']
    feature_names = X.columns.tolist()
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    models = get_candidate_models()
    results = {}
    best_model_name = None
    best_f1_score = -1.0
    best_model_obj = None
    
    for name, model in models.items():
        logger.info(f"Training ML Model: {name}...")
        model.fit(X_train, y_train)
        metrics = evaluate_model(model, X_test, y_test)
        results[name] = metrics
        
        # Select best model based on F1-Score & ROC-AUC
        if metrics["f1_score"] > best_f1_score:
            best_f1_score = metrics["f1_score"]
            best_model_name = name
            best_model_obj = model
            
    # Extract Feature Importances for best model if available
    feature_importances = {}
    if hasattr(best_model_obj, "feature_importances_"):
        importances = best_model_obj.feature_importances_
        sorted_idx = np.argsort(importances)[::-1]
        for idx in sorted_idx[:15]:
            feature_importances[feature_names[idx]] = round(float(importances[idx]), 4)
    elif hasattr(best_model_obj, "coef_"):
        coefs = np.abs(best_model_obj.coef_[0])
        sorted_idx = np.argsort(coefs)[::-1]
        for idx in sorted_idx[:15]:
            feature_importances[feature_names[idx]] = round(float(coefs[idx]), 4)
            
    # 5. Save Model Bundle (Model, Scaler, Encoders, Feature Names)
    bundle = {
        "model": best_model_obj,
        "model_name": best_model_name,
        "scaler": scaler,
        "encoders": encoders,
        "feature_names": feature_names,
        "performance": results[best_model_name],
        "feature_importances": feature_importances
    }
    
    joblib.dump(bundle, MODEL_FILE_PATH)
    logger.info(f"Best model '{best_model_name}' (F1: {best_f1_score}) successfully saved to {MODEL_FILE_PATH}")
    
    return {
        "best_model": best_model_name,
        "comparison": results,
        "feature_importances": feature_importances,
        "etl_summary": etl_summary
    }

if __name__ == "__main__":
    dataset_file = os.path.join(os.path.dirname(MODEL_DIR), "../datasets/ibm_hr_attrition.csv")
    train_and_evaluate_pipeline(os.path.abspath(dataset_file))
