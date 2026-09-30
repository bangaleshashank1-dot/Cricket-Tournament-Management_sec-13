# CricPulse Pro - Cricket Tournament Management System

A production-grade **Cricket Tournament Management System** featuring a complete relational database design (PostgreSQL/MySQL/SQLite + Prisma ORM) and a modern, high-performance React + Vite + Tailwind CSS frontend application.

---

## 🌟 Key Features

### 1. Live Match Scoring Engine (`src/components/LiveScorer.tsx`)
- **Real-Time Umpire Console**: Interactive ball-by-ball keypad for recording runs (`0, 1, 2, 3, 4, 6`), extras (`Wide`, `No Ball`, `Leg Bye`, `Bye`), and wickets.
- **Strike & Bowler Automation**: Strike rotates automatically on odd runs (1, 3, 5) and at the end of each over (6 legal deliveries).
- **Undo Last Ball**: Multi-level state rollback stack restoring match score, batsman balls/runs, and bowler spells.
- **Dismissal Modal**: Choose dismissal mode (Bowled, Caught, Run Out, LBW, Stumped), fielder involved, and incoming new batsman.
- **Over Timeline**: Visual badges displaying the current over's deliveries (e.g. `[ 1 ] [ 4 ] [ • ] [ Wd ] [ 2 ] [ W ] [ 6 ]`).
- **Live Commentary Feed**: Automated descriptive play-by-play commentary log.

### 2. Tournament Standings & Net Run Rate (NRR) Engine (`src/components/PointsTableView.tsx`)
- **Strict ICC NRR Formula**:
  $$\text{NRR} = \left(\frac{\text{Total Runs Scored}}{\text{Total Overs Faced}}\right) - \left(\frac{\text{Total Runs Conceded}}{\text{Total Overs Bowled}}\right)$$
- Group A & Group B filtering, form guides (last 5 results: W/L), and qualifier zone highlighting.
- Built-in interactive NRR breakdown modal explaining the mathematical steps with real numbers.

### 3. Comprehensive Database Design (`database/`)
- **`database/schema.sql`**: Production relational DDL for PostgreSQL / MySQL / SQLite with 13 tables, primary/foreign keys, indexes, and analytical views (`view_orange_cap`, `view_purple_cap`).
- **`database/schema.prisma`**: Modern Prisma ORM schema ready for TypeScript / Next.js / Express backends.
- **`database/seed_data.sql`**: Complete realistic dataset ("Apex Super League 2026", 6 teams, squads, matches, completed scorecard, live match).
- **`database/queries.sql`**: Pre-tested SQL queries for live scorecards, NRR calculations, and leaderboards.
- **In-App Database Explorer**: Built-in tab allowing developers to browse tables, inspect relations, and copy schema code directly from the UI.

### 4. Player Honors & Leaderboards (`src/components/LeaderboardsView.tsx`)
- 🟠 **Orange Cap**: Top run scorers with Average, Strike Rate, 4s, and 6s.
- 🟣 **Purple Cap**: Top wicket-takers with Economy Rate, Bowling Average, and Maidens.
- 🚀 **Maximum Sixes & Highest Individual Scores**: Instant aggregate rankings across all tournament matches.

### 5. Franchise & Squad Management (`src/components/TeamsView.tsx`)
- Team roster management with custom franchise colors, logos, home venues, and coaching staff.
- Detailed player cards with roles (Batsman, Bowler, All-Rounder, Wicketkeeper), batting styles, bowling styles, and jersey numbers.
- Modals for registering new franchises and enlisting players.

### 6. Fixture Scheduling & Round-Robin Generator (`src/components/FixturesView.tsx`)
- Filter by status (`All`, `Live`, `Upcoming`, `Completed`).
- 1-click **Auto-Generate Round Robin Fixtures** algorithm scheduling league matches across venues.
- Schedule match dialog with customizable stage, venue, and overs.

---

## 🚀 Quick Start Guide

### 1. Set Workspace Directory
Open this folder in your code editor / IDE:
```
C:\Users\laxma\.gemini\antigravity\scratch\cricket-tournament-system
```

### 2. Start the Frontend Application
```powershell
cd C:\Users\laxma\.gemini\antigravity\scratch\cricket-tournament-system
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the system!

### 3. Build for Production
```powershell
npm run build
```

### 4. Database Setup (Optional backend use)
- **PostgreSQL / MySQL / SQLite**: Run `database/schema.sql` followed by `database/seed_data.sql`.
- **Prisma**: Run `npx prisma db push` with `database/schema.prisma`.

---

## 📁 Project Architecture

```
cricket-tournament-system/
├── database/
│   ├── schema.sql           # Complete relational DDL & indexes
│   ├── schema.prisma        # Prisma ORM schema definition
│   ├── seed_data.sql        # Realistic tournament seed dataset
│   ├── queries.sql          # Analytical & live scorecard queries
│   └── README.md            # ER diagram & database documentation
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Top navigation & live match ticker
│   │   ├── Dashboard.tsx          # Tournament overview & spotlight
│   │   ├── LiveScorer.tsx         # Real-time ball-by-ball scoring console
│   │   ├── MatchScorecardModal.tsx# Tabbed professional match scorecard
│   │   ├── FixturesView.tsx       # Match schedule & round-robin generator
│   │   ├── PointsTableView.tsx    # Standings & interactive NRR modal
│   │   ├── LeaderboardsView.tsx   # Orange/Purple Cap & stats rankings
│   │   ├── TeamsView.tsx          # Team profiles & squad roster manager
│   │   └── DatabaseSchemaView.tsx # In-app interactive DB & SQL explorer
│   ├── context/
│   │   └── TournamentContext.tsx  # Central cricket state & scoring engine
│   ├── data/
│   │   └── mockData.ts            # Realistic initial seed state
│   ├── types/
│   │   └── cricket.ts             # Strict TypeScript domain interfaces
│   ├── App.tsx                    # Main app shell & routing
│   ├── main.tsx                   # React root mount
│   └── index.css                  # Tailwind styles & cricket palette
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── test_sql.py
```
