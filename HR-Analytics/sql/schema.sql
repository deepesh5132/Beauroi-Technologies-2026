-- =============================================================================
-- HR Workforce Analytics & Employee Attrition Database Schema
-- DBMS: PostgreSQL 14+ / 15+ / 16+
-- =============================================================================

DROP TABLE IF EXISTS attrition_predictions CASCADE;
DROP TABLE IF EXISTS performance_reviews CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS job_roles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 1. Departments Table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Job Roles Table
CREATE TABLE job_roles (
    role_id SERIAL PRIMARY KEY,
    department_id INT NOT NULL REFERENCES departments(department_id) ON DELETE CASCADE,
    role_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, role_name)
);

-- 3. Employees Core Table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    age INT NOT NULL CHECK (age >= 18),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Non-Binary', 'Other')),
    department_id INT NOT NULL REFERENCES departments(department_id),
    role_id INT NOT NULL REFERENCES job_roles(role_id),
    education_level INT CHECK (education_level BETWEEN 1 AND 5),
    education_field VARCHAR(100) NOT NULL,
    business_travel VARCHAR(50) NOT NULL,
    distance_from_home INT CHECK (distance_from_home >= 0),
    marital_status VARCHAR(20) NOT NULL,
    monthly_income NUMERIC(10, 2) NOT NULL CHECK (monthly_income > 0),
    daily_rate INT,
    hourly_rate INT,
    monthly_rate INT,
    job_level INT CHECK (job_level BETWEEN 1 AND 5),
    num_companies_worked INT CHECK (num_companies_worked >= 0),
    overtime VARCHAR(5) NOT NULL CHECK (overtime IN ('Yes', 'No')),
    percent_salary_hike INT CHECK (percent_salary_hike >= 0),
    stock_option_level INT CHECK (stock_option_level BETWEEN 0 AND 3),
    total_working_years INT CHECK (total_working_years >= 0),
    training_times_last_year INT CHECK (training_times_last_year >= 0),
    years_at_company INT CHECK (years_at_company >= 0),
    years_in_current_role INT CHECK (years_in_current_role >= 0),
    years_since_last_promotion INT CHECK (years_since_last_promotion >= 0),
    years_with_curr_manager INT CHECK (years_with_curr_manager >= 0),
    attrition VARCHAR(5) NOT NULL CHECK (attrition IN ('Yes', 'No')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Performance & Satisfaction Reviews Table
CREATE TABLE performance_reviews (
    review_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    environment_satisfaction INT CHECK (environment_satisfaction BETWEEN 1 AND 4),
    job_satisfaction INT CHECK (job_satisfaction BETWEEN 1 AND 4),
    job_involvement INT CHECK (job_involvement BETWEEN 1 AND 4),
    relationship_satisfaction INT CHECK (relationship_satisfaction BETWEEN 1 AND 4),
    work_life_balance INT CHECK (work_life_balance BETWEEN 1 AND 4),
    performance_rating INT CHECK (performance_rating BETWEEN 1 AND 4),
    review_date DATE DEFAULT CURRENT_DATE
);

-- 5. Attrition ML Predictions Table
CREATE TABLE attrition_predictions (
    prediction_id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(employee_id) ON DELETE SET NULL,
    predicted_attrition VARCHAR(5) NOT NULL CHECK (predicted_attrition IN ('Yes', 'No')),
    attrition_probability NUMERIC(5, 4) NOT NULL CHECK (attrition_probability BETWEEN 0 AND 1),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Low Risk', 'Medium Risk', 'High Risk')),
    model_version VARCHAR(50) DEFAULT 'v1.0-xgboost',
    prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Query Performance Optimization
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_role ON employees(role_id);
CREATE INDEX idx_employees_attrition ON employees(attrition);
CREATE INDEX idx_employees_income ON employees(monthly_income);
CREATE INDEX idx_predictions_risk ON attrition_predictions(risk_level);
