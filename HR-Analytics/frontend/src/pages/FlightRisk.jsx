import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Search, Filter, Sparkles, CheckCircle2, User 
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { fetchEmployees } from '../services/api';

const FlightRisk = ({ onSelectEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEmployees(1, 100, 'All', search)
      .then((res) => {
        const empList = (res.employees || []).map((emp) => {
          // Calculate realistic risk score from dataset features
          let risk = 12;
          let factors = [];
          
          if (emp.OverTime === 'Yes') {
            risk += 28;
            factors.push('Mandatory Overtime');
          }
          if (emp.JobSatisfaction <= 2) {
            risk += 22;
            factors.push('Low Job Satisfaction');
          }
          if (emp.YearsSinceLastPromotion >= 4) {
            risk += 18;
            factors.push('Promotion Stagnation');
          }
          if (emp.MonthlyIncome < 4000) {
            risk += 15;
            factors.push('Compensation Gap');
          }
          if (emp.DistanceFromHome > 20) {
            risk += 12;
            factors.push('Long Daily Commute');
          }

          risk = Math.min(96, Math.max(8, risk));
          
          let tier = 'Low Risk';
          let action = 'Maintain standard performance reviews';
          if (risk > 60) {
            tier = 'High Risk';
            action = 'Schedule immediate 1-on-1 retention stay interview';
          } else if (risk > 30) {
            tier = 'Medium Risk';
            action = 'Review workload & consider compensation adjustment';
          }

          return {
            ...emp,
            flight_risk_pct: risk,
            risk_tier: tier,
            main_factor: factors.length > 0 ? factors[0] : 'Normal Indicators',
            action: action
          };
        });

        empList.sort((a, b) => b.flight_risk_pct - a.flight_risk_pct);
        setEmployees(empList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching flight risk data:', err);
        setLoading(false);
      });
  }, [search]);

  const filteredEmployees = employees.filter((emp) => {
    if (filterLevel === 'All') return true;
    return emp.risk_tier === filterLevel;
  });

  const highRiskCount = employees.filter((e) => e.risk_tier === 'High Risk').length;
  const medRiskCount = employees.filter((e) => e.risk_tier === 'Medium Risk').length;
  const lowRiskCount = employees.filter((e) => e.risk_tier === 'Low Risk').length;

  return (
    <div className="space-y-6">
      {/* Banner & Disclaimer */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-slate-100">Employee Flight-Risk Predictor Command Center</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactive turnover risk estimation derived from dataset engagement, overtime, promotion, and compensation factors.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
          Model Mode: <strong className="text-teal-400">Dataset Risk Scoring Engine</strong>
        </div>
      </div>

      {/* Risk Tiers Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-400">High Risk (🔴 &gt; 60%)</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">{highRiskCount} Staff</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Immediate retention intervention required</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400">Medium Risk (🟡 30-60%)</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">{medRiskCount} Staff</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Workload & salary review recommended</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400">Low Risk (🟢 &lt; 30%)</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">{lowRiskCount} Staff</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Stable retention indicators</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Risk Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search employee or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Filter Risk Tier:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="High Risk">High Risk Only (🔴)</option>
              <option value="Medium Risk">Medium Risk Only (🟡)</option>
              <option value="Low Risk">Low Risk Only (🟢)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Emp ID</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Flight Risk %</th>
                <th className="px-5 py-3.5">Risk Tier</th>
                <th className="px-5 py-3.5">Primary Risk Factor</th>
                <th className="px-5 py-3.5">Recommended HR Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Evaluating risk scores...
                  </td>
                </tr>
              ) : filteredEmployees.map((emp) => (
                <tr
                  key={emp.EmployeeNumber}
                  onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                  className="hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="px-5 py-3.5 font-mono text-teal-400 font-bold">#{emp.EmployeeNumber}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    {emp.JobRole}
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{emp.Department}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-100">{emp.flight_risk_pct}%</td>
                  <td className="px-5 py-3.5">
                    <RiskBadge riskLevel={emp.risk_tier} />
                  </td>
                  <td className="px-5 py-3.5 text-amber-400 font-medium">{emp.main_factor}</td>
                  <td className="px-5 py-3.5 text-slate-400 italic">{emp.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FlightRisk;
