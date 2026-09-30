import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tournament,
  Team,
  Venue,
  Match,
  TournamentStanding,
  ExtrasType,
  DismissalType,
  Delivery,
  Player,
  MatchInning
} from '../types/cricket';
import {
  initialTournaments,
  initialTeams,
  initialVenues,
  initialMatches,
  initialStandings
} from '../data/mockData';

export interface RecordDeliveryInput {
  runsBat: number;
  extrasType: ExtrasType;
  extrasRuns?: number;
  isWicket?: boolean;
  wicketType?: DismissalType;
  playerOutId?: string;
  fielderName?: string;
  newBatsmanId?: string;
  commentary?: string;
}

interface TournamentContextType {
  tournaments: Tournament[];
  activeTournament: Tournament | undefined;
  setActiveTournamentId: (id: string) => void;
  teams: Team[];
  venues: Venue[];
  matches: Match[];
  standings: TournamentStanding[];
  activeMatch: Match | undefined;
  setActiveMatchId: (id: string) => void;
  recordDelivery: (input: RecordDeliveryInput) => void;
  undoLastBall: () => void;
  switchStriker: () => void;
  setActiveBowler: (bowlerId: string) => void;
  createMatch: (match: Partial<Match>) => void;
  generateRoundRobinFixtures: () => void;
  addTeam: (team: Partial<Team>) => void;
  addPlayerToTeam: (teamId: string, player: Omit<Player, 'id'>) => void;
  selectedScorecardMatch: Match | null;
  setSelectedScorecardMatch: (match: Match | null) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('cricpulse_tournaments');
    return saved ? JSON.parse(saved) : initialTournaments;
  });

  const [activeTournamentId, setActiveTournamentId] = useState<string>('tour-2026');

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('cricpulse_teams');
    return saved ? JSON.parse(saved) : initialTeams;
  });

  const [venues, setVenues] = useState<Venue[]>(() => {
    const saved = localStorage.getItem('cricpulse_venues');
    return saved ? JSON.parse(saved) : initialVenues;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('cricpulse_matches');
    return saved ? JSON.parse(saved) : initialMatches;
  });

  const [standings, setStandings] = useState<TournamentStanding[]>(() => {
    const saved = localStorage.getItem('cricpulse_standings');
    return saved ? JSON.parse(saved) : initialStandings;
  });

  const [activeMatchId, setActiveMatchId] = useState<string>('m2');
  const [selectedScorecardMatch, setSelectedScorecardMatch] = useState<Match | null>(null);
  const [matchHistoryStack, setMatchHistoryStack] = useState<{ [matchId: string]: Match[] }>({});

  // Persistence to local storage
  useEffect(() => {
    localStorage.setItem('cricpulse_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('cricpulse_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('cricpulse_standings', JSON.stringify(standings));
  }, [standings]);

  const activeTournament = tournaments.find(t => t.id === activeTournamentId);
  const activeMatch = matches.find(m => m.id === activeMatchId);

  // Helper to switch active striker and non-striker
  const switchStriker = () => {
    if (!activeMatch) return;
    setMatches(prevMatches =>
      prevMatches.map(m => {
        if (m.id !== activeMatch.id) return m;
        return {
          ...m,
          activeStrikerId: m.activeNonStrikerId,
          activeNonStrikerId: m.activeStrikerId
        };
      })
    );
  };

  const setActiveBowler = (bowlerId: string) => {
    if (!activeMatch) return;
    setMatches(prevMatches =>
      prevMatches.map(m => (m.id === activeMatch.id ? { ...m, activeBowlerId: bowlerId } : m))
    );
  };

  // Undo Last Ball
  const undoLastBall = () => {
    if (!activeMatch) return;
    const history = matchHistoryStack[activeMatch.id];
    if (!history || history.length === 0) return;

    const previousState = history[history.length - 1];
    setMatchHistoryStack(prev => ({
      ...prev,
      [activeMatch.id]: prev[activeMatch.id].slice(0, -1)
    }));

    setMatches(prevMatches =>
      prevMatches.map(m => (m.id === activeMatch.id ? previousState : m))
    );
  };

  // Record Delivery (Core Cricket Engine)
  const recordDelivery = (input: RecordDeliveryInput) => {
    if (!activeMatch) return;

    const currentInningIndex = activeMatch.innings.length > 0 ? activeMatch.innings.length - 1 : -1;
    if (currentInningIndex === -1) return;

    // Save snapshot for undo
    setMatchHistoryStack(prev => ({
      ...prev,
      [activeMatch.id]: [...(prev[activeMatch.id] || []), JSON.parse(JSON.stringify(activeMatch))]
    }));

    setMatches(prevMatches => {
      return prevMatches.map(match => {
        if (match.id !== activeMatch.id) return match;

        const currentInning = { ...match.innings[currentInningIndex] };
        const battingTeam = teams.find(t => t.id === currentInning.battingTeamId);
        const bowlingTeam = teams.find(t => t.id === currentInning.bowlingTeamId);

        const striker = battingTeam?.squad.find(p => p.id === match.activeStrikerId);
        const nonStriker = battingTeam?.squad.find(p => p.id === match.activeNonStrikerId);
        const bowler = bowlingTeam?.squad.find(p => p.id === match.activeBowlerId);

        const isLegal = input.extrasType !== 'WIDE' && input.extrasType !== 'NO_BALL';
        const ballRuns = input.runsBat + (input.extrasRuns || 0);

        // Update Legal Balls & Overs
        let newLegalBalls = currentInning.legalBalls;
        if (isLegal) {
          newLegalBalls += 1;
        }

        const completedOvers = Math.floor(newLegalBalls / 6);
        const remainingBalls = newLegalBalls % 6;
        const newOversFormatted = `${completedOvers}.${remainingBalls}`;

        // Update Inning Totals
        const newTotalRuns = currentInning.totalRuns + ballRuns;
        const newTotalWickets = currentInning.totalWickets + (input.isWicket ? 1 : 0);

        // Update Extras
        let extW = currentInning.extrasWides;
        let extNb = currentInning.extrasNoballs;
        let extB = currentInning.extrasByes;
        let extLb = currentInning.extrasLegbyes;

        if (input.extrasType === 'WIDE') extW += (input.extrasRuns || 1);
        if (input.extrasType === 'NO_BALL') extNb += (input.extrasRuns || 1);
        if (input.extrasType === 'BYE') extB += input.runsBat;
        if (input.extrasType === 'LEG_BYE') extLb += input.runsBat;

        // Update Batting Scorecard
        let updatedBatting = [...currentInning.batting];
        if (striker) {
          let strikerCard = updatedBatting.find(b => b.playerId === striker.id);
          if (!strikerCard) {
            strikerCard = {
              playerId: striker.id,
              playerName: striker.knownAs,
              battingPosition: updatedBatting.length + 1,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0,
              dismissalType: 'not out',
              isNotOut: true
            };
            updatedBatting.push(strikerCard);
          }

          if (input.extrasType !== 'WIDE') {
            strikerCard.balls += 1;
          }
          strikerCard.runs += input.runsBat;
          if (input.runsBat === 4) strikerCard.fours += 1;
          if (input.runsBat === 6) strikerCard.sixes += 1;
          strikerCard.strikeRate = Number(((strikerCard.runs / Math.max(1, strikerCard.balls)) * 100).toFixed(2));

          if (input.isWicket && input.playerOutId === striker.id) {
            strikerCard.isNotOut = false;
            strikerCard.dismissalType = input.wicketType || 'caught';
            strikerCard.bowlerName = bowler?.knownAs;
            strikerCard.fielderName = input.fielderName;
          }
        }

        // If non-striker was out (e.g. run out)
        if (input.isWicket && input.playerOutId === nonStriker?.id && nonStriker) {
          let nonStrikerCard = updatedBatting.find(b => b.playerId === nonStriker.id);
          if (nonStrikerCard) {
            nonStrikerCard.isNotOut = false;
            nonStrikerCard.dismissalType = input.wicketType || 'run_out';
            nonStrikerCard.fielderName = input.fielderName;
          }
        }

        // Update Bowling Scorecard
        let updatedBowling = [...currentInning.bowling];
        if (bowler) {
          let bowlerCard = updatedBowling.find(b => b.playerId === bowler.id);
          if (!bowlerCard) {
            bowlerCard = {
              playerId: bowler.id,
              playerName: bowler.knownAs,
              bowlingOrder: updatedBowling.length + 1,
              oversBowled: 0,
              legalBalls: 0,
              maidens: 0,
              runsConceded: 0,
              wickets: 0,
              wides: 0,
              noBalls: 0,
              dots: 0,
              economyRate: 0
            };
            updatedBowling.push(bowlerCard);
          }

          if (isLegal) {
            bowlerCard.legalBalls += 1;
          }
          if (input.extrasType === 'WIDE') bowlerCard.wides += (input.extrasRuns || 1);
          if (input.extrasType === 'NO_BALL') bowlerCard.noBalls += 1;

          // Byes/Leg byes are not charged to the bowler
          const bowlerCharge = input.extrasType === 'BYE' || input.extrasType === 'LEG_BYE' ? 0 : ballRuns;
          bowlerCard.runsConceded += bowlerCharge;

          if (ballRuns === 0 && isLegal) {
            bowlerCard.dots += 1;
          }

          if (input.isWicket && input.wicketType !== 'run_out') {
            bowlerCard.wickets += 1;
          }

          const bOvers = Math.floor(bowlerCard.legalBalls / 6);
          const bBalls = bowlerCard.legalBalls % 6;
          bowlerCard.oversBowled = Number(`${bOvers}.${bBalls}`);
          const totalOversDec = bowlerCard.legalBalls / 6;
          bowlerCard.economyRate = totalOversDec > 0 ? Number((bowlerCard.runsConceded / totalOversDec).toFixed(2)) : 0;
        }

        // Fall of Wickets
        let updatedFOW = [...currentInning.fallOfWickets];
        if (input.isWicket) {
          const outName = input.playerOutId === striker?.id ? striker?.knownAs : nonStriker?.knownAs;
          updatedFOW.push({
            wicketNumber: newTotalWickets,
            score: newTotalRuns,
            overBall: newOversFormatted,
            playerName: outName || 'Batsman'
          });
        }

        // Add Delivery Event
        const newDelivery: Delivery = {
          id: `del-${Date.now()}-${Math.random()}`,
          inningsNumber: currentInning.inningsNumber,
          overNumber: completedOvers,
          ballNumber: remainingBalls === 0 && isLegal ? 6 : remainingBalls,
          legalBallNumber: newLegalBalls,
          bowlerId: bowler?.id || '',
          bowlerName: bowler?.knownAs || 'Bowler',
          strikerId: striker?.id || '',
          strikerName: striker?.knownAs || 'Striker',
          nonStrikerId: nonStriker?.id || '',
          nonStrikerName: nonStriker?.knownAs || 'Non-Striker',
          runsBat: input.runsBat,
          extrasType: input.extrasType,
          extrasRuns: input.extrasRuns || 0,
          totalRuns: ballRuns,
          isWicket: !!input.isWicket,
          wicketType: input.wicketType,
          playerOutId: input.playerOutId,
          playerOutName: input.playerOutId === striker?.id ? striker?.knownAs : nonStriker?.knownAs,
          fielderName: input.fielderName,
          commentary: input.commentary || `${ballRuns} runs scored off ${bowler?.knownAs}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedDeliveries = [newDelivery, ...currentInning.deliveries];

        // Next Striker / Non-Striker logic
        let nextStrikerId = match.activeStrikerId;
        let nextNonStrikerId = match.activeNonStrikerId;

        // If wicket fell, replace dismissed player
        if (input.isWicket && input.newBatsmanId) {
          if (input.playerOutId === striker?.id) {
            nextStrikerId = input.newBatsmanId;
          } else {
            nextNonStrikerId = input.newBatsmanId;
          }
        }

        // If odd runs (1, 3, 5), rotate strike
        if (input.runsBat % 2 === 1) {
          const temp = nextStrikerId;
          nextStrikerId = nextNonStrikerId;
          nextNonStrikerId = temp;
        }

        // End of Over (6 legal balls completed in this over)
        const isEndOfOver = isLegal && remainingBalls === 0;
        if (isEndOfOver) {
          // Strike rotates at the end of the over
          const temp = nextStrikerId;
          nextStrikerId = nextNonStrikerId;
          nextNonStrikerId = temp;
        }

        const updatedInning: MatchInning = {
          ...currentInning,
          totalRuns: newTotalRuns,
          totalWickets: newTotalWickets,
          legalBalls: newLegalBalls,
          oversFormatted: newOversFormatted,
          extrasWides: extW,
          extrasNoballs: extNb,
          extrasByes: extB,
          extrasLegbyes: extLb,
          batting: updatedBatting,
          bowling: updatedBowling,
          fallOfWickets: updatedFOW,
          deliveries: updatedDeliveries
        };

        const updatedInningsList = [...match.innings];
        updatedInningsList[currentInningIndex] = updatedInning;

        return {
          ...match,
          innings: updatedInningsList,
          activeStrikerId: nextStrikerId,
          activeNonStrikerId: nextNonStrikerId
        };
      });
    });
  };

  // Add a new scheduled or custom match
  const createMatch = (matchData: Partial<Match>) => {
    const newMatch: Match = {
      id: `m-${Date.now()}`,
      tournamentId: activeTournamentId,
      matchNumber: matches.length + 1,
      stage: 'League',
      team1Id: matchData.team1Id || teams[0].id,
      team2Id: matchData.team2Id || teams[1].id,
      venueId: matchData.venueId || venues[0].id,
      matchDate: matchData.matchDate || new Date().toISOString().replace('T', ' ').slice(0, 16),
      scheduledOvers: matchData.scheduledOvers || 20,
      status: 'scheduled',
      innings: [],
      ...matchData
    };
    setMatches(prev => [...prev, newMatch]);
  };

  // Automated Round Robin Fixture Generator
  const generateRoundRobinFixtures = () => {
    const tourTeams = teams;
    if (tourTeams.length < 2) return;

    const newFixtures: Match[] = [];
    let matchNum = matches.length + 1;
    let baseDate = new Date();

    for (let i = 0; i < tourTeams.length; i++) {
      for (let j = i + 1; j < tourTeams.length; j++) {
        baseDate.setDate(baseDate.getDate() + 1);
        const venue = venues[(i + j) % venues.length];
        newFixtures.push({
          id: `m-rr-${Date.now()}-${i}-${j}`,
          tournamentId: activeTournamentId,
          matchNumber: matchNum++,
          stage: 'League',
          team1Id: tourTeams[i].id,
          team2Id: tourTeams[j].id,
          venueId: venue.id,
          matchDate: baseDate.toISOString().replace('T', ' ').slice(0, 16),
          scheduledOvers: 20,
          status: 'scheduled',
          notes: `League fixture: ${tourTeams[i].shortName} vs ${tourTeams[j].shortName}`,
          innings: []
        });
      }
    }

    setMatches(prev => [...prev, ...newFixtures]);
  };

  // Add Team
  const addTeam = (teamData: Partial<Team>) => {
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name: teamData.name || 'New Franchise',
      shortName: teamData.shortName || 'NEW',
      city: teamData.city || 'City',
      logoUrl: teamData.logoUrl || '🏏',
      primaryColor: teamData.primaryColor || '#2563EB',
      secondaryColor: teamData.secondaryColor || '#F59E0B',
      coach: teamData.coach || 'Head Coach',
      squad: []
    };
    setTeams(prev => [...prev, newTeam]);
  };

  // Add Player to Squad
  const addPlayerToTeam = (teamId: string, player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };

    setTeams(prev =>
      prev.map(team => {
        if (team.id !== teamId) return team;
        return {
          ...team,
          squad: [...team.squad, newPlayer]
        };
      })
    );
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        activeTournament,
        setActiveTournamentId,
        teams,
        venues,
        matches,
        standings,
        activeMatch,
        setActiveMatchId,
        recordDelivery,
        undoLastBall,
        switchStriker,
        setActiveBowler,
        createMatch,
        generateRoundRobinFixtures,
        addTeam,
        addPlayerToTeam,
        selectedScorecardMatch,
        setSelectedScorecardMatch
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
