import csv
import random
import os

random.seed(42)
n_samples = 1470

departments = ["Research & Development", "Sales", "Human Resources"]
dept_weights = [0.65, 0.30, 0.05]

job_roles = {
    "Research & Development": ["Research Scientist", "Laboratory Technician", "Manufacturing Director", "Healthcare Representative", "Research Director", "Manager"],
    "Sales": ["Sales Executive", "Sales Representative", "Manager"],
    "Human Resources": ["Human Resources", "Manager"]
}

education_fields = {
    "Research & Development": ["Life Sciences", "Medical", "Technical Degree", "Other"],
    "Sales": ["Marketing", "Life Sciences", "Medical", "Other"],
    "Human Resources": ["Human Resources", "Life Sciences", "Medical", "Other"]
}

business_travels = ["Travel_Rarely", "Travel_Frequently", "Non-Travel"]
travel_weights = [0.70, 0.19, 0.11]

genders = ["Female", "Male"]
gender_weights = [0.40, 0.60]

marital_statuses = ["Single", "Married", "Divorced"]
marital_weights = [0.32, 0.46, 0.22]

def weighted_choice(choices, weights):
    total = sum(weights)
    r = random.uniform(0, total)
    upto = 0
    for c, w in zip(choices, weights):
        if upto + w >= r:
            return c
        upto += w
    return choices[-1]

data = []

fieldnames = [
    "Age", "Attrition", "BusinessTravel", "DailyRate", "Department",
    "DistanceFromHome", "Education", "EducationField", "EmployeeCount",
    "EmployeeNumber", "EnvironmentSatisfaction", "Gender", "HourlyRate",
    "JobInvolvement", "JobLevel", "JobRole", "JobSatisfaction",
    "MaritalStatus", "MonthlyIncome", "MonthlyRate", "NumCompaniesWorked",
    "Over18", "OverTime", "PercentSalaryHike", "PerformanceRating",
    "RelationshipSatisfaction", "StandardHours", "StockOptionLevel",
    "TotalWorkingYears", "TrainingTimesLastYear", "WorkLifeBalance",
    "YearsAtCompany", "YearsInCurrentRole", "YearsSinceLastPromotion",
    "YearsWithCurrManager"
]

for i in range(1, n_samples + 1):
    age = random.randint(18, 60)
    gender = weighted_choice(genders, gender_weights)
    dept = weighted_choice(departments, dept_weights)
    role = random.choice(job_roles[dept])
    edu_field = random.choice(education_fields[dept])
    edu_level = weighted_choice([1, 2, 3, 4, 5], [0.11, 0.19, 0.39, 0.27, 0.04])
    b_travel = weighted_choice(business_travels, travel_weights)
    distance = random.randint(1, 29)
    marital = weighted_choice(marital_statuses, marital_weights)
    
    env_sat = weighted_choice([1, 2, 3, 4], [0.19, 0.19, 0.31, 0.31])
    job_inv = weighted_choice([1, 2, 3, 4], [0.06, 0.25, 0.57, 0.12])
    job_sat = weighted_choice([1, 2, 3, 4], [0.19, 0.19, 0.31, 0.31])
    rel_sat = weighted_choice([1, 2, 3, 4], [0.19, 0.19, 0.31, 0.31])
    wlb = weighted_choice([1, 2, 3, 4], [0.06, 0.23, 0.61, 0.10])
    
    if "Manager" in role or "Director" in role:
        job_level = weighted_choice([4, 5], [0.6, 0.4])
    elif "Executive" in role or "Representative" in role:
        job_level = weighted_choice([2, 3], [0.7, 0.3])
    else:
        job_level = weighted_choice([1, 2], [0.6, 0.4])
        
    base_income = {1: 2800, 2: 5500, 3: 9500, 4: 14000, 5: 18500}[job_level]
    monthly_income = int(max(2000, min(20000, random.gauss(base_income, 800))))
    
    daily_rate = random.randint(102, 1499)
    hourly_rate = random.randint(30, 100)
    monthly_rate = random.randint(2094, 26999)
    
    max_twy = max(0, age - 18)
    total_working_years = max(0, min(max_twy, int(random.gauss(job_level * 4, 3))))
    years_at_company = max(0, min(total_working_years, int(random.gauss(total_working_years * 0.6, 2))))
    years_in_curr_role = max(0, min(years_at_company, int(random.gauss(years_at_company * 0.5, 1.5))))
    years_since_promotion = max(0, min(years_at_company, int(random.gauss(years_at_company * 0.3, 1.2))))
    years_with_curr_mgr = max(0, min(years_at_company, int(random.gauss(years_at_company * 0.5, 1.5))))
    
    num_companies = random.randint(0, 9)
    overtime = weighted_choice(["Yes", "No"], [0.28, 0.72])
    salary_hike = random.randint(11, 25)
    perf_rating = 4 if salary_hike >= 20 else 3
    stock_level = weighted_choice([0, 1, 2, 3], [0.40, 0.40, 0.15, 0.05])
    training_last_year = random.randint(0, 6)
    
    attrition_prob = 0.10
    if overtime == "Yes": attrition_prob += 0.18
    if job_sat <= 2: attrition_prob += 0.15
    if env_sat <= 2: attrition_prob += 0.10
    if monthly_income < 3500: attrition_prob += 0.12
    if years_since_promotion > 4: attrition_prob += 0.10
    if distance > 20: attrition_prob += 0.08
    if wlb == 1: attrition_prob += 0.12
    if stock_level == 0: attrition_prob += 0.05
    if b_travel == "Travel_Frequently": attrition_prob += 0.10
    
    attrition_prob = min(0.85, max(0.02, attrition_prob))
    attrition = "Yes" if random.random() < attrition_prob else "No"
    
    data.append({
        "Age": age, "Attrition": attrition, "BusinessTravel": b_travel,
        "DailyRate": daily_rate, "Department": dept, "DistanceFromHome": distance,
        "Education": edu_level, "EducationField": edu_field, "EmployeeCount": 1,
        "EmployeeNumber": i, "EnvironmentSatisfaction": env_sat, "Gender": gender,
        "HourlyRate": hourly_rate, "JobInvolvement": job_inv, "JobLevel": job_level,
        "JobRole": role, "JobSatisfaction": job_sat, "MaritalStatus": marital,
        "MonthlyIncome": monthly_income, "MonthlyRate": monthly_rate,
        "NumCompaniesWorked": num_companies, "Over18": "Y", "OverTime": overtime,
        "PercentSalaryHike": salary_hike, "PerformanceRating": perf_rating,
        "RelationshipSatisfaction": rel_sat, "StandardHours": 80,
        "StockOptionLevel": stock_level, "TotalWorkingYears": total_working_years,
        "TrainingTimesLastYear": training_last_year, "WorkLifeBalance": wlb,
        "YearsAtCompany": years_at_company, "YearsInCurrentRole": years_in_curr_role,
        "YearsSinceLastPromotion": years_since_promotion, "YearsWithCurrManager": years_with_curr_mgr
    })

os.makedirs("HR-Analytics/datasets", exist_ok=True)
with open("HR-Analytics/datasets/ibm_hr_attrition.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(data)

print(f"Generated IBM HR dataset with {len(data)} records successfully.")
