-- ==============================================================================
-- CRICKET TOURNAMENT MANAGEMENT SYSTEM - DATABASE SCHEMA (DDL)
-- Compatible with PostgreSQL, SQLite, and MySQL
-- ==============================================================================

-- 1. VENUES TABLE
CREATE TABLE IF NOT EXISTS venues (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 20000,
    pitch_type VARCHAR(50) DEFAULT 'Balanced', -- 'Batting', 'Bowling', 'Spin', 'Balanced'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TOURNAMENTS TABLE
CREATE TABLE IF NOT EXISTS tournaments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE, -- e.g., 'ASL2026', 'IPL2026'
    season VARCHAR(20) NOT NULL,       -- e.g., '2026'
    format VARCHAR(20) NOT NULL DEFAULT 'T20', -- 'T20', 'ODI', 'T10', 'TEST'
    overs_per_innings INT NOT NULL DEFAULT 20,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    points_for_win INT DEFAULT 2,
    points_for_tie INT DEFAULT 1,
    points_for_nr INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'ongoing', -- 'upcoming', 'ongoing', 'completed'
    banner_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TEAMS TABLE
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(10) NOT NULL, -- e.g., 'CSK', 'RCB', 'MI'
    city VARCHAR(100) NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#1E40AF',
    secondary_color VARCHAR(20) DEFAULT '#FBBF24',
    coach VARCHAR(100),
    home_venue_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (home_venue_id) REFERENCES venues(id) ON DELETE SET NULL
);

-- 4. TOURNAMENT TEAMS (M:N with Group Assignment)
CREATE TABLE IF NOT EXISTS tournament_teams (
    tournament_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    group_name VARCHAR(20) DEFAULT 'Group A', -- 'Group A', 'Group B', 'League'
    seed INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tournament_id, team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- 5. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    known_as VARCHAR(100) NOT NULL,
    dob DATE,
    batting_style VARCHAR(50) DEFAULT 'Right Handed Bat', -- 'Right Handed Bat', 'Left Handed Bat'
    bowling_style VARCHAR(50) DEFAULT 'Right-arm medium', -- 'Right-arm fast', 'Left-arm orthodox', etc.
    primary_role VARCHAR(50) DEFAULT 'All-Rounder',       -- 'Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'
    avatar_url TEXT,
    country VARCHAR(100) DEFAULT 'India',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TOURNAMENT SQUADS (Roster per tournament)
CREATE TABLE IF NOT EXISTS tournament_squads (
    id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    player_id VARCHAR(36) NOT NULL,
    is_captain BOOLEAN DEFAULT FALSE,
    is_vice_captain BOOLEAN DEFAULT FALSE,
    is_wicketkeeper BOOLEAN DEFAULT FALSE,
    jersey_number INT,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE (tournament_id, team_id, player_id)
);

-- 7. MATCHES TABLE
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(36) PRIMARY KEY,
    tournament_id VARCHAR(36) NOT NULL,
    match_number INT NOT NULL,
    stage VARCHAR(50) DEFAULT 'League', -- 'League', 'Quarter-Final', 'Semi-Final', 'Final'
    team1_id VARCHAR(36) NOT NULL,
    team2_id VARCHAR(36) NOT NULL,
    venue_id VARCHAR(36) NOT NULL,
    match_date TIMESTAMP NOT NULL,
    scheduled_overs INT DEFAULT 20,
    toss_winner_id VARCHAR(36),
    toss_decision VARCHAR(10), -- 'bat', 'bowl'
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'innings_break', 'completed', 'abandoned', 'tied'
    winner_id VARCHAR(36),
    win_margin INT,
    win_margin_type VARCHAR(20), -- 'runs', 'wickets'
    player_of_the_match_id VARCHAR(36),
    is_dls_applied BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE RESTRICT,
    FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE RESTRICT,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE RESTRICT,
    FOREIGN KEY (toss_winner_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (player_of_the_match_id) REFERENCES players(id) ON DELETE SET NULL
);

-- 8. MATCH INNINGS TABLE
CREATE TABLE IF NOT EXISTS match_innings (
    id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    innings_number INT NOT NULL, -- 1, 2 (or 3, 4 for Super Over)
    batting_team_id VARCHAR(36) NOT NULL,
    bowling_team_id VARCHAR(36) NOT NULL,
    total_runs INT DEFAULT 0,
    total_wickets INT DEFAULT 0,
    total_overs NUMERIC(4, 1) DEFAULT 0.0, -- e.g. 19.4
    balls_bowled INT DEFAULT 0,
    extras_wides INT DEFAULT 0,
    extras_noballs INT DEFAULT 0,
    extras_byes INT DEFAULT 0,
    extras_legbyes INT DEFAULT 0,
    extras_penalties INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (batting_team_id) REFERENCES teams(id) ON DELETE RESTRICT,
    FOREIGN KEY (bowling_team_id) REFERENCES teams(id) ON DELETE RESTRICT,
    UNIQUE (match_id, innings_number)
);

-- 9. DELIVERIES (Ball-by-Ball Granular Engine)
CREATE TABLE IF NOT EXISTS deliveries (
    id VARCHAR(36) PRIMARY KEY,
    innings_id VARCHAR(36) NOT NULL,
    over_number INT NOT NULL,       -- 0 to (overs - 1)
    ball_number INT NOT NULL,       -- 1, 2, 3 ... legal + extra attempts
    legal_ball_number INT NOT NULL, -- 1 to 6
    bowler_id VARCHAR(36) NOT NULL,
    striker_id VARCHAR(36) NOT NULL,
    non_striker_id VARCHAR(36) NOT NULL,
    runs_bat INT DEFAULT 0,
    extras_type VARCHAR(20) DEFAULT 'NONE', -- 'NONE', 'WIDE', 'NO_BALL', 'BYE', 'LEG_BYE', 'PENALTY'
    extras_runs INT DEFAULT 0,
    total_runs INT DEFAULT 0,
    is_wicket BOOLEAN DEFAULT FALSE,
    wicket_type VARCHAR(50), -- 'bowled', 'caught', 'lbw', 'run_out', 'stumped', 'hit_wicket', 'retired_hurt'
    player_out_id VARCHAR(36),
    fielder_id VARCHAR(36),
    commentary TEXT,
    wagon_zone VARCHAR(20), -- 'Cover', 'Mid-Wicket', 'Long-On', 'Third-Man', 'Square-Leg', 'Straight'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (innings_id) REFERENCES match_innings(id) ON DELETE CASCADE,
    FOREIGN KEY (bowler_id) REFERENCES players(id) ON DELETE RESTRICT,
    FOREIGN KEY (striker_id) REFERENCES players(id) ON DELETE RESTRICT,
    FOREIGN KEY (non_striker_id) REFERENCES players(id) ON DELETE RESTRICT,
    FOREIGN KEY (player_out_id) REFERENCES players(id) ON DELETE SET NULL,
    FOREIGN KEY (fielder_id) REFERENCES players(id) ON DELETE SET NULL
);

-- 10. BATTING SCORECARDS (Aggregated / Fast Read per Player per Innings)
CREATE TABLE IF NOT EXISTS batting_scorecards (
    id VARCHAR(36) PRIMARY KEY,
    innings_id VARCHAR(36) NOT NULL,
    player_id VARCHAR(36) NOT NULL,
    batting_position INT NOT NULL,
    runs INT DEFAULT 0,
    balls INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    strike_rate NUMERIC(6, 2) DEFAULT 0.00,
    dismissal_type VARCHAR(50),
    bowler_id VARCHAR(36),
    fielder_id VARCHAR(36),
    is_not_out BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (innings_id) REFERENCES match_innings(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE RESTRICT,
    FOREIGN KEY (bowler_id) REFERENCES players(id) ON DELETE SET NULL,
    FOREIGN KEY (fielder_id) REFERENCES players(id) ON DELETE SET NULL,
    UNIQUE (innings_id, player_id)
);

-- 11. BOWLING SCORECARDS (Aggregated / Fast Read per Bowler per Innings)
CREATE TABLE IF NOT EXISTS bowling_scorecards (
    id VARCHAR(36) PRIMARY KEY,
    innings_id VARCHAR(36) NOT NULL,
    player_id VARCHAR(36) NOT NULL,
    bowling_order INT NOT NULL,
    overs_bowled NUMERIC(4, 1) DEFAULT 0.0,
    legal_balls INT DEFAULT 0,
    maidens INT DEFAULT 0,
    runs_conceded INT DEFAULT 0,
    wickets INT DEFAULT 0,
    wides INT DEFAULT 0,
    no_balls INT DEFAULT 0,
    dots INT DEFAULT 0,
    economy_rate NUMERIC(5, 2) DEFAULT 0.00,
    FOREIGN KEY (innings_id) REFERENCES match_innings(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE RESTRICT,
    UNIQUE (innings_id, player_id)
);

-- 12. FALL OF WICKETS
CREATE TABLE IF NOT EXISTS fall_of_wickets (
    id VARCHAR(36) PRIMARY KEY,
    innings_id VARCHAR(36) NOT NULL,
    wicket_number INT NOT NULL,
    score INT NOT NULL,
    over_ball NUMERIC(4, 1) NOT NULL,
    player_out_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (innings_id) REFERENCES match_innings(id) ON DELETE CASCADE,
    FOREIGN KEY (player_out_id) REFERENCES players(id) ON DELETE RESTRICT,
    UNIQUE (innings_id, wicket_number)
);

-- 13. TOURNAMENT STANDINGS (Cached / Persistent Standings)
CREATE TABLE IF NOT EXISTS tournament_standings (
    tournament_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36) NOT NULL,
    group_name VARCHAR(20) DEFAULT 'Group A',
    matches_played INT DEFAULT 0,
    won INT DEFAULT 0,
    lost INT DEFAULT 0,
    tied INT DEFAULT 0,
    no_result INT DEFAULT 0,
    points INT DEFAULT 0,
    runs_scored INT DEFAULT 0,
    overs_faced NUMERIC(6, 1) DEFAULT 0.0,
    runs_conceded INT DEFAULT 0,
    overs_bowled NUMERIC(6, 1) DEFAULT 0.0,
    net_run_rate NUMERIC(6, 3) DEFAULT 0.000,
    PRIMARY KEY (tournament_id, team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id, status);
CREATE INDEX IF NOT EXISTS idx_deliveries_innings ON deliveries(innings_id, over_number);
CREATE INDEX IF NOT EXISTS idx_deliveries_batsman ON deliveries(striker_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_bowler ON deliveries(bowler_id);
CREATE INDEX IF NOT EXISTS idx_batting_scorecards_player ON batting_scorecards(player_id);
CREATE INDEX IF NOT EXISTS idx_bowling_scorecards_player ON bowling_scorecards(player_id);

-- ==============================================================================
-- ANALYTICAL VIEWS
-- ==============================================================================

-- View: Orange Cap Leaderboard (Most Runs)
CREATE OR REPLACE VIEW view_orange_cap AS
SELECT 
    p.id AS player_id,
    p.known_as,
    t.name AS team_name,
    t.short_name AS team_code,
    COUNT(bs.id) AS innings_played,
    SUM(bs.runs) AS total_runs,
    MAX(bs.runs) AS highest_score,
    ROUND(AVG(bs.runs), 2) AS batting_average,
    ROUND(CASE WHEN SUM(bs.balls) > 0 THEN (SUM(bs.runs)::NUMERIC / SUM(bs.balls)) * 100 ELSE 0 END, 2) AS strike_rate,
    SUM(bs.fours) AS total_fours,
    SUM(bs.sixes) AS total_sixes
FROM players p
JOIN batting_scorecards bs ON p.id = bs.player_id
JOIN match_innings mi ON bs.innings_id = mi.id
JOIN matches m ON mi.match_id = m.id
JOIN tournament_squads ts ON p.id = ts.player_id AND m.tournament_id = ts.tournament_id
JOIN teams t ON ts.team_id = t.id
GROUP BY p.id, p.known_as, t.name, t.short_name
ORDER BY total_runs DESC, strike_rate DESC;

-- View: Purple Cap Leaderboard (Most Wickets)
CREATE OR REPLACE VIEW view_purple_cap AS
SELECT 
    p.id AS player_id,
    p.known_as,
    t.name AS team_name,
    t.short_name AS team_code,
    COUNT(bw.id) AS innings_bowled,
    SUM(bw.wickets) AS total_wickets,
    SUM(bw.runs_conceded) AS runs_conceded,
    SUM(bw.legal_balls) AS total_balls,
    ROUND(CASE WHEN SUM(bw.legal_balls) > 0 THEN (SUM(bw.runs_conceded)::NUMERIC / (SUM(bw.legal_balls)::NUMERIC / 6)) ELSE 0 END, 2) AS economy_rate,
    ROUND(CASE WHEN SUM(bw.wickets) > 0 THEN (SUM(bw.runs_conceded)::NUMERIC / SUM(bw.wickets)) ELSE 0 END, 2) AS bowling_average
FROM players p
JOIN bowling_scorecards bw ON p.id = bw.player_id
JOIN match_innings mi ON bw.innings_id = mi.id
JOIN matches m ON mi.match_id = m.id
JOIN tournament_squads ts ON p.id = ts.player_id AND m.tournament_id = ts.tournament_id
JOIN teams t ON ts.team_id = t.id
GROUP BY p.id, p.known_as, t.name, t.short_name
ORDER BY total_wickets DESC, economy_rate ASC;
