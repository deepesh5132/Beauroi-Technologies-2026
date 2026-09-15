import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import ChartCard from '../components/ChartCard';
import { fetchAttritionAnalytics } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttritionAnalytics()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Deep Analytics Suite...</span>
        </div>
      </div>
    );
  }

  const byDept = data?.by_department || [];
  const byRole = data?.by_role || [];
  const byAge = data?.by_age || [];

  return (
    <div className="space-y-6">
      {/* Role-wise Attrition Bar Chart */}
      <ChartCard title="Attrition Rate by Job Role" subtitle="Percentage of turnover per role within organization">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byRole} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="JobRole" stroke="#64748B" fontSize={11} angle={-35} textAnchor="end" interval={0} />
            <YAxis stroke="#64748B" fontSize={12} unit="%" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
            />
            <Bar dataKey="attrition_rate" name="Attrition Rate %" fill="#EF4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Grid of Demographics & Salary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Group Breakdown */}
        <ChartCard title="Age Bracket vs Turnover" subtitle="Turnover distribution across age brackets">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byAge}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="age_group" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
              />
              <Bar dataKey="attrition_rate" name="Attrition Rate %" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Average Income Comparison */}
        <ChartCard title="Average Departmental Income" subtitle="Monthly compensation averages by department">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="Department" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
              />
              <Bar dataKey="avg_salary" name="Avg Monthly Salary ($)" fill="#0D9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
