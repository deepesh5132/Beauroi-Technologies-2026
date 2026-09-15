import React from 'react';

const ChartCard = ({ title, subtitle, action, children }) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-200">{title}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full flex-1 flex items-center justify-center min-h-[260px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
