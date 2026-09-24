import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mirrorApi } from '../api/client';

export const HistoryPage: React.FC = () => {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calibration, setCalibration] = useState<any>(null);

  useEffect(() => {
    Promise.all([mirrorApi.getSimulations(), mirrorApi.getCalibration()])
      .then(([simsRes, calRes]) => {
        setSimulations((simsRes as any).simulations || []);
        setCalibration((calRes as any).calibrationStats || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Simulation History</h1>
          <p className="text-sm text-slate-500 mt-1">Past simulations with prediction vs. reality calibration</p>
        </div>
        <Link to="/simulate" className="text-xs font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition-colors">
          + New Simulation
        </Link>
      </div>

      {/* Calibration summary bar */}
      {calibration && (
        <div className="am-card p-4 mb-6 flex items-center gap-6">
          <div className="text-xs text-slate-500 font-medium">Model Calibration</div>
          <div className="flex items-center gap-4 text-xs">
            <span><strong className="text-emerald-600">{calibration.highAccuracyCount}</strong> High Accuracy</span>
            <span><strong className="text-blue-600">{calibration.closePredictionCount}</strong> Close</span>
            <span><strong className="text-slate-700">{calibration.totalRecords}</strong> Total</span>
          </div>
          <div className="flex-1">
            <div className="progress-bar-track">
              <div className="progress-bar-fill bg-emerald-500" style={{ width: `${calibration.aggregateAccuracyRate}%` }} />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900">{calibration.aggregateAccuracyRate}%</div>
        </div>
      )}

      {/* Table */}
      <div className="am-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Simulation</th>
                <th className="px-4 py-3 text-left">Intent</th>
                <th className="px-4 py-3 text-center">Plans</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Calibration</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : simulations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No simulations yet. <Link to="/simulate" className="text-blue-600">Run your first →</Link>
                  </td>
                </tr>
              ) : simulations.map((sim: any) => {
                const cal = sim.intent?.calibration;
                return (
                  <tr key={sim.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">{sim.simulationCode}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-medium text-slate-900 truncate max-w-[200px]">{sim.intent?.title || '—'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sim.intent?.quantity} units · ${sim.intent?.budget?.toLocaleString()} USDC</div>
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs text-slate-600">{sim.intent?.plans?.length || '—'}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`badge-${sim.status === 'COMPLETED' ? 'green' : 'slate'}`}>{sim.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {cal ? (
                        <span className={`badge-${cal.calibrationAccuracy === 'HIGH_ACCURACY' ? 'green' : cal.calibrationAccuracy === 'CLOSE_PREDICTION' ? 'blue' : 'amber'}`}>
                          {cal.calibrationAccuracy?.replace('_', ' ')}
                        </span>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{new Date(sim.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5 text-center">
                      <Link to={`/simulation/${sim.id}`} className="text-xs text-blue-600 hover:underline">View →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-3 italic text-center">All simulation figures are model-generated under stated assumptions, not real-world predictions.</p>
    </div>
  );
};
