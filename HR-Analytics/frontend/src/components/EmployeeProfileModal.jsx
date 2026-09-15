import React from 'react';
import { 
  X, User, Award, Calendar, DollarSign, Briefcase, Sparkles, CheckCircle2, TrendingUp, ShieldAlert 
} from 'lucide-react';
import RiskBadge from './RiskBadge';

const EmployeeProfileModal = ({ employee, onClose }) => {
  if (!employee) return null;

  const empId = employee.EmployeeNumber || employee.employee_id || 101;
  const role = employee.JobRole || employee.role || 'Senior Specialist';
  const dept = employee.Department || employee.department || 'Research & Development';
  const income = employee.MonthlyIncome || employee.monthly_income || 6500;
  const age = employee.Age || 34;
  const yac = employee.YearsAtCompany || employee.years_at_company || 4;
  const yslp = employee.YearsSinceLastPromotion || 2;
  const perf = employee.PerformanceRating || 3;
  const sat = employee.JobSatisfaction || 3;
  const overtime = employee.OverTime || 'No';
  const attrition = employee.Attrition || 'No';

  // Calculate health indicators
  const flightRiskPct = overtime === 'Yes' || sat <= 2 || yslp >= 4 ? 78 : 18;

  const empName = employee.EmployeeName || employee.name || `Employee #${empId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-3xl rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
              {empName.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{empName}</h3>
                <RiskBadge riskLevel={flightRiskPct > 60 ? 'High Risk' : flightRiskPct > 30 ? 'Medium Risk' : 'Low Risk'} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5"><strong className="text-teal-400">#{empId}</strong> • {role} • {dept} ({yac} Yrs Tenure)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Monthly Compensation</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">${income.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Performance Rating</span>
            <div className="text-base font-bold text-slate-100 mt-0.5">{perf} / 4 Stars</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Job Satisfaction</span>
            <div className="text-base font-bold text-sky-400 mt-0.5">{sat} / 4 Rating</div>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Overtime Status</span>
            <div className={`text-base font-bold mt-0.5 ${overtime === 'Yes' ? 'text-amber-400' : 'text-slate-300'}`}>
              {overtime}
            </div>
          </div>
        </div>

        {/* Visual Career Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Visual Career Growth Timeline
          </h4>

          <div className="grid grid-cols-6 gap-2 text-center text-[10px]">
            <div className="p-2 bg-slate-900/80 rounded-xl border border-teal-500/30">
              <div className="font-bold text-teal-400">JOINED</div>
              <div className="text-slate-400 mt-1">{2026 - yac}</div>
            </div>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="font-bold text-slate-200">TRAINING</div>
              <div className="text-slate-400 mt-1">Compliance</div>
            </div>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="font-bold text-sky-400">REVIEW</div>
              <div className="text-slate-400 mt-1">Rating: {perf}/4</div>
            </div>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="font-bold text-purple-400">CERTIFIED</div>
              <div className="text-slate-400 mt-1">Power BI</div>
            </div>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="font-bold text-amber-400">PROMOTION</div>
              <div className="text-slate-400 mt-1">{yslp} Yrs Ago</div>
            </div>
            <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-500/40 text-teal-300 font-bold">
              <div>CURRENT</div>
              <div className="text-slate-300 mt-1">Active Staff</div>
            </div>
          </div>
        </div>

        {/* Employee Health Indicators */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-200">Employee Health Indicators</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400">Performance Trend</span>
              <div className="font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Stable Growth (+4%)
              </div>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400">Workload Index</span>
              <div className={`font-semibold mt-1 ${overtime === 'Yes' ? 'text-amber-400' : 'text-slate-200'}`}>
                {overtime === 'Yes' ? 'High Workload (Overtime)' : 'Optimal Workload'}
              </div>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400">Flight Risk Score</span>
              <div className={`font-bold mt-1 ${flightRiskPct > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {flightRiskPct}% Estimated Risk
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;
