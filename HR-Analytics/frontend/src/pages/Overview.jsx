import React, { useEffect, useState } from 'react';
import { 
  Users, UserCheck, UserX, DollarSign, Calendar, Clock, 
  ShieldAlert, Sparkles, TrendingUp, AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import RiskBadge from '../components/RiskBadge';
import { fetchDashboardSummary, fetchHRAlerts, fetchFinancialCosts } from '../services/api';

const COLORS = ['#0D9488', '#0284C7', '#6366F1', '#EC4899', '#F59E0B'];

const Overview = ({ onSelectEmployee }) => {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDashboardSummary(),
      fetchHRAlerts(),
      fetchFinancialCosts()
    ])
      .then(([dashRes, alertRes, finRes]) => {
        setData(dashRes);
        setAlerts(alertRes || []);
        setFinancials(finRes || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Overview fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Initializing HR Intelligence Command Center...</span>
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
          title="Total Employees"
          value={kpis.total_employees?.toLocaleString() || '1,470'}
          subtitle="Workforce Headcount"
          icon={Users}
          color="sky"
          sparklineData={[1400, 1420, 1435, 1450, 1470]}
        />
        <KPICard
          title="Attrition Rate"
          value={`${kpis.attrition_rate || 16.12}%`}
          subtitle="Quarterly Turnover"
          icon={UserX}
          color="rose"
          trend={-2.4}
          sparklineData={[22, 19, 18, 17, 16.1]}
        />
        <KPICard
          title="Turnover Cost"
          value={`₹${financials?.total_annual_cost_lakhs || 38.6}L`}
          subtitle="Annual Financial Cost"
          icon={DollarSign}
          color="amber"
          sparklineData={[48, 44, 42, 40, 38.6]}
        />
        <KPICard
          title="Average Salary"
          value={`$${kpis.avg_salary?.toLocaleString() || '6,503'}`}
          subtitle="Monthly Compensation"
          icon={DollarSign}
          color="indigo"
          sparklineData={[6100, 6200, 6350, 6450, 6503]}
        />
        <KPICard
          title="Avg Performance"
          value="3.15 / 4.0"
          subtitle="Rating Index Score"
          icon={Calendar}
          color="emerald"
          sparklineData={[3.0, 3.05, 3.1, 3.12, 3.15]}
        />
        <KPICard
          title="Productivity"
          value="78.4%"
          subtitle="Output Benchmark"
          icon={Clock}
          color="teal"
          sparklineData={[72, 74, 75, 77, 78.4]}
        />
      </div>

      {/* Critical HR Alerts Stream Banner */}
      {alerts.length > 0 && (
        <div className="glass-card p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">{alerts[0].title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">{alerts[0].description}</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {alerts[0].severity}
            </span>
          </div>
        </div>
      )}

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Workforce & Attrition Bar Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Department Headcount & Attrition Rate" subtitle="Headcount breakdown vs turnover rate per department">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={deptDist} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="Department" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
                />
                <Bar dataKey="total" name="Total Headcount" fill="#0284C7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attrition_count" name="Turnover Count" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div>
          <ChartCard title="Workforce Gender Ratio" subtitle="Demographic breakdown across company">
            <ResponsiveContainer width="100%" height={270}>
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

      {/* Flight Risk Monitor & Financial Cost Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Salary Tier Attrition */}
        <div className="lg:col-span-1">
          <ChartCard title="Turnover by Compensation Tier" subtitle="Percentage of turnover by monthly salary bracket">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salaryAttr} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#64748B" fontSize={11} unit="%" />
                <YAxis type="category" dataKey="salary_tier" stroke="#64748B" fontSize={10} tickLine={false} width={85} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
                />
                <Bar dataKey="attrition_rate" name="Turnover %" fill="#0D9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* High Risk Employees Overview Table */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-200">High-Risk Employee Flight Monitor</h4>
              <p className="text-xs text-slate-400 mt-0.5">Real-time predictive risk scoring from dataset indicators</p>
            </div>
            <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/30">
              Live AI Model
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Emp ID</th>
                  <th className="px-4 py-2.5">Job Role</th>
                  <th className="px-4 py-2.5">Department</th>
                  <th className="px-4 py-2.5">Flight Risk %</th>
                  <th className="px-4 py-2.5">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(data?.recent_predictions || []).map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectEmployee && onSelectEmployee(row)}
                    className="hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="px-4 py-3 font-mono text-teal-400 font-bold">#{row.employee_id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-100">{row.name}</td>
                    <td className="px-4 py-3 text-slate-400">{row.department}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-200">{(row.probability * 100).toFixed(1)}%</td>
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

export default Overview;
