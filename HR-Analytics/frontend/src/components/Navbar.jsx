import React from 'react';
import { Download, Sparkles, Bell, Play } from 'lucide-react';
import { downloadExecutiveReport } from '../services/api';

const Navbar = ({ activeTab, isDemoMode, setIsDemoMode }) => {
  const titles = {
    overview: 'HR Intelligence Command Center',
    employees: 'Employee Directory & Intelligence Profiles',
    analytics: 'Workforce Analytics & Demographic Trends',
    'flight-risk': 'Employee Flight-Risk Predictor',
    skills: 'Skill Gap Intelligence & Training Engine',
    'talent-matrix': '9-Box Talent & Potential Matrix',
    copilot: 'AI HR Copilot Assistant',
    alerts: 'HR Early Warning System',
    simulator: 'What-If HR Decision Simulator',
    financials: 'Turnover Financial Cost Engine',
    reports: 'Executive PDF Audit Reports',
  };

  return (
    <header className="h-16 glass-panel border-b border-slate-800/60 px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-base font-bold text-slate-100 capitalize">
          {titles[activeTab] || 'HR Command Center'}
        </h2>
        <p className="text-[11px] text-slate-400">Enterprise Workforce Analytics & Decision AI</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Guided Demo Presentation Mode Toggle */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            isDemoMode
              ? 'bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/30'
              : 'bg-slate-800 text-teal-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isDemoMode ? 'Demo Mode Active' : 'Start Guided Demo'}</span>
        </button>

        {/* Quick Export PDF */}
        <button
          onClick={downloadExecutiveReport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
            HR
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200">Executive Director</div>
            <div className="text-[10px] text-teal-400 font-medium">HR Intelligence</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
