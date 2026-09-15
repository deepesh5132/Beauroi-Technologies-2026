import React, { useState } from 'react';
import { Sparkles, Send, Bot, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { askHRCopilot } from '../services/api';

const HRCopilot = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    query: "Why did attrition increase this quarter?",
    insight: "Turnover is primarily driven by excessive overtime (28.5%) and promotion stagnation in Research & Development.",
    supporting_numbers: [
      "Overall Attrition Rate: 16.12%",
      "Mandatory Overtime Ratio: 28.5%",
      "Highest Risk Department: Research & Development",
      "Estimated Annual Turnover Cost: ₹38.6 Lakhs"
    ],
    affected_entities: ["Research & Development", "Sales Executives", "Lab Technicians"],
    recommended_actions: [
      "1. Audit weekly working hours and enforce overtime caps in high-risk departments.",
      "2. Conduct bi-annual promotion eligibility reviews for staff with 3+ years tenure.",
      "3. Adjust compensation benchmarks for entry/mid-level roles under $4,000/month."
    ]
  });

  const presetQueries = [
    "Why did attrition increase this quarter?",
    "Which department has highest turnover?",
    "Who are the highest-risk employees?",
    "Which employees are ready for promotion?",
    "Where are the biggest skill gaps?",
    "What should HR focus on this month?",
    "How much could turnover cost us?"
  ];

  const handleSend = async (qText) => {
    const textToSend = qText || query;
    if (!textToSend.trim()) return;
    setLoading(true);
    try {
      const res = await askHRCopilot(textToSend);
      setResponse(res);
      setQuery('');
    } catch (err) {
      console.error('HR Copilot Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">AI HR Copilot Assistant</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask natural-language workforce management questions to generate live dataset insights.
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Dataset-Bound Decision AI
          </span>
        </div>
      </div>

      {/* Preset Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400">Suggested Natural-Language Questions:</span>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pq)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition text-left"
            >
              "{pq}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Query Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="glass-card p-2 rounded-2xl border border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask HR Copilot any natural language question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition flex items-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Ask Copilot
            </>
          )}
        </button>
      </form>

      {/* Copilot Response Card */}
      {response && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-6 shadow-2xl">
          {/* Question Banner */}
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 border-b border-slate-800 pb-3">
            <Bot className="w-4 h-4" />
            <span>Copilot Evaluation for: "{response.query}"</span>
          </div>

          {/* Key Insight */}
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/30 space-y-1">
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Executive Insight</span>
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">{response.insight}</p>
          </div>

          {/* Supporting Numbers & Impacted Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300">Supporting Quantitative Evidence:</span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {(response.supporting_numbers || []).map((num, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{num}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300">Impacted Entities / Groups:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {(response.affected_entities || []).map((entity, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended HR Action Steps */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Strategic HR Recommendations:</span>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
              {(response.recommended_actions || []).map((action, idx) => (
                <p key={idx} className="text-xs text-slate-300 leading-relaxed">{action}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRCopilot;
