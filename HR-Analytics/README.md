# Internship Project beau roi 🚀

An enterprise-grade, end-to-end **HR Analytics & Machine Learning Attrition Platform** built with **FastAPI, Python 3.12, PostgreSQL, Scikit-Learn/XGBoost, ReportLab, and React + Tailwind CSS**.

Allows HR leaders to track workforce KPIs, analyze compensation & satisfaction metrics, run 25+ SQL analytics queries, predict employee turnover risks in real-time, generate downloadable PDF reports, and view Power BI dashboards.

---

## 🌟 Key Platform Features

- **ETL Data Cleaning & Preprocessing**:
  - Handles missing values, deduplication, data type validation, and Tukey's IQR outlier capping.
  - Generates composite HR features (`TenureRatio`, `IncomeToAgeRatio`, `OverallSatisfaction`, `OverTimeRisk`).
- **Relational PostgreSQL Database**:
  - Normalized schema (`departments`, `job_roles`, `employees`, `performance_reviews`, `attrition_predictions`).
  - Includes 25+ complex SQL analytics queries for BI reporting.
- **Machine Learning Engine**:
  - Evaluates and compares **Logistic Regression, Decision Tree, Random Forest, and XGBoost**.
  - Computes Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Feature Importances.
  - Classifies risk into **Low Risk (<25%)**, **Medium Risk (25-60%)**, and **High Risk (>60%)**.
- **Modern React + Tailwind Dashboard**:
  - 6 Core KPI cards, department distribution charts, gender ratio breakdown, and attrition risk meters.
  - Interactive multi-field prediction screen with real-time risk gauge.
- **Executive PDF Audit Reports**:
  - Automatic PDF generation powered by ReportLab with downloadable executive audit metrics.
- **Power BI BI Specifications**:
  - Complete Power BI specification and DAX measure manual (`dashboard/powerbi_guide.md`).

---

## 📁 Repository Folder Structure

```
HR-Analytics/
│
├── backend/
│   ├── app.py                     # FastAPI application entry point
│   ├── database.py                # Database connection (PostgreSQL / SQLite fallback)
│   ├── models.py                  # SQLAlchemy ORM models
│   ├── schemas.py                 # Pydantic v2 schemas
│   ├── crud.py                    # Database CRUD operations
│   ├── routes.py                  # API routes (/upload, /train, /predict, /report, /employees, etc.)
│   ├── ml/
│   │   ├── train.py               # ML training & model comparison pipeline
│   │   ├── predict.py             # Inference engine & risk scoring
│   │   └── model.pkl              # Serialized model artifact
│   ├── preprocessing/
│   │   ├── cleaning.py            # Missing values, deduplication & outlier cleaning
│   │   └── feature_engineering.py # Encoders, scalers & composite HR features
│   ├── analytics/
│   │   ├── sql_queries.py         # 25+ SQL query handlers
│   │   └── kpis.py                # Business logic for HR KPIs
│   ├── reports/
│   │   └── generate_report.py     # ReportLab PDF report engine
│   └── requirements.txt           # Python backend dependencies
│
├── frontend/                      # React 18 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/            # Sidebar, Navbar, KPICard, ChartCard, RiskBadge
│   │   ├── pages/                 # Dashboard, Employees, Analytics, Prediction, Reports, Settings
│   │   └── services/api.js        # Axios API Client
│   ├── package.json
│   └── vite.config.js
│
├── datasets/
│   └── ibm_hr_attrition.csv       # Raw IBM HR Employee Attrition dataset (1,470 rows)
│
├── sql/
│   ├── schema.sql                 # PostgreSQL DDL DDL Schema
│   ├── insert.sql                 # Seed SQL insert statements
│   └── analytics.sql              # 25+ SQL BI queries
│
├── dashboard/
│   ├── powerbi_guide.md           # Power BI setup and DAX manual
│   └── PowerBI.pbix               # Power BI specification metadata
│
├── docs/
│   └── documentation.md           # System Architecture & ER Diagrams
│
├── Dockerfile                     # Multi-stage production Docker container
├── docker-compose.yml             # Full-stack orchestrator
└── README.md                      # Production Documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Python 3.12 (or Python 3.9+)
- Node.js 18+ & npm
- PostgreSQL (Optional; system defaults to SQLite fallback if Postgres is unavailable)

### 2. Backend Setup & Local Server Execution

```bash
# Navigate to project root
cd HR-Analytics

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Run ML Training Pipeline to generate model.pkl
python -m backend.ml.train

# Start FastAPI Backend Server (Running at http://localhost:8000)
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

FastAPI Interactive Swagger API Documentation is available at:
`http://localhost:8000/docs`

---

### 3. React Frontend Setup & Local Execution

```bash
# Navigate to frontend directory
cd HR-Analytics/frontend

# Install node dependencies
npm install

# Start Vite Development Server (Running at http://localhost:3000)
npm run dev
```

---

### 4. Docker Deployment (Backend + Postgres + Frontend)

To launch the full production environment in containerized mode:

```bash
docker-compose up --build -d
```

---

## 📊 SQL Analytics Suite Examples

```sql
-- Attrition Rate by Department
SELECT 
    d.department_name,
    COUNT(e.employee_id) AS total_employees,
    SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(e.employee_id), 2) AS dept_attrition_rate
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY dept_attrition_rate DESC;
```

---

## 🛡️ License

Built for enterprise HR workforce analytics demonstration.
