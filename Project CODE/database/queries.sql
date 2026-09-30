-- ==============================================================================
-- CRICKET TOURNAMENT MANAGEMENT SYSTEM - ESSENTIAL SQL QUERIES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. MATHEMATICAL NET RUN RATE (NRR) RECALCULATION
-- Formula: NRR = (Total Runs Scored / Overs Faced) - (Total Runs Conceded / Overs Bowled)
-- Note: Overs like 19.4 must be converted to balls / 6.0 (e.g. 19 + 4/6 = 19.667)
-- ------------------------------------------------------------------------------
SELECT 
    t.name AS team_name,
    ts.matches_played,
    ts.won,
    ts.lost,
    ts.tied,
    ts.points,
    ROUND(
        (ts.runs_scored::NUMERIC / NULLIF((FLOOR(ts.overs_faced) + (ts.overs_faced - FLOOR(ts.overs_faced)) * 10 / 6), 0)) -
        (ts.runs_conceded::NUMERIC / NULLIF((FLOOR(ts.overs_bowled) + (ts.overs_bowled - FLOOR(ts.overs_bowled)) * 10 / 6), 0)),
        3
    ) AS calculated_nrr
FROM tournament_standings ts
JOIN teams t ON ts.team_id = t.id
WHERE ts.tournament_id = 'tour-2026'
ORDER BY ts.points DESC, calculated_nrr DESC;

-- ------------------------------------------------------------------------------
-- 2. LIVE MATCH INNINGS FULL BATTING SCORECARD
-- Fetches active batters, runs, balls, boundaries, strike rate, dismissal state
-- ------------------------------------------------------------------------------
SELECT 
    p.known_as AS batsman_name,
    bs.batting_position,
    bs.runs,
    bs.balls,
    bs.fours,
    bs.sixes,
    ROUND(CASE WHEN bs.balls > 0 THEN (bs.runs::NUMERIC / bs.balls) * 100 ELSE 0.00 END, 2) AS strike_rate,
    CASE 
        WHEN bs.is_not_out = TRUE THEN 'Batting'
        WHEN bs.dismissal_type = 'bowled' THEN CONCAT('b ', bowler.known_as)
        WHEN bs.dismissal_type = 'caught' THEN CONCAT('c ', fielder.known_as, ' b ', bowler.known_as)
        WHEN bs.dismissal_type = 'lbw' THEN CONCAT('lbw b ', bowler.known_as)
        WHEN bs.dismissal_type = 'run_out' THEN CONCAT('run out (', fielder.known_as, ')')
        ELSE bs.dismissal_type
    END AS status_description
FROM batting_scorecards bs
JOIN players p ON bs.player_id = p.id
LEFT JOIN players bowler ON bs.bowler_id = bowler.id
LEFT JOIN players fielder ON bs.fielder_id = fielder.id
WHERE bs.innings_id = 'inn1_m1'
ORDER BY bs.batting_position ASC;

-- ------------------------------------------------------------------------------
-- 3. LIVE MATCH INNINGS BOWLING SCORECARD
-- Calculates overs, maidens, runs conceded, wickets, economy
-- ------------------------------------------------------------------------------
SELECT 
    p.known_as AS bowler_name,
    bw.bowling_order,
    bw.overs_bowled,
    bw.maidens,
    bw.runs_conceded,
    bw.wickets,
    bw.wides,
    bw.no_balls,
    bw.dots,
    ROUND(
        CASE 
            WHEN bw.legal_balls > 0 THEN (bw.runs_conceded::NUMERIC / (bw.legal_balls::NUMERIC / 6.0))
            ELSE 0.00 
        END, 2
    ) AS economy_rate
FROM bowling_scorecards bw
JOIN players p ON bw.player_id = p.id
WHERE bw.innings_id = 'inn1_m1'
ORDER BY bw.bowling_order ASC;

-- ------------------------------------------------------------------------------
-- 4. OVER-BY-OVER DELIVERIES TIMELINE (Last 12 balls)
-- ------------------------------------------------------------------------------
SELECT 
    d.over_number + 1 AS over_no,
    d.ball_number,
    b.known_as AS bowler,
    s.known_as AS striker,
    d.runs_bat,
    d.extras_type,
    d.extras_runs,
    d.total_runs,
    d.is_wicket,
    d.wicket_type,
    d.commentary
FROM deliveries d
JOIN players b ON d.bowler_id = b.id
JOIN players s ON d.striker_id = s.id
WHERE d.innings_id = 'inn1_m2'
ORDER BY d.over_number DESC, d.ball_number DESC
LIMIT 12;

-- ------------------------------------------------------------------------------
-- 5. MOST BOUNDARIES & SIXES HITTER LEADERBOARD
-- ------------------------------------------------------------------------------
SELECT 
    p.known_as AS player_name,
    t.short_name AS team,
    SUM(bs.fours) AS total_fours,
    SUM(bs.sixes) AS total_sixes,
    (SUM(bs.fours) * 4 + SUM(bs.sixes) * 6) AS boundary_runs
FROM batting_scorecards bs
JOIN players p ON bs.player_id = p.id
JOIN match_innings mi ON bs.innings_id = mi.id
JOIN matches m ON mi.match_id = m.id
JOIN tournament_squads ts ON p.id = ts.player_id AND m.tournament_id = ts.tournament_id
JOIN teams t ON ts.team_id = t.id
WHERE m.tournament_id = 'tour-2026'
GROUP BY p.known_as, t.short_name
ORDER BY total_sixes DESC, total_fours DESC
LIMIT 10;
