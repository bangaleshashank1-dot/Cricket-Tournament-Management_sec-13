import React from 'react';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Radio, 
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { 
    activeTournament, 
    matches, 
    teams, 
    venues, 
    standings, 
    setActiveMatchId, 
    setSelectedScorecardMatch 
  } = useTournament();

  const liveMatch = matches.find(m => m.status === 'live') || matches[1];
  const completedMatches = matches.filter(m => m.status === 'completed');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled');

  // Live match details
  const team1 = teams.find(t => t.id === liveMatch?.team1Id);
  const team2 = teams.find(t => t.id === liveMatch?.team2Id);
  const liveVenue = venues.find(v => v.id === liveMatch?.venueId);
  const liveInning = liveMatch?.innings[liveMatch.innings.length - 1];
  const battingTeam = liveInning?.battingTeamId === team1?.id ? team1 : team2;
  const bowlingTeam = liveInning?.bowlingTeamId === team1?.id ? team1 : team2;

  // Active striker & bowler
  const strikerCard = liveInning?.batting.find(b => b.playerId === liveMatch?.activeStrikerId);
  const nonStrikerCard = liveInning?.batting.find(b => b.playerId === liveMatch?.activeNonStrikerId);
  const bowlerCard = liveInning?.bowling.find(b => b.playerId === liveMatch?.activeBowlerId);

  // Recent balls from live match
  const recentBalls = liveInning?.deliveries.slice(0, 6).reverse() || [];

  // Total tournament stats calculation
  const totalRuns = matches.reduce((sum, m) => {
    return sum + m.innings.reduce((iSum, inn) => iSum + inn.totalRuns, 0);
  }, 0);

  const totalSixes = matches.reduce((sum, m) => {
    return sum + m.innings.reduce((iSum, inn) => {
      return iSum + inn.batting.reduce((bSum, b) => bSum + b.sixes, 0);
    }, 0);
  }, 0);

  const totalWickets = matches.reduce((sum, m) => {
    return sum + m.innings.reduce((iSum, inn) => iSum + inn.totalWickets, 0);
  }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Tournament Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 sm:p-8">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Tournament Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {activeTournament?.name || 'Cricket Tournament'}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Real-time ball-by-ball scoring, dynamic Net Run Rate (NRR) standings, squad roster management, and relational database engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (liveMatch) {
                  setActiveMatchId(liveMatch.id);
                  setActiveTab('scorer');
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Live Scoring Console</span>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Explore DB Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Match Spotlight Card */}
      {liveMatch && (
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-[#0A0F1D] p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                LIVE NOW
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Match #{liveMatch.matchNumber} • {liveMatch.stage}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{liveVenue?.name}, {liveVenue?.city}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
            {/* Teams & Score */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{battingTeam?.logoUrl}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {battingTeam?.name}
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Batting
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">Toss won by {liveMatch.tossWinnerId === battingTeam?.id ? battingTeam?.shortName : bowlingTeam?.shortName} (chose to {liveMatch.tossDecision})</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
                    {liveInning?.totalRuns}/{liveInning?.totalWickets}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {liveInning?.oversFormatted} / {liveMatch.scheduledOvers} ov
                  </div>
                </div>
              </div>

              {/* Bowling Team Banner */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{bowlingTeam?.logoUrl}</span>
                  <span className="text-sm font-semibold text-slate-300">{bowlingTeam?.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  CRR: {(liveInning && Number(liveInning.oversFormatted) > 0 ? (liveInning.totalRuns / (Math.floor(liveInning.legalBalls / 6) + (liveInning.legalBalls % 6) / 6)).toFixed(2) : '0.00')}
                </span>
              </div>

              {/* Recent Balls Timeline */}
              {recentBalls.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 uppercase font-medium">This Over:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {recentBalls.map((b, idx) => (
                      <span
                        key={idx}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                          b.isWicket
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                            : b.runsBat === 6
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : b.runsBat === 4
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                            : b.extrasType !== 'NONE'
                            ? 'bg-amber-600 text-white'
                            : b.runsBat === 0
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-slate-800 text-white border border-slate-700'
                        }`}
                      >
                        {b.isWicket ? 'W' : b.extrasType === 'WIDE' ? 'Wd' : b.extrasType === 'NO_BALL' ? 'Nb' : b.runsBat === 0 ? '•' : b.runsBat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Players & Key Stats */}
            <div className="lg:col-span-6 bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Batter 1 */}
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      🏏 {strikerCard?.playerName || 'Striker'} *
                    </span>
                    <span className="text-[10px] text-amber-400 uppercase font-bold">On Strike</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {strikerCard?.runs || 0} <span className="text-xs text-slate-400 font-normal">({strikerCard?.balls || 0}b)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    4s: {strikerCard?.fours || 0} | 6s: {strikerCard?.sixes || 0} | SR: {strikerCard?.strikeRate || 0}
                  </div>
                </div>

                {/* Batter 2 */}
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 mb-1 font-semibold text-slate-300">
                    {nonStrikerCard?.playerName || 'Non-Striker'}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {nonStrikerCard?.runs || 0} <span className="text-xs text-slate-400 font-normal">({nonStrikerCard?.balls || 0}b)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    4s: {nonStrikerCard?.fours || 0} | 6s: {nonStrikerCard?.sixes || 0} | SR: {nonStrikerCard?.strikeRate || 0}
                  </div>
                </div>
              </div>

              {/* Bowler Card */}
              {bowlerCard && (
                <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400">Current Bowler:</span>{' '}
                    <span className="font-bold text-white">{bowlerCard.playerName}</span>
                  </div>
                  <div className="font-mono text-slate-300">
                    <span className="text-amber-400 font-bold">{bowlerCard.wickets}/{bowlerCard.runsConceded}</span>{' '}
                    <span className="text-slate-400">({bowlerCard.oversBowled} ov)</span> • Econ: {bowlerCard.economyRate}
                  </div>
                </div>
              )}

              {/* Action CTAs */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    setActiveMatchId(liveMatch.id);
                    setActiveTab('scorer');
                  }}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Launch Live Scorer</span>
                </button>
                <button
                  onClick={() => setSelectedScorecardMatch(liveMatch)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
                >
                  Full Scorecard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{teams.length}</div>
            <div className="text-xs text-slate-400">Franchises Enlisted</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalRuns}</div>
            <div className="text-xs text-slate-400">Total Runs Scored</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalSixes}</div>
            <div className="text-xs text-slate-400">Total Sixes Hit</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalWickets}</div>
            <div className="text-xs text-slate-400">Wickets Fallen</div>
          </div>
        </div>
      </div>

      {/* Tournament Leaders Spotlight & Quick Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orange Cap (Most Runs) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Orange Cap Leader</h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-semibold">Most Runs</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
              👑
            </div>
            <div>
              <div className="text-lg font-bold text-white">Suryakumar Yadav</div>
              <div className="text-xs text-slate-400">Mumbai Titans</div>
              <div className="flex items-center gap-3 mt-1.5 font-mono text-xs">
                <span className="text-amber-400 font-bold text-base">76 runs</span>
                <span className="text-slate-400">38 balls</span>
                <span className="text-emerald-400">SR: 200.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purple Cap (Most Wickets) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Purple Cap Leader</h3>
            </div>
            <span className="text-[11px] font-mono text-purple-400 font-semibold">Most Wickets</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-3xl shadow-inner">
              ⚡
            </div>
            <div>
              <div className="text-lg font-bold text-white">Jasprit Bumrah</div>
              <div className="text-xs text-slate-400">Mumbai Titans</div>
              <div className="flex items-center gap-3 mt-1.5 font-mono text-xs">
                <span className="text-purple-400 font-bold text-base">3 wickets</span>
                <span className="text-slate-400">4.0 ov</span>
                <span className="text-blue-400">Econ: 5.50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Standings Widget */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Standings Snapshot</h3>
              <button
                onClick={() => setActiveTab('standings')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Full Table</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {standings.slice(0, 3).map((st, idx) => {
                const team = teams.find(t => t.id === st.teamId);
                return (
                  <div
                    key={st.teamId}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-bold w-4">{idx + 1}</span>
                      <span className="text-base">{team?.logoUrl}</span>
                      <span className="font-semibold text-slate-200">{team?.shortName}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-slate-400">P: {st.matchesPlayed}</span>
                      <span className="text-slate-400">W: {st.won}</span>
                      <span className="font-bold text-amber-400">{st.points} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-800/60 mt-3">
            Top 2 teams qualify directly for Qualifier 1
          </div>
        </div>
      </div>

      {/* Upcoming Fixtures Quick List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Upcoming Fixtures</span>
          </h3>
          <button
            onClick={() => setActiveTab('fixtures')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingMatches.slice(0, 2).map((m) => {
            const t1 = teams.find(t => t.id === m.team1Id);
            const t2 = teams.find(t => t.id === m.team2Id);
            const v = venues.find(ven => ven.id === m.venueId);
            return (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
                    Match #{m.matchNumber} • {m.stage}
                  </div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{t1?.name}</span>
                    <span className="text-slate-500 text-xs">vs</span>
                    <span>{t2?.name}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{v?.name}, {v?.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-300">{m.matchDate}</div>
                  <button
                    onClick={() => {
                      setActiveMatchId(m.id);
                      setActiveTab('fixtures');
                    }}
                    className="mt-2 text-xs px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-all cursor-pointer font-medium"
                  >
                    Match Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
