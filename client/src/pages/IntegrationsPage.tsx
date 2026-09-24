import React, { useEffect, useState } from 'react';
import { okxApi } from '../api/client';

const integrations = [
  {
    name: 'OKX AI Tool Protocol',
    key: 'OKX_AI',
    description: 'AgentMirror is registered as an OKX AI Agent service exposing simulate, challenge, and decide capabilities via the OKX Tool Protocol schema.',
    endpoints: ['POST /api/mirror/simulate', 'POST /api/mirror/generate-plans', 'POST /api/mirror/simulation/:id/what-if'],
    docs: 'https://www.okx.com/web3/build/docs/waas/introduction-to-developer-portal'
  },
  {
    name: 'OKX A2A Bus',
    key: 'OKX_A2A',
    description: 'Agent-to-Agent communication protocol enabling external agents to send intents to AgentMirror and receive structured decision responses.',
    endpoints: ['POST /api/a2a/message/:agentId', 'GET /api/a2a/agents'],
    docs: 'https://www.okx.com/web3/build/docs/waas/waas-introduction'
  },
  {
    name: 'OKX Payment SDK & Escrow',
    key: 'OKX_PAYMENT',
    description: 'Programmable escrow and payment settlement layer. After human approval, funds are locked in OKX smart escrow until delivery conditions are verified.',
    endpoints: ['POST /api/mirror/simulation/:id/execute'],
    docs: 'https://www.okx.com/web3/build/docs/waas/waas-introduction'
  },
  {
    name: 'OKX ERC-4337 Agentic Wallet',
    key: 'AGENTIC_WALLET',
    description: 'Smart account manager for autonomous spend policies. Session keys allow the simulation engine to propose executions without exposing private keys.',
    endpoints: ['POST /api/integrations/okx/wallet'],
    docs: 'https://www.okx.com/web3/build/docs/waas/waas-introduction'
  },
  {
    name: 'OKX X Layer',
    key: 'XLAYER',
    description: 'Ethereum L2 settlement chain for escrow contracts. All demo executions target X Layer Sepolia (Chain ID 195) testnet.',
    endpoints: ['https://xlayertestrpc.okx.com'],
    docs: 'https://www.okx.com/xlayer'
  }
];

const statusColors: Record<string, string> = {
  CONNECTED: 'badge-green',
  DEMO: 'badge-amber',
  DISCONNECTED: 'badge-red',
  NOT_CONFIGURED: 'badge-slate'
};

export const IntegrationsPage: React.FC = () => {
  const [statuses, setStatuses] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    okxApi.getStatus()
      .then((res: any) => {
        const map: any = {};
        (res.integrations || []).forEach((i: any) => { map[i.name] = i; });
        setStatuses(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">OKX Integrations</h1>
        <p className="text-sm text-slate-500 mt-1">AgentMirror integration status with the OKX ecosystem</p>
      </div>

      <div className="am-card p-4 mb-6 bg-amber-50/40 border-amber-100">
        <div className="flex items-start gap-2">
          <span className="badge-amber flex-shrink-0 mt-0.5">Demo Mode Active</span>
          <p className="text-xs text-slate-600">All integrations are operating via their sandbox/demo adapters. No real funds are at risk. To switch to production, configure the environment variables in <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">.env</code>.</p>
        </div>
      </div>

      <div className="space-y-4">
        {integrations.map(intg => {
          const status = statuses[intg.key];
          const connStatus = status?.connectionStatus || 'DEMO';
          return (
            <div key={intg.key} className="am-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">{intg.name}</h3>
                    <span className={statusColors[connStatus] || 'badge-slate'}>{connStatus}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{intg.description}</p>
                </div>
                {status && (
                  <div className="text-right text-xs flex-shrink-0">
                    <div className="text-slate-700 font-medium">{status.requestsHandled?.toLocaleString()}</div>
                    <div className="text-slate-400">requests</div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 mt-3">
                <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wide font-medium">Endpoints</div>
                <div className="flex flex-wrap gap-2">
                  {intg.endpoints.map(ep => (
                    <code key={ep} className="text-[11px] font-mono bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-600">{ep}</code>
                  ))}
                </div>
              </div>

              {connStatus === 'DEMO' && (
                <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                  <span>Demo adapter active.</span>
                  <a href={intg.docs} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OKX Docs →</a>
                </div>
              )}

              {status && (
                <div className="mt-2 text-[10px] text-slate-400">
                  Network: {status.network} · Environment: {status.environment}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
