import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { downloadExecutiveReport } from '../services/api';

const Reports = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadExecutiveReport();
    } catch (err) {
      console.error('Download Report Error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Report Header Card */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800/80 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20">
          <FileSpreadsheet className="w-7 h-7 text-white" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-100">Executive HR Workforce Attrition Audit Report</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
            Comprehensive PDF document containing high-level executive KPIs, departmental turnover breakdowns, and AI-driven retention strategies.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-500/25 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating PDF Document...' : 'Download PDF Executive Audit'}
          </button>
        </div>
      </div>

      {/* Report Included Content Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Executive Data Breakdown
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>Headcount, Active Staff, and Turnover Rates</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>Average Compensation & Experience Matrix</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>Departmental Attrition Comparison Tables</span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Strategic Recommendations
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Overtime & Work-Life Balance Interventions</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Promotion Fast-Tracking for Stagnant Staff</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Commute & Remote Hybrid Work Policies</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
