import React, { useState } from 'react';
import { 
  TableProperties, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  X,
  Calculator
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

export const PointsTableView: React.FC = () => {
  const { standings, teams, activeTournament } = useTournament();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const groups = ['all', 'Group A', 'Group B'];

  const filteredStandings = standings.filter(s => {
    if (selectedGroup === 'all') return true;
    return s.groupName === selectedGroup;
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.netRunRate - a.netRunRate;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-amber-400" />
            <span>Tournament Standings & Points Table</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTournament?.name} • Automated 2 points per win, 1 per tie/no result, and exact ICC Net Run Rate (NRR).
          </p>
        </div>

        <button
          onClick={() => setShowFormulaModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer shadow-sm"
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>How NRR is Calculated</span>
        </button>
      </div>

      {/* Group Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {groups.map(grp => (
          <button
            key={grp}
            onClick={() => setSelectedGroup(grp)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              selectedGroup === grp
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {grp === 'all' ? 'All Groups Combined' : grp}
          </button>
        ))}
      </div>

      {/* Points Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-center w-12">Pos</th>
                <th className="p-3.5">Team</th>
                <th className="p-3.5 text-center">P</th>
                <th className="p-3.5 text-center">W</th>
                <th className="p-3.5 text-center">L</th>
                <th className="p-3.5 text-center">T</th>
                <th className="p-3.5 text-center">NR</th>
                <th className="p-3.5 text-center font-bold text-white">PTS</th>
                <th className="p-3.5 text-right font-bold text-white">NRR</th>
                <th className="p-3.5 text-center">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStandings.map((s, idx) => {
                const team = teams.find(t => t.id === s.teamId);
                const isQualifier = idx < 2;
                const isEliminator = idx >= 2 && idx < 4;

                return (
                  <tr 
                    key={s.teamId} 
                    className={`hover:bg-slate-800/30 transition-colors ${
                      isQualifier ? 'bg-blue-950/10' : ''
                    }`}
                  >
                    {/* Position */}
                    <td className="p-3.5 text-center font-mono font-bold">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        isQualifier 
                          ? 'bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30' 
                          : isEliminator 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{team?.logoUrl}</span>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            {team?.name}
                            <span className="text-[10px] font-mono text-slate-400">({team?.shortName})</span>
                            {isQualifier && (
                              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Q1 Zone
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{s.groupName}</div>
                        </div>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="p-3.5 text-center font-mono text-slate-300">{s.matchesPlayed}</td>
                    <td className="p-3.5 text-center font-mono text-emerald-400 font-semibold">{s.won}</td>
                    <td className="p-3.5 text-center font-mono text-rose-400 font-semibold">{s.lost}</td>
                    <td className="p-3.5 text-center font-mono text-slate-400">{s.tied}</td>
                    <td className="p-3.5 text-center font-mono text-slate-400">{s.noResult}</td>

                    {/* Points */}
                    <td className="p-3.5 text-center font-mono font-black text-amber-400 text-sm">
                      {s.points}
                    </td>

                    {/* Net Run Rate */}
                    <td className="p-3.5 text-right font-mono font-bold">
                      <span className={`${
                        s.netRunRate > 0 
                          ? 'text-emerald-400' 
                          : s.netRunRate < 0 
                          ? 'text-rose-400' 
                          : 'text-slate-400'
                      }`}>
                        {s.netRunRate > 0 ? `+${s.netRunRate.toFixed(3)}` : s.netRunRate.toFixed(3)}
                      </span>
                    </td>

                    {/* Form Guide */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {s.form && s.form.length > 0 ? (
                          s.form.map((res, fIdx) => (
                            <span
                              key={fIdx}
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                                res === 'W'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : res === 'L'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {res}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 font-mono text-xs">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Positions 1-2: Advance directly to Qualifier 1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Positions 3-4: Advance to Eliminator</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            P = Played, W = Won, L = Lost, PTS = Points, NRR = Net Run Rate
          </div>
        </div>
      </div>

      {/* FORMULA MODAL */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>ICC Net Run Rate (NRR) Formula</span>
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                Net Run Rate (NRR) is calculated by taking the average runs per over scored by a team across the tournament and subtracting the average runs per over conceded by that team.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center text-sm text-amber-300">
                NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-400">
                <p><strong>Important Rules:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>If a team is bowled out before the allotted overs, their full quota of overs (e.g. 20.0 for T20) is counted in the calculation.</li>
                  <li>Part-overs like 19.4 are converted into fraction of 6 balls: <code>19 + (4 / 6) = 19.667 overs</code>.</li>
                  <li>Only completed innings in matches that reached a natural conclusion or DLS adjustment are included.</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-200">
                <strong>Match 1 Example:</strong> Mumbai Titans scored 198 in 20.0 ov (RR = 9.900). They conceded 184 in 20.0 ov (RR = 9.200). <code>NRR = 9.900 - 9.200 = +0.700</code>.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
