import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, subtitle, icon: Icon, color = 'teal', trend, sparklineData }) => {
  const colorMap = {
    teal: 'from-teal-500/20 to-teal-500/5 text-teal-400 border-teal-500/30',
    sky: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30',
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/30',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
  };

  const accentColor = colorMap[color] || colorMap.teal;

  // Default sparkline path SVG generator
  const points = sparklineData || [10, 15, 12, 18, 14, 22, 19, 25];
  const minP = Math.min(...points);
  const maxP = Math.max(...points);
  const pathD = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * 100;
      const y = 30 - ((val - minP) / (maxP - minP || 1)) * 25;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="glass-card p-4 rounded-2xl border border-slate-800/80 transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{title}</span>
          <div className={`p-2 rounded-xl bg-gradient-to-br border ${accentColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">{value}</h3>
          {trend !== undefined && (
            <span className={`text-[11px] font-bold flex items-center gap-0.5 ${trend < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
        
        {/* Mini SVG Sparkline */}
        <svg className="w-16 h-6 overflow-visible" viewBox="0 0 100 30">
          <path
            d={pathD}
            fill="none"
            stroke={color === 'rose' ? '#EF4444' : color === 'emerald' ? '#10B981' : '#0D9488'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default KPICard;
