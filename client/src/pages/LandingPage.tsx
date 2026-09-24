import React from 'react';
import { Link } from 'react-router-dom';

const FlowStep: React.FC<{ label: string; sub?: string; highlight?: boolean }> = ({ label, sub, highlight }) => (
  <div className={`text-center ${highlight ? 'text-blue-600' : 'text-slate-600'}`}>
    <div className={`text-xs font-semibold tracking-wide uppercase ${highlight ? 'text-blue-600' : 'text-slate-500'}`}>{label}</div>
    {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
  </div>
);

const Arrow: React.FC = () => (
  <div className="text-slate-300 text-lg leading-none">↓</div>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot" />
          OKX Dev Day 2026 — Build a Company Track
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-none mb-5">
          Agent<span className="text-blue-600">Mirror</span>
        </h1>

        <p className="text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed mb-3">
          Before your agent acts, see what could happen.
        </p>
        <p className="text-sm text-slate-400 mb-10">
          Simulate. Challenge. Decide. Then act.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/simulate"
            className="px-6 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Run a Simulation
          </Link>
          <Link
            to="/simulation/sim-demo-00182"
            className="px-6 py-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-slate-400 transition-colors"
          >
            View Demo (AM-00182)
          </Link>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-slate-100" />
      </div>

      {/* ── CORE CONCEPT ────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="sim-label mb-3">Core Concept</p>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-4">
              The simulation layer<br/>between intent and action.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              AgentMirror intercepts an agent's first proposed plan and generates competing action paths. A Monte Carlo scenario engine stress-tests each path across thousands of runs. An adversarial <strong>Counter-Agent</strong> challenges every assumption. Only then is a Decision Brief generated for human approval.
            </p>
            <p className="text-sm text-slate-500 italic">
              "Don't ask an agent only what it wants to do. Ask what could happen if it does it."
            </p>
          </div>

          {/* Flow visual */}
          <div className="flex flex-col items-center gap-1.5 bg-slate-50 rounded-xl border border-slate-200 p-8">
            <FlowStep label="User Intent" />
            <Arrow />
            <FlowStep label="Primary Agent Proposes" sub="Plan A, B, C, D" />
            <Arrow />
            <FlowStep label="Simulate Futures" sub="4,000 Monte Carlo runs" highlight />
            <Arrow />
            <FlowStep label="Counter-Agent Challenges" sub="Adversarial stress tests" />
            <Arrow />
            <FlowStep label="Decision Brief" />
            <Arrow />
            <FlowStep label="Human Approval Gate" />
            <Arrow />
            <FlowStep label="Optional OKX Execution" highlight />
            <Arrow />
            <FlowStep label="Prediction vs. Reality" sub="Calibration feedback loop" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="sim-label text-center mb-8">Key Capabilities</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '⚡', title: 'Monte Carlo Engine', desc: 'Seeded deterministic simulation. 4,000 scenario runs across 5 stress conditions with P10/P50/P90 distributions.' },
              { icon: '⚔️', title: 'Counter-Agent', desc: 'An adversarial AI reviewer that challenges hidden assumptions, runs stress tests, and surfaces failure modes.' },
              { icon: '🔀', title: 'What-If Explorer', desc: 'Adjust budget, deadline, logistics reliability, or supplier capacity. The engine instantly recalculates all futures.' },
              { icon: '📊', title: 'Multi-Attribute Decision', desc: 'Configurable weight scoring across Cost, Speed, Reliability, Complexity, and Downside Exposure — not a single AI score.' },
              { icon: '🔗', title: 'OKX Integration', desc: 'Connects to OKX AI Tool Protocol, A2A Bus, Agentic Wallet, and X Layer Testnet for end-to-end execution.' },
              { icon: '📈', title: 'Calibration Loop', desc: 'Records actual outcomes against simulated predictions. Every simulation improves future model accuracy.' }
            ].map(f => (
              <div key={f.title} className="am-card p-5">
                <div className="text-xl mb-2">{f.icon}</div>
                <div className="text-sm font-semibold text-slate-900 mb-1">{f.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO SCENARIO ───────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="sim-label text-center mb-8">Demo Scenario</p>
        <div className="am-card p-6">
          <p className="text-xs text-slate-400 mb-3 font-medium">User Intent</p>
          <p className="text-lg font-semibold text-slate-900 mb-6">
            "Purchase 100 laboratory glass reactors. Budget: 10,000 USDC. Delivery within 14 days."
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { plan: 'Plan A', strategy: 'Single Source', cost: '$9,400', delivery: '12 days', success: '74%', color: 'plan-a' },
              { plan: 'Plan B', strategy: 'Expedited', cost: '$10,000', delivery: '6 days', success: '91%', color: 'plan-b', preferred: true },
              { plan: 'Plan C', strategy: 'Negotiated', cost: '$9,800', delivery: '8 days', success: '87%', color: 'plan-c' },
              { plan: 'Plan D', strategy: 'Dual Source', cost: '$9,600', delivery: '9 days', success: '82%', color: 'plan-d' }
            ].map(p => (
              <div key={p.plan} className={`${p.color} pl-3 pr-4 py-4 rounded-r-md border border-l-0 border-slate-100 relative`}>
                {p.preferred && (
                  <div className="absolute -top-2 left-2">
                    <span className="badge-green text-[10px]">Preferred</span>
                  </div>
                )}
                <div className="text-xs font-bold text-slate-900 mb-1">{p.plan}</div>
                <div className="text-[10px] text-slate-500 mb-2">{p.strategy}</div>
                <div className="text-sm font-semibold text-slate-900">{p.cost}</div>
                <div className="text-[10px] text-slate-500">{p.delivery}</div>
                <div className="text-xs font-medium text-emerald-600 mt-1">{p.success} simulated</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2">
            <span className="counter-agent-tag mt-0.5">Counter-Agent</span>
            <p className="text-xs text-slate-600">Found 3 challenges: Supplier C depends on a single logistics corridor. Plan A has 23% simulated delay risk. Plan D introduces coordination overhead.</p>
          </div>

          <div className="mt-4 flex justify-end">
            <Link to="/simulation/sim-demo-00182" className="text-xs font-medium text-blue-600 hover:underline">
              Explore full simulation →
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-400 italic">All figures are model-generated simulation outputs, not real-world predictions.</p>
        </div>
      </section>

      {/* ── CTA BOTTOM ──────────────────────────────────── */}
      <section className="border-t border-slate-100 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to simulate?</h2>
          <p className="text-sm text-slate-500 mb-8">Create an intent, generate competing plans, stress-test them with the Counter-Agent, then decide.</p>
          <Link to="/simulate" className="px-8 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
            Start a New Simulation
          </Link>
        </div>
      </section>
    </div>
  );
};
