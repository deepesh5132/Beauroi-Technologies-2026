"""
Pydantic Schemas for API Request/Response Serialization & Validation.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any

class EmployeeBase(BaseModel):
    EmployeeName: Optional[str] = Field("Alex Morgan", description="Full Name of Employee")
    Age: int = Field(..., ge=18, le=70, description="Employee Age")
    Gender: str = Field(..., description="Male or Female")
    Department: str = Field(..., description="Department Name")
    Education: int = Field(3, ge=1, le=5)
    EducationField: str = Field("Life Sciences")
    BusinessTravel: str = Field("Travel_Rarely")
    DistanceFromHome: int = Field(5, ge=0, le=100)
    EnvironmentSatisfaction: int = Field(3, ge=1, le=4)
    JobInvolvement: int = Field(3, ge=1, le=4)
    JobLevel: int = Field(2, ge=1, le=5)
    JobRole: str = Field("Sales Executive")
    JobSatisfaction: int = Field(3, ge=1, le=4)
    MaritalStatus: str = Field("Single")
    MonthlyIncome: float = Field(5000.0, ge=1000.0)
    NumCompaniesWorked: int = Field(2, ge=0)
    OverTime: str = Field("No", description="Yes or No")
    PercentSalaryHike: int = Field(15, ge=0)
    PerformanceRating: int = Field(3, ge=1, le=4)
    RelationshipSatisfaction: int = Field(3, ge=1, le=4)
    StockOptionLevel: int = Field(1, ge=0, le=3)
    TotalWorkingYears: int = Field(8, ge=0)
    TrainingTimesLastYear: int = Field(2, ge=0)
    WorkLifeBalance: int = Field(3, ge=1, le=4)
    YearsAtCompany: int = Field(5, ge=0)
    YearsInCurrentRole: int = Field(3, ge=0)
    YearsSinceLastPromotion: int = Field(1, ge=0)
    YearsWithCurrManager: int = Field(3, ge=0)
    Attrition: Optional[str] = Field("No")

class EmployeeCreate(EmployeeBase):
    EmployeeNumber: Optional[int] = None

class EmployeeResponse(EmployeeBase):
    EmployeeNumber: int
    model_config = ConfigDict(from_attributes=True)

class PredictionRequest(EmployeeBase):
    pass

class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    risk_level: str
    risk_score: float
    risk_factors: List[str]
    model_version: str

class TrainResponse(BaseModel):
    status: str
    best_model: str
    comparison: Dict[str, Any]
    feature_importances: Dict[str, float]
    etl_summary: Dict[str, Any]

class DashboardKPIs(BaseModel):
    total_employees: int
    active_employees: int
    attrition_count: int
    attrition_rate: float
    avg_salary: float
    avg_age: float
    avg_experience: float
    avg_tenure: float

class DepartmentBreakdown(BaseModel):
    department: str
    total: int
    attrition_count: int
    attrition_rate: float
    avg_salary: float

class DashboardSummaryResponse(BaseModel):
    kpis: DashboardKPIs
    department_distribution: List[DepartmentBreakdown]
    gender_distribution: List[Dict[str, Any]]
    attrition_by_salary: List[Dict[str, Any]]
    attrition_by_age: List[Dict[str, Any]]
    recent_predictions: List[Dict[str, Any]]

class ReportRequest(BaseModel):
    report_title: Optional[str] = "Executive HR Workforce Attrition Audit Report"
    include_recommendations: Optional[bool] = True

class CopilotRequest(BaseModel):
    query: str = Field(..., example="Why did attrition increase this quarter?")

class SimulatorRequest(BaseModel):
    salary_increase_pct: float = Field(5.0, ge=0.0, le=15.0)
    training_budget_usd: float = Field(25000.0, ge=0.0, le=100000.0)
    additional_hiring_count: int = Field(10, ge=0, le=50)
    overtime_reduction_pct: float = Field(10.0, ge=0.0, le=30.0)
