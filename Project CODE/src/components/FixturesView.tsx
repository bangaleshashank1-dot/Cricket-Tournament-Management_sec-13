import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  Radio, 
  FileText, 
  Filter, 
  X
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Match, MatchStage } from '../types/cricket';

interface FixturesViewProps {
  setActiveTab: (tab: string) => void;
}

export const FixturesView: React.FC<FixturesViewProps> = ({ setActiveTab }) => {
  const { 
    matches, 
    teams, 
    venues, 
    createMatch, 
    generateRoundRobinFixtures, 
    setActiveMatchId,
    setSelectedScorecardMatch 
  } = useTournament();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Match Form State
  const [newTeam1, setNewTeam1] = useState(teams[0]?.id || '');
  const [newTeam2, setNewTeam2] = useState(teams[1]?.id || '');
  const [newVenue, setNewVenue] = useState(venues[0]?.id || '');
  const [newStage, setNewStage] = useState<MatchStage>('League');
  const [newDate, setNewDate] = useState('2026-03-25 19:30');
  const [newOvers, setNewOvers] = useState(20);

  const filteredMatches = matches.filter(m => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeam1 === newTeam2) {
      alert('Please choose two distinct teams!');
      return;
    }

    createMatch({
      team1Id: newTeam1,
      team2Id: newTeam2,
      venueId: newVenue,
      stage: newStage,
      matchDate: newDate,
      scheduledOvers: Number(newOvers),
      status: 'scheduled'
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Fixture Generator Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Tournament Fixtures & Match Schedule</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage league stages, generate round-robin schedules, or launch live scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={generateRoundRobinFixtures}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Generate Round Robin</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Match</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: `All Matches (${matches.length})` },
          { id: 'live', label: `🔴 Live (${matches.filter(m => m.status === 'live').length})` },
          { id: 'scheduled', label: `Upcoming (${matches.filter(m => m.status === 'scheduled').length})` },
          { id: 'completed', label: `Completed (${matches.filter(m => m.status === 'completed').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fixture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map(match => {
          const t1 = teams.find(t => t.id === match.team1Id);
          const t2 = teams.find(t => t.id === match.team2Id);
          const v = venues.find(ven => ven.id === match.venueId);

          const inn1 = match.innings[0];
          const inn2 = match.innings[1];

          return (
            <div
              key={match.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-300">Match #{match.matchNumber}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-blue-400 uppercase font-semibold text-[11px]">{match.stage}</span>
                </div>
                <div>
                  {match.status === 'live' && (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      LIVE
                    </span>
                  )}
                  {match.status === 'completed' && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      COMPLETED
                    </span>
                  )}
                  {match.status === 'scheduled' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
                      SCHEDULED
                    </span>
                  )}
                </div>
              </div>

              {/* Match Teams & Inning Totals */}
              <div className="space-y-2.5">
                {/* Team 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t1?.logoUrl}</span>
                    <span className="text-sm font-bold text-white">{t1?.name}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-200">
                    {inn1?.battingTeamId === t1?.id ? (
                      <span>{inn1.totalRuns}/{inn1.totalWickets} <span className="text-xs text-slate-400 font-normal">({inn1.oversFormatted})</span></span>
                    ) : inn2?.battingTeamId === t1?.id ? (
                      <span>{inn2.totalRuns}/{inn2.totalWickets} <span className="text-xs text-slate-400 font-normal">({inn2.oversFormatted})</span></span>
                    ) : (
                      <span className="text-slate-600 text-xs font-normal">Yet to bat</span>
                    )}
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t2?.logoUrl}</span>
                    <span className="text-sm font-bold text-white">{t2?.name}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-200">
                    {inn1?.battingTeamId === t2?.id ? (
                      <span>{inn1.totalRuns}/{inn1.totalWickets} <span className="text-xs text-slate-400 font-normal">({inn1.oversFormatted})</span></span>
                    ) : inn2?.battingTeamId === t2?.id ? (
                      <span>{inn2.totalRuns}/{inn2.totalWickets} <span className="text-xs text-slate-400 font-normal">({inn2.oversFormatted})</span></span>
                    ) : (
                      <span className="text-slate-600 text-xs font-normal">Yet to bat</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Match Details & Result */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{v?.name}, {v?.city}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{match.matchDate}</div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2">
                  {match.status === 'live' && (
                    <button
                      onClick={() => {
                        setActiveMatchId(match.id);
                        setActiveTab('scorer');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-red-600/30 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Live Scorer</span>
                    </button>
                  )}

                  {match.innings.length > 0 && (
                    <button
                      onClick={() => setSelectedScorecardMatch(match)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Scorecard</span>
                    </button>
                  )}

                  {match.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        // Start match: create empty innings 1 and set live
                        match.status = 'live';
                        if (match.innings.length === 0) {
                          match.innings.push({
                            id: `inn1_${match.id}`,
                            matchId: match.id,
                            inningsNumber: 1,
                            battingTeamId: match.team1Id,
                            bowlingTeamId: match.team2Id,
                            totalRuns: 0,
                            totalWickets: 0,
                            oversFormatted: '0.0',
                            legalBalls: 0,
                            extrasWides: 0,
                            extrasNoballs: 0,
                            extrasByes: 0,
                            extrasLegbyes: 0,
                            isCompleted: false,
                            batting: [],
                            bowling: [],
                            fallOfWickets: [],
                            deliveries: []
                          });
                        }
                        setActiveMatchId(match.id);
                        setActiveTab('scorer');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      Start Match
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCHEDULE MATCH MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Schedule New Match</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Team 1 (Home)</label>
                <select
                  value={newTeam1}
                  onChange={(e) => setNewTeam1(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Team 2 (Away)</label>
                <select
                  value={newTeam2}
                  onChange={(e) => setNewTeam2(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Venue</label>
                <select
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name}, {v.city}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as MatchStage)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="League">League</option>
                    <option value="Quarter-Final">Quarter-Final</option>
                    <option value="Semi-Final">Semi-Final</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overs / Innings</label>
                  <input
                    type="number"
                    value={newOvers}
                    onChange={(e) => setNewOvers(Number(e.target.value))}
                    min={5}
                    max={50}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Match Date & Time</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="YYYY-MM-DD HH:mm"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Save Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
