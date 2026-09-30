import React, { useState } from 'react';
import { 
  Radio, 
  RotateCcw, 
  ArrowLeftRight, 
  AlertTriangle, 
  FileText, 
  Check, 
  X, 
  ChevronDown, 
  UserCheck, 
  Zap,
  Volume2
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { DismissalType, ExtrasType, Player } from '../types/cricket';

export const LiveScorer: React.FC = () => {
  const { 
    matches, 
    activeMatch, 
    setActiveMatchId, 
    teams, 
    venues, 
    recordDelivery, 
    undoLastBall, 
    switchStriker, 
    setActiveBowler,
    setSelectedScorecardMatch
  } = useTournament();

  // Wicket Modal State
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState<DismissalType>('caught');
  const [playerOutId, setPlayerOutId] = useState<string>('');
  const [fielderName, setFielderName] = useState<string>('');
  const [newBatsmanId, setNewBatsmanId] = useState<string>('');
  const [customCommentary, setCustomCommentary] = useState<string>('');

  // Bowler selector modal/dropdown
  const [showBowlerSelect, setShowBowlerSelect] = useState(false);

  if (!activeMatch) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
        No active match selected. Please select a match from the Fixtures tab.
      </div>
    );
  }

  const currentInning = activeMatch.innings[activeMatch.innings.length - 1];
  const battingTeam = teams.find(t => t.id === currentInning?.battingTeamId);
  const bowlingTeam = teams.find(t => t.id === currentInning?.bowlingTeamId);
  const venue = venues.find(v => v.id === activeMatch.venueId);

  // Active Players
  const striker = battingTeam?.squad.find(p => p.id === activeMatch.activeStrikerId);
  const nonStriker = battingTeam?.squad.find(p => p.id === activeMatch.activeNonStrikerId);
  const bowler = bowlingTeam?.squad.find(p => p.id === activeMatch.activeBowlerId);

  const strikerCard = currentInning?.batting.find(b => b.playerId === striker?.id);
  const nonStrikerCard = currentInning?.batting.find(b => b.playerId === nonStriker?.id);
  const bowlerCard = currentInning?.bowling.find(b => b.playerId === bowler?.id);

  // Remaining eligible batsmen in batting squad
  const dismissedPlayerIds = currentInning?.fallOfWickets.map(f => {
    return battingTeam?.squad.find(p => p.knownAs === f.playerName)?.id;
  }).filter(Boolean) || [];

  const availableBatsmen = battingTeam?.squad.filter(p => 
    p.id !== striker?.id && 
    p.id !== nonStriker?.id && 
    !dismissedPlayerIds.includes(p.id)
  ) || [];

  // Available bowlers in bowling squad
  const availableBowlers = bowlingTeam?.squad.filter(p => p.id !== bowler?.id) || [];

  // Current Over Deliveries (filter deliveries from current over)
  const currentOverNum = currentInning ? Math.floor(currentInning.legalBalls / 6) : 0;
  const currentOverDeliveries = currentInning?.deliveries.filter(d => d.overNumber === currentOverNum) || [];

  // Handle standard run entry
  const handleScoreRuns = (runs: number) => {
    let comment = `${runs} run${runs === 1 ? '' : 's'} taken by ${striker?.knownAs || 'batsman'}.`;
    if (runs === 4) comment = `FOUR! Beautiful shot through the gap by ${striker?.knownAs}!`;
    if (runs === 6) comment = `SIX! Mammoth hit over the ropes by ${striker?.knownAs}! High and handsome!`;
    if (runs === 0) comment = `Dot ball. Good tight bowling from ${bowler?.knownAs}.`;

    recordDelivery({
      runsBat: runs,
      extrasType: 'NONE',
      extrasRuns: 0,
      isWicket: false,
      commentary: comment
    });
  };

  // Handle extras entry
  const handleScoreExtras = (type: ExtrasType, runs: number = 1) => {
    let comment = `${type} ball conceded by ${bowler?.knownAs}. (+${runs} extras)`;
    recordDelivery({
      runsBat: 0,
      extrasType: type,
      extrasRuns: runs,
      isWicket: false,
      commentary: comment
    });
  };

  // Open Wicket Modal
  const openWicketModal = () => {
    setPlayerOutId(striker?.id || '');
    setWicketType('caught');
    setFielderName('');
    setNewBatsmanId(availableBatsmen[0]?.id || '');
    setCustomCommentary('');
    setShowWicketModal(true);
  };

  // Confirm Wicket
  const handleConfirmWicket = () => {
    const outPlayer = battingTeam?.squad.find(p => p.id === playerOutId);
    let desc = `OUT! ${outPlayer?.knownAs} is dismissed (${wicketType})`;
    if (fielderName) desc += ` by ${fielderName}`;
    desc += ` off the bowling of ${bowler?.knownAs}.`;

    recordDelivery({
      runsBat: 0,
      extrasType: 'NONE',
      extrasRuns: 0,
      isWicket: true,
      wicketType: wicketType,
      playerOutId: playerOutId,
      fielderName: fielderName,
      newBatsmanId: newBatsmanId,
      commentary: customCommentary || desc
    });

    setShowWicketModal(false);
  };

  // Calculate Run Rates
  const oversDecimal = currentInning && currentInning.legalBalls > 0 
    ? Math.floor(currentInning.legalBalls / 6) + (currentInning.legalBalls % 6) / 6 
    : 0;
  const crr = oversDecimal > 0 ? (currentInning.totalRuns / oversDecimal).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Match Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Live Scorer Console
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <select
            value={activeMatch.id}
            onChange={(e) => setActiveMatchId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            {matches.map(m => {
              const t1 = teams.find(t => t.id === m.team1Id)?.shortName;
              const t2 = teams.find(t => t.id === m.team2Id)?.shortName;
              return (
                <option key={m.id} value={m.id}>
                  Match #{m.matchNumber}: {t1} vs {t2} ({m.status.toUpperCase()})
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedScorecardMatch(activeMatch)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Full Scorecard</span>
          </button>
          <button
            onClick={undoLastBall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 cursor-pointer transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Ball</span>
          </button>
        </div>
      </div>

      {/* Main Scoreboard Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Score & Active Players (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Big Score Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0C1322] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{battingTeam?.logoUrl}</span>
                  <h2 className="text-2xl font-black text-white">{battingTeam?.name}</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  vs {bowlingTeam?.name} • {venue?.name}
                </p>
              </div>

              <div className="text-right">
                <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 tracking-tight font-mono">
                  {currentInning?.totalRuns || 0}
                  <span className="text-slate-500 text-3xl">/</span>
                  {currentInning?.totalWickets || 0}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Overs: <span className="text-white font-bold">{currentInning?.oversFormatted || '0.0'}</span> / {activeMatch.scheduledOvers}
                </div>
              </div>
            </div>

            {/* Run Rate Bar */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-400">
                  Current Run Rate: <strong className="text-emerald-400 font-mono text-sm">{crr}</strong>
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">
                  Extras: <strong className="text-white font-mono">{
                    (currentInning?.extrasWides || 0) + 
                    (currentInning?.extrasNoballs || 0) + 
                    (currentInning?.extrasByes || 0) + 
                    (currentInning?.extrasLegbyes || 0)
                  }</strong> (wd {currentInning?.extrasWides || 0}, nb {currentInning?.extrasNoballs || 0}, b {currentInning?.extrasByes || 0}, lb {currentInning?.extrasLegbyes || 0})
                </span>
              </div>
              <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Innings {currentInning?.inningsNumber}
              </span>
            </div>
          </div>

          {/* Active Batsmen Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>Active Batsmen</span>
              </h3>
              <button
                onClick={switchStriker}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Rotate Strike</span>
              </button>
            </div>

            <div className="space-y-2">
              {/* Striker Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/20 border border-blue-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                    🏏
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      {striker?.knownAs || 'Striker'}
                      <span className="text-amber-400 font-bold">*</span>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        Striker
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{striker?.primaryRole} • #{striker?.jerseyNumber}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-lg font-extrabold text-white">
                    {strikerCard?.runs || 0} <span className="text-xs text-slate-400 font-normal">({strikerCard?.balls || 0} balls)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    4s: <span className="text-white">{strikerCard?.fours || 0}</span> | 6s: <span className="text-white">{strikerCard?.sixes || 0}</span> | SR: <span className="text-emerald-400 font-bold">{strikerCard?.strikeRate || 0}</span>
                  </div>
                </div>
              </div>

              {/* Non-Striker Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm">
                    🏃
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">
                      {nonStriker?.knownAs || 'Non-Striker'}
                    </div>
                    <div className="text-[11px] text-slate-400">{nonStriker?.primaryRole} • #{nonStriker?.jerseyNumber}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-lg font-bold text-slate-200">
                    {nonStrikerCard?.runs || 0} <span className="text-xs text-slate-400 font-normal">({nonStrikerCard?.balls || 0} balls)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    4s: <span className="text-slate-300">{nonStrikerCard?.fours || 0}</span> | 6s: <span className="text-slate-300">{nonStrikerCard?.sixes || 0}</span> | SR: <span className="text-slate-300">{nonStrikerCard?.strikeRate || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Bowler Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>Active Bowler</span>
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowBowlerSelect(!showBowlerSelect)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
                >
                  <span>Change Bowler</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showBowlerSelect && (
                  <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-20">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Select Bowler</div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {availableBowlers.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveBowler(p.id);
                            setShowBowlerSelect(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                        >
                          <span>{p.knownAs}</span>
                          <span className="text-[10px] text-slate-400">{p.bowlingStyle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-base border border-purple-500/30">
                  ⚡
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{bowler?.knownAs || 'Bowler'}</div>
                  <div className="text-[11px] text-slate-400">{bowler?.bowlingStyle} • #{bowler?.jerseyNumber}</div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-lg font-extrabold text-purple-300">
                  {bowlerCard?.wickets || 0} - {bowlerCard?.runsConceded || 0}
                  <span className="text-xs text-slate-400 font-normal ml-2">({bowlerCard?.oversBowled || '0.0'} ov)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Dots: <span className="text-white">{bowlerCard?.dots || 0}</span> | Econ: <span className="text-amber-400 font-bold">{bowlerCard?.economyRate || 0}</span> | Wd/Nb: {bowlerCard?.wides || 0}/{bowlerCard?.noBalls || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Ball Entry Pad & Commentary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ball Entry Console */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                Live Keypad
              </h3>
              <p className="text-xs text-slate-400">Click to record instant ball delivery.</p>
            </div>

            {/* Over Timeline Visualizer */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>This Over ({currentOverDeliveries.length}/6 balls):</span>
                <span className="font-mono text-slate-500">Over #{currentOverNum + 1}</span>
              </div>
              <div className="flex items-center gap-2 min-h-[34px]">
                {currentOverDeliveries.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">No balls bowled in this over yet.</span>
                ) : (
                  currentOverDeliveries.map((b, idx) => (
                    <span
                      key={idx}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shadow-sm ${
                        b.isWicket
                          ? 'bg-red-600 text-white'
                          : b.runsBat === 6
                          ? 'bg-purple-600 text-white'
                          : b.runsBat === 4
                          ? 'bg-blue-600 text-white'
                          : b.extrasType !== 'NONE'
                          ? 'bg-amber-600 text-white'
                          : b.runsBat === 0
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-slate-800 text-white border border-slate-700'
                      }`}
                    >
                      {b.isWicket ? 'W' : b.extrasType === 'WIDE' ? 'Wd' : b.extrasType === 'NO_BALL' ? 'Nb' : b.runsBat === 0 ? '•' : b.runsBat}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Runs Keypad Buttons (0, 1, 2, 3, 4, 6) */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Runs off the bat
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleScoreRuns(0)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  0 <span className="text-[10px] block font-sans text-slate-400 font-normal">Dot Ball</span>
                </button>
                <button
                  onClick={() => handleScoreRuns(1)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  1 <span className="text-[10px] block font-sans text-slate-400 font-normal">Single</span>
                </button>
                <button
                  onClick={() => handleScoreRuns(2)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  2 <span className="text-[10px] block font-sans text-slate-400 font-normal">Double</span>
                </button>
                <button
                  onClick={() => handleScoreRuns(3)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  3 <span className="text-[10px] block font-sans text-slate-400 font-normal">Three</span>
                </button>
                <button
                  onClick={() => handleScoreRuns(4)}
                  className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-extrabold text-lg border border-blue-500 transition-all cursor-pointer shadow-md shadow-blue-600/30 active:scale-95"
                >
                  4 <span className="text-[10px] block font-sans text-blue-200 font-normal">FOUR!</span>
                </button>
                <button
                  onClick={() => handleScoreRuns(6)}
                  className="py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-extrabold text-lg border border-purple-500 transition-all cursor-pointer shadow-md shadow-purple-600/30 active:scale-95"
                >
                  6 <span className="text-[10px] block font-sans text-purple-200 font-normal">SIX!</span>
                </button>
              </div>
            </div>

            {/* Extras Buttons (Wide, No Ball, Leg Bye, Bye) */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Extras & Penalties
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleScoreExtras('WIDE', 1)}
                  className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all cursor-pointer active:scale-95"
                >
                  Wide (+1)
                </button>
                <button
                  onClick={() => handleScoreExtras('NO_BALL', 1)}
                  className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all cursor-pointer active:scale-95"
                >
                  No Ball (+1)
                </button>
                <button
                  onClick={() => handleScoreExtras('LEG_BYE', 1)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all cursor-pointer active:scale-95"
                >
                  Leg Bye
                </button>
                <button
                  onClick={() => handleScoreExtras('BYE', 1)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all cursor-pointer active:scale-95"
                >
                  Bye
                </button>
              </div>
            </div>

            {/* Big Wicket Button */}
            <button
              onClick={openWicketModal}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-98 border border-red-500"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>OUT! Record Wicket</span>
            </button>
          </div>

          {/* Ball-by-Ball Live Commentary Stream */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Ball Commentary Log</span>
              </h3>
              <span className="text-[11px] text-slate-500">Live feed</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
              {currentInning?.deliveries.slice(0, 10).map((d) => (
                <div
                  key={d.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                      d.isWicket
                        ? 'bg-red-600 text-white'
                        : d.runsBat === 6
                        ? 'bg-purple-600 text-white'
                        : d.runsBat === 4
                        ? 'bg-blue-600 text-white'
                        : d.extrasType !== 'NONE'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {d.isWicket ? 'W' : d.runsBat}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-0.5">
                      <span className="font-semibold text-slate-200">
                        Ov {d.overNumber}.{d.ballNumber} ({d.bowlerName} to {d.strikerName})
                      </span>
                      <span className="text-slate-500">{d.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{d.commentary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WICKET MODAL */}
      {showWicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <h3 className="text-lg font-bold text-white">Record Wicket Dismissal</h3>
              </div>
              <button
                onClick={() => setShowWicketModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Dismissed Batsman Selection */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Who got Out?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlayerOutId(striker?.id || '')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      playerOutId === striker?.id
                        ? 'bg-red-500/20 border-red-500 text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs">{striker?.knownAs} (Striker)</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{strikerCard?.runs} runs ({strikerCard?.balls}b)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerOutId(nonStriker?.id || '')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      playerOutId === nonStriker?.id
                        ? 'bg-red-500/20 border-red-500 text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs">{nonStriker?.knownAs} (Non-Striker)</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{nonStrikerCard?.runs} runs ({nonStrikerCard?.balls}b)</div>
                  </button>
                </div>
              </div>

              {/* Dismissal Type */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Dismissal Type</label>
                <select
                  value={wicketType}
                  onChange={(e) => setWicketType(e.target.value as DismissalType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="caught">Caught</option>
                  <option value="bowled">Bowled</option>
                  <option value="lbw">LBW (Leg Before Wicket)</option>
                  <option value="run_out">Run Out</option>
                  <option value="stumped">Stumped</option>
                  <option value="hit_wicket">Hit Wicket</option>
                </select>
              </div>

              {/* Fielder Name (for caught/run_out/stumped) */}
              {(wicketType === 'caught' || wicketType === 'run_out' || wicketType === 'stumped') && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Fielder involved (optional)</label>
                  <input
                    type="text"
                    value={fielderName}
                    onChange={(e) => setFielderName(e.target.value)}
                    placeholder="e.g. Jadeja, Starc"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Next Incoming Batsman */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Next Batsman to Crease</label>
                {availableBatsmen.length > 0 ? (
                  <select
                    value={newBatsmanId}
                    onChange={(e) => setNewBatsmanId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  >
                    {availableBatsmen.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.knownAs} ({p.primaryRole}, #{p.jerseyNumber})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-amber-400 text-xs">All remaining squad members have batted or are all out!</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowWicketModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWicket}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Confirm Wicket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
