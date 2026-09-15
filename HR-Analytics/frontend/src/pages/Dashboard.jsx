import React, { useEffect, useState } from 'react';
import { 
  Users, UserCheck, UserX, DollarSign, Calendar, Clock, ArrowUpRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import RiskBadge from '../components/RiskBadge';
import { fetchDashboardSummary } from '../services/api';

const COLORS = ['#0D9488', '#0284C7', '#6366F1', '#EC4899', '#F59E0B'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard summary:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Workforce Analytics...</span>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const deptDist = data?.department_distribution || [];
  const genderDist = data?.gender_distribution || [];
  const salaryAttr = data?.attrition_by_salary || [];

  return (
    <div className="space-y-6">
      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Workforce"
          value={kpis.total_employees?.toLocaleString() || '1,470'}
          subtitle="All Active & Historic Records"
          icon={Users}
          color="sky"
        />
        <KPICard
          title="Active Headcount"
          value={kpis.active_employees?.toLocaleString() || '1,233'}
          subtitle="Current Retained Staff"
          icon={UserCheck}
          color="emerald"
        />
        <KPICard
          title="Attrition Rate"
          value={`${kpis.attrition_rate || 16.12}%`}
          subtitle="Turnover Percentage"
          icon={UserX}
          color="rose"
          trend={1.4}
        />
        <KPICard
          title="Average Salary"
          value={`$${kpis.avg_salary?.toLocaleString() || '6,503'}`}
          subtitle="Monthly Income"
          icon={DollarSign}
          color="indigo"
        />
        <KPICard
          title="Average Age"
          value={`${kpis.avg_age || 36.9} Yrs`}
          subtitle="Workforce Demographics"
          icon={Calendar}
          color="amber"
        />
        <KPICard
          title="Avg Experience"
          value={`${kpis.avg_experience || 11.3} Yrs`}
          subtitle="Total Career Tenure"
          icon={Clock}
          color="teal"
        />
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Bar Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Department Workforce & Attrition" subtitle="Headcount breakdown across corporate departments">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptDist} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="Department" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
                />
                <Bar dataKey="total" name="Total Headcount" fill="#0284C7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attrition_count" name="Attrition Count" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div>
          <ChartCard title="Gender Ratio" subtitle="Workforce gender breakdown">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={genderDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="Gender"
                >
                  {genderDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Secondary Charts & Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Salary Tier Attrition Rates */}
        <div className="lg:col-span-1">
          <ChartCard title="Attrition by Salary Tier" subtitle="Turnover percentage by compensation brackets">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salaryAttr} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#64748B" fontSize={12} unit="%" />
                <YAxis type="category" dataKey="salary_tier" stroke="#64748B" fontSize={11} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
                />
                <Bar dataKey="attrition_rate" name="Attrition %" fill="#0D9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent High Attrition Risk Monitor Table */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-200">Recent ML Risk Audit Predictions</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time inference logs from model predictor engine</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2.5 rounded-l-lg">Emp ID</th>
                  <th className="px-4 py-2.5">Job Role</th>
                  <th className="px-4 py-2.5">Department</th>
                  <th className="px-4 py-2.5">Risk Score</th>
                  <th className="px-4 py-2.5 rounded-r-lg">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(data?.recent_predictions || []).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-slate-200">#{row.employee_id}</td>
                    <td className="px-4 py-3 font-medium text-slate-100">{row.name}</td>
                    <td className="px-4 py-3 text-slate-400">{row.department}</td>
                    <td className="px-4 py-3 font-bold text-slate-200">{(row.probability * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <RiskBadge riskLevel={row.risk_level} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
