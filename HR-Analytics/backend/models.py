"""
SQLAlchemy ORM Models for HR Workforce Analytics Platform.
"""

from sqlalchemy import Column, Integer, String, Float, Numeric, DateTime, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class Department(Base):
    __tablename__ = "departments"
    
    department_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    department_name = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job_roles = relationship("JobRole", back_populates="department", cascade="all, delete-orphan")
    employees = relationship("Employee", back_populates="department")

class JobRole(Base):
    __tablename__ = "job_roles"
    
    role_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    department_id = Column(Integer, ForeignKey("departments.department_id", ondelete="CASCADE"), nullable=False)
    role_name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    department = relationship("Department", back_populates="job_roles")
    employees = relationship("Employee", back_populates="role")

class Employee(Base):
    __tablename__ = "employees"
    
    employee_id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(150), nullable=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
    role_id = Column(Integer, ForeignKey("job_roles.role_id"), nullable=False)
    education_level = Column(Integer)
    education_field = Column(String(100), nullable=False)
    business_travel = Column(String(50), nullable=False)
    distance_from_home = Column(Integer)
    marital_status = Column(String(20), nullable=False)
    monthly_income = Column(Numeric(10, 2), nullable=False)
    daily_rate = Column(Integer)
    hourly_rate = Column(Integer)
    monthly_rate = Column(Integer)
    job_level = Column(Integer)
    num_companies_worked = Column(Integer)
    overtime = Column(String(5), nullable=False)
    percent_salary_hike = Column(Integer)
    stock_option_level = Column(Integer)
    total_working_years = Column(Integer)
    training_times_last_year = Column(Integer)
    years_at_company = Column(Integer)
    years_in_current_role = Column(Integer)
    years_since_last_promotion = Column(Integer)
    years_with_curr_manager = Column(Integer)
    attrition = Column(String(5), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    department = relationship("Department", back_populates="employees")
    role = relationship("JobRole", back_populates="employees")
    reviews = relationship("PerformanceReview", back_populates="employee", cascade="all, delete-orphan")
    predictions = relationship("AttritionPrediction", back_populates="employee")

class PerformanceReview(Base):
    __tablename__ = "performance_reviews"
    
    review_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False)
    environment_satisfaction = Column(Integer)
    job_satisfaction = Column(Integer)
    job_involvement = Column(Integer)
    relationship_satisfaction = Column(Integer)
    work_life_balance = Column(Integer)
    performance_rating = Column(Integer)
    review_date = Column(Date, server_default=func.current_date())
    
    employee = relationship("Employee", back_populates="reviews")

class AttritionPrediction(Base):
    __tablename__ = "attrition_predictions"
    
    prediction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="SET NULL"), nullable=True)
    predicted_attrition = Column(String(5), nullable=False)
    attrition_probability = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    model_version = Column(String(50), default="v1.0-xgboost")
    prediction_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    employee = relationship("Employee", back_populates="predictions")
