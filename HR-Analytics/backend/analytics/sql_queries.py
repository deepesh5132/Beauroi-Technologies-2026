"""
SQL Queries Execution Module for HR Analytics BI Engine.
Provides functions to run SQL queries against SQLAlchemy session or pandas DataFrames.
"""

from typing import List, Dict, Any
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)

def execute_custom_sql(db: Session, query_str: str) -> List[Dict[str, Any]]:
    """Execute raw SQL query against database and return list of dictionaries."""
    try:
        result = db.execute(text(query_str))
        if result.returns_rows:
            columns = result.keys()
            return [dict(zip(columns, row)) for row in result.fetchall()]
        return []
    except Exception as e:
        logger.error(f"SQL Execution Error: {e}")
        return []

def get_department_distribution_df(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Compute Department employee counts and attrition percentages."""
    grouped = df.groupby('Department').agg(
        total=('Age', 'count'),
        attrition_count=('Attrition', lambda x: (x == 'Yes').sum()),
        avg_salary=('MonthlyIncome', 'mean')
    ).reset_index()
    
    grouped['attrition_rate'] = (grouped['attrition_count'] / grouped['total'] * 100).round(2)
    grouped['avg_salary'] = grouped['avg_salary'].round(2)
    return grouped.to_dict(orient='records')

def get_gender_distribution_df(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Compute Gender distribution and attrition breakdown."""
    grouped = df.groupby('Gender').agg(
        count=('Age', 'count'),
        attrition_count=('Attrition', lambda x: (x == 'Yes').sum())
    ).reset_index()
    
    grouped['attrition_rate'] = (grouped['attrition_count'] / grouped['count'] * 100).round(2)
    return grouped.to_dict(orient='records')

def get_salary_tier_attrition_df(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Categorize employees into salary tiers and compute attrition rates."""
    bins = [0, 3000, 6000, 10000, 15000, 100000]
    labels = ['< $3,000', '$3,000 - $6,000', '$6,001 - $10,000', '$10,001 - $15,000', '> $15,000']
    
    df_copy = df.copy()
    df_copy['salary_tier'] = pd.cut(df_copy['MonthlyIncome'], bins=bins, labels=labels)
    
    grouped = df_copy.groupby('salary_tier', observed=False).agg(
        count=('Age', 'count'),
        attrition_count=('Attrition', lambda x: (x == 'Yes').sum())
    ).reset_index()
    
    grouped['attrition_rate'] = (grouped['attrition_count'] / grouped['count'] * 100).fillna(0).round(2)
    return grouped.to_dict(orient='records')

def get_age_tier_attrition_df(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Categorize employees into age buckets and compute attrition rates."""
    bins = [17, 29, 39, 49, 100]
    labels = ['< 30 Years', '30-39 Years', '40-49 Years', '50+ Years']
    
    df_copy = df.copy()
    df_copy['age_group'] = pd.cut(df_copy['Age'], bins=bins, labels=labels)
    
    grouped = df_copy.groupby('age_group', observed=False).agg(
        count=('Age', 'count'),
        attrition_count=('Attrition', lambda x: (x == 'Yes').sum())
    ).reset_index()
    
    grouped['attrition_rate'] = (grouped['attrition_count'] / grouped['count'] * 100).fillna(0).round(2)
    return grouped.to_dict(orient='records')
