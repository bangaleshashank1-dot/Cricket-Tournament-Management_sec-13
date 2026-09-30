import React, { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LiveScorer } from './components/LiveScorer';
import { FixturesView } from './components/FixturesView';
import { PointsTableView } from './components/PointsTableView';
import { LeaderboardsView } from './components/LeaderboardsView';
import { TeamsView } from './components/TeamsView';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { MatchScorecardModal } from './components/MatchScorecardModal';
import { ShieldCheck, Heart, Github } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { selectedScorecardMatch, setSelectedScorecardMatch } = useTournament();

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'scorer' && <LiveScorer />}
        {activeTab === 'fixtures' && <FixturesView setActiveTab={setActiveTab} />}
        {activeTab === 'standings' && <PointsTableView />}
        {activeTab === 'leaderboards' && <LeaderboardsView />}
        {activeTab === 'teams' && <TeamsView />}
        {activeTab === 'database' && <DatabaseSchemaView />}
      </main>

      {/* Full Match Scorecard Modal */}
      {selectedScorecardMatch && (
        <MatchScorecardModal
          match={selectedScorecardMatch}
          onClose={() => setSelectedScorecardMatch(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🏏</span>
            <span className="font-bold text-slate-300">CricPulse Pro</span>
            <span>&bull;</span>
            <span>Cricket Tournament Management & Live Engine</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <button
              onClick={() => setActiveTab('database')}
              className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
            >
              PostgreSQL / SQLite DDL
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('database')}
              className="text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              Prisma Schema
            </button>
            <span>&bull;</span>
            <span className="text-emerald-400">Strict ICC NRR Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <TournamentProvider>
      <MainLayout />
    </TournamentProvider>
  );
}

export default App;
