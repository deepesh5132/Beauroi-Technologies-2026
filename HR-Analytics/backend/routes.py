"""
FastAPI Routes and REST API Controllers for HR Analytics Platform.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import pandas as pd
import io
import os
import logging

from backend.database import get_db
from backend.schemas import (
    PredictionRequest, PredictionResponse, TrainResponse,
    DashboardKPIs, DashboardSummaryResponse, ReportRequest, EmployeeResponse,
    EmployeeCreate, CopilotRequest, SimulatorRequest
)
from backend.ml.train import train_and_evaluate_pipeline
from backend.ml.predict import predictor_service
from backend.preprocessing.cleaning import run_etl_cleaning_pipeline
from backend.analytics.kpis import calculate_kpis
from backend.analytics.sql_queries import (
    get_department_distribution_df,
    get_gender_distribution_df,
    get_salary_tier_attrition_df,
    get_age_tier_attrition_df
)
from backend.reports.generate_report import generate_pdf_report_bytes

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["HR Analytics"])

DATASET_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../datasets/ibm_hr_attrition.csv")
)

NAMES_FIRST = ["Alexander", "Sophia", "Ethan", "Emma", "Liam", "Olivia", "Noah", "Ava", "Lucas", "Isabella", "Mason", "Mia", "Oliver", "Charlotte", "Elijah", "Amelia", "Logan", "Harper", "James", "Evelyn", "Benjamin", "Abigail", "Jacob", "Emily", "Jackson", "Elizabeth", "Sebastian", "Mila", "Henry", "Ella", "Daniel", "Avery", "Michael", "Sofia", "Matthew", "Camila", "Samuel", "Aria", "David", "Scarlett", "Joseph", "Victoria", "Carter", "Madison", "Owen", "Luna", "Wyatt", "Grace", "John", "Chloe"]
NAMES_LAST = ["Morgan", "Wright", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan"]

def _ensure_employee_name(df: pd.DataFrame) -> pd.DataFrame:
    """Ensure every employee in dataframe has a populated EmployeeName field."""
    if 'EmployeeName' not in df.columns:
        df['EmployeeName'] = None
    
    def fill_name(row):
        existing = row.get('EmployeeName')
        if pd.notna(existing) and str(existing).strip():
            return str(existing).strip()
        emp_num = int(row.get('EmployeeNumber', 1000)) if pd.notna(row.get('EmployeeNumber')) else 1000
        fn = NAMES_FIRST[emp_num % len(NAMES_FIRST)]
        ln = NAMES_LAST[(emp_num * 7) % len(NAMES_LAST)]
        return f"{fn} {ln}"
        
    df['EmployeeName'] = df.apply(fill_name, axis=1)
    return df

def _load_current_df() -> pd.DataFrame:
    """Helper to load working dataset."""
    if os.path.exists(DATASET_PATH):
        df = pd.read_csv(DATASET_PATH)
        return _ensure_employee_name(df)
    else:
        raise HTTPException(status_code=404, detail="Dataset not found. Please upload a dataset.")

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload CSV dataset, execute ETL cleaning, and save cleaned CSV."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    try:
        contents = await file.read()
        df_uploaded = pd.read_csv(io.BytesIO(contents))
        df_clean, summary = run_etl_cleaning_pipeline(df_uploaded)
        
        os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
        df_clean.to_csv(DATASET_PATH, index=False)
        
        return {
            "message": "Dataset uploaded and cleaned successfully.",
            "summary": summary
        }
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process CSV file: {str(e)}")

@router.post("/train", response_model=TrainResponse)
async def train_models():
    """Trigger ML pipeline training and comparison across LR, DT, RF, XGBoost."""
    try:
        results = train_and_evaluate_pipeline(DATASET_PATH)
        return {
            "status": "success",
            "best_model": results["best_model"],
            "comparison": results["comparison"],
            "feature_importances": results["feature_importances"],
            "etl_summary": results["etl_summary"]
        }
    except Exception as e:
        logger.error(f"Training error: {e}")
        raise HTTPException(status_code=500, detail=f"Training pipeline failed: {str(e)}")

@router.post("/predict", response_model=PredictionResponse)
async def predict_attrition(payload: PredictionRequest):
    """Predict employee attrition probability and risk level."""
    try:
        data_dict = payload.model_dump()
        result = predictor_service.predict_single(data_dict)
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post("/report")
async def generate_report(payload: Optional[ReportRequest] = None):
    """Generate and stream downloadable executive PDF report."""
    try:
        df = _load_current_df()
        kpis = calculate_kpis(df)
        dept_data = get_department_distribution_df(df)
        
        title = payload.report_title if payload and payload.report_title else "Executive HR Workforce Attrition Audit Report"
        pdf_bytes = generate_pdf_report_bytes(kpis, dept_data, report_title=title)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=HR_Analytics_Executive_Report.pdf"}
        )
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@router.get("/kpis")
async def get_kpis():
    """Get executive HR KPIs summary."""
    df = _load_current_df()
    return calculate_kpis(df)

@router.get("/dashboard")
async def get_dashboard_summary():
    """Get unified dashboard overview metrics and chart series."""
    df = _load_current_df()
    kpis = calculate_kpis(df)
    dept_dist = get_department_distribution_df(df)
    gender_dist = get_gender_distribution_df(df)
    salary_attr = get_salary_tier_attrition_df(df)
    age_attr = get_age_tier_attrition_df(df)
    
    # Recent sample predictions summary
    recent_preds = [
        {"employee_id": 101, "name": "Research Analyst", "department": "Research & Development", "risk_level": "High Risk", "probability": 0.74},
        {"employee_id": 102, "name": "Sales Executive", "department": "Sales", "risk_level": "Low Risk", "probability": 0.12},
        {"employee_id": 103, "name": "Lab Technician", "department": "Research & Development", "risk_level": "Medium Risk", "probability": 0.42},
        {"employee_id": 104, "name": "HR Specialist", "department": "Human Resources", "risk_level": "Low Risk", "probability": 0.18},
    ]
    
    return {
        "kpis": kpis,
        "department_distribution": dept_dist,
        "gender_distribution": gender_dist,
        "attrition_by_salary": salary_attr,
        "attrition_by_age": age_attr,
        "recent_predictions": recent_preds
    }

@router.get("/employees")
async def get_employees(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    department: Optional[str] = None,
    search: Optional[str] = None
):
    """Get paginated employee list with search and department filtering."""
    df = _load_current_df()
    
    if department and department != "All":
        df = df[df['Department'] == department]
        
    if search:
        search_lower = search.lower()
        df = df[
            (df['EmployeeName'].fillna('').astype(str).str.lower().str.contains(search_lower)) |
            (df['JobRole'].fillna('').astype(str).str.lower().str.contains(search_lower)) |
            (df['Department'].fillna('').astype(str).str.lower().str.contains(search_lower))
        ]
        
    total_count = len(df)
    start = (page - 1) * limit
    end = start + limit
    df_page = df.iloc[start:end]
    
    employees_list = df_page.to_dict(orient='records')
    
    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "employees": employees_list
    }

@router.post("/employees")
async def create_employee(payload: EmployeeCreate):
    """Add a new employee record to the working dataset and database."""
    try:
        df = _load_current_df()
        new_emp = payload.model_dump()
        
        # Assign next EmployeeNumber
        max_id = int(df['EmployeeNumber'].max()) if ('EmployeeNumber' in df.columns and len(df) > 0) else 1000
        new_emp_number = max_id + 1
        new_emp['EmployeeNumber'] = new_emp_number
        if not new_emp.get('EmployeeName') or not str(new_emp.get('EmployeeName')).strip():
            new_emp['EmployeeName'] = f"Employee #{new_emp_number}"
        
        # Populate defaults for standard IBM HR fields if omitted
        defaults = {
            "DailyRate": 800,
            "HourlyRate": 60,
            "MonthlyRate": 14000,
            "EmployeeCount": 1,
            "Over18": "Y",
            "StandardHours": 80
        }
        for k, v in defaults.items():
            if k not in new_emp or new_emp[k] is None:
                new_emp[k] = v
                
        # Convert to DataFrame row and concatenate
        new_row_df = pd.DataFrame([new_emp])
        df_updated = pd.concat([df, new_row_df], ignore_index=True)
        
        # Save back to CSV
        os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
        df_updated.to_csv(DATASET_PATH, index=False)
        
        logger.info(f"Added new employee #{new_emp_number} - {new_emp.get('JobRole')} ({new_emp.get('Department')})")
        
        return {
            "message": "Employee record added successfully.",
            "employee": new_emp
        }
    except Exception as e:
        logger.error(f"Error creating employee record: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to add employee record: {str(e)}")


@router.get("/attrition")
async def get_attrition_analytics():
    """Get granular attrition metrics broken down by department, gender, age, salary, role."""
    df = _load_current_df()
    
    role_attr = df.groupby('JobRole').agg(
        total=('Age', 'count'),
        attrition_count=('Attrition', lambda x: (x == 'Yes').sum())
    ).reset_index()
    role_attr['attrition_rate'] = (role_attr['attrition_count'] / role_attr['total'] * 100).round(2)
    
    return {
        "by_department": get_department_distribution_df(df),
        "by_gender": get_gender_distribution_df(df),
        "by_salary": get_salary_tier_attrition_df(df),
        "by_age": get_age_tier_attrition_df(df),
        "by_role": role_attr.to_dict(orient='records')
    }

@router.get("/departments")
async def get_departments_analysis():
    """Get department-wise headcount, average income, and satisfaction scores."""
    df = _load_current_df()
    
    dept_summary = df.groupby('Department').agg(
        headcount=('Age', 'count'),
        avg_monthly_income=('MonthlyIncome', 'mean'),
        avg_job_satisfaction=('JobSatisfaction', 'mean'),
        avg_env_satisfaction=('EnvironmentSatisfaction', 'mean'),
        attrition_rate=('Attrition', lambda x: (x == 'Yes').mean() * 100)
    ).reset_index()
    
    for col in ['avg_monthly_income', 'avg_job_satisfaction', 'avg_env_satisfaction', 'attrition_rate']:
        dept_summary[col] = dept_summary[col].round(2)
        
    return dept_summary.to_dict(orient='records')

@router.get("/performance")
async def get_performance_analysis():
    """Get performance rating vs job involvement & salary hike analysis."""
    df = _load_current_df()
    
    perf_summary = df.groupby('PerformanceRating').agg(
        count=('Age', 'count'),
        avg_salary_hike=('PercentSalaryHike', 'mean'),
        avg_job_involvement=('JobInvolvement', 'mean'),
        attrition_rate=('Attrition', lambda x: (x == 'Yes').mean() * 100)
    ).reset_index()
    
    for col in ['avg_salary_hike', 'avg_job_involvement', 'attrition_rate']:
        perf_summary[col] = perf_summary[col].round(2)
        
    return perf_summary.to_dict(orient='records')

@router.post("/copilot")
async def ask_hr_copilot(payload: CopilotRequest):
    """Answer natural language HR management query using dataset insights."""
    from backend.analytics.copilot import answer_copilot_query
    df = _load_current_df()
    return answer_copilot_query(payload.query, df)

@router.post("/simulator")
async def run_hr_simulator(payload: SimulatorRequest):
    """Run What-If decision simulation for salary, training, hiring, and overtime policies."""
    from backend.analytics.simulator import run_what_if_simulation
    df = _load_current_df()
    return run_what_if_simulation(
        payload.salary_increase_pct,
        payload.training_budget_usd,
        payload.additional_hiring_count,
        payload.overtime_reduction_pct,
        df
    )

@router.get("/skills")
async def get_skills_intelligence():
    """Get skill gap matrix and prioritized training course recommendations."""
    from backend.analytics.intelligence import calculate_skill_intelligence
    df = _load_current_df()
    return calculate_skill_intelligence(df)

@router.get("/alerts")
async def get_hr_alerts():
    """Get real-time HR early warning alerts stream."""
    from backend.analytics.intelligence import generate_hr_early_warning_alerts
    df = _load_current_df()
    return generate_hr_early_warning_alerts(df)

@router.get("/financials")
async def get_financial_costs():
    """Get annual turnover financial cost breakdown and departmental impact."""
    from backend.analytics.intelligence import calculate_financial_turnover_costs
    df = _load_current_df()
    return calculate_financial_turnover_costs(df)

@router.get("/talent-matrix")
async def get_talent_matrix():
    """Get 9-Box Performance vs Potential Talent Matrix placement."""
    from backend.analytics.intelligence import calculate_talent_matrix_grid
    df = _load_current_df()
    return calculate_talent_matrix_grid(df)

