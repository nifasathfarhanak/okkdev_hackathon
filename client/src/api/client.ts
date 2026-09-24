const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...((opts.headers as any) || {}) },
    ...opts
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Mirror / AgentMirror Core API ─────────────────────────────────────────

export const mirrorApi = {
  generatePlans: (body: any) => request('/api/mirror/generate-plans', { method: 'POST', body: JSON.stringify(body) }),
  simulate: (body: any) => request('/api/mirror/simulate', { method: 'POST', body: JSON.stringify(body) }),
  getSimulations: () => request<any>('/api/mirror/simulations'),
  getSimulation: (id: string) => request<any>(`/api/mirror/simulation/${id}`),
  whatIf: (id: string, body: any) => request<any>(`/api/mirror/simulation/${id}/what-if`, { method: 'POST', body: JSON.stringify(body) }),
  approve: (id: string, body: any) => request<any>(`/api/mirror/simulation/${id}/approve`, { method: 'POST', body: JSON.stringify(body) }),
  execute: (id: string, body: any) => request<any>(`/api/mirror/simulation/${id}/execute`, { method: 'POST', body: JSON.stringify(body) }),
  recordOutcome: (id: string, body: any) => request<any>(`/api/mirror/simulation/${id}/outcome`, { method: 'POST', body: JSON.stringify(body) }),
  getCalibration: () => request<any>('/api/mirror/calibration')
};

// ─── Agents ────────────────────────────────────────────────────────────────
export const agentsApi = {
  getAll: () => request<any>('/api/agents'),
  getById: (id: string) => request<any>(`/api/agents/${id}`)
};

// ─── Activity ──────────────────────────────────────────────────────────────
export const activityApi = {
  getAll: () => request<any>('/api/activity')
};

// ─── Stats ─────────────────────────────────────────────────────────────────
export const statsApi = {
  get: () => request<any>('/api/stats')
};

// ─── OKX Integrations ──────────────────────────────────────────────────────
export const okxApi = {
  getStatus: () => request<any>('/api/integrations/okx/status')
};

// ─── A2A ───────────────────────────────────────────────────────────────────
export const a2aApi = {
  getAgents: () => request<any>('/api/a2a/agents'),
  message: (agentId: string, body: any) => request<any>(`/api/a2a/message/${agentId}`, { method: 'POST', body: JSON.stringify(body) })
};
