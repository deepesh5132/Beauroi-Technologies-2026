# Power BI Dashboard Specification & Setup Manual

This document provides complete instructions, data modeling schemas, DAX measures, and visual configuration specs for building the **Power BI HR Workforce Analytics & Attrition Dashboard** (`PowerBI.pbix`).

---

## 1. Dashboard Structure & Pages

The Power BI report contains 3 primary interactive pages:

### Page 1: HR Workforce Overview Dashboard
- **KPI Cards**:
  - `[Total Employees]`: `COUNT(employees[employee_id])`
  - `[Active Headcount]`: `CALCULATE(COUNT(employees[employee_id]), employees[attrition] = "No")`
  - `[Attrition Rate %]`: `DIVIDE([Total Attrition], [Total Employees], 0)`
  - `[Avg Monthly Income]`: `AVERAGE(employees[monthly_income])`
  - `[Avg Tenure]`: `AVERAGE(employees[years_at_company])`
- **Visuals**:
  - **Bar Chart**: Headcount & Attrition by Department (`departments[department_name]`)
  - **Donut Chart**: Gender Distribution (`employees[gender]`)
  - **Histogram**: Monthly Income Distribution Buckets (`[Salary Range]`)
  - **Slicers**: Department Filter, Business Travel Filter, Overtime Filter.

---

### Page 2: Workforce Performance & Satisfaction Dashboard
- **Visuals**:
  - **Heatmap Grid**: Job Satisfaction (`performance_reviews[job_satisfaction]`) vs Environment Satisfaction (`performance_reviews[environment_satisfaction]`)
  - **Clustered Column Chart**: Performance Rating (`performance_reviews[performance_rating]`) vs Average Salary Hike (`employees[percent_salary_hike]`)
  - **Line Chart**: Experience (`employees[total_working_years]`) vs Monthly Income Trend
  - **Slicers**: Job Role, Education Field.

---

### Page 3: Attrition Risk & Predictive Analysis Dashboard
- **Visuals**:
  - **Gauges**: Risk Level Distribution (`attrition_predictions[risk_level]`)
  - **Scatter Plot**: Distance From Home vs Attrition Probability
  - **Decomposition Tree**: Drill-down from Department -> Job Role -> Overtime Status -> Attrition Rate
  - **Table View**: Top 20 High-Risk Employees with AI Attrition Score.

---

## 2. DAX Measures Reference Library

```dax
// 1. Total Employees
Total Employees = COUNT(employees[employee_id])

// 2. Total Attrition Count
Total Attrition = CALCULATE(COUNT(employees[employee_id]), employees[attrition] = "Yes")

// 3. Attrition Rate Percentage
Attrition Rate % = 
VAR AttrCount = [Total Attrition]
VAR TotalCount = [Total Employees]
RETURN
DIVIDE(AttrCount, TotalCount, 0) * 100

// 4. Average Monthly Salary
Avg Salary = AVERAGE(employees[monthly_income])

// 5. Overtime Attrition Impact Ratio
Overtime Attrition Ratio = 
CALCULATE(
    [Attrition Rate %],
    employees[overtime] = "Yes"
)

// 6. Promotion Stagnant Employee Count (> 4 Years)
Stagnant Employees = 
CALCULATE(
    COUNT(employees[employee_id]),
    employees[years_since_last_promotion] >= 4
)
```

---

## 3. Database Connection Configuration

1. In Power BI Desktop, select **Get Data** -> **PostgreSQL Database**.
2. Server: `localhost:5432` or your Docker container IP.
3. Database: `hr_analytics`.
4. Import mode: **DirectQuery** or **Import**.
