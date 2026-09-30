-- ==============================================================================
-- CRICKET TOURNAMENT MANAGEMENT SYSTEM - SEED DATA
-- Tournament: Apex Super League 2026 (ASL 2026)
-- ==============================================================================

-- 1. VENUES
INSERT INTO venues (id, name, city, country, capacity, pitch_type) VALUES
('v1', 'Wankhede Stadium', 'Mumbai', 'India', 33000, 'Batting'),
('v2', 'M. Chinnaswamy Stadium', 'Bengaluru', 'India', 38000, 'Batting'),
('v3', 'Eden Gardens', 'Kolkata', 'India', 68000, 'Spin'),
('v4', 'MA Chidambaram Stadium', 'Chennai', 'India', 38000, 'Spin'),
('v5', 'Narendra Modi Stadium', 'Ahmedabad', 'India', 132000, 'Balanced');

-- 2. TOURNAMENT
INSERT INTO tournaments (id, name, code, season, format, overs_per_innings, start_date, end_date, points_for_win, points_for_tie, points_for_nr, status, banner_url) VALUES
('tour-2026', 'Apex Super League 2026', 'ASL2026', '2026', 'T20', 20, '2026-03-20', '2026-05-28', 2, 1, 1, 'ongoing', 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80');

-- 3. TEAMS
INSERT INTO teams (id, name, short_name, city, logo_url, primary_color, secondary_color, coach, home_venue_id) VALUES
('t1', 'Mumbai Titans', 'MT', 'Mumbai', '🏏', '#004BA0', '#D4AF37', 'Mahela Jayawardene', 'v1'),
('t2', 'Bengaluru Challengers', 'BC', 'Bengaluru', '🦁', '#EC1C24', '#000000', 'Andy Flower', 'v2'),
('t3', 'Chennai Super Kings', 'CSK', 'Chennai', '⚡', '#FFFF00', '#0081E9', 'Stephen Fleming', 'v4'),
('t4', 'Kolkata Knights', 'KK', 'Kolkata', '⚔️', '#3A225D', '#D4AF37', 'Chandrakant Pandit', 'v3'),
('t5', 'Gujarat Strikers', 'GS', 'Ahmedabad', '🌪️', '#1B2133', '#E0A96D', 'Ashish Nehra', 'v5'),
('t6', 'Delhi Dynamos', 'DD', 'Delhi', '🦅', '#004C97', '#DC0032', 'Ricky Ponting', 'v1');

-- 4. TOURNAMENT TEAMS
INSERT INTO tournament_teams (tournament_id, team_id, group_name, seed) VALUES
('tour-2026', 't1', 'Group A', 1),
('tour-2026', 't2', 'Group A', 2),
('tour-2026', 't3', 'Group A', 3),
('tour-2026', 't4', 'Group B', 1),
('tour-2026', 't5', 'Group B', 2),
('tour-2026', 't6', 'Group B', 3);

-- 5. PLAYERS
INSERT INTO players (id, first_name, last_name, known_as, batting_style, bowling_style, primary_role, avatar_url, country) VALUES
-- Mumbai Titans
('p101', 'Rohit', 'Sharma', 'R. Sharma', 'Right Handed Bat', 'Right-arm offbreak', 'Batsman', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'India'),
('p102', 'Suryakumar', 'Yadav', 'S. Yadav', 'Right Handed Bat', 'Right-arm medium', 'Batsman', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'India'),
('p103', 'Jasprit', 'Bumrah', 'J. Bumrah', 'Right Handed Bat', 'Right-arm fast', 'Bowler', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'India'),
('p104', 'Hardik', 'Pandya', 'H. Pandya', 'Right Handed Bat', 'Right-arm fast-medium', 'All-Rounder', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', 'India'),
('p105', 'Ishan', 'Kishan', 'I. Kishan', 'Left Handed Bat', 'None', 'Wicketkeeper', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'India'),

-- Bengaluru Challengers
('p201', 'Virat', 'Kohli', 'V. Kohli', 'Right Handed Bat', 'Right-arm medium', 'Batsman', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'India'),
('p202', 'Faf', 'du Plessis', 'F. du Plessis', 'Right Handed Bat', 'Right-arm legbreak', 'Batsman', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'South Africa'),
('p203', 'Glenn', 'Maxwell', 'G. Maxwell', 'Right Handed Bat', 'Right-arm offbreak', 'All-Rounder', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Australia'),
('p204', 'Mohammed', 'Siraj', 'M. Siraj', 'Right Handed Bat', 'Right-arm fast', 'Bowler', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'India'),
('p205', 'Dinesh', 'Karthik', 'D. Karthik', 'Right Handed Bat', 'None', 'Wicketkeeper', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150', 'India'),

-- Chennai Super Kings
('p301', 'Ruturaj', 'Gaikwad', 'R. Gaikwad', 'Right Handed Bat', 'Right-arm offbreak', 'Batsman', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'India'),
('p302', 'Ravindra', 'Jadeja', 'R. Jadeja', 'Left Handed Bat', 'Slow left-arm orthodox', 'All-Rounder', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'India'),
('p303', 'MS', 'Dhoni', 'MS Dhoni', 'Right Handed Bat', 'Right-arm medium', 'Wicketkeeper', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150', 'India'),
('p304', 'Matheesha', 'Pathirana', 'M. Pathirana', 'Right Handed Bat', 'Right-arm fast', 'Bowler', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', 'Sri Lanka'),
('p305', 'Shivam', 'Dube', 'S. Dube', 'Left Handed Bat', 'Right-arm medium', 'All-Rounder', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'India'),

-- Kolkata Knights
('p401', 'Shreyas', 'Iyer', 'S. Iyer', 'Right Handed Bat', 'Right-arm legbreak', 'Batsman', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'India'),
('p402', 'Andre', 'Russell', 'A. Russell', 'Right Handed Bat', 'Right-arm fast', 'All-Rounder', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'West Indies'),
('p403', 'Sunil', 'Narine', 'S. Narine', 'Left Handed Bat', 'Right-arm offbreak', 'All-Rounder', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'West Indies'),
('p404', 'Mitchell', 'Starc', 'M. Starc', 'Left Handed Bat', 'Left-arm fast', 'Bowler', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Australia'),
('p405', 'Phil', 'Salt', 'P. Salt', 'Right Handed Bat', 'None', 'Wicketkeeper', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'England');

-- 6. TOURNAMENT SQUADS
INSERT INTO tournament_squads (id, tournament_id, team_id, player_id, is_captain, is_vice_captain, is_wicketkeeper, jersey_number) VALUES
('sq1', 'tour-2026', 't1', 'p101', TRUE, FALSE, FALSE, 45),
('sq2', 'tour-2026', 't1', 'p102', FALSE, FALSE, FALSE, 63),
('sq3', 'tour-2026', 't1', 'p103', FALSE, FALSE, FALSE, 93),
('sq4', 'tour-2026', 't1', 'p104', FALSE, TRUE, FALSE, 33),
('sq5', 'tour-2026', 't1', 'p105', FALSE, FALSE, TRUE, 23),

('sq6', 'tour-2026', 't2', 'p201', FALSE, FALSE, FALSE, 18),
('sq7', 'tour-2026', 't2', 'p202', TRUE, FALSE, FALSE, 13),
('sq8', 'tour-2026', 't2', 'p203', FALSE, TRUE, FALSE, 32),
('sq9', 'tour-2026', 't2', 'p204', FALSE, FALSE, FALSE, 73),
('sq10', 'tour-2026', 't2', 'p205', FALSE, FALSE, TRUE, 19),

('sq11', 'tour-2026', 't3', 'p301', TRUE, FALSE, FALSE, 31),
('sq12', 'tour-2026', 't3', 'p302', FALSE, TRUE, FALSE, 8),
('sq13', 'tour-2026', 't3', 'p303', FALSE, FALSE, TRUE, 7),
('sq14', 'tour-2026', 't3', 'p304', FALSE, FALSE, FALSE, 99),
('sq15', 'tour-2026', 't3', 'p305', FALSE, FALSE, FALSE, 25),

('sq16', 'tour-2026', 't4', 'p401', TRUE, FALSE, FALSE, 96),
('sq17', 'tour-2026', 't4', 'p402', FALSE, TRUE, FALSE, 12),
('sq18', 'tour-2026', 't4', 'p403', FALSE, FALSE, FALSE, 74),
('sq19', 'tour-2026', 't4', 'p404', FALSE, FALSE, FALSE, 56),
('sq20', 'tour-2026', 't4', 'p405', FALSE, FALSE, TRUE, 28);

-- 7. MATCHES
INSERT INTO matches (id, tournament_id, match_number, stage, team1_id, team2_id, venue_id, match_date, scheduled_overs, toss_winner_id, toss_decision, status, winner_id, win_margin, win_margin_type, player_of_the_match_id, notes) VALUES
('m1', 'tour-2026', 1, 'League', 't1', 't2', 'v1', '2026-03-20 19:30:00', 20, 't2', 'bowl', 'completed', 't1', 14, 'runs', 'p102', 'Season opener at Wankhede Stadium. High scoring thriller.'),
('m2', 'tour-2026', 2, 'League', 't3', 't4', 'v4', '2026-03-21 19:30:00', 20, 't3', 'bat', 'live', NULL, NULL, NULL, NULL, 'Live match in Chennai. Electrifying atmosphere.'),
('m3', 'tour-2026', 3, 'League', 't5', 't6', 'v5', '2026-03-22 15:30:00', 20, NULL, NULL, 'scheduled', NULL, NULL, NULL, NULL, 'Afternoon fixture in Ahmedabad.'),
('m4', 'tour-2026', 4, 'League', 't1', 't3', 'v1', '2026-03-23 19:30:00', 20, NULL, NULL, 'scheduled', NULL, NULL, NULL, NULL, 'El Clasico of Indian Cricket.');

-- 8. MATCH INNINGS FOR MATCH 1 (COMPLETED)
INSERT INTO match_innings (id, match_id, innings_number, batting_team_id, bowling_team_id, total_runs, total_wickets, total_overs, balls_bowled, extras_wides, extras_noballs, extras_byes, extras_legbyes, is_completed) VALUES
('inn1_m1', 'm1', 1, 't1', 't2', 198, 5, 20.0, 120, 4, 1, 2, 3, TRUE),
('inn2_m1', 'm1', 2, 't2', 't1', 184, 8, 20.0, 120, 5, 0, 1, 2, TRUE);

-- Batting Scorecard Innings 1 (Mumbai Titans)
INSERT INTO batting_scorecards (id, innings_id, player_id, batting_position, runs, balls, fours, sixes, strike_rate, dismissal_type, bowler_id, is_not_out) VALUES
('bs1', 'inn1_m1', 'p101', 1, 48, 32, 6, 2, 150.00, 'caught', 'p204', FALSE),
('bs2', 'inn1_m1', 'p105', 2, 35, 24, 4, 1, 145.83, 'bowled', 'p203', FALSE),
('bs3', 'inn1_m1', 'p102', 3, 76, 38, 7, 5, 200.00, 'not out', NULL, TRUE),
('bs4', 'inn1_m1', 'p104', 4, 29, 16, 2, 2, 181.25, 'caught', 'p204', FALSE);

-- Bowling Scorecard Innings 1 (Bengaluru Challengers)
INSERT INTO bowling_scorecards (id, innings_id, player_id, bowling_order, overs_bowled, legal_balls, maidens, runs_conceded, wickets, wides, no_balls, economy_rate) VALUES
('bw1', 'inn1_m1', 'p204', 1, 4.0, 24, 0, 38, 2, 2, 0, 9.50),
('bw2', 'inn1_m1', 'p203', 2, 4.0, 24, 0, 32, 1, 1, 0, 8.00);

-- 9. MATCH INNINGS FOR MATCH 2 (LIVE)
INSERT INTO match_innings (id, match_id, innings_number, batting_team_id, bowling_team_id, total_runs, total_wickets, total_overs, balls_bowled, extras_wides, extras_noballs, is_completed) VALUES
('inn1_m2', 'm2', 1, 't3', 't4', 142, 3, 15.4, 94, 3, 1, FALSE);

-- 10. TOURNAMENT STANDINGS
INSERT INTO tournament_standings (tournament_id, team_id, group_name, matches_played, won, lost, tied, no_result, points, runs_scored, overs_faced, runs_conceded, overs_bowled, net_run_rate) VALUES
('tour-2026', 't1', 'Group A', 1, 1, 0, 0, 0, 2, 198, 20.0, 184, 20.0, 0.700),
('tour-2026', 't2', 'Group A', 1, 0, 1, 0, 0, 0, 184, 20.0, 198, 20.0, -0.700),
('tour-2026', 't3', 'Group A', 0, 0, 0, 0, 0, 0, 0, 0.0, 0, 0.0, 0.000),
('tour-2026', 't4', 'Group B', 0, 0, 0, 0, 0, 0, 0, 0.0, 0, 0.0, 0.000),
('tour-2026', 't5', 'Group B', 0, 0, 0, 0, 0, 0, 0, 0.0, 0, 0.0, 0.000),
('tour-2026', 't6', 'Group B', 0, 0, 0, 0, 0, 0, 0, 0.0, 0, 0.0, 0.000);
