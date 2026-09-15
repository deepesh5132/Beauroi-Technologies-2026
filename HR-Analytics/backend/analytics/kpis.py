"""
HR Key Performance Indicators (KPIs) Business Logic.
Calculates high-level executive metrics from raw dataset or database models.
"""

import pandas as pd
from typing import Dict, Any

def calculate_kpis(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate executive HR KPIs from DataFrame."""
    total_employees = int(len(df))
    attrition_count = int((df['Attrition'] == 'Yes').sum()) if 'Attrition' in df.columns else 0
    active_employees = total_employees - attrition_count
    attrition_rate = round((attrition_count / total_employees * 100), 2) if total_employees > 0 else 0.0
    
    avg_salary = round(float(df['MonthlyIncome'].mean()), 2) if 'MonthlyIncome' in df.columns else 0.0
    avg_age = round(float(df['Age'].mean()), 1) if 'Age' in df.columns else 0.0
    avg_experience = round(float(df['TotalWorkingYears'].mean()), 1) if 'TotalWorkingYears' in df.columns else 0.0
    avg_tenure = round(float(df['YearsAtCompany'].mean()), 1) if 'YearsAtCompany' in df.columns else 0.0
    
    # Overtime Percentage
    overtime_pct = round(float((df['OverTime'] == 'Yes').sum() / total_employees * 100), 2) if 'OverTime' in df.columns else 0.0
    
    # High Attrition Risk Department
    if 'Department' in df.columns and 'Attrition' in df.columns:
        dept_attr = df.groupby('Department')['Attrition'].apply(lambda x: (x == 'Yes').mean() * 100)
        top_risk_dept = dept_attr.idxmax() if not dept_attr.empty else "N/A"
    else:
        top_risk_dept = "N/A"
        
    return {
        "total_employees": total_employees,
        "active_employees": active_employees,
        "attrition_count": attrition_count,
        "attrition_rate": attrition_rate,
        "avg_salary": avg_salary,
        "avg_age": avg_age,
        "avg_experience": avg_experience,
        "avg_tenure": avg_tenure,
        "overtime_pct": overtime_pct,
        "highest_risk_department": top_risk_dept
    }
