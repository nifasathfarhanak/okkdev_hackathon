import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mirrorApi } from '../api/client';

const planColor: Record<string, string> = { PLAN_A: 'plan-a', PLAN_B: 'plan-b', PLAN_C: 'plan-c', PLAN_D: 'plan-d' };
const planBg: Record<string, string> = { PLAN_A: 'bg-blue-100 text-blue-800', PLAN_B: 'bg-emerald-100 text-emerald-800', PLAN_C: 'bg-amber-100 text-amber-800', PLAN_D: 'bg-violet-100 text-violet-800' };

export const SimulationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'overview' | 'challenges' | 'whatif' | 'decision'>('overview');
  const [approving, setApproving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [approved, setApproved] = useState(false);
  const [executed, setExecuted] = useState<any>(null);

  // What-If state
  const [wiAssumptions, setWiAssumptions] = useState<any>({});
  const [wiResult, setWiResult] = useState<any>(null);
  const [wiLoading, setWiLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    mirrorApi.getSimulation(id)
      .then((res: any) => {
        setData(res);
        setWiAssumptions(res.assumptions || {});
      })
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const runWhatIf = async () => {
    if (!id) return;
    setWiLoading(true);
    try {
      const res: any = await mirrorApi.whatIf(id, { modifiedAssumptions: wiAssumptions });
      setWiResult(res.deltaResult);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setWiLoading(false);
    }
  };

  const approve = async () => {
    if (!id) return;
    setApproving(true);
    try {
      await mirrorApi.approve(id, { selectedPlanKey: data?.comparison?.preferredPlanKey, decisionNotes: 'Approved after counterfactual review.' });
      setApproved(true);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setApproving(false);
    }
  };

  const execute = async () => {
    if (!id) return;
    setExecuting(true);
    try {
      const res: any = await mirrorApi.execute(id, { planKey: data?.comparison?.preferredPlanKey });
      setExecuted(res.execution);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10 text-sm text-slate-400">Loading simulation...</div>;
  if (error) return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="am-card p-6 text-sm text-red-600">Error: {error}</div>
    </div>
  );
  if (!data) return null;

  const { simulation, plans = [], metrics = [], comparison, assumptions } = data;
  const brief = simulation?.decisionBrief;
  const challenges = simulation?.counterChallenges || [];
  const preferred = comparison?.preferredPlanKey;
  const rankedPlans = comparison?.rankedPlans || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500">{simulation?.simulationCode}</span>
            <span className="badge-green">{simulation?.status}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{simulation?.intent?.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Budget: {simulation?.intent?.currency} {simulation?.intent?.budget?.toLocaleString()} · Deadline: {simulation?.intent?.deadlineDays} days · {simulation?.iterations?.toLocaleString()} iterations · Seed: {simulation?.seed}
          </p>
        </div>
        <Link to="/simulate" className="text-xs text-blue-600 hover:underline">← New Simulation</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {([['overview', 'Overview'], ['challenges', `Counter-Agent (${challenges.length})`], ['whatif', 'What-If'], ['decision', 'Decision Brief']] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-medium px-4 py-2.5 border-b-2 transition-colors ${tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Simulation info */}
          <div className="am-card p-5">
            <p className="sim-label mb-3">Simulation Summary</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div><div className="text-xl font-bold text-slate-900">{plans.length}</div><div className="text-xs text-slate-500">Plans</div></div>
              <div><div className="text-xl font-bold text-slate-900">{(simulation?.iterations || 4000).toLocaleString()}</div><div className="text-xs text-slate-500">Iterations</div></div>
              <div><div className="text-xl font-bold text-slate-900">{challenges.length}</div><div className="text-xs text-slate-500">Challenges</div></div>
              <div><div className="text-xl font-bold text-blue-600">{preferred}</div><div className="text-xs text-slate-500">Preferred</div></div>
            </div>
          </div>

          {/* Plan Comparison Table */}
          <div className="am-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Plan Comparison</h2>
              <p className="text-xs text-slate-400 mt-0.5 italic">All figures are model-generated simulation outputs under current assumptions.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-right">Cost (Median)</th>
                    <th className="px-4 py-3 text-right">Delivery P50</th>
                    <th className="px-4 py-3 text-right">Simulated Success</th>
                    <th className="px-4 py-3 text-right">Downside</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankedPlans.map((rp: any) => {
                    const m = rp.metrics;
                    const isPreferred = rp.planKey === preferred;
                    return (
                      <tr key={rp.planKey} className={isPreferred ? 'bg-emerald-50/50' : ''}>
                        <td className="px-5 py-3.5">
                          <div className={`${planColor[rp.planKey]} pl-2.5 pr-3 py-1 rounded-r text-xs font-semibold text-slate-700 border-l-0 border border-slate-100 inline-block`}>
                            {rp.planKey.replace('_', ' ')}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">{rp.planName.split(':')[1]?.trim() || rp.planName}</div>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-xs">${m?.costP50?.toLocaleString() ?? '—'}</td>
                        <td className="px-4 py-3.5 text-right text-xs">{m?.deliveryDaysP50 ?? '—'}d</td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`text-xs font-semibold ${m?.simulatedSuccessPct >= 90 ? 'text-emerald-600' : m?.simulatedSuccessPct >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                            {m?.simulatedSuccessPct ?? '—'}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-xs text-red-500">{m?.downsideRiskScore?.toFixed(1) ?? '—'}</td>
                        <td className="px-4 py-3.5 text-right font-bold text-sm text-slate-900">{rp.compositeScore}</td>
                        <td className="px-4 py-3.5 text-center">
                          {isPreferred ? <span className="badge-green">Preferred</span> : <span className="badge-slate">Evaluated</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* P10/P50/P90 distributions */}
          {metrics.map((m: any) => (
            <div key={m.planKey} className={`am-card p-4 ${planColor[m.planKey]}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${planBg[m.planKey]}`}>{m.planKey.replace('_', ' ')}</span>
                <span className="text-xs text-slate-500">{m.planName}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div className="bg-slate-50 rounded p-3">
                  <div className="font-bold text-slate-900">{m.deliveryDaysP10}d</div>
                  <div className="text-slate-400 mt-0.5">P10 delivery</div>
                </div>
                <div className="bg-blue-50 rounded p-3">
                  <div className="font-bold text-blue-700">{m.deliveryDaysP50}d</div>
                  <div className="text-slate-400 mt-0.5">P50 delivery</div>
                </div>
                <div className="bg-amber-50 rounded p-3">
                  <div className="font-bold text-amber-700">{m.deliveryDaysP90}d</div>
                  <div className="text-slate-400 mt-0.5">P90 delivery</div>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-500">
                <span>Success: <strong className="text-emerald-600">{m.simulatedSuccessPct}%</strong></span>
                <span>Delay: <strong className="text-amber-600">{m.simulatedDelayPct}%</strong></span>
                <span>Failure: <strong className="text-red-500">{m.simulatedFailurePct}%</strong></span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 italic">Simulated distribution under current model assumptions.</p>
            </div>
          ))}

          {/* Preferred explanation */}
          {comparison?.explanation && (
            <div className="am-card p-5 bg-emerald-50/40 border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="primary-agent-tag">Primary Agent</span>
                <span className="text-xs text-slate-500">Recommendation under current weighting</span>
              </div>
              <p className="text-sm text-slate-700">{comparison.explanation}</p>
            </div>
          )}

          {/* Approval & Execute */}
          <div className="am-card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Human Approval Gate</h3>
            <p className="text-xs text-slate-500 mb-4">Review the decision brief and counter-agent challenges before approving execution.</p>
            <div className="flex gap-3">
              {!approved && (
                <button
                  onClick={approve}
                  disabled={approving}
                  className="text-xs font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {approving ? 'Processing...' : `Approve ${preferred}`}
                </button>
              )}
              {approved && !executed && (
                <button
                  onClick={execute}
                  disabled={executing}
                  className="text-xs font-medium px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {executing ? 'Executing...' : 'Execute via OKX Adapter'}
                </button>
              )}
              {approved && <span className="badge-green text-xs py-2">Approved ✓</span>}
            </div>
            {executed && (
              <div className="mt-4 p-3 rounded bg-emerald-50 border border-emerald-100 text-xs">
                <div className="font-semibold text-emerald-700 mb-1">Execution Completed (Demo Adapter)</div>
                <div className="text-slate-600">Amount: ${executed.amount?.toLocaleString()} USDC</div>
                <div className="text-slate-600">Network: {executed.network}</div>
                <div className="text-slate-500 mt-1 font-mono truncate">{executed.txHash}</div>
                <p className="text-[10px] text-slate-400 mt-1 italic">Simulated execution via OKX_AGENTIC_WALLET_DEMO adapter. Not a real blockchain transaction.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHALLENGES TAB ────────────────────────────── */}
      {tab === 'challenges' && (
        <div className="space-y-4">
          <div className="am-card p-4 bg-red-50/30 border-red-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="counter-agent-tag">Counter-Agent</span>
              <span className="text-xs text-slate-500">Adversarial Decision Reviewer</span>
            </div>
            <p className="text-xs text-slate-600">System role: Find reasons why the proposed action could fail. Identify hidden assumptions, constraint violations, timing risks, and correlated failure modes.</p>
          </div>

          {challenges.length === 0 ? (
            <div className="am-card p-8 text-center text-slate-400 text-sm">No counter-agent challenges recorded for this simulation.</div>
          ) : challenges.map((c: any, i: number) => (
            <div key={c.id} className="am-card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="counter-agent-tag">Challenge #{c.challengeNumber || i + 1}</span>
                    <span className={`badge-${c.severity === 'CRITICAL' || c.severity === 'HIGH' ? 'red' : c.severity === 'MEDIUM' ? 'amber' : 'slate'}`}>{c.severity}</span>
                    <span className="badge-blue">{c.planId ? plans.find((p: any) => p.id === c.planId)?.planKey?.replace('_', ' ') || 'PLAN' : ''}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{c.title}</h3>
                </div>
                <span className="badge-slate flex-shrink-0">{c.status}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 rounded p-3">
                  <div className="font-medium text-slate-600 mb-1">Challenged Assumption</div>
                  <div className="text-slate-700">{c.assumption}</div>
                </div>
                <div className="bg-red-50 rounded p-3">
                  <div className="font-medium text-red-600 mb-1">Evidence</div>
                  <div className="text-slate-700">{c.evidence}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 rounded p-3">
                    <div className="font-medium text-amber-700 mb-1">Stress Test</div>
                    <div className="text-slate-700">{c.stressTestName}</div>
                    <div className="text-amber-700 font-medium mt-1">{c.stressTestDelta}</div>
                  </div>
                  <div className="bg-emerald-50 rounded p-3">
                    <div className="font-medium text-emerald-700 mb-1">Mitigation</div>
                    <div className="text-slate-700">{c.mitigation}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── WHAT-IF TAB ───────────────────────────────── */}
      {tab === 'whatif' && (
        <div className="space-y-5">
          <div className="am-card p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">What-If Explorer</h2>
            <p className="text-xs text-slate-400 mb-4">Adjust assumptions and click Re-run to see how the counterfactual distributions shift.</p>

            <div className="space-y-4">
              {[
                { key: 'budgetLimit', label: 'Budget (USDC)', min: 5000, max: 20000, unit: '' },
                { key: 'deadlineDays', label: 'Deadline (days)', min: 3, max: 30, unit: ' days' },
                { key: 'supplierDelayProb', label: 'Supplier Delay Probability', min: 0, max: 50, unit: '%' },
                { key: 'priceVolatility', label: 'Price Volatility Band', min: 0, max: 30, unit: '%' },
                { key: 'logisticsReliability', label: 'Logistics Reliability', min: 50, max: 100, unit: '%' }
              ].map(f => (
                <div key={f.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{f.label}</span>
                    <span className="font-medium text-slate-900">{wiAssumptions[f.key] ?? assumptions?.[f.key] ?? '—'}{f.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    value={wiAssumptions[f.key] ?? assumptions?.[f.key] ?? (f.min + f.max) / 2}
                    onChange={e => setWiAssumptions((p: any) => ({ ...p, [f.key]: Number(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={runWhatIf}
              disabled={wiLoading}
              className="mt-5 w-full py-2.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {wiLoading ? 'Recalculating futures...' : 'Re-run Futures'}
            </button>
          </div>

          {/* What-If Results */}
          {wiResult && (
            <div className="space-y-4">
              <div className="am-card p-4 bg-blue-50/40 border-blue-100">
                <p className="text-xs text-blue-700 font-medium mb-1">What-If Result</p>
                <p className="text-xs text-slate-700">{wiResult.explanation}</p>
                {wiResult.preferenceChanged && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="badge-amber">Preference Changed!</span>
                    <span className="text-slate-600">{wiResult.preferredPlanBefore} → {wiResult.preferredPlanAfter}</span>
                  </div>
                )}
              </div>

              <div className="am-card overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 text-xs font-semibold text-slate-700">Before vs. After Comparison</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Plan</th>
                        <th className="px-4 py-3 text-right">Success Before</th>
                        <th className="px-4 py-3 text-right">Success After</th>
                        <th className="px-4 py-3 text-right">Δ Success</th>
                        <th className="px-4 py-3 text-right">Delivery P50 Δ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wiResult.planDeltas?.map((d: any) => (
                        <tr key={d.planKey}>
                          <td className="px-4 py-3 font-medium text-slate-900">{d.planKey.replace('_', ' ')}</td>
                          <td className="px-4 py-3 text-right">{d.successRateBefore}%</td>
                          <td className="px-4 py-3 text-right font-semibold">{d.successRateAfter}%</td>
                          <td className={`px-4 py-3 text-right font-semibold ${d.successRateDelta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {d.successRateDelta >= 0 ? '+' : ''}{d.successRateDelta}%
                          </td>
                          <td className={`px-4 py-3 text-right ${d.deliveryP50Delta > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {d.deliveryP50Delta >= 0 ? '+' : ''}{d.deliveryP50Delta}d
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center italic">Model-generated counterfactual comparison. Not a real-world forecast.</p>
            </div>
          )}
        </div>
      )}

      {/* ── DECISION BRIEF TAB ────────────────────────── */}
      {tab === 'decision' && brief && (
        <div className="space-y-5">
          <div className="am-card p-5 border-emerald-100 bg-emerald-50/30">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Decision Brief</h2>
              <span className="badge-green">Score: {brief.overallScore}/100</span>
            </div>
            <p className="text-sm text-slate-700 mb-3">{brief.intentSummary}</p>
            <div className="font-medium text-sm text-slate-900">Proposed Action: <span className="text-emerald-700">{brief.proposedAction}</span></div>
          </div>

          {/* Score breakdown */}
          <div className="am-card p-5">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-4">Decision Score Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Cost Efficiency', value: brief.costScore, color: 'bg-blue-500' },
                { label: 'Speed', value: brief.speedScore, color: 'bg-emerald-500' },
                { label: 'Reliability', value: brief.reliabilityScore, color: 'bg-indigo-500' },
                { label: 'Complexity', value: brief.complexityScore, color: 'bg-violet-500' },
                { label: 'Downside Protection', value: brief.downsideScore, color: 'bg-amber-500' }
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{s.label}</span>
                    <span className="font-medium text-slate-900">{s.value}/100</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${s.color}`} style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key sections */}
          {[
            { label: 'Key Assumptions', json: brief.keyAssumptionsJson, tag: 'MODEL ASSUMPTION' },
            { label: 'Counter-Agent Challenges', json: brief.counterChallengesJson, tag: 'ADVERSARIAL' },
            { label: 'Mitigations', json: brief.mitigationsJson, tag: 'MITIGATION' }
          ].map(section => {
            let items: string[] = [];
            try { items = JSON.parse(section.json || '[]'); } catch (e) {}
            return (
              <div key={section.label} className="am-card p-5">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">{section.label}</h3>
                <ul className="space-y-1.5">
                  {items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="badge-slate flex-shrink-0 mt-0.5">{section.tag}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="am-card p-5">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Reasoning</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{brief.reasoning}</p>
            {brief.requiresHumanApproval && (
              <div className="mt-3 badge-amber">Human Approval Required</div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 italic text-center">This Decision Brief was generated by AgentMirror's simulation engine under stated model assumptions. It is not a guarantee of any real-world outcome.</p>
        </div>
      )}

      {tab === 'decision' && !brief && (
        <div className="am-card p-8 text-center text-slate-400 text-sm">No decision brief found for this simulation.</div>
      )}
    </div>
  );
};
