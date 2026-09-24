import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Workflow, 
  Wallet, 
  Layers, 
  ShieldCheck, 
  Play, 
  FileCode2, 
  Zap, 
  Radio,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';

export const OkxIntegrationPage: React.FC = () => {
  const [statusData, setStatusData] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('discover_agents');
  const [toolParams, setToolParams] = useState<string>(
    JSON.stringify({ requirement: 'Laboratory Glass Reactor', budget: 10000, deadlineDays: 14 }, null, 2)
  );
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOkxStatus(), api.getOkxTools()])
      .then(([status, toolsRes]) => {
        setStatusData(status);
        setTools(toolsRes.tools || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToolChange = (toolName: string) => {
    setSelectedTool(toolName);
    if (toolName === 'discover_agents') {
      setToolParams(JSON.stringify({ requirement: 'Laboratory Glass Reactor', budget: 10000, deadlineDays: 14 }, null, 2));
    } else if (toolName === 'get_reputation') {
      setToolParams(JSON.stringify({ agentId: 'agent-precisionlab-02' }, null, 2));
    } else if (toolName === 'negotiate') {
      setToolParams(JSON.stringify({ dealId: 'deal-sample', agentId: 'agent-precisionlab-02', targetPrice: 10000 }, null, 2));
    } else if (toolName === 'create_deal') {
      setToolParams(JSON.stringify({ title: 'HPLC Acetonitrile Solvents', quantity: 50, budget: 8500 }, null, 2));
    }
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    try {
      const parsed = JSON.parse(toolParams);
      const res = await api.executeOkxTool(selectedTool, parsed);
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({ error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading OKX Integration Diagnostics...</span>
        </div>
      </div>
    );
  }

  const modules = statusData?.modules;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">OKX Ecosystem Integrations & Diagnostics</h1>
          </div>
          <Badge variant="emerald">OKX DEV DAY 2026: TRACK 1</Badge>
        </div>
        <p className="text-xs text-slate-400">
          Core architectural integration layer connecting DealMesh to OKX AI Tools, A2A Agent Mesh, Payment SDK, Agentic Wallets, and X Layer L2 settlement.
        </p>
      </div>

      {/* 5 Component Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module 1: OKX AI */}
        <div className="glass-panel p-5 rounded-3xl border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>OKX AI Tool Bridge</span>
            </div>
            <Badge variant="emerald">ACTIVE</Badge>
          </div>
          <p className="text-xs text-slate-300">
            Exposes 7 typed function-calling schemas allowing OKX AI Agents to discover suppliers and negotiate.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Endpoint: <span className="text-emerald-300">{modules?.okxAi?.endpoint}</span></div>
            <div>Mode: <span className="text-white">{modules?.okxAi?.mode}</span></div>
          </div>
        </div>

        {/* Module 2: A2A */}
        <div className="glass-panel p-5 rounded-3xl border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Workflow className="w-4 h-4 text-blue-400" />
              <span>OKX A2A Protocol Bus</span>
            </div>
            <Badge variant="blue">ACTIVE</Badge>
          </div>
          <p className="text-xs text-slate-300">
            Standardized agent-to-agent message transport with typed schemas for quotes and counter-offers.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Protocol: <span className="text-blue-300">OKX-A2A/1.0</span></div>
            <div>Bus: <span className="text-white">OKX Agent Mesh v1.0</span></div>
          </div>
        </div>

        {/* Module 3: Payment SDK */}
        <div className="glass-panel p-5 rounded-3xl border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>OKX Payment SDK</span>
            </div>
            <Badge variant="purple">ACTIVE</Badge>
          </div>
          <p className="text-xs text-slate-300">
            Payment provider abstraction with escrow lock and conditional delivery release.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Provider: <span className="text-purple-300">{modules?.payment?.activeProvider}</span></div>
            <div>Tokens: <span className="text-white">USDC, USDT, OKB</span></div>
          </div>
        </div>

        {/* Module 4: Agentic Wallet */}
        <div className="glass-panel p-5 rounded-3xl border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Wallet className="w-4 h-4 text-teal-400" />
              <span>Agentic Smart Account</span>
            </div>
            <Badge variant="emerald">ERC-4337</Badge>
          </div>
          <p className="text-xs text-slate-300">
            Enforces $0 autonomous spending ceiling for guaranteed human-in-the-loop transaction authorization.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Policy: <span className="text-teal-300">Human Approval Gate Enforced</span></div>
            <div>Keys: <span className="text-white">Zero Private Key Custody</span></div>
          </div>
        </div>

        {/* Module 5: X Layer */}
        <div className="glass-panel p-5 rounded-3xl border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>OKX X Layer (L2 ZK)</span>
            </div>
            <Badge variant="amber">CHAIN 195</Badge>
          </div>
          <p className="text-xs text-slate-300">
            High-speed ZK-rollup settlement layer with transparent testnet RPC and verified escrow contracts.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Network: <span className="text-amber-300">X Layer Sepolia</span></div>
            <div>Escrow: <span className="text-white">0x32A4...1F4B</span></div>
          </div>
        </div>

      </div>

      {/* Interactive Tool Calling Tester Console */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">Interactive OKX AI Tool Execution Console</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live Tester</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tool Selector & Input */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Select OKX AI Registered Tool:</label>
              <select
                value={selectedTool}
                onChange={(e) => handleToolChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
              >
                {tools.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} — {t.description.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tool Parameters (JSON):</label>
              <textarea
                rows={6}
                value={toolParams}
                onChange={(e) => setToolParams(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none resize-none"
              />
            </div>

            <button
              onClick={handleExecuteTool}
              disabled={isExecuting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              {isExecuting ? 'Invoking Tool in OKX AI Registry...' : `Execute ${selectedTool}()`}
            </button>
          </div>

          {/* Response Payload Viewer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Execution Result (OKX AI Schema):</label>
            <div className="h-[280px] bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-200">
              {executionResult ? (
                <pre>{JSON.stringify(executionResult, null, 2)}</pre>
              ) : (
                <span className="text-slate-500 italic">Click Execute to trigger live tool handler...</span>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
