import React from 'react';
import { 
  Trophy, 
  LayoutDashboard, 
  Radio, 
  CalendarDays, 
  TableProperties, 
  Award, 
  Users, 
  Database,
  ChevronDown
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { tournaments, activeTournament, setActiveTournamentId, activeMatch, teams } = useTournament();

  const liveInning = activeMatch?.innings.find(i => !i.isCompleted) || activeMatch?.innings[activeMatch.innings.length - 1];
  const battingTeam = teams.find(t => t.id === liveInning?.battingTeamId);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scorer', label: 'Live Scorer', icon: Radio, isLiveBadge: activeMatch?.status === 'live' },
    { id: 'fixtures', label: 'Fixtures & Schedule', icon: CalendarDays },
    { id: 'standings', label: 'Points Table', icon: TableProperties },
    { id: 'leaderboards', label: 'Leaderboards', icon: Award },
    { id: 'teams', label: 'Teams & Squads', icon: Users },
    { id: 'database', label: 'Database Design', icon: Database, badge: 'SQL/Prisma' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner with Brand and Live Ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
                  CricPulse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400">Tournament Management System</p>
            </div>
          </div>

          {/* Center: Live Match Ticker (if live match exists) */}
          {activeMatch && activeMatch.status === 'live' && liveInning && (
            <div 
              onClick={() => setActiveTab('scorer')}
              className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-red-500/30 hover:border-red-500/60 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="tracking-wide uppercase">LIVE MATCH</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-700"></div>
              <div className="text-xs font-medium text-slate-300">
                <span className="font-bold text-white">{battingTeam?.shortName}</span>{' '}
                <span className="text-amber-400 font-bold">{liveInning.totalRuns}/{liveInning.totalWickets}</span>{' '}
                <span className="text-slate-400">({liveInning.oversFormatted} ov)</span>
              </div>
              <span className="text-[11px] text-blue-400 group-hover:underline font-medium">
                Open Scorer &rarr;
              </span>
            </div>
          )}

          {/* Right: Tournament Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative inline-block text-left">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200">
                <Trophy className="w-4 h-4 text-amber-400" />
                <select
                  value={activeTournament?.id}
                  onChange={(e) => setActiveTournamentId(e.target.value)}
                  className="bg-transparent border-none text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-2"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.isLiveBadge && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                )}
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-blue-400 border border-blue-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
