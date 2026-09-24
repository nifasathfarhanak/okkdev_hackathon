import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { agentsApi } from '../api/client';

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentsApi.getAll()
      .then((res: any) => setAgents(res.agents || res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const typeColor: Record<string, string> = {
    SUPPLIER: 'badge-blue',
    LOGISTICS: 'badge-indigo',
    PAYMENT: 'badge-green',
    REVIEWER: 'badge-red',
    DATA: 'badge-amber',
    SERVICE: 'badge-slate'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agent Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Candidate agents available for simulation scenarios</p>
        </div>
        <Link to="/simulate" className="text-xs font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition-colors">
          Run Simulation
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading agents...</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {agents.map((agent: any) => (
            <Link key={agent.id} to={`/agents/${agent.id}`} className="am-card p-5 no-underline block hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{agent.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{agent.industry}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={typeColor[agent.type] || 'badge-slate'}>{agent.type}</span>
                  <span className={`badge-${agent.status === 'ACTIVE' ? 'green' : 'slate'}`}>{agent.status}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{agent.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>~{agent.avgResponseTimeMs}ms</span>
                <span>{agent.historicalReliability?.toFixed(1) ?? '—'}% reliability</span>
                <span>{agent.verificationStatus}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    agentsApi.getById(id)
      .then((res: any) => setAgent(res.agent || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-slate-400">Loading...</div>;
  if (!agent) return <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-slate-400">Agent not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/agents" className="text-xs text-blue-600 hover:underline">← Agent Registry</Link>
      </div>
      <div className="am-card p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{agent.name}</h1>
            <div className="text-xs text-slate-500 mt-1">{agent.industry} · {agent.protocol}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`badge-${agent.status === 'ACTIVE' ? 'green' : 'slate'}`}>{agent.status}</span>
            <span className="badge-blue">{agent.type}</span>
            <span className="badge-indigo">{agent.verificationStatus}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{agent.description}</p>
      </div>

      <div className="am-card p-5 mb-5">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-slate-900">{agent.avgResponseTimeMs}ms</div>
            <div className="text-xs text-slate-500">Avg Response</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-600">{agent.historicalReliability?.toFixed(1) ?? '—'}%</div>
            <div className="text-xs text-slate-500">Reliability</div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{agent.avgFulfillmentDays?.toFixed(1) ?? '—'}d</div>
            <div className="text-xs text-slate-500">Avg Fulfillment</div>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-3 italic text-center">Historical synthetic performance metrics — model generated.</p>
      </div>

      {agent.capabilities?.length > 0 && (
        <div className="am-card p-5">
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Capabilities</h2>
          <div className="space-y-2">
            {agent.capabilities.map((cap: any) => (
              <div key={cap.id} className="flex items-start gap-2">
                <span className="badge-slate mt-0.5">{cap.category}</span>
                <div>
                  <div className="text-xs font-medium text-slate-800">{cap.name}</div>
                  <div className="text-xs text-slate-500">{cap.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
