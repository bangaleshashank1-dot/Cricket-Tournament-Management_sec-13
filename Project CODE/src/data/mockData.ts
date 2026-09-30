import { Tournament, Venue, Team, Match, TournamentStanding } from '../types/cricket';

export const initialVenues: Venue[] = [
  { id: 'v1', name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33000, pitchType: 'Batting' },
  { id: 'v2', name: 'M. Chinnaswamy Stadium', city: 'Bengaluru', country: 'India', capacity: 38000, pitchType: 'Batting' },
  { id: 'v3', name: 'Eden Gardens', city: 'Kolkata', country: 'India', capacity: 68000, pitchType: 'Spin' },
  { id: 'v4', name: 'MA Chidambaram Stadium', city: 'Chennai', country: 'India', capacity: 38000, pitchType: 'Spin' },
  { id: 'v5', name: 'Narendra Modi Stadium', city: 'Ahmedabad', country: 'India', capacity: 132000, pitchType: 'Balanced' }
];

export const initialTournaments: Tournament[] = [
  {
    id: 'tour-2026',
    name: 'Apex Super League 2026',
    code: 'ASL2026',
    season: '2026',
    format: 'T20',
    oversPerInnings: 20,
    startDate: '2026-03-20',
    endDate: '2026-05-28',
    pointsForWin: 2,
    pointsForTie: 1,
    pointsForNr: 1,
    status: 'ongoing',
    bannerUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80'
  }
];

export const initialTeams: Team[] = [
  {
    id: 't1',
    name: 'Mumbai Titans',
    shortName: 'MT',
    city: 'Mumbai',
    logoUrl: '🏏',
    primaryColor: '#004BA0',
    secondaryColor: '#D4AF37',
    coach: 'Mahela Jayawardene',
    homeVenueId: 'v1',
    squad: [
      { id: 'p101', firstName: 'Rohit', lastName: 'Sharma', knownAs: 'R. Sharma', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm offbreak', primaryRole: 'Batsman', country: 'India', jerseyNumber: 45, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      { id: 'p102', firstName: 'Suryakumar', lastName: 'Yadav', knownAs: 'S. Yadav', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm medium', primaryRole: 'Batsman', country: 'India', jerseyNumber: 63, avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150' },
      { id: 'p103', firstName: 'Jasprit', lastName: 'Bumrah', knownAs: 'J. Bumrah', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm fast', primaryRole: 'Bowler', country: 'India', jerseyNumber: 93, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { id: 'p104', firstName: 'Hardik', lastName: 'Pandya', knownAs: 'H. Pandya', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm fast-medium', primaryRole: 'All-Rounder', country: 'India', jerseyNumber: 33, avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150' },
      { id: 'p105', firstName: 'Ishan', lastName: 'Kishan', knownAs: 'I. Kishan', battingStyle: 'Left Handed Bat', bowlingStyle: 'None', primaryRole: 'Wicketkeeper', country: 'India', jerseyNumber: 23, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
    ]
  },
  {
    id: 't2',
    name: 'Bengaluru Challengers',
    shortName: 'BC',
    city: 'Bengaluru',
    logoUrl: '🦁',
    primaryColor: '#EC1C24',
    secondaryColor: '#000000',
    coach: 'Andy Flower',
    homeVenueId: 'v2',
    squad: [
      { id: 'p201', firstName: 'Virat', lastName: 'Kohli', knownAs: 'V. Kohli', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm medium', primaryRole: 'Batsman', country: 'India', jerseyNumber: 18, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
      { id: 'p202', firstName: 'Faf', lastName: 'du Plessis', knownAs: 'F. du Plessis', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm legbreak', primaryRole: 'Batsman', country: 'South Africa', jerseyNumber: 13, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
      { id: 'p203', firstName: 'Glenn', lastName: 'Maxwell', knownAs: 'G. Maxwell', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm offbreak', primaryRole: 'All-Rounder', country: 'Australia', jerseyNumber: 32, avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
      { id: 'p204', firstName: 'Mohammed', lastName: 'Siraj', knownAs: 'M. Siraj', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm fast', primaryRole: 'Bowler', country: 'India', jerseyNumber: 73, avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
      { id: 'p205', firstName: 'Dinesh', lastName: 'Karthik', knownAs: 'D. Karthik', battingStyle: 'Right Handed Bat', bowlingStyle: 'None', primaryRole: 'Wicketkeeper', country: 'India', jerseyNumber: 19, avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150' }
    ]
  },
  {
    id: 't3',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    city: 'Chennai',
    logoUrl: '⚡',
    primaryColor: '#FACC15',
    secondaryColor: '#1E40AF',
    coach: 'Stephen Fleming',
    homeVenueId: 'v4',
    squad: [
      { id: 'p301', firstName: 'Ruturaj', lastName: 'Gaikwad', knownAs: 'R. Gaikwad', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm offbreak', primaryRole: 'Batsman', country: 'India', jerseyNumber: 31, avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
      { id: 'p302', firstName: 'Ravindra', lastName: 'Jadeja', knownAs: 'R. Jadeja', battingStyle: 'Left Handed Bat', bowlingStyle: 'Slow left-arm orthodox', primaryRole: 'All-Rounder', country: 'India', jerseyNumber: 8, avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
      { id: 'p303', firstName: 'MS', lastName: 'Dhoni', knownAs: 'MS Dhoni', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm medium', primaryRole: 'Wicketkeeper', country: 'India', jerseyNumber: 7, avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150' },
      { id: 'p304', firstName: 'Matheesha', lastName: 'Pathirana', knownAs: 'M. Pathirana', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm fast', primaryRole: 'Bowler', country: 'Sri Lanka', jerseyNumber: 99, avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150' },
      { id: 'p305', firstName: 'Shivam', lastName: 'Dube', knownAs: 'S. Dube', battingStyle: 'Left Handed Bat', bowlingStyle: 'Right-arm medium', primaryRole: 'All-Rounder', country: 'India', jerseyNumber: 25, avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' }
    ]
  },
  {
    id: 't4',
    name: 'Kolkata Knights',
    shortName: 'KK',
    city: 'Kolkata',
    logoUrl: '⚔️',
    primaryColor: '#6B21A8',
    secondaryColor: '#F59E0B',
    coach: 'Chandrakant Pandit',
    homeVenueId: 'v3',
    squad: [
      { id: 'p401', firstName: 'Shreyas', lastName: 'Iyer', knownAs: 'S. Iyer', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm legbreak', primaryRole: 'Batsman', country: 'India', jerseyNumber: 96, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      { id: 'p402', firstName: 'Andre', lastName: 'Russell', knownAs: 'A. Russell', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm fast', primaryRole: 'All-Rounder', country: 'West Indies', jerseyNumber: 12, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
      { id: 'p403', firstName: 'Sunil', lastName: 'Narine', knownAs: 'S. Narine', battingStyle: 'Left Handed Bat', bowlingStyle: 'Right-arm offbreak', primaryRole: 'All-Rounder', country: 'West Indies', jerseyNumber: 74, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
      { id: 'p404', firstName: 'Mitchell', lastName: 'Starc', knownAs: 'M. Starc', battingStyle: 'Left Handed Bat', bowlingStyle: 'Left-arm fast', primaryRole: 'Bowler', country: 'Australia', jerseyNumber: 56, avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
      { id: 'p405', firstName: 'Phil', lastName: 'Salt', knownAs: 'P. Salt', battingStyle: 'Right Handed Bat', bowlingStyle: 'None', primaryRole: 'Wicketkeeper', country: 'England', jerseyNumber: 28, avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' }
    ]
  },
  {
    id: 't5',
    name: 'Gujarat Strikers',
    shortName: 'GS',
    city: 'Ahmedabad',
    logoUrl: '🌪️',
    primaryColor: '#0F766E',
    secondaryColor: '#FBBF24',
    coach: 'Ashish Nehra',
    homeVenueId: 'v5',
    squad: [
      { id: 'p501', firstName: 'Shubman', lastName: 'Gill', knownAs: 'S. Gill', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm offbreak', primaryRole: 'Batsman', country: 'India', jerseyNumber: 77, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 'p502', firstName: 'Rashid', lastName: 'Khan', knownAs: 'R. Khan', battingStyle: 'Right Handed Bat', bowlingStyle: 'Right-arm legbreak', primaryRole: 'Bowler', country: 'Afghanistan', jerseyNumber: 19, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { id: 'p503', firstName: 'David', lastName: 'Miller', knownAs: 'D. Miller', battingStyle: 'Left Handed Bat', bowlingStyle: 'Right-arm offbreak', primaryRole: 'Batsman', country: 'South Africa', jerseyNumber: 10, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
    ]
  },
  {
    id: 't6',
    name: 'Delhi Dynamos',
    shortName: 'DD',
    city: 'Delhi',
    logoUrl: '🦅',
    primaryColor: '#1E3A8A',
    secondaryColor: '#EF4444',
    coach: 'Ricky Ponting',
    homeVenueId: 'v1',
    squad: [
      { id: 'p601', firstName: 'Rishabh', lastName: 'Pant', knownAs: 'R. Pant', battingStyle: 'Left Handed Bat', bowlingStyle: 'None', primaryRole: 'Wicketkeeper', country: 'India', jerseyNumber: 17, avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150' },
      { id: 'p602', firstName: 'Axar', lastName: 'Patel', knownAs: 'A. Patel', battingStyle: 'Left Handed Bat', bowlingStyle: 'Slow left-arm orthodox', primaryRole: 'All-Rounder', country: 'India', jerseyNumber: 20, avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150' },
      { id: 'p603', firstName: 'Kuldeep', lastName: 'Yadav', knownAs: 'K. Yadav', battingStyle: 'Left Handed Bat', bowlingStyle: 'Left-arm wrist spin', primaryRole: 'Bowler', country: 'India', jerseyNumber: 23, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' }
    ]
  }
];

export const initialMatches: Match[] = [
  {
    id: 'm1',
    tournamentId: 'tour-2026',
    matchNumber: 1,
    stage: 'League',
    team1Id: 't1',
    team2Id: 't2',
    venueId: 'v1',
    matchDate: '2026-03-20 19:30',
    scheduledOvers: 20,
    tossWinnerId: 't2',
    tossDecision: 'bowl',
    status: 'completed',
    winnerId: 't1',
    winMargin: 14,
    winMarginType: 'runs',
    playerOfTheMatchId: 'p102',
    notes: 'Match 1 thriller at Wankhede! Mumbai Titans held their nerve.',
    innings: [
      {
        id: 'inn1_m1',
        matchId: 'm1',
        inningsNumber: 1,
        battingTeamId: 't1',
        bowlingTeamId: 't2',
        totalRuns: 198,
        totalWickets: 5,
        oversFormatted: '20.0',
        legalBalls: 120,
        extrasWides: 4,
        extrasNoballs: 1,
        extrasByes: 2,
        extrasLegbyes: 3,
        isCompleted: true,
        batting: [
          { playerId: 'p101', playerName: 'Rohit Sharma', battingPosition: 1, runs: 48, balls: 32, fours: 6, sixes: 2, strikeRate: 150.0, dismissalType: 'caught', bowlerName: 'M. Siraj', fielderName: 'V. Kohli', isNotOut: false },
          { playerId: 'p105', playerName: 'Ishan Kishan', battingPosition: 2, runs: 35, balls: 24, fours: 4, sixes: 1, strikeRate: 145.83, dismissalType: 'bowled', bowlerName: 'G. Maxwell', isNotOut: false },
          { playerId: 'p102', playerName: 'Suryakumar Yadav', battingPosition: 3, runs: 76, balls: 38, fours: 7, sixes: 5, strikeRate: 200.0, dismissalType: 'not out', isNotOut: true },
          { playerId: 'p104', playerName: 'Hardik Pandya', battingPosition: 4, runs: 29, balls: 16, fours: 2, sixes: 2, strikeRate: 181.25, dismissalType: 'caught', bowlerName: 'M. Siraj', fielderName: 'F. du Plessis', isNotOut: false }
        ],
        bowling: [
          { playerId: 'p204', playerName: 'Mohammed Siraj', bowlingOrder: 1, oversBowled: 4.0, legalBalls: 24, maidens: 0, runsConceded: 38, wickets: 2, wides: 2, noBalls: 0, dots: 8, economyRate: 9.50 },
          { playerId: 'p203', playerName: 'Glenn Maxwell', bowlingOrder: 2, oversBowled: 4.0, legalBalls: 24, maidens: 0, runsConceded: 32, wickets: 1, wides: 1, noBalls: 0, dots: 7, economyRate: 8.00 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 62, overBall: '6.4', playerName: 'Ishan Kishan' },
          { wicketNumber: 2, score: 110, overBall: '11.2', playerName: 'Rohit Sharma' },
          { wicketNumber: 3, score: 175, overBall: '17.5', playerName: 'Hardik Pandya' }
        ],
        deliveries: []
      },
      {
        id: 'inn2_m1',
        matchId: 'm1',
        inningsNumber: 2,
        battingTeamId: 't2',
        bowlingTeamId: 't1',
        totalRuns: 184,
        totalWickets: 8,
        oversFormatted: '20.0',
        legalBalls: 120,
        extrasWides: 5,
        extrasNoballs: 0,
        extrasByes: 1,
        extrasLegbyes: 2,
        isCompleted: true,
        batting: [
          { playerId: 'p201', playerName: 'Virat Kohli', battingPosition: 1, runs: 68, balls: 44, fours: 7, sixes: 2, strikeRate: 154.55, dismissalType: 'caught', bowlerName: 'J. Bumrah', fielderName: 'S. Yadav', isNotOut: false },
          { playerId: 'p202', playerName: 'Faf du Plessis', battingPosition: 2, runs: 42, balls: 28, fours: 4, sixes: 2, strikeRate: 150.0, dismissalType: 'lbw', bowlerName: 'J. Bumrah', isNotOut: false },
          { playerId: 'p203', playerName: 'Glenn Maxwell', battingPosition: 3, runs: 28, balls: 14, fours: 2, sixes: 3, strikeRate: 200.0, dismissalType: 'bowled', bowlerName: 'H. Pandya', isNotOut: false },
          { playerId: 'p205', playerName: 'Dinesh Karthik', battingPosition: 4, runs: 24, balls: 16, fours: 3, sixes: 1, strikeRate: 150.0, dismissalType: 'not out', isNotOut: true }
        ],
        bowling: [
          { playerId: 'p103', playerName: 'Jasprit Bumrah', bowlingOrder: 1, oversBowled: 4.0, legalBalls: 24, maidens: 1, runsConceded: 22, wickets: 3, wides: 1, noBalls: 0, dots: 14, economyRate: 5.50 },
          { playerId: 'p104', playerName: 'Hardik Pandya', bowlingOrder: 2, oversBowled: 4.0, legalBalls: 24, maidens: 0, runsConceded: 35, wickets: 2, wides: 2, noBalls: 0, dots: 6, economyRate: 8.75 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 78, overBall: '8.2', playerName: 'Faf du Plessis' },
          { wicketNumber: 2, score: 125, overBall: '13.4', playerName: 'Virat Kohli' },
          { wicketNumber: 3, score: 152, overBall: '16.1', playerName: 'Glenn Maxwell' }
        ],
        deliveries: []
      }
    ]
  },
  {
    id: 'm2',
    tournamentId: 'tour-2026',
    matchNumber: 2,
    stage: 'League',
    team1Id: 't3',
    team2Id: 't4',
    venueId: 'v4',
    matchDate: '2026-03-21 19:30',
    scheduledOvers: 20,
    tossWinnerId: 't3',
    tossDecision: 'bat',
    status: 'live',
    notes: 'Super Kings chose to bat first on a dry spin-friendly Chennai pitch.',
    activeStrikerId: 'p301',
    activeNonStrikerId: 'p305',
    activeBowlerId: 'p402',
    innings: [
      {
        id: 'inn1_m2',
        matchId: 'm2',
        inningsNumber: 1,
        battingTeamId: 't3',
        bowlingTeamId: 't4',
        totalRuns: 142,
        totalWickets: 3,
        oversFormatted: '15.4',
        legalBalls: 94,
        extrasWides: 3,
        extrasNoballs: 1,
        extrasByes: 1,
        extrasLegbyes: 2,
        isCompleted: false,
        batting: [
          { playerId: 'p301', playerName: 'Ruturaj Gaikwad', battingPosition: 1, runs: 58, balls: 41, fours: 6, sixes: 2, strikeRate: 141.46, dismissalType: 'not out', isNotOut: true },
          { playerId: 'p303', playerName: 'MS Dhoni', battingPosition: 2, runs: 12, balls: 8, fours: 1, sixes: 1, strikeRate: 150.0, dismissalType: 'caught', bowlerName: 'S. Narine', fielderName: 'A. Russell', isNotOut: false },
          { playerId: 'p302', playerName: 'Ravindra Jadeja', battingPosition: 3, runs: 24, balls: 18, fours: 2, sixes: 0, strikeRate: 133.33, dismissalType: 'bowled', bowlerName: 'M. Starc', isNotOut: false },
          { playerId: 'p305', playerName: 'Shivam Dube', battingPosition: 4, runs: 34, balls: 18, fours: 2, sixes: 3, strikeRate: 188.89, dismissalType: 'not out', isNotOut: true }
        ],
        bowling: [
          { playerId: 'p404', playerName: 'Mitchell Starc', bowlingOrder: 1, oversBowled: 3.0, legalBalls: 18, maidens: 0, runsConceded: 28, wickets: 1, wides: 1, noBalls: 0, dots: 8, economyRate: 9.33 },
          { playerId: 'p403', playerName: 'Sunil Narine', bowlingOrder: 2, oversBowled: 4.0, legalBalls: 24, maidens: 0, runsConceded: 22, wickets: 1, wides: 0, noBalls: 0, dots: 11, economyRate: 5.50 },
          { playerId: 'p402', playerName: 'Andre Russell', bowlingOrder: 3, oversBowled: 2.4, legalBalls: 16, maidens: 0, runsConceded: 24, wickets: 1, wides: 2, noBalls: 1, dots: 5, economyRate: 9.00 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 32, overBall: '3.5', playerName: 'MS Dhoni' },
          { wicketNumber: 2, score: 79, overBall: '9.2', playerName: 'Ravindra Jadeja' },
          { wicketNumber: 3, score: 98, overBall: '11.4', playerName: 'Ajinkya Rahane' }
        ],
        deliveries: [
          { id: 'b1', inningsNumber: 1, overNumber: 14, ballNumber: 6, legalBallNumber: 6, bowlerId: 'p403', bowlerName: 'S. Narine', strikerId: 'p301', strikerName: 'R. Gaikwad', nonStrikerId: 'p305', nonStrikerName: 'S. Dube', runsBat: 1, extrasType: 'NONE', extrasRuns: 0, totalRuns: 1, isWicket: false, commentary: 'Pushed into the covers for a quick single.', timestamp: '19:55' },
          { id: 'b2', inningsNumber: 1, overNumber: 15, ballNumber: 1, legalBallNumber: 1, bowlerId: 'p402', bowlerName: 'A. Russell', strikerId: 'p301', strikerName: 'R. Gaikwad', nonStrikerId: 'p305', nonStrikerName: 'S. Dube', runsBat: 4, extrasType: 'NONE', extrasRuns: 0, totalRuns: 4, isWicket: false, commentary: 'FOUR! Slashed over backward point with ferocious power!', timestamp: '19:57' },
          { id: 'b3', inningsNumber: 1, overNumber: 15, ballNumber: 2, legalBallNumber: 2, bowlerId: 'p402', bowlerName: 'A. Russell', strikerId: 'p301', strikerName: 'R. Gaikwad', nonStrikerId: 'p305', nonStrikerName: 'S. Dube', runsBat: 0, extrasType: 'NONE', extrasRuns: 0, totalRuns: 0, isWicket: false, commentary: 'Beaten by the extra bounce outside off-stump.', timestamp: '19:58' },
          { id: 'b4', inningsNumber: 1, overNumber: 15, ballNumber: 3, legalBallNumber: 2, bowlerId: 'p402', bowlerName: 'A. Russell', strikerId: 'p301', strikerName: 'R. Gaikwad', nonStrikerId: 'p305', nonStrikerName: 'S. Dube', runsBat: 0, extrasType: 'WIDE', extrasRuns: 1, totalRuns: 1, isWicket: false, commentary: 'Wide ball signaled down the leg side.', timestamp: '19:59' },
          { id: 'b5', inningsNumber: 1, overNumber: 15, ballNumber: 4, legalBallNumber: 3, bowlerId: 'p402', bowlerName: 'A. Russell', strikerId: 'p301', strikerName: 'R. Gaikwad', nonStrikerId: 'p305', nonStrikerName: 'S. Dube', runsBat: 2, extrasType: 'NONE', extrasRuns: 0, totalRuns: 2, isWicket: false, commentary: 'Clipped off the pads to deep square leg, good hustle for two.', timestamp: '20:00' },
          { id: 'b6', inningsNumber: 1, overNumber: 15, ballNumber: 5, legalBallNumber: 4, bowlerId: 'p402', bowlerName: 'A. Russell', strikerId: 'p301', strikerName: 'R. Gaikwad', nonStrikerId: 'p305', nonStrikerName: 'S. Dube', runsBat: 6, extrasType: 'NONE', extrasRuns: 0, totalRuns: 6, isWicket: false, commentary: 'SIX! Dispatched straight into the stands! High and handsome!', timestamp: '20:01' }
        ]
      }
    ]
  },
  {
    id: 'm3',
    tournamentId: 'tour-2026',
    matchNumber: 3,
    stage: 'League',
    team1Id: 't5',
    team2Id: 't6',
    venueId: 'v5',
    matchDate: '2026-03-22 15:30',
    scheduledOvers: 20,
    status: 'scheduled',
    notes: 'Afternoon clash at Narendra Modi Stadium, Ahmedabad.',
    innings: []
  },
  {
    id: 'm4',
    tournamentId: 'tour-2026',
    matchNumber: 4,
    stage: 'League',
    team1Id: 't1',
    team2Id: 't3',
    venueId: 'v1',
    matchDate: '2026-03-23 19:30',
    scheduledOvers: 20,
    status: 'scheduled',
    notes: 'Epic rivalry: Mumbai Titans vs Chennai Super Kings.',
    innings: []
  }
];

export const initialStandings: TournamentStanding[] = [
  {
    tournamentId: 'tour-2026',
    teamId: 't1',
    groupName: 'Group A',
    matchesPlayed: 1,
    won: 1,
    lost: 0,
    tied: 0,
    noResult: 0,
    points: 2,
    runsScored: 198,
    oversFaced: 20.0,
    runsConceded: 184,
    oversBowled: 20.0,
    netRunRate: 0.700,
    form: ['W']
  },
  {
    tournamentId: 'tour-2026',
    teamId: 't3',
    groupName: 'Group A',
    matchesPlayed: 0,
    won: 0,
    lost: 0,
    tied: 0,
    noResult: 0,
    points: 0,
    runsScored: 0,
    oversFaced: 0.0,
    runsConceded: 0,
    oversBowled: 0.0,
    netRunRate: 0.000,
    form: []
  },
  {
    tournamentId: 'tour-2026',
    teamId: 't2',
    groupName: 'Group A',
    matchesPlayed: 1,
    won: 0,
    lost: 1,
    tied: 0,
    noResult: 0,
    points: 0,
    runsScored: 184,
    oversFaced: 20.0,
    runsConceded: 198,
    oversBowled: 20.0,
    netRunRate: -0.700,
    form: ['L']
  },
  {
    tournamentId: 'tour-2026',
    teamId: 't4',
    groupName: 'Group B',
    matchesPlayed: 0,
    won: 0,
    lost: 0,
    tied: 0,
    noResult: 0,
    points: 0,
    runsScored: 0,
    oversFaced: 0.0,
    runsConceded: 0,
    oversBowled: 0.0,
    netRunRate: 0.000,
    form: []
  },
  {
    tournamentId: 'tour-2026',
    teamId: 't5',
    groupName: 'Group B',
    matchesPlayed: 0,
    won: 0,
    lost: 0,
    tied: 0,
    noResult: 0,
    points: 0,
    runsScored: 0,
    oversFaced: 0.0,
    runsConceded: 0,
    oversBowled: 0.0,
    netRunRate: 0.000,
    form: []
  },
  {
    tournamentId: 'tour-2026',
    teamId: 't6',
    groupName: 'Group B',
    matchesPlayed: 0,
    won: 0,
    lost: 0,
    tied: 0,
    noResult: 0,
    points: 0,
    runsScored: 0,
    oversFaced: 0.0,
    runsConceded: 0,
    oversBowled: 0.0,
    netRunRate: 0.000,
    form: []
  }
];
