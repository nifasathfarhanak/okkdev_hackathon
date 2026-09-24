import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mirrorApi, statsApi } from '../api/client';

export const DashboardPage: React.FC<{ sseConnected?: boolean }> = ({ sseConnected }) => {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [calibration, setCalibration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([mirrorApi.getSimulations(), mirrorApi.getCalibration()])
      .then(([simsRes, calRes]) => {
        setSimulations((simsRes as any).simulations || []);
        setCalibration((calRes as any).calibrationStats || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completed = simulations.filter((s: any) => s.intent?.actualOutcome).length;
  const pending = simulations.filter((s: any) => s.intent?.approvals?.some((a: any) => a.status === 'PENDING')).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">AgentMirror counterfactual simulation overview</p>
        </div>
        <Link to="/simulate" className="text-xs font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition-colors">
          + New Simulation
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Simulations', value: loading ? '—' : simulations.length, sub: 'All time' },
          { label: 'Calibration Rate', value: loading ? '—' : `${calibration?.aggregateAccuracyRate ?? '—'}%`, sub: 'Model accuracy' },
          { label: 'Awaiting Approval', value: loading ? '—' : pending, sub: 'Pending decisions' },
          { label: 'Actual Outcomes', value: loading ? '—' : completed, sub: 'Recorded' }
        ].map(s => (
          <div key={s.label} className="am-card p-4">
            <div className="text-2xl font-bold text-slate-900 mb-1">{s.value}</div>
            <div className="text-xs font-medium text-slate-700">{s.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Calibration Section */}
      {calibration && (
        <div className="am-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Model Calibration</h2>
            <span className="sim-label">Prediction vs. Reality</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-lg font-bold text-emerald-600">{calibration.highAccuracyCount}</div>
              <div className="text-xs text-slate-500">High Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{calibration.closePredictionCount}</div>
              <div className="text-xs text-slate-500">Close Prediction</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-700">{calibration.totalRecords}</div>
              <div className="text-xs text-slate-500">Total Records</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Aggregate Accuracy</span>
              <span className="font-medium text-slate-700">{calibration.aggregateAccuracyRate}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill bg-emerald-500" style={{ width: `${calibration.aggregateAccuracyRate}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic">All figures are model-generated calibration metrics, not guarantees of future accuracy.</p>
        </div>
      )}

      {/* Recent Simulations */}
      <div className="am-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent Simulations</h2>
          <Link to="/history" className="text-xs text-blue-600 hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-sm text-slate-400 text-center">Loading simulations...</div>
        ) : simulations.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-400 text-center">
            No simulations yet. <Link to="/simulate" className="text-blue-600 hover:underline">Run your first simulation →</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {simulations.slice(0, 8).map((sim: any) => (
              <Link
                key={sim.id}
                to={`/simulation/${sim.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors no-underline"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">{sim.simulationCode}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{sim.intent?.title || '—'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge-${sim.status === 'COMPLETED' ? 'green' : 'slate'}`}>{sim.status}</span>
                  <span className="text-xs text-slate-400">{new Date(sim.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
