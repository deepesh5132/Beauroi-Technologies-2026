import React, { useEffect, useState } from 'react';
import { Grid, Sparkles, User, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { fetchTalentMatrix } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const TalentMatrix = ({ onSelectEmployee }) => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTalentMatrix()
      .then((res) => {
        setMatrixData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching talent matrix:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Talent 9-Box Matrix Grid...</span>
        </div>
      </div>
    );
  }

  const quadrants = matrixData?.quadrants || {};
  const counts = matrixData?.counts || {};

  const quadrantConfigs = [
    {
      key: "Future Leaders",
      title: "Future Leaders (Top Talent)",
      desc: "High Performance + High Potential",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      accentBorder: "border-emerald-500/40 bg-emerald-500/5",
      actionText: "Fast-track promotion & leadership coaching"
    },
    {
      key: "Specialists",
      title: "High Performing Specialists",
      desc: "High Performance + Low Potential",
      badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/40",
      accentBorder: "border-sky-500/40 bg-sky-500/5",
      actionText: "Retain & reward subject matter expertise"
    },
    {
      key: "Development Opportunities",
      title: "Development Opportunities",
      desc: "Low Performance + High Potential",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      accentBorder: "border-amber-500/40 bg-amber-500/5",
      actionText: "Assign targeted skill training & mentorship"
    },
    {
      key: "Attention Required",
      title: "Attention Required",
      desc: "Low Performance + Low Potential",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      accentBorder: "border-rose-500/40 bg-rose-500/5",
      actionText: "Performance management review & counseling"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Talent & Potential 9-Box Matrix Grid</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluates Current Performance Rating vs Future Leadership Potential Score.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Click any employee card to inspect intelligence profile</span>
        </div>
      </div>

      {/* 2x2 Interactive Talent Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrantConfigs.map((cfg) => {
          const empList = quadrants[cfg.key] || [];
          const totalCount = counts[cfg.key] || empList.length;

          return (
            <div
              key={cfg.key}
              className={`glass-card p-5 rounded-3xl border transition-all duration-300 ${cfg.accentBorder} space-y-4`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-100">{cfg.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cfg.desc}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.badgeColor}`}>
                  {totalCount} Staff
                </span>
              </div>

              {/* Employee Cards List */}
              <div className="space-y-2">
                {empList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No employees in this quadrant.</p>
                ) : (
                  empList.map((emp) => (
                    <div
                      key={emp.employee_id}
                      onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-200">{emp.role}</h5>
                          <p className="text-[10px] text-slate-400">EMP-#{emp.employee_id} • {emp.department}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400">${emp.monthly_income?.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">{emp.years_at_company} yrs tenure</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 text-[11px] text-teal-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                Recommended Action: {cfg.actionText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TalentMatrix;
