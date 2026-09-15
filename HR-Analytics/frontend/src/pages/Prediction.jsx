import React, { useState } from 'react';
import { BrainCircuit, AlertCircle, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { predictAttrition } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const Prediction = () => {
  const [formData, setFormData] = useState({
    Age: 32,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Research Scientist',
    Education: 3,
    EducationField: 'Life Sciences',
    BusinessTravel: 'Travel_Rarely',
    DistanceFromHome: 12,
    EnvironmentSatisfaction: 2,
    JobInvolvement: 3,
    JobLevel: 2,
    JobSatisfaction: 2,
    MaritalStatus: 'Single',
    MonthlyIncome: 3500,
    NumCompaniesWorked: 3,
    OverTime: 'Yes',
    PercentSalaryHike: 13,
    PerformanceRating: 3,
    RelationshipSatisfaction: 2,
    StockOptionLevel: 0,
    TotalWorkingYears: 6,
    TrainingTimesLastYear: 2,
    WorkLifeBalance: 2,
    YearsAtCompany: 4,
    YearsInCurrentRole: 2,
    YearsSinceLastPromotion: 4,
    YearsWithCurrManager: 2,
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictAttrition(formData);
      setPredictionResult(res);
    } catch (err) {
      console.error('Prediction API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Employee Input Form Column */}
      <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Employee Attrition Risk Predictor</h3>
            <p className="text-xs text-slate-400">Input employee parameters for XGBoost ML inference</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <select
                name="Department"
                value={formData.Department}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              >
                <option value="Research & Development">Research & Development</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Role</label>
              <input
                type="text"
                name="JobRole"
                value={formData.JobRole}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Income ($)</label>
              <input
                type="number"
                name="MonthlyIncome"
                value={formData.MonthlyIncome}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Overtime Required?</label>
              <select
                name="OverTime"
                value={formData.OverTime}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Satisfaction (1 - 4)</label>
              <input
                type="number"
                min="1"
                max="4"
                name="JobSatisfaction"
                value={formData.JobSatisfaction}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Years Since Last Promotion</label>
              <input
                type="number"
                name="YearsSinceLastPromotion"
                value={formData.YearsSinceLastPromotion}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Distance From Home (km)</label>
              <input
                type="number"
                name="DistanceFromHome"
                value={formData.DistanceFromHome}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work-Life Balance (1 - 4)</label>
              <input
                type="number"
                min="1"
                max="4"
                name="WorkLifeBalance"
                value={formData.WorkLifeBalance}
                onChange={handleChange}
                className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Predictive Inference...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Evaluate Employee Attrition Risk
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Output Gauge Panel */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-200 mb-1">Inference Results & Risk Gauge</h4>
          <p className="text-xs text-slate-400 mb-6">Probability score estimated by machine learning model</p>

          {predictionResult ? (
            <div className="space-y-6 text-center">
              <div className="py-4">
                <RiskBadge riskLevel={predictionResult.risk_level} />
                <div className="mt-4 text-4xl font-extrabold text-slate-100 font-mono">
                  {predictionResult.risk_score}%
                </div>
                <p className="text-xs text-slate-400 mt-1">Attrition Probability Score</p>
              </div>

              {/* Progress Gauge */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    predictionResult.risk_level === 'High Risk'
                      ? 'bg-rose-500'
                      : predictionResult.risk_level === 'Medium Risk'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${predictionResult.risk_score}%` }}
                ></div>
              </div>

              {/* Contributing Risk Factors */}
              <div className="text-left space-y-2 pt-4 border-t border-slate-800">
                <h5 className="text-xs font-semibold text-slate-300">Key Retention Risk Indicators:</h5>
                <ul className="space-y-1.5">
                  {(predictionResult.risk_factors || []).map((factor, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <BrainCircuit className="w-12 h-12 mx-auto text-slate-700 stroke-1" />
              <p className="text-xs">Fill out the employee profile and click Predict to view ML evaluation.</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-500">
          Model Version: <strong className="text-slate-300">{predictionResult?.model_version || 'v1.0-XGBoost'}</strong>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
