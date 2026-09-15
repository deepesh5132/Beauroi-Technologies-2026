import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, TrendingUp, TrendingDown, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import { runWhatIfSimulation } from '../services/api';

const WhatIfSimulator = () => {
  const [sliders, setSliders] = useState({
    salary_increase_pct: 5.0,
    training_budget_usd: 25000,
    additional_hiring_count: 10,
    overtime_reduction_pct: 15.0,
  });

  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSliderChange = (field, val) => {
    setSliders((prev) => ({ ...prev, [field]: Number(val) }));
  };

  const executeSimulation = async () => {
    setLoading(true);
    try {
      const res = await runWhatIfSimulation(sliders);
      setSimulation(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSimulation();
  }, [sliders]);

  const cmp = simulation?.comparison || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Policy Sliders Control Panel */}
      <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">HR Decision Sandbox</h3>
            <p className="text-xs text-slate-400">Adjust policy sliders to test simulated impact</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Slider 1: Salary Increase */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Salary Increase</span>
              <span className="text-teal-400 font-mono">{sliders.salary_increase_pct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={sliders.salary_increase_pct}
              onChange={(e) => handleSliderChange('salary_increase_pct', e.target.value)}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% (Baseline)</span>
              <span>15% (Max Hike)</span>
            </div>
          </div>

          {/* Slider 2: Training Budget */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Training Budget</span>
              <span className="text-sky-400 font-mono">${sliders.training_budget_usd.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={sliders.training_budget_usd}
              onChange={(e) => handleSliderChange('training_budget_usd', e.target.value)}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>$0</span>
              <span>$100,000</span>
            </div>
          </div>

          {/* Slider 3: Additional Hiring */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Additional Hiring</span>
              <span className="text-purple-400 font-mono">+{sliders.additional_hiring_count} Staff</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={sliders.additional_hiring_count}
              onChange={(e) => handleSliderChange('additional_hiring_count', e.target.value)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 Hires</span>
              <span>+50 Hires</span>
            </div>
          </div>

          {/* Slider 4: Overtime Reduction */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Overtime Reduction</span>
              <span className="text-amber-400 font-mono">-{sliders.overtime_reduction_pct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={sliders.overtime_reduction_pct}
              onChange={(e) => handleSliderChange('overtime_reduction_pct', e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% Reduction</span>
              <span>-30% Reduction</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-teal-400 inline mr-1" />
          {simulation?.disclaimer || "Scenario Estimates: Simulated projections derived from dataset parameters."}
        </div>
      </div>

      {/* Predicted Impact Dashboard Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Net Savings Metric Header */}
        <div className="glass-card p-6 rounded-3xl border border-teal-500/40 bg-teal-500/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Estimated Net Financial ROI</span>
            <div className="text-3xl font-extrabold text-slate-100 mt-1 font-mono">
              ₹{simulation?.net_financial_savings_lakhs || 0} Lakhs Net Savings
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Calculated by offsetting policy cost vs reduced turnover loss</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono text-center">
            <span className="text-[10px] uppercase block">Turnover Shift</span>
            <strong className="text-lg">
              {cmp.attrition_rate?.current}% → {cmp.attrition_rate?.simulated}%
            </strong>
          </div>
        </div>

        {/* 4 Outcome Metric Comparison Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Attrition Rate */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Attrition Rate %</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-400">{cmp.attrition_rate?.current}%</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">{cmp.attrition_rate?.simulated}%</span>
            </div>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              {cmp.attrition_rate?.change}% Predicted Decrease
            </p>
          </div>

          {/* Productivity Score */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Workforce Productivity Score</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-400">{cmp.productivity?.current}%</span>
              <span className="text-2xl font-extrabold text-sky-400 font-mono">{cmp.productivity?.simulated}%</span>
            </div>
            <p className="text-xs text-sky-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +{cmp.productivity?.change}% Projected Boost
            </p>
          </div>

          {/* Employee Satisfaction */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Employee Satisfaction Index</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-400">{cmp.satisfaction?.current}%</span>
              <span className="text-2xl font-extrabold text-purple-400 font-mono">{cmp.satisfaction?.simulated}%</span>
            </div>
            <p className="text-xs text-purple-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +{cmp.satisfaction?.change}% Engagement Lift
            </p>
          </div>

          {/* Annual HR Cost */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Annual HR Budget Cost</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-400">₹{cmp.annual_hr_cost_lakhs?.current}L</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">₹{cmp.annual_hr_cost_lakhs?.simulated}L</span>
            </div>
            <p className="text-xs text-amber-400 font-semibold">
              Net Change: ₹{cmp.annual_hr_cost_lakhs?.change} Lakhs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;
