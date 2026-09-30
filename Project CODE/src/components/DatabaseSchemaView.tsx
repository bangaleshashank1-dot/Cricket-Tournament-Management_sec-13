import React, { useState } from 'react';
import { 
  Database, 
  Code, 
  Table, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'sql' | 'prisma' | 'queries'>('tables');
  const [copied, setCopied] = useState(false);

  const tablesList = [
    {
      name: 'tournaments',
      desc: 'Stores tournament metadata, format (T20/ODI/Test), overs, points rules, dates and status.',
      pk: 'id (VARCHAR)',
      fks: []
    },
    {
      name: 'venues',
      desc: 'Stadium facilities, city, country, spectator capacity, and pitch characteristics.',
      pk: 'id (VARCHAR)',
      fks: []
    },
    {
      name: 'teams',
      desc: 'Franchises/clubs, short codes (CSK, MI), brand colors, logos, head coaches.',
      pk: 'id (VARCHAR)',
      fks: ['home_venue_id -> venues.id']
    },
    {
      name: 'tournament_teams',
      desc: 'Many-to-Many bridge enlisting teams in tournaments with Group assignments (Group A, Group B).',
      pk: '(tournament_id, team_id)',
      fks: ['tournament_id -> tournaments.id', 'team_id -> teams.id']
    },
    {
      name: 'players',
      desc: 'Player registry, batting style (RHB/LHB), bowling style, primary role, bio details.',
      pk: 'id (VARCHAR)',
      fks: []
    },
    {
      name: 'tournament_squads',
      desc: 'Official tournament squad roster linking players to teams with jersey numbers and captain tags.',
      pk: 'id (VARCHAR)',
      fks: ['tournament_id -> tournaments.id', 'team_id -> teams.id', 'player_id -> players.id']
    },
    {
      name: 'matches',
      desc: 'Fixture schedules, stage (League, Semis, Final), toss results, match status, winner and margin.',
      pk: 'id (VARCHAR)',
      fks: ['tournament_id -> tournaments.id', 'team1_id -> teams.id', 'team2_id -> teams.id', 'venue_id -> venues.id']
    },
    {
      name: 'match_innings',
      desc: 'Per-innings scorekeeper (Innings 1, Innings 2, Super Over), runs, wickets, overs, extras breakdown.',
      pk: 'id (VARCHAR)',
      fks: ['match_id -> matches.id', 'batting_team_id -> teams.id', 'bowling_team_id -> teams.id']
    },
    {
      name: 'deliveries',
      desc: 'High-granularity ball-by-ball record: over, ball, striker, bowler, runs, extras, wickets, commentary.',
      pk: 'id (VARCHAR)',
      fks: ['innings_id -> match_innings.id', 'bowler_id -> players.id', 'striker_id -> players.id']
    },
    {
      name: 'batting_scorecards',
      desc: 'Aggregated batting stats per batter per innings (runs, balls, 4s, 6s, strike rate, dismissal).',
      pk: 'id (VARCHAR)',
      fks: ['innings_id -> match_innings.id', 'player_id -> players.id']
    },
    {
      name: 'bowling_scorecards',
      desc: 'Aggregated bowling stats per bowler per innings (overs, maidens, runs, wickets, economy).',
      pk: 'id (VARCHAR)',
      fks: ['innings_id -> match_innings.id', 'player_id -> players.id']
    },
    {
      name: 'fall_of_wickets',
      desc: 'Historical timeline of wicket dismissals (score, over, batsman out).',
      pk: 'id (VARCHAR)',
      fks: ['innings_id -> match_innings.id', 'player_out_id -> players.id']
    },
    {
      name: 'tournament_standings',
      desc: 'Live league standings caching played, won, lost, points, and mathematically computed Net Run Rate (NRR).',
      pk: '(tournament_id, team_id)',
      fks: ['tournament_id -> tournaments.id', 'team_id -> teams.id']
    }
  ];

  const sqlSchemaSnippet = `-- PostgreSQL / MySQL / SQLite Relational DDL
CREATE TABLE tournaments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    format VARCHAR(20) DEFAULT 'T20',
    overs_per_innings INT DEFAULT 20,
    points_for_win INT DEFAULT 2,
    points_for_tie INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'ongoing'
);

CREATE TABLE teams (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    city VARCHAR(100),
    primary_color VARCHAR(20),
    coach VARCHAR(100)
);

CREATE TABLE matches (
    id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) REFERENCES tournaments(id) ON DELETE CASCADE,
    match_number INT NOT NULL,
    stage VARCHAR(50) DEFAULT 'League',
    team1_id VARCHAR(36) REFERENCES teams(id),
    team2_id VARCHAR(36) REFERENCES teams(id),
    venue_id VARCHAR(36),
    match_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    winner_id VARCHAR(36)
);

CREATE TABLE match_innings (
    id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) REFERENCES matches(id) ON DELETE CASCADE,
    innings_number INT NOT NULL,
    batting_team_id VARCHAR(36) REFERENCES teams(id),
    bowling_team_id VARCHAR(36) REFERENCES teams(id),
    total_runs INT DEFAULT 0,
    total_wickets INT DEFAULT 0,
    total_overs NUMERIC(4, 1) DEFAULT 0.0,
    extras_wides INT DEFAULT 0,
    extras_noballs INT DEFAULT 0
);

CREATE TABLE deliveries (
    id VARCHAR(36) PRIMARY KEY,
    innings_id VARCHAR(36) REFERENCES match_innings(id) ON DELETE CASCADE,
    over_number INT NOT NULL,
    ball_number INT NOT NULL,
    bowler_id VARCHAR(36) REFERENCES players(id),
    striker_id VARCHAR(36) REFERENCES players(id),
    runs_bat INT DEFAULT 0,
    extras_type VARCHAR(20) DEFAULT 'NONE',
    extras_runs INT DEFAULT 0,
    is_wicket BOOLEAN DEFAULT FALSE,
    wicket_type VARCHAR(50),
    commentary TEXT
);`;

  const prismaSnippet = `// Prisma ORM Definition
model Tournament {
  id               String            @id @default(uuid())
  name             String
  code             String            @unique
  format           String            @default("T20")
  oversPerInnings  Int               @default(20)
  status           String            @default("ongoing")
  teams            TournamentTeam[]
  matches          Match[]
  standings        TournamentStanding[]
}

model Match {
  id               String            @id @default(uuid())
  tournamentId     String
  matchNumber      Int
  team1Id          String
  team2Id          String
  status           MatchStatus       @default(SCHEDULED)
  tournament       Tournament        @relation(fields: [tournamentId], references: [id])
  innings          MatchInning[]
}

model Delivery {
  id               String            @id @default(uuid())
  inningsId        String
  overNumber       Int
  ballNumber       Int
  bowlerId         String
  strikerId        String
  runsBat          Int               @default(0)
  extrasType       ExtrasType        @default(NONE)
  isWicket         Boolean           @default(false)
  innings          MatchInning       @relation(fields: [inningsId], references: [id])
}`;

  const querySnippet = `-- 1. Mathematical Net Run Rate (NRR) Formula
SELECT 
    t.name AS team_name,
    ts.matches_played,
    ts.won,
    ts.points,
    ROUND(
        (ts.runs_scored::NUMERIC / NULLIF((FLOOR(ts.overs_faced) + (ts.overs_faced - FLOOR(ts.overs_faced)) * 10 / 6), 0)) -
        (ts.runs_conceded::NUMERIC / NULLIF((FLOOR(ts.overs_bowled) + (ts.overs_bowled - FLOOR(ts.overs_bowled)) * 10 / 6), 0)),
        3
    ) AS calculated_nrr
FROM tournament_standings ts
JOIN teams t ON ts.team_id = t.id
ORDER BY ts.points DESC, calculated_nrr DESC;

-- 2. Orange Cap (Most Runs) Leaderboard View
SELECT 
    p.known_as,
    t.short_name AS team,
    COUNT(bs.id) AS innings,
    SUM(bs.runs) AS total_runs,
    ROUND((SUM(bs.runs)::NUMERIC / NULLIF(SUM(bs.balls), 0)) * 100, 2) AS strike_rate
FROM players p
JOIN batting_scorecards bs ON p.id = bs.player_id
JOIN tournament_squads ts ON p.id = ts.player_id
JOIN teams t ON ts.team_id = t.id
GROUP BY p.known_as, t.short_name
ORDER BY total_runs DESC;`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Relational Architecture Complete</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Cricket Tournament Database Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-grade schema covering tournaments, franchises, player rosters, ball-by-ball deliveries, and dynamic NRR calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(activeSubTab === 'prisma' ? prismaSnippet : activeSubTab === 'queries' ? querySnippet : sqlSchemaSnippet)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Schema Code'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'tables', label: 'Tables & Schema Model (13 Tables)', icon: Table },
          { id: 'sql', label: 'schema.sql (PostgreSQL / SQLite / MySQL)', icon: Code },
          { id: 'prisma', label: 'schema.prisma (Modern ORM)', icon: Cpu },
          { id: 'queries', label: 'Analytical SQL Queries', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: TABLES LIST */}
      {activeSubTab === 'tables' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tablesList.map(t => (
              <div
                key={t.name}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-blue-400 flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-blue-500" />
                    {t.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    PK: {t.pk}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{t.desc}</p>
                {t.fks.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Relations (FK):</div>
                    {t.fks.map((fk, idx) => (
                      <div key={idx} className="text-emerald-400/90 truncate">
                        &bull; {fk}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SQL SCHEMA */}
      {activeSubTab === 'sql' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-xs text-slate-200 overflow-x-auto">
          <pre className="text-emerald-400/90 leading-relaxed whitespace-pre">
            {sqlSchemaSnippet}
          </pre>
          <div className="mt-4 pt-4 border-t border-slate-800 text-slate-400 text-xs font-sans">
            The full complete schema is saved at: <code className="text-blue-400">database/schema.sql</code> (ready to run on PostgreSQL, SQLite, or MySQL).
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRISMA */}
      {activeSubTab === 'prisma' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-xs text-slate-200 overflow-x-auto">
          <pre className="text-purple-300/90 leading-relaxed whitespace-pre">
            {prismaSnippet}
          </pre>
          <div className="mt-4 pt-4 border-t border-slate-800 text-slate-400 text-xs font-sans">
            The complete Prisma schema is saved at: <code className="text-blue-400">database/schema.prisma</code> (ready to run with <code>npx prisma db push</code>).
          </div>
        </div>
      )}

      {/* SUBTAB 4: SQL QUERIES */}
      {activeSubTab === 'queries' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-xs text-slate-200 overflow-x-auto">
          <pre className="text-amber-300/90 leading-relaxed whitespace-pre">
            {querySnippet}
          </pre>
          <div className="mt-4 pt-4 border-t border-slate-800 text-slate-400 text-xs font-sans">
            Ready-to-use analytical SQL queries are saved at: <code className="text-blue-400">database/queries.sql</code>.
          </div>
        </div>
      )}
    </div>
  );
};
