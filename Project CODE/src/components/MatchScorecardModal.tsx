import React, { useState } from 'react';
import { X, Trophy, Award, Calendar, MapPin } from 'lucide-react';
import { Match } from '../types/cricket';
import { useTournament } from '../context/TournamentContext';

interface MatchScorecardModalProps {
  match: Match;
  onClose: () => void;
}

export const MatchScorecardModal: React.FC<MatchScorecardModalProps> = ({ match, onClose }) => {
  const { teams, venues } = useTournament();
  const [activeInningIndex, setActiveInningIndex] = useState<number>(0);

  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);
  const venue = venues.find(v => v.id === match.venueId);

  const innings = match.innings;
  const currentInning = innings[activeInningIndex];
  const battingTeam = teams.find(t => t.id === currentInning?.battingTeamId);
  const bowlingTeam = teams.find(t => t.id === currentInning?.bowlingTeamId);

  // Player of the match
  const potm = team1?.squad.find(p => p.id === match.playerOfTheMatchId) || 
               team2?.squad.find(p => p.id === match.playerOfTheMatchId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <span>Match #{match.matchNumber}</span>
              <span>•</span>
              <span>{match.stage}</span>
              <span>•</span>
              <span>{match.status.toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{team1?.name}</span>
              <span className="text-slate-500 text-sm font-normal">vs</span>
              <span>{team2?.name}</span>
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {venue?.name}, {venue?.city}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {match.matchDate}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Result Banner */}
        {match.status === 'completed' && match.winnerId && (
          <div className="px-5 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>
                {teams.find(t => t.id === match.winnerId)?.name} won by {match.winMargin} {match.winMarginType}
              </span>
            </div>
            {potm && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Player of the Match: <strong>{potm.knownAs}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Innings Tabs */}
        {innings.length > 0 ? (
          <div className="flex border-b border-slate-800 px-5 pt-3 bg-slate-900/50">
            {innings.map((inn, idx) => {
              const bTeam = teams.find(t => t.id === inn.battingTeamId);
              const isActive = idx === activeInningIndex;
              return (
                <button
                  key={inn.id}
                  onClick={() => setActiveInningIndex(idx)}
                  className={`pb-2.5 px-4 font-semibold text-xs transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{bTeam?.name}</span>
                  <span className="font-mono text-amber-400">
                    {inn.totalRuns}/{inn.totalWickets} ({inn.oversFormatted} ov)
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Match scheduled. Scorecard will be populated once the match begins.
          </div>
        )}

        {/* Scorecard Body */}
        {currentInning && (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Batting Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Batting Scorecard - {battingTeam?.name}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Batter</th>
                      <th className="p-3">Dismissal</th>
                      <th className="p-3 text-right">R</th>
                      <th className="p-3 text-right">B</th>
                      <th className="p-3 text-right">4s</th>
                      <th className="p-3 text-right">6s</th>
                      <th className="p-3 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentInning.batting.map((b) => (
                      <tr key={b.playerId} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                          {b.playerName}
                          {b.isNotOut && <span className="text-amber-400 font-bold">*</span>}
                        </td>
                        <td className="p-3 text-slate-400">
                          {b.isNotOut ? (
                            <span className="text-emerald-400 font-medium">not out</span>
                          ) : b.dismissalType === 'caught' ? (
                            `c ${b.fielderName || ''} b ${b.bowlerName || ''}`
                          ) : b.dismissalType === 'bowled' ? (
                            `b ${b.bowlerName || ''}`
                          ) : b.dismissalType === 'lbw' ? (
                            `lbw b ${b.bowlerName || ''}`
                          ) : (
                            b.dismissalType
                          )}
                        </td>
                        <td className="p-3 text-right font-bold text-white font-mono">{b.runs}</td>
                        <td className="p-3 text-right text-slate-400 font-mono">{b.balls}</td>
                        <td className="p-3 text-right text-slate-300 font-mono">{b.fours}</td>
                        <td className="p-3 text-right text-slate-300 font-mono">{b.sixes}</td>
                        <td className="p-3 text-right text-emerald-400 font-mono font-bold">{b.strikeRate}</td>
                      </tr>
                    ))}
                    {/* Extras */}
                    <tr className="bg-slate-900/80 text-slate-400">
                      <td colSpan={2} className="p-3 font-semibold">Extras</td>
                      <td colSpan={5} className="p-3 text-right font-mono text-white">
                        <strong>
                          {currentInning.extrasWides + currentInning.extrasNoballs + currentInning.extrasByes + currentInning.extrasLegbyes}
                        </strong>{' '}
                        <span className="text-[11px] text-slate-500">
                          (wd {currentInning.extrasWides}, nb {currentInning.extrasNoballs}, b {currentInning.extrasByes}, lb {currentInning.extrasLegbyes})
                        </span>
                      </td>
                    </tr>
                    {/* Total */}
                    <tr className="bg-slate-800/40 font-bold text-white">
                      <td colSpan={2} className="p-3">Total</td>
                      <td colSpan={5} className="p-3 text-right font-mono text-amber-400 text-sm">
                        {currentInning.totalRuns}/{currentInning.totalWickets}{' '}
                        <span className="text-xs text-slate-400 font-normal">
                          ({currentInning.oversFormatted} Overs)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Bowling Figures - {bowlingTeam?.name}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Bowler</th>
                      <th className="p-3 text-right">O</th>
                      <th className="p-3 text-right">M</th>
                      <th className="p-3 text-right">R</th>
                      <th className="p-3 text-right">W</th>
                      <th className="p-3 text-right">ECON</th>
                      <th className="p-3 text-right">DOTS</th>
                      <th className="p-3 text-right">WD</th>
                      <th className="p-3 text-right">NB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentInning.bowling.map((bw) => (
                      <tr key={bw.playerId} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-white">{bw.playerName}</td>
                        <td className="p-3 text-right font-mono text-slate-300">{bw.oversBowled}</td>
                        <td className="p-3 text-right font-mono text-slate-400">{bw.maidens}</td>
                        <td className="p-3 text-right font-mono text-white font-bold">{bw.runsConceded}</td>
                        <td className="p-3 text-right font-mono text-purple-400 font-extrabold">{bw.wickets}</td>
                        <td className="p-3 text-right font-mono text-amber-400 font-bold">{bw.economyRate}</td>
                        <td className="p-3 text-right font-mono text-slate-400">{bw.dots}</td>
                        <td className="p-3 text-right font-mono text-slate-400">{bw.wides}</td>
                        <td className="p-3 text-right font-mono text-slate-400">{bw.noBalls}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fall of Wickets */}
            {currentInning.fallOfWickets.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Fall of Wickets
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentInning.fallOfWickets.map((fow) => (
                    <div
                      key={fow.wicketNumber}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-800 text-xs font-mono"
                    >
                      <span className="text-amber-400 font-bold">{fow.score}/{fow.wicketNumber}</span>{' '}
                      <span className="text-slate-300 font-sans">({fow.playerName}, {fow.overBall} ov)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Tournament: ASL 2026 • Match ID: {match.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
