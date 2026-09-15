"""
Data Preprocessing & Cleaning Module for HR Workforce Analytics.
Handles missing values, duplicate records, data type validation, and outlier detection.
"""

import pandas as pd
import numpy as np
from typing import Tuple, List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NUMERICAL_COLS = [
    "Age", "DailyRate", "DistanceFromHome", "Education", "EmployeeNumber",
    "EnvironmentSatisfaction", "HourlyRate", "JobInvolvement", "JobLevel",
    "JobSatisfaction", "MonthlyIncome", "MonthlyRate", "NumCompaniesWorked",
    "PercentSalaryHike", "PerformanceRating", "RelationshipSatisfaction",
    "StockOptionLevel", "TotalWorkingYears", "TrainingTimesLastYear",
    "WorkLifeBalance", "YearsAtCompany", "YearsInCurrentRole",
    "YearsSinceLastPromotion", "YearsWithCurrManager"
]

CATEGORICAL_COLS = [
    "BusinessTravel", "Department", "EducationField", "Gender",
    "JobRole", "MaritalStatus", "OverTime"
]

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Fill missing numerical values with median and categorical with mode."""
    df_clean = df.copy()
    
    for col in df_clean.columns:
        if df_clean[col].isnull().sum() > 0:
            if df_clean[col].dtype in ['int64', 'float64']:
                median_val = df_clean[col].median()
                df_clean[col].fillna(median_val, inplace=True)
                logger.info(f"Imputed missing numerical values in '{col}' with median: {median_val}")
            else:
                mode_val = df_clean[col].mode()[0]
                df_clean[col].fillna(mode_val, inplace=True)
                logger.info(f"Imputed missing categorical values in '{col}' with mode: {mode_val}")
                
    return df_clean

def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows from dataset."""
    initial_count = len(df)
    df_clean = df.drop_duplicates()
    removed_count = initial_count - len(df_clean)
    if removed_count > 0:
        logger.info(f"Removed {removed_count} duplicate records.")
    return df_clean

def enforce_datatypes(df: pd.DataFrame) -> pd.DataFrame:
    """Validate and cast columns to appropriate data types."""
    df_clean = df.copy()
    
    for col in NUMERICAL_COLS:
        if col in df_clean.columns:
            df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
            
    for col in CATEGORICAL_COLS:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].astype(str).str.strip()
            
    if 'Attrition' in df_clean.columns:
        df_clean['Attrition'] = df_clean['Attrition'].astype(str).str.strip().str.capitalize()
        
    return df_clean

def detect_outliers_iqr(df: pd.DataFrame, columns: List[str] = None) -> Dict[str, Any]:
    """Detect outliers using Tukey's Interquartile Range (IQR) method."""
    if columns is None:
        columns = ["MonthlyIncome", "TotalWorkingYears", "YearsAtCompany", "YearsSinceLastPromotion"]
        
    outlier_summary = {}
    
    for col in columns:
        if col in df.columns and pd.api.types.is_numeric_dtype(df[col]):
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
            outlier_summary[col] = {
                "outlier_count": len(outliers),
                "lower_bound": float(lower_bound),
                "upper_bound": float(upper_bound),
                "outlier_percentage": round((len(outliers) / len(df)) * 100, 2)
            }
            
    return outlier_summary

def run_etl_cleaning_pipeline(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Execute complete ETL data cleaning pipeline."""
    initial_shape = df.shape
    df_clean = remove_duplicates(df)
    df_clean = handle_missing_values(df_clean)
    df_clean = enforce_datatypes(df_clean)
    
    # Drop uninformative single-value constant columns if present
    constant_cols = [c for c in ['Over18', 'StandardHours', 'EmployeeCount'] if c in df_clean.columns]
    if constant_cols:
        df_clean.drop(columns=constant_cols, inplace=True)
        
    outliers = detect_outliers_iqr(df_clean)
    
    summary = {
        "initial_rows": initial_shape[0],
        "final_rows": df_clean.shape[0],
        "total_columns": df_clean.shape[1],
        "outlier_analysis": outliers
    }
    
    logger.info(f"ETL Cleaning completed successfully: {df_clean.shape[0]} rows, {df_clean.shape[1]} columns.")
    return df_clean, summary
