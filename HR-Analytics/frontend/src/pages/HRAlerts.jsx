import React, { useEffect, useState } from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchHRAlerts } from '../services/api';

const HRAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRAlerts()
      .then((res) => {
        setAlerts(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching HR alerts:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Real-time HR Early Warning System...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">HR Early Warning & Anomaly Alert Stream</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated anomaly detection stream monitoring turnover spikes, overtime thresholds, and promotion queues.
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800">
            {alerts.length} Active Early Warnings
          </span>
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          let badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
          let icon = <ShieldAlert className="w-5 h-5 text-rose-400" />;
          let borderAccent = 'border-rose-500/30 bg-rose-500/5';

          if (alert.severity === 'WARNING') {
            badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
            icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
            borderAccent = 'border-amber-500/30 bg-amber-500/5';
          } else if (alert.severity === 'INFO') {
            badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
            borderAccent = 'border-emerald-500/30 bg-emerald-500/5';
          }

          return (
            <div
              key={alert.id}
              className={`glass-card p-5 rounded-2xl border transition-all duration-300 ${borderAccent} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0 mt-0.5">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-extrabold text-slate-100">{alert.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeColor}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{alert.description}</p>
                  <p className="text-[11px] text-teal-400 italic mt-2">
                    Recommended Action: {alert.action}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                <span className="font-mono text-sm font-bold text-slate-200">{alert.metric}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">ID: {alert.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HRAlerts;
