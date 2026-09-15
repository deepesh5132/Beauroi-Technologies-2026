-- =============================================================================
-- Seed Data Insert Statements for HR Analytics Database
-- =============================================================================

-- Insert Departments
INSERT INTO departments (department_id, department_name) VALUES
(1, 'Research & Development'),
(2, 'Sales'),
(3, 'Human Resources')
ON CONFLICT (department_id) DO NOTHING;

-- Insert Job Roles
INSERT INTO job_roles (role_id, department_id, role_name) VALUES
(1, 1, 'Research Scientist'),
(2, 1, 'Laboratory Technician'),
(3, 1, 'Manufacturing Director'),
(4, 1, 'Healthcare Representative'),
(5, 1, 'Research Director'),
(6, 1, 'Manager'),
(7, 2, 'Sales Executive'),
(8, 2, 'Sales Representative'),
(9, 2, 'Manager'),
(10, 3, 'Human Resources'),
(11, 3, 'Manager')
ON CONFLICT (role_id) DO NOTHING;

-- Sample Employee Inserts
INSERT INTO employees (
    employee_id, age, gender, department_id, role_id, education_level,
    education_field, business_travel, distance_from_home, marital_status,
    monthly_income, daily_rate, hourly_rate, monthly_rate, job_level,
    num_companies_worked, overtime, percent_salary_hike, stock_option_level,
    total_working_years, training_times_last_year, years_at_company,
    years_in_current_role, years_since_last_promotion, years_with_curr_manager,
    attrition
) VALUES
(1, 41, 'Female', 2, 7, 2, 'Life Sciences', 'Travel_Rarely', 1, 'Single', 5993, 1102, 94, 19479, 2, 8, 'Yes', 11, 0, 8, 0, 6, 4, 0, 5, 'Yes'),
(2, 49, 'Male', 1, 1, 1, 'Life Sciences', 'Travel_Frequently', 8, 'Married', 5130, 279, 61, 24907, 2, 1, 'No', 23, 1, 10, 3, 10, 7, 1, 7, 'No'),
(3, 37, 'Male', 1, 2, 2, 'Other', 'Travel_Rarely', 2, 'Single', 2090, 1373, 92, 2396, 1, 6, 'Yes', 15, 0, 7, 3, 0, 0, 0, 0, 'Yes'),
(4, 33, 'Female', 1, 1, 4, 'Life Sciences', 'Travel_Frequently', 3, 'Married', 2909, 1392, 56, 23159, 1, 1, 'Yes', 11, 0, 8, 3, 8, 7, 3, 0, 'No'),
(5, 27, 'Male', 1, 2, 1, 'Medical', 'Travel_Rarely', 2, 'Married', 3468, 591, 40, 16632, 1, 9, 'No', 12, 1, 6, 3, 2, 2, 2, 2, 'No');

-- Sample Performance Reviews Inserts
INSERT INTO performance_reviews (
    employee_id, environment_satisfaction, job_satisfaction, job_involvement,
    relationship_satisfaction, work_life_balance, performance_rating
) VALUES
(1, 2, 4, 3, 1, 1, 3),
(2, 3, 2, 2, 4, 3, 4),
(3, 4, 3, 2, 2, 3, 3),
(4, 4, 3, 3, 3, 3, 3),
(5, 1, 2, 3, 4, 3, 3);
