import React, { useState } from 'react';
import { Settings, RefreshCw, Upload, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { trainModels, uploadDatasetCSV } from '../services/api';

const SettingsPage = () => {
  const [training, setTraining] = useState(false);
  const [trainResult, setTrainResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleTrain = async () => {
    setTraining(true);
    try {
      const res = await trainModels();
      setTrainResult(res);
    } catch (err) {
      console.error('Training Error:', err);
    } finally {
      setTraining(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadDatasetCSV(file);
      setUploadStatus(res);
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ML Retraining Control Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Retrain Machine Learning Models</h3>
              <p className="text-xs text-slate-400">Triggers Logistic Regression, Decision Tree, Random Forest & XGBoost training</p>
            </div>
          </div>
          <button
            onClick={handleTrain}
            disabled={training}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${training ? 'animate-spin' : ''}`} />
            {training ? 'Training Pipeline Running...' : 'Train ML Pipeline'}
          </button>
        </div>

        {trainResult && (
          <div className="p-4 bg-slate-900/80 rounded-xl border border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <CheckCircle className="w-4 h-4" />
              <span>Best Selected Classifier: {trainResult.best_model}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-2">Model</th>
                    <th className="p-2">Accuracy</th>
                    <th className="p-2">Precision</th>
                    <th className="p-2">Recall</th>
                    <th className="p-2">F1 Score</th>
                    <th className="p-2">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {Object.entries(trainResult.comparison || {}).map(([name, m]) => (
                    <tr key={name} className={name === trainResult.best_model ? 'bg-purple-500/10 font-bold text-purple-300' : ''}>
                      <td className="p-2">{name}</td>
                      <td className="p-2">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="p-2">{(m.precision * 100).toFixed(1)}%</td>
                      <td className="p-2">{(m.recall * 100).toFixed(1)}%</td>
                      <td className="p-2">{(m.f1_score * 100).toFixed(1)}%</td>
                      <td className="p-2">{(m.roc_auc * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Dataset Upload & Database Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Dataset */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Import Employee CSV</h4>
              <p className="text-[11px] text-slate-400">ETL pipeline cleans and updates backend store</p>
            </div>
          </div>

          <label className="block w-full cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-center text-xs text-slate-300 transition">
              {uploading ? 'Processing File...' : 'Click to Browse IBM HR CSV File'}
            </div>
          </label>

          {uploadStatus && (
            <p className="text-xs text-emerald-400 font-semibold">{uploadStatus.message}</p>
          )}
        </div>

        {/* Database Status */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Database Connection</h4>
              <p className="text-[11px] text-slate-400">PostgreSQL / SQLite Storage Engine</p>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Status:</span>
              <strong className="text-emerald-400">Connected (Active)</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Target Schema:</span>
              <strong className="font-mono text-slate-200">hr_analytics</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
