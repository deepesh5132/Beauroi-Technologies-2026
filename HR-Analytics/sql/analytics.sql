-- =============================================================================
-- HR Workforce Analytics SQL Queries Suite (25+ Enterprise BI Queries)
-- =============================================================================

-- 1. Average Monthly Salary Overall
SELECT ROUND(AVG(monthly_income), 2) AS overall_avg_salary FROM employees;

-- 2. Department-wise Employee Count & Percentage Distribution
SELECT 
    d.department_name,
    COUNT(e.employee_id) AS total_employees,
    ROUND(COUNT(e.employee_id) * 100.0 / (SELECT COUNT(*) FROM employees), 2) AS dept_percentage
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY total_employees DESC;

-- 3. Gender Ratio & Distribution
SELECT 
    gender,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees), 2) AS gender_percentage
FROM employees
GROUP BY gender;

-- 4. Average Age overall and by Gender
SELECT 
    gender,
    ROUND(AVG(age), 1) AS avg_age,
    MIN(age) AS min_age,
    MAX(age) AS max_age
FROM employees
GROUP BY gender;

-- 5. Top 10 Highest Paid Employees
SELECT 
    e.employee_id,
    d.department_name,
    j.role_name,
    e.monthly_income,
    e.job_level,
    e.years_at_company
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN job_roles j ON e.role_id = j.role_id
ORDER BY e.monthly_income DESC
LIMIT 10;

-- 6. Overall Workforce Attrition Rate (%)
SELECT 
    COUNT(*) AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) AS total_attrition,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate_pct
FROM employees;

-- 7. Promotion Stagnation Analysis (Employees with > 5 years since last promotion)
SELECT 
    d.department_name,
    COUNT(*) AS stagnant_employee_count,
    ROUND(AVG(years_since_last_promotion), 1) AS avg_years_stagnant
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.years_since_last_promotion >= 5
GROUP BY d.department_name
ORDER BY stagnant_employee_count DESC;

-- 8. Total Working Experience Distribution (Tenure Buckets)
SELECT 
    CASE 
        WHEN total_working_years < 3 THEN '0-2 Years (Entry)'
        WHEN total_working_years BETWEEN 3 AND 7 THEN '3-7 Years (Mid)'
        WHEN total_working_years BETWEEN 8 AND 15 THEN '8-15 Years (Senior)'
        ELSE '15+ Years (Executive)'
    END AS experience_bucket,
    COUNT(*) AS employee_count,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS bucket_attrition_rate
FROM employees
GROUP BY 1
ORDER BY MIN(total_working_years);

-- 9. Monthly Income Distribution Buckets
SELECT 
    CASE 
        WHEN monthly_income < 3000 THEN '< $3,000 (Entry)'
        WHEN monthly_income BETWEEN 3000 AND 6000 THEN '$3,000 - $6,000'
        WHEN monthly_income BETWEEN 6001 AND 10000 THEN '$6,001 - $10,000'
        WHEN monthly_income BETWEEN 10001 AND 15000 THEN '$10,001 - $15,000'
        ELSE '> $15,000 (Executive)'
    END AS salary_range,
    COUNT(*) AS count,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees
GROUP BY 1
ORDER BY MIN(monthly_income);

-- 10. Job Satisfaction Rating vs Attrition
SELECT 
    pr.job_satisfaction,
    COUNT(*) AS total_employees,
    SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees e
JOIN performance_reviews pr ON e.employee_id = pr.employee_id
GROUP BY pr.job_satisfaction
ORDER BY pr.job_satisfaction;

-- 11. Environment Satisfaction Breakdown
SELECT 
    pr.environment_satisfaction,
    COUNT(*) AS count,
    ROUND(AVG(e.monthly_income), 2) AS avg_income
FROM employees e
JOIN performance_reviews pr ON e.employee_id = pr.employee_id
GROUP BY pr.environment_satisfaction
ORDER BY pr.environment_satisfaction;

-- 12. Work-Life Balance Rating Impact on Attrition
SELECT 
    pr.work_life_balance,
    COUNT(*) AS count,
    SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees e
JOIN performance_reviews pr ON e.employee_id = pr.employee_id
GROUP BY pr.work_life_balance
ORDER BY pr.work_life_balance;

-- 13. Average Years Since Promotion by Job Role
SELECT 
    j.role_name,
    ROUND(AVG(e.years_since_last_promotion), 2) AS avg_years_since_promo
FROM employees e
JOIN job_roles j ON e.role_id = j.role_id
GROUP BY j.role_name
ORDER BY avg_years_since_promo DESC;

-- 14. Average Tenure (Years at Company) by Department
SELECT 
    d.department_name,
    ROUND(AVG(e.years_at_company), 2) AS avg_tenure_years
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;

-- 15. Average Training Times Last Year by Department
SELECT 
    d.department_name,
    ROUND(AVG(e.training_times_last_year), 2) AS avg_trainings
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;

-- 16. Employee Count by Department
SELECT d.department_name, COUNT(e.employee_id) AS total_employees
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;

-- 17. Employee Count by Job Role
SELECT j.role_name, COUNT(e.employee_id) AS total_employees
FROM employees e
JOIN job_roles j ON e.role_id = j.role_id
GROUP BY j.role_name
ORDER BY total_employees DESC;

-- 18. Overtime Analysis & Attrition Correlation
SELECT 
    overtime,
    COUNT(*) AS total_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees
GROUP BY overtime;

-- 19. Performance Rating Distribution
SELECT 
    pr.performance_rating,
    COUNT(*) AS count,
    ROUND(AVG(e.percent_salary_hike), 2) AS avg_salary_hike_pct
FROM employees e
JOIN performance_reviews pr ON e.employee_id = pr.employee_id
GROUP BY pr.performance_rating;

-- 20. Relationship Satisfaction Breakdown
SELECT 
    pr.relationship_satisfaction,
    COUNT(*) AS count,
    ROUND(SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees e
JOIN performance_reviews pr ON e.employee_id = pr.employee_id
GROUP BY pr.relationship_satisfaction;

-- 21. Distance From Home Analysis vs Attrition
SELECT 
    CASE 
        WHEN distance_from_home <= 5 THEN 'Near (0-5 km)'
        WHEN distance_from_home BETWEEN 6 AND 15 THEN 'Moderate (6-15 km)'
        ELSE 'Far (> 15 km)'
    END AS commute_distance,
    COUNT(*) AS total,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees
GROUP BY 1
ORDER BY MIN(distance_from_home);

-- 22. Manager-wise Tenure Stability Analysis
SELECT 
    CASE 
        WHEN years_with_curr_manager < 2 THEN '< 2 Years'
        WHEN years_with_curr_manager BETWEEN 2 AND 5 THEN '2-5 Years'
        ELSE '> 5 Years'
    END AS manager_tenure,
    COUNT(*) AS count,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees
GROUP BY 1;

-- 23. Average Salary by Department
SELECT 
    d.department_name,
    ROUND(AVG(e.monthly_income), 2) AS avg_monthly_income,
    MIN(e.monthly_income) AS min_income,
    MAX(e.monthly_income) AS max_income
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;

-- 24. Attrition Rate by Department
SELECT 
    d.department_name,
    COUNT(e.employee_id) AS total_employees,
    SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_employees,
    ROUND(SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(e.employee_id), 2) AS dept_attrition_rate
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY dept_attrition_rate DESC;

-- 25. Attrition Rate by Gender
SELECT 
    gender,
    COUNT(*) AS total,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees
GROUP BY gender;

-- 26. Attrition Rate by Age Group
SELECT 
    CASE 
        WHEN age < 30 THEN '< 30 Years'
        WHEN age BETWEEN 30 AND 40 THEN '30-40 Years'
        WHEN age BETWEEN 41 AND 50 THEN '41-50 Years'
        ELSE '50+ Years'
    END AS age_group,
    COUNT(*) AS total,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees
GROUP BY 1
ORDER BY MIN(age);

-- 27. Attrition Rate by Salary Range
SELECT 
    CASE 
        WHEN monthly_income < 4000 THEN 'Low (< $4,000)'
        WHEN monthly_income BETWEEN 4000 AND 10000 THEN 'Medium ($4,000 - $10,000)'
        ELSE 'High (> $10,000)'
    END AS salary_tier,
    COUNT(*) AS count,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate
FROM employees
GROUP BY 1;

-- 28. Attrition Rate by Job Role
SELECT 
    j.role_name,
    COUNT(e.employee_id) AS total_employees,
    SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(SUM(CASE WHEN e.attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(e.employee_id), 2) AS role_attrition_rate
FROM employees e
JOIN job_roles j ON e.role_id = j.role_id
GROUP BY j.role_name
ORDER BY role_attrition_rate DESC;

-- 29. Executive KPI Master Summary Query
SELECT 
    COUNT(*) AS total_employees,
    SUM(CASE WHEN attrition = 'No' THEN 1 ELSE 0 END) AS active_employees,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS attrition_rate_pct,
    ROUND(AVG(monthly_income), 2) AS avg_monthly_income,
    ROUND(AVG(age), 1) AS avg_age,
    ROUND(AVG(total_working_years), 1) AS avg_total_working_years,
    ROUND(AVG(years_at_company), 1) AS avg_tenure
FROM employees;
