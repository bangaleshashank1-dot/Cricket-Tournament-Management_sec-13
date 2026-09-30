export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
export type BattingStyle = 'Right Handed Bat' | 'Left Handed Bat';
export type MatchStatus = 'scheduled' | 'live' | 'innings_break' | 'completed' | 'abandoned' | 'tied';
export type MatchStage = 'League' | 'Quarter-Final' | 'Semi-Final' | 'Final';
export type ExtrasType = 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY';
export type DismissalType = 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket' | 'retired_hurt' | 'not out';

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  pitchType: 'Batting' | 'Bowling' | 'Spin' | 'Balanced';
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  knownAs: string;
  battingStyle: BattingStyle;
  bowlingStyle: string;
  primaryRole: PlayerRole;
  avatarUrl?: string;
  country: string;
  jerseyNumber?: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  coach: string;
  homeVenueId?: string;
  squad: Player[];
}

export interface Tournament {
  id: string;
  name: string;
  code: string;
  season: string;
  format: 'T20' | 'ODI' | 'T10' | 'TEST';
  oversPerInnings: number;
  startDate: string;
  endDate: string;
  pointsForWin: number;
  pointsForTie: number;
  pointsForNr: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  bannerUrl?: string;
}

export interface BattingScorecard {
  playerId: string;
  playerName: string;
  battingPosition: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissalType: DismissalType;
  bowlerId?: string;
  bowlerName?: string;
  fielderName?: string;
  isNotOut: boolean;
}

export interface BowlingScorecard {
  playerId: string;
  playerName: string;
  bowlingOrder: number;
  oversBowled: number;
  legalBalls: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  wides: number;
  noBalls: number;
  dots: number;
  economyRate: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  overBall: string;
  playerName: string;
}

export interface Delivery {
  id: string;
  inningsNumber: number;
  overNumber: number;
  ballNumber: number;
  legalBallNumber: number;
  bowlerId: string;
  bowlerName: string;
  strikerId: string;
  strikerName: string;
  nonStrikerId: string;
  nonStrikerName: string;
  runsBat: number;
  extrasType: ExtrasType;
  extrasRuns: number;
  totalRuns: number;
  isWicket: boolean;
  wicketType?: DismissalType;
  playerOutId?: string;
  playerOutName?: string;
  fielderName?: string;
  commentary: string;
  timestamp: string;
}

export interface MatchInning {
  id: string;
  matchId: string;
  inningsNumber: number;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  totalWickets: number;
  oversFormatted: string; // e.g. "15.4"
  legalBalls: number;
  extrasWides: number;
  extrasNoballs: number;
  extrasByes: number;
  extrasLegbyes: number;
  isCompleted: boolean;
  batting: BattingScorecard[];
  bowling: BowlingScorecard[];
  fallOfWickets: FallOfWicket[];
  deliveries: Delivery[];
}

export interface Match {
  id: string;
  tournamentId: string;
  matchNumber: number;
  stage: MatchStage;
  team1Id: string;
  team2Id: string;
  venueId: string;
  matchDate: string;
  scheduledOvers: number;
  tossWinnerId?: string;
  tossDecision?: 'bat' | 'bowl';
  status: MatchStatus;
  winnerId?: string;
  winMargin?: number;
  winMarginType?: 'runs' | 'wickets';
  playerOfTheMatchId?: string;
  notes?: string;
  innings: MatchInning[];
  activeStrikerId?: string;
  activeNonStrikerId?: string;
  activeBowlerId?: string;
}

export interface TournamentStanding {
  tournamentId: string;
  teamId: string;
  groupName: string;
  matchesPlayed: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  runsScored: number;
  oversFaced: number;
  runsConceded: number;
  oversBowled: number;
  netRunRate: number;
  form: ('W' | 'L' | 'T' | 'NR')[];
}
