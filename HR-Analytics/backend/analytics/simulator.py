"""
What-If HR Decision Simulation Engine.
Calculates mathematical scenario projections based on user-adjustable policy sliders.
"""

import pandas as pd
from typing import Dict, Any
from backend.analytics.kpis import calculate_kpis
from backend.analytics.intelligence import calculate_financial_turnover_costs

def run_what_if_simulation(
    salary_increase_pct: float,
    training_budget_usd: float,
    additional_hiring_count: int,
    overtime_reduction_pct: float,
    df: pd.DataFrame
) -> Dict[str, Any]:
    """Calculate predicted scenario impact of HR policy decisions."""
    kpis = calculate_kpis(df)
    financials = calculate_financial_turnover_costs(df)
    
    base_attrition = kpis.get("attrition_rate", 16.2)
    base_productivity = 74.0
    base_satisfaction = 68.0
    base_cost_lakhs = financials.get("total_annual_cost_lakhs", 38.6)
    
    # 1. Attrition Impact Calculation
    # Salary hike reduces attrition (up to -4.5%)
    sal_reduction = (salary_increase_pct / 15.0) * 4.5
    # Training budget reduces attrition (up to -3.0%)
    train_reduction = (training_budget_usd / 100000.0) * 3.0
    # Overtime reduction reduces attrition (up to -5.0%)
    ot_reduction = (overtime_reduction_pct / 30.0) * 5.0
    
    total_attr_reduction = sal_reduction + train_reduction + ot_reduction
    simulated_attrition = max(4.0, round(base_attrition - total_attr_reduction, 1))
    
    # 2. Productivity Impact Calculation
    prod_boost = (training_budget_usd / 100000.0) * 6.0 + (overtime_reduction_pct / 30.0) * 4.0 + (additional_hiring_count / 50.0) * 5.0
    simulated_productivity = min(98.0, round(base_productivity + prod_boost, 1))
    
    # 3. Satisfaction Impact Calculation
    sat_boost = (salary_increase_pct / 15.0) * 7.0 + (overtime_reduction_pct / 30.0) * 6.0 + (training_budget_usd / 100000.0) * 3.0
    simulated_satisfaction = min(98.0, round(base_satisfaction + sat_boost, 1))
    
    # 4. Financial Cost Calculation
    # New investment costs
    sal_cost_lakhs = ((kpis.get("total_employees", 1000) * kpis.get("avg_salary", 5000) * 12 * (salary_increase_pct / 100.0)) * 83) / 100000.0
    training_cost_lakhs = (training_budget_usd * 83) / 100000.0
    hiring_cost_lakhs = additional_hiring_count * 1.5 # 1.5 Lakhs per new hire onboarding
    
    total_new_investment = sal_cost_lakhs + training_cost_lakhs + hiring_cost_lakhs
    
    # Savings from reduced attrition
    attrition_savings = ((base_attrition - simulated_attrition) / 100.0) * kpis.get("total_employees", 1000) * ((kpis.get("avg_salary", 5000) * 12 * 1.2 * 83) / 100000.0)
    
    simulated_hr_cost = round(base_cost_lakhs + total_new_investment - attrition_savings, 1)
    net_savings = round(attrition_savings - total_new_investment, 1)
    
    return {
        "inputs": {
            "salary_increase_pct": salary_increase_pct,
            "training_budget_usd": training_budget_usd,
            "additional_hiring_count": additional_hiring_count,
            "overtime_reduction_pct": overtime_reduction_pct
        },
        "comparison": {
            "attrition_rate": {"current": base_attrition, "simulated": simulated_attrition, "change": round(simulated_attrition - base_attrition, 1)},
            "productivity": {"current": base_productivity, "simulated": simulated_productivity, "change": round(simulated_productivity - base_productivity, 1)},
            "satisfaction": {"current": base_satisfaction, "simulated": simulated_satisfaction, "change": round(simulated_satisfaction - base_satisfaction, 1)},
            "annual_hr_cost_lakhs": {"current": round(base_cost_lakhs, 1), "simulated": simulated_hr_cost, "change": round(simulated_hr_cost - base_cost_lakhs, 1)}
        },
        "net_financial_savings_lakhs": net_savings,
        "disclaimer": "Scenario Simulation Model: Output metrics represent estimated statistical projections based on current dataset parameters."
    }
