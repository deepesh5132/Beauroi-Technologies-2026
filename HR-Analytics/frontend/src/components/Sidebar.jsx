import React from 'react';
import { 
  LayoutDashboard, Users, BarChart3, ShieldAlert, BrainCircuit, 
  Sparkles, Grid, Sliders, DollarSign, FileSpreadsheet, Bell, Building2
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees Directory', icon: Users },
    { id: 'analytics', label: 'Workforce Analytics', icon: BarChart3 },
    { id: 'flight-risk', label: 'Flight-Risk Predictor', icon: ShieldAlert, badge: 'AI Risk' },
    { id: 'skills', label: 'Skill Intelligence', icon: BrainCircuit },
    { id: 'talent-matrix', label: 'Talent 9-Box Matrix', icon: Grid },
    { id: 'copilot', label: 'AI HR Copilot', icon: Sparkles, badge: 'Copilot' },
    { id: 'alerts', label: 'HR Early Warnings', icon: Bell },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'financials', label: 'Turnover Financials', icon: DollarSign },
    { id: 'reports', label: 'Executive Reports', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/60 flex flex-col justify-between hidden lg:flex shrink-0 h-screen overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/60 sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xs text-slate-100 tracking-wide uppercase">Pulse HR AI</h1>
            <p className="text-[10px] text-teal-400 font-semibold">Intelligence Command</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/10 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-3 m-3 rounded-xl glass-card border border-slate-800">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-bold text-slate-300">FastAPI & Decision Engine</span>
        </div>
        <p className="text-[10px] text-slate-500">Live Enterprise Data Pipeline</p>
      </div>
    </aside>
  );
};

export default Sidebar;
