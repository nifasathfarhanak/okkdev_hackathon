import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { useSSE } from './hooks/useSSE';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SimulatePage } from './pages/SimulatePage';
import { SimulationPage } from './pages/SimulationPage';
import { HistoryPage } from './pages/HistoryPage';
import { AgentsPage, AgentDetailPage } from './pages/AgentsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { HackathonPage } from './pages/HackathonPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { connected } = useSSE();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        <Navbar sseConnected={connected} />

        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage sseConnected={connected} />} />
            <Route path="/simulate" element={<SimulatePage />} />
            <Route path="/simulation/:id" element={<SimulationPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/:id" element={<AgentDetailPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/hackathon" element={<HackathonPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Legacy / redirect aliases */}
            <Route path="/api" element={<DeveloperPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};
