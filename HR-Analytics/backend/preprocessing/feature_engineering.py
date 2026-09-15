"""
Feature Engineering & Transformation Module for HR Workforce Analytics ML Pipeline.
Handles domain feature creation, encoding, scaling, and standardization.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from typing import Tuple, Dict, Any

def add_hr_domain_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create composite HR domain features to enhance ML signal."""
    df_fe = df.copy()
    
    # 1. Tenure Ratio: Years at company vs Total Working Years
    if 'YearsAtCompany' in df_fe.columns and 'TotalWorkingYears' in df_fe.columns:
        twy = df_fe['TotalWorkingYears'].replace(0, np.nan)
        df_fe['TenureRatio'] = (df_fe['YearsAtCompany'] / twy).fillna(0.0)
        
    # 2. Income to Age Ratio
    if 'MonthlyIncome' in df_fe.columns and 'Age' in df_fe.columns:
        age = df_fe['Age'].replace(0, np.nan)
        df_fe['IncomeToAgeRatio'] = (df_fe['MonthlyIncome'] / age).fillna(0.0)
        
    # 3. Overall Satisfaction Score (Average of 4 satisfaction metrics)
    sat_cols = [c for c in ['EnvironmentSatisfaction', 'JobSatisfaction', 'RelationshipSatisfaction', 'WorkLifeBalance'] if c in df_fe.columns]
    if len(sat_cols) == 4:
        df_fe['OverallSatisfaction'] = df_fe[sat_cols].mean(axis=1)
        
    # 4. Career Stagnation Risk Indicator
    if 'YearsSinceLastPromotion' in df_fe.columns and 'YearsAtCompany' in df_fe.columns:
        yac = df_fe['YearsAtCompany'].replace(0, np.nan)
        df_fe['StagnationIndex'] = (df_fe['YearsSinceLastPromotion'] / yac).fillna(0.0)
        
    # 5. Overtime High Risk Binary Flag
    if 'OverTime' in df_fe.columns:
        df_fe['OverTimeRisk'] = (df_fe['OverTime'] == 'Yes').astype(int)
        
    # Replace any infinite values with 0
    df_fe.replace([np.inf, -np.inf], 0.0, inplace=True)
    df_fe.fillna(0.0, inplace=True)
    
    return df_fe

def encode_features(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, LabelEncoder]]:
    """Encode categorical text columns using LabelEncoder / Dummy variables."""
    df_encoded = df.copy()
    encoders = {}
    
    categorical_cols = df_encoded.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # Ensure Attrition target is encoded as binary (1/0)
    if 'Attrition' in categorical_cols:
        df_encoded['Attrition'] = (df_encoded['Attrition'] == 'Yes').astype(int)
        categorical_cols.remove('Attrition')
        
    for col in categorical_cols:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
        encoders[col] = le
        
    return df_encoded, encoders

def scale_features(df: pd.DataFrame, target_col: str = 'Attrition') -> Tuple[pd.DataFrame, StandardScaler]:
    """Standardize and scale feature matrix X while maintaining target column y intact."""
    df_scaled = df.copy()
    
    if target_col in df_scaled.columns:
        X = df_scaled.drop(columns=[target_col, 'EmployeeNumber'], errors='ignore')
        y = df_scaled[target_col]
    else:
        X = df_scaled.drop(columns=['EmployeeNumber'], errors='ignore')
        y = None
        
    scaler = StandardScaler()
    X_scaled_array = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled_array, columns=X.columns, index=X.index)
    
    if y is not None:
        X_scaled[target_col] = y
        
    return X_scaled, scaler
