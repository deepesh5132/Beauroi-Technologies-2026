import React from 'react';
import { Play, ChevronRight, ChevronLeft, Sparkles, X } from 'lucide-react';

const DEMO_STEPS = [
  { step: 1, tab: 'overview', title: 'Step 1: Command Center Overview', desc: 'Review high-level executive KPIs, sparklines, and attrition indicators.' },
  { step: 2, tab: 'analytics', title: 'Step 2: Department Attrition Spike', desc: 'Examine turnover rate breakdown in R&D and Sales departments.' },
  { step: 3, tab: 'flight-risk', title: 'Step 3: Flight-Risk Predictor', desc: 'Identify high-risk employees using real-time predictive scoring.' },
  { step: 4, tab: 'flight-risk', title: 'Step 4: Contributing Risk Factors', desc: 'Inspect root causes (Overtime, low satisfaction, stagnation).' },
  { step: 5, tab: 'skills', title: 'Step 5: Skill Gap Intelligence', desc: 'Analyze workforce competency gaps vs target requirements.' },
  { step: 6, tab: 'skills', title: 'Step 6: Training Recommendations', desc: 'Review prioritized training modules for affected staff.' },
  { step: 7, tab: 'copilot', title: 'Step 7: AI HR Copilot', desc: 'Ask natural-language questions to generate dataset insights.' },
  { step: 8, tab: 'simulator', title: 'Step 8: What-If HR Decision Simulator', desc: 'Open interactive policy simulation sandbox.' },
  { step: 9, tab: 'simulator', title: 'Step 9: Policy Budget Adjustments', desc: 'Slide salary increase & training budget parameters.' },
  { step: 10, tab: 'financials', title: 'Step 10: Financial Impact & ROI', desc: 'Demonstrate simulated turnover cost savings and net ROI.' }
];

const DemoGuideBar = ({ currentStep, setCurrentStep, setActiveTab, onClose }) => {
  const stepInfo = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[0];

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setActiveTab(DEMO_STEPS[nextStep - 1].tab);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setActiveTab(DEMO_STEPS[prevStep - 1].tab);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="glass-panel p-4 rounded-2xl border border-teal-500/50 shadow-2xl shadow-teal-500/20 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center font-extrabold text-white text-sm shrink-0 shadow-lg">
            {currentStep}/10
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <h4 className="text-xs font-bold text-slate-100">{stepInfo.title}</h4>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">{stepInfo.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            disabled={currentStep === 1}
            onClick={handlePrev}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentStep === DEMO_STEPS.length}
            onClick={handleNext}
            className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 font-bold text-xs text-white shadow-md flex items-center gap-1.5 transition"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoGuideBar;
