import React, { useState } from 'react';
import { Award, Flame, Target, Zap, Trophy } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

export const LeaderboardsView: React.FC = () => {
  const { matches, teams } = useTournament();
  const [activeCategory, setActiveCategory] = useState<'runs' | 'wickets' | 'sixes' | 'scores'>('runs');

  // Aggregate Batting Stats across all matches
  const batterStatsMap: {
    [playerId: string]: {
      name: string;
      team: string;
      teamCode: string;
      innings: number;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      highest: number;
      isNotOut: boolean;
      avatarUrl?: string;
    };
  } = {};

  // Aggregate Bowling Stats across all matches
  const bowlerStatsMap: {
    [playerId: string]: {
      name: string;
      team: string;
      teamCode: string;
      innings: number;
      balls: number;
      runsConceded: number;
      wickets: number;
      maidens: number;
      bestWickets: number;
      bestRuns: number;
      avatarUrl?: string;
    };
  } = {};

  matches.forEach(m => {
    m.innings.forEach(inn => {
      const batTeam = teams.find(t => t.id === inn.battingTeamId);
      const bowlTeam = teams.find(t => t.id === inn.bowlingTeamId);

      // Batting
      inn.batting.forEach(b => {
        if (!batterStatsMap[b.playerId]) {
          const playerObj = batTeam?.squad.find(p => p.id === b.playerId);
          batterStatsMap[b.playerId] = {
            name: b.playerName,
            team: batTeam?.name || '',
            teamCode: batTeam?.shortName || '',
            innings: 0,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            highest: 0,
            isNotOut: false,
            avatarUrl: playerObj?.avatarUrl
          };
        }
        const entry = batterStatsMap[b.playerId];
        entry.innings += 1;
        entry.runs += b.runs;
        entry.balls += b.balls;
        entry.fours += b.fours;
        entry.sixes += b.sixes;
        if (b.runs > entry.highest) {
          entry.highest = b.runs;
        }
        entry.isNotOut = b.isNotOut;
      });

      // Bowling
      inn.bowling.forEach(bw => {
        if (!bowlerStatsMap[bw.playerId]) {
          const playerObj = bowlTeam?.squad.find(p => p.id === bw.playerId);
          bowlerStatsMap[bw.playerId] = {
            name: bw.playerName,
            team: bowlTeam?.name || '',
            teamCode: bowlTeam?.shortName || '',
            innings: 0,
            balls: 0,
            runsConceded: 0,
            wickets: 0,
            maidens: 0,
            bestWickets: 0,
            bestRuns: 999,
            avatarUrl: playerObj?.avatarUrl
          };
        }
        const entry = bowlerStatsMap[bw.playerId];
        entry.innings += 1;
        entry.balls += bw.legalBalls;
        entry.runsConceded += bw.runsConceded;
        entry.wickets += bw.wickets;
        entry.maidens += bw.maidens;
        if (bw.wickets > entry.bestWickets) {
          entry.bestWickets = bw.wickets;
          entry.bestRuns = bw.runsConceded;
        }
      });
    });
  });

  const topRunScorers = Object.values(batterStatsMap).sort((a, b) => b.runs - a.runs);
  const topWicketTakers = Object.values(bowlerStatsMap).sort((a, b) => {
    if (b.wickets !== a.wickets) return b.wickets - a.wickets;
    const aEcon = a.balls > 0 ? a.runsConceded / (a.balls / 6) : 999;
    const bEcon = b.balls > 0 ? b.runsConceded / (b.balls / 6) : 999;
    return aEcon - bEcon;
  });
  const topSixHitters = [...topRunScorers].sort((a, b) => b.sixes - a.sixes);
  const topScores = [...topRunScorers].sort((a, b) => b.highest - a.highest);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Player Leaderboards & Tournament Honors</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Orange Cap, Purple Cap, Maximum Sixes, and Top Match Performances.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'runs', label: '🟠 Orange Cap (Most Runs)', icon: Flame },
          { id: 'wickets', label: '🟣 Purple Cap (Most Wickets)', icon: Target },
          { id: 'sixes', label: '🚀 Most Sixes', icon: Zap },
          { id: 'scores', label: '💥 Highest Individual Score', icon: Trophy }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Leaderboard Table / Content */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* RUNS (ORANGE CAP) */}
        {activeCategory === 'runs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5 text-center w-12">Rank</th>
                  <th className="p-3.5">Batter</th>
                  <th className="p-3.5">Team</th>
                  <th className="p-3.5 text-center">Inn</th>
                  <th className="p-3.5 text-right font-bold text-amber-400">Runs</th>
                  <th className="p-3.5 text-right">Balls</th>
                  <th className="p-3.5 text-right">Highest</th>
                  <th className="p-3.5 text-right">4s</th>
                  <th className="p-3.5 text-right">6s</th>
                  <th className="p-3.5 text-right">Strike Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topRunScorers.map((p, idx) => {
                  const sr = p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={idx} className={`hover:bg-slate-800/30 ${idx === 0 ? 'bg-amber-500/10' : ''}`}>
                      <td className="p-3.5 text-center font-mono font-bold">
                        {idx === 0 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                            👑
                          </span>
                        ) : (
                          <span className="text-slate-500">{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        {p.name}
                        {idx === 0 && (
                          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Orange Cap
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{p.team}</td>
                      <td className="p-3.5 text-center font-mono text-slate-400">{p.innings}</td>
                      <td className="p-3.5 text-right font-mono font-extrabold text-amber-400 text-sm">{p.runs}</td>
                      <td className="p-3.5 text-right font-mono text-slate-400">{p.balls}</td>
                      <td className="p-3.5 text-right font-mono text-slate-200">{p.highest}</td>
                      <td className="p-3.5 text-right font-mono text-slate-300">{p.fours}</td>
                      <td className="p-3.5 text-right font-mono text-purple-300 font-bold">{p.sixes}</td>
                      <td className="p-3.5 text-right font-mono text-emerald-400 font-bold">{sr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* WICKETS (PURPLE CAP) */}
        {activeCategory === 'wickets' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5 text-center w-12">Rank</th>
                  <th className="p-3.5">Bowler</th>
                  <th className="p-3.5">Team</th>
                  <th className="p-3.5 text-center">Inn</th>
                  <th className="p-3.5 text-right font-bold text-purple-400">Wickets</th>
                  <th className="p-3.5 text-right">Overs</th>
                  <th className="p-3.5 text-right">Runs</th>
                  <th className="p-3.5 text-right">Maidens</th>
                  <th className="p-3.5 text-right">Economy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topWicketTakers.map((p, idx) => {
                  const overs = `${Math.floor(p.balls / 6)}.${p.balls % 6}`;
                  const econ = p.balls > 0 ? (p.runsConceded / (p.balls / 6)).toFixed(2) : '0.00';
                  return (
                    <tr key={idx} className={`hover:bg-slate-800/30 ${idx === 0 ? 'bg-purple-950/20' : ''}`}>
                      <td className="p-3.5 text-center font-mono font-bold">
                        {idx === 0 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs">
                            ⚡
                          </span>
                        ) : (
                          <span className="text-slate-500">{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        {p.name}
                        {idx === 0 && (
                          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Purple Cap
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{p.team}</td>
                      <td className="p-3.5 text-center font-mono text-slate-400">{p.innings}</td>
                      <td className="p-3.5 text-right font-mono font-extrabold text-purple-400 text-sm">{p.wickets}</td>
                      <td className="p-3.5 text-right font-mono text-slate-300">{overs}</td>
                      <td className="p-3.5 text-right font-mono text-slate-300">{p.runsConceded}</td>
                      <td className="p-3.5 text-right font-mono text-slate-400">{p.maidens}</td>
                      <td className="p-3.5 text-right font-mono text-amber-400 font-bold">{econ}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MOST SIXES */}
        {activeCategory === 'sixes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5 text-center w-12">Rank</th>
                  <th className="p-3.5">Batter</th>
                  <th className="p-3.5">Team</th>
                  <th className="p-3.5 text-right font-bold text-purple-400">Total Sixes</th>
                  <th className="p-3.5 text-right">Total Fours</th>
                  <th className="p-3.5 text-right">Total Runs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topSixHitters.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-white">{p.name}</td>
                    <td className="p-3.5 text-slate-300">{p.team}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-purple-400 text-sm">{p.sixes}</td>
                    <td className="p-3.5 text-right font-mono text-slate-300">{p.fours}</td>
                    <td className="p-3.5 text-right font-mono text-amber-400 font-bold">{p.runs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HIGHEST INDIVIDUAL SCORES */}
        {activeCategory === 'scores' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5 text-center w-12">Rank</th>
                  <th className="p-3.5">Batter</th>
                  <th className="p-3.5">Team</th>
                  <th className="p-3.5 text-right font-bold text-amber-400">Top Score</th>
                  <th className="p-3.5 text-right">Total Fours</th>
                  <th className="p-3.5 text-right">Total Sixes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topScores.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-white">{p.name}</td>
                    <td className="p-3.5 text-slate-300">{p.team}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-amber-400 text-sm">{p.highest}</td>
                    <td className="p-3.5 text-right font-mono text-slate-300">{p.fours}</td>
                    <td className="p-3.5 text-right font-mono text-purple-400 font-bold">{p.sixes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
