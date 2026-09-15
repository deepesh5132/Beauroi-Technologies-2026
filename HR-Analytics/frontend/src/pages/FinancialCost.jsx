import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Building2, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ChartCard from '../components/ChartCard';
import { fetchFinancialCosts } from '../services/api';

const COLORS = ['#EF4444', '#F59E0B', '#0D9488', '#0284C7', '#6366F1'];

const FinancialCost = () => {
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialCosts()
      .then((res) => {
        setFinancials(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching financial cost analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Turnover Financial Cost Engine...</span>
        </div>
      </div>
    );
  }

  const breakdown = financials?.cost_breakdown || [];
  const deptCosts = financials?.department_costs || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Turnover Financial Cost Analytics Engine</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantifies financial business loss of employee turnover across recruitment, productivity, and training.
            </p>
          </div>
        </div>
      </div>

      {/* Top Cost KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs font-bold text-amber-400 uppercase">Total Annual Turnover Cost</span>
          <div className="text-3xl font-extrabold text-slate-100 mt-1 font-mono">
            ₹{financials?.total_annual_cost_lakhs || 38.6} Lakhs
          </div>
          <p className="text-[11px] text-slate-400 mt-1">($ {financials?.total_annual_cost_usd?.toLocaleString()} USD)</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Cost Per Departed Staff</span>
          <div className="text-3xl font-extrabold text-teal-400 mt-1 font-mono">
            ₹{financials?.cost_per_employee_lakhs || 2.8} Lakhs
          </div>
          <p className="text-[11px] text-slate-400 mt-1">~1.2x Annual Compensation replacement cost</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Largest Cost Component</span>
          <div className="text-3xl font-extrabold text-rose-400 mt-1 font-mono">
            Lost Productivity
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Accounts for 40% of total turnover loss</p>
        </div>
      </div>

      {/* Financial Cost Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Category Breakdown Pie Chart */}
        <ChartCard title="Turnover Cost Category Breakdown" subtitle="Distribution of financial loss by operational area">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="amount_lakhs"
                nameKey="category"
              >
                {breakdown.map((entry, index) => (
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

        {/* Department Cost Ranking Bar Chart */}
        <ChartCard title="Department Turnover Financial Cost (₹ Lakhs)" subtitle="Identifies which department costs the company the most">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptCosts} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="department" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} unit="L" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
              />
              <Bar dataKey="cost_lakhs" name="Cost (₹ Lakhs)" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default FinancialCost;
