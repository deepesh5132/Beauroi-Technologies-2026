import React, { useEffect, useState } from 'react';
import { BrainCircuit, BookOpen, AlertCircle, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import ChartCard from '../components/ChartCard';
import { fetchSkillIntelligence } from '../services/api';

const SkillIntelligence = () => {
  const [skillsData, setSkillsData] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillIntelligence()
      .then((res) => {
        setSkillsData(res.skills_matrix || []);
        setTrainings(res.recommended_trainings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching skill intelligence:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Skill Gap Intelligence Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Skill Gap & Competency Intelligence</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis of current employee technical proficiencies vs required enterprise standards.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Skill Comparison Chart */}
      <ChartCard title="Current vs Required Skill Proficiency Levels (%)" subtitle="Identifies strategic upskilling requirements across technical domains">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={skillsData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="skill" stroke="#64748B" fontSize={11} />
            <YAxis stroke="#64748B" fontSize={11} unit="%" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="current" name="Current Level %" fill="#0D9488" radius={[6, 6, 0, 0]} />
            <Bar dataKey="required" name="Required Target %" fill="#0284C7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Skill Gap Detail Matrix Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200">Skill Gap Assessment Matrix</h4>
          <span className="text-xs text-teal-400 font-semibold">6 Core Competencies Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Skill Domain</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Current Level</th>
                <th className="px-5 py-3.5">Required Target</th>
                <th className="px-5 py-3.5">Skill Gap %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {skillsData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-semibold text-slate-100">{row.skill}</td>
                  <td className="px-5 py-3.5 text-slate-400">{row.category}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-200">{row.current}%</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-sky-400">{row.required}%</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {row.gap}% Gap
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Training Modules */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-400" />
          Recommended Upskilling Courses & Training Modules
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainings.map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400">{item.skill}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${item.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {item.priority} PRIORITY
                </span>
              </div>

              <h5 className="text-sm font-bold text-slate-100">{item.course}</h5>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span>Affected Staff: <strong className="text-slate-200">{item.employees_affected} Employees</strong></span>
                <span>Duration: <strong className="text-slate-200">{item.est_duration}</strong></span>
              </div>

              <p className="text-[11px] text-teal-400 italic bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
                Expected Impact: {item.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillIntelligence;
