"""
CRUD Helper Module for Database Queries and Model Persistence.
"""

from sqlalchemy.orm import Session
from backend.models import Employee, Department, JobRole, PerformanceReview, AttritionPrediction
from backend.schemas import EmployeeCreate, PredictionRequest
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

def get_employee_by_id(db: Session, employee_id: int) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()

def get_all_employees(db: Session, skip: int = 0, limit: int = 100, department: Optional[str] = None) -> List[Employee]:
    query = db.query(Employee)
    if department and department != "All":
        query = query.join(Department).filter(Department.department_name == department)
    return query.offset(skip).limit(limit).all()

def get_total_employee_count(db: Session) -> int:
    return db.query(Employee).count()

def get_or_create_department(db: Session, dept_name: str) -> Department:
    dept = db.query(Department).filter(Department.department_name == dept_name).first()
    if not dept:
        dept = Department(department_name=dept_name)
        db.add(dept)
        db.commit()
        db.refresh(dept)
    return dept

def get_or_create_job_role(db: Session, dept_id: int, role_name: str) -> JobRole:
    role = db.query(JobRole).filter(JobRole.department_id == dept_id, JobRole.role_name == role_name).first()
    if not role:
        role = JobRole(department_id=dept_id, role_name=role_name)
        db.add(role)
        db.commit()
        db.refresh(role)
    return role

def save_prediction(db: Session, employee_id: Optional[int], pred_data: Dict[str, Any]) -> AttritionPrediction:
    prediction = AttritionPrediction(
        employee_id=employee_id,
        predicted_attrition=pred_data.get("prediction", "No"),
        attrition_probability=float(pred_data.get("probability", 0.0)),
        risk_level=pred_data.get("risk_level", "Low Risk"),
        model_version=pred_data.get("model_version", "v1.0-xgboost")
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction
