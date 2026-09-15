# HR Workforce Analytics & Attrition Prediction Platform
## Technical Architecture & Operational Documentation

---

## 1. Executive System Overview

The **HR Workforce Analytics Platform** is an enterprise-grade AI system designed for HR directors, BI analysts, and executive leadership. It provides real-time visibility into employee headcount, compensation benchmarks, departmental satisfaction metrics, and machine learning-powered employee attrition risk prediction.

```
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|   React 18 + Tailwind CSS Dashboard (Vite, Recharts, Lucide, Axios)               |
+-----------------------------------------------------------------------------------+
                                         |
                                   HTTP REST API
                                         v
+-----------------------------------------------------------------------------------+
|                                 FASTAPI BACKEND                                   |
|   • ETL Pipeline (cleaning.py, feature_engineering.py)                           |
|   • Analytics Suite (sql_queries.py, kpis.py)                                     |
|   • Inference Engine (predict.py) & Joblib Model Persistence                     |
|   • PDF Report Generator (generate_report.py using ReportLab)                    |
+-----------------------------------------------------------------------------------+
                   |                                     |
           Relational ORM                           ML Model
                   v                                     v
+------------------------------------+   +------------------------------------------+
|        POSTGRESQL DATABASE         |   |        SCIKIT-LEARN & XGBOOST           |
|   • departments, job_roles         |   |   • Logistic Regression, Decision Tree   |
|   • employees, performance_reviews |   |   • Random Forest, XGBoost Classifier    |
|   • attrition_predictions          |   |   • Model artifact: backend/ml/model.pkl  |
+------------------------------------+   +------------------------------------------+
```

---

## 2. Entity-Relationship (ER) Diagram

```
+------------------+         +------------------+         +--------------------------+
|   departments    |         |    job_roles     |         |        employees         |
+------------------+         +------------------+         +--------------------------+
| department_id PK |<-------1| role_id       PK |<-------1| employee_id           PK |
| department_name  |    |    | department_id FK |    |    | age                      |
| created_at       |    +---N| role_name        |    +---N| gender                   |
+------------------+         +------------------+         | department_id         FK |
                                                          | role_id               FK |
                                                          | monthly_income           |
                                                          | total_working_years      |
                                                          | years_at_company         |
                                                          | attrition ('Yes'/'No')   |
                                                          +--------------------------+
                                                                     | 1
                                                                     |
                                                                     v N
                                                          +--------------------------+
                                                          |   performance_reviews    |
                                                          +--------------------------+
                                                          | review_id             PK |
                                                          | employee_id           FK |
                                                          | environment_satisfaction |
                                                          | job_satisfaction         |
                                                          | work_life_balance        |
                                                          +--------------------------+
```

---

## 3. Machine Learning Pipeline Architecture

1. **ETL Preprocessing**:
   - Deduplication, type validation, and median/mode imputation.
   - Tukey's Interquartile Range (IQR) outlier capping on salary and promotion years.
2. **Domain Feature Engineering**:
   - `TenureRatio` = `YearsAtCompany` / `TotalWorkingYears`
   - `IncomeToAgeRatio` = `MonthlyIncome` / `Age`
   - `OverallSatisfaction` = Average of 4 satisfaction metrics.
   - `OverTimeRisk` = Binary indicator.
3. **Model Evaluation & Comparison**:
   - Evaluates **Logistic Regression**, **Decision Tree**, **Random Forest**, and **XGBoost**.
   - Model metrics recorded: Accuracy, Precision, Recall, F1 Score, ROC-AUC.
   - Best model serialized to `backend/ml/model.pkl` via `joblib`.

---

## 4. API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Returns summary KPIs and aggregate chart series |
| `GET` | `/api/kpis` | Returns high-level executive workforce KPIs |
| `GET` | `/api/employees` | Paginated employee directory list with filtering |
| `POST` | `/api/predict` | Runs ML inference for single employee profile |
| `POST` | `/api/train` | Triggers model retraining and metrics evaluation |
| `POST` | `/api/report` | Generates downloadable PDF Executive Audit report |
| `POST` | `/api/upload` | Uploads and cleans external CSV dataset |

---

## 5. Future Scope & Roadmap

- **LLM Executive Summary Agent**: Integration of OpenAI/Gemini for automated natural language executive insights.
- **Real-Time WebSockets**: Live monitoring stream for employee status updates.
- **Active Directory / Okta SSO Integration**: Enterprise RBAC authentication.
