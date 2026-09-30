import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  Shield, 
  UserPlus, 
  X, 
  Shirt,
  Sparkles
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Team, Player, PlayerRole, BattingStyle } from '../types/cricket';

export const TeamsView: React.FC = () => {
  const { teams, venues, addTeam, addPlayerToTeam } = useTournament();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  // New Team Form State
  const [teamName, setTeamName] = useState('');
  const [teamShortName, setTeamShortName] = useState('');
  const [teamCity, setTeamCity] = useState('');
  const [teamLogo, setTeamLogo] = useState('🏏');
  const [teamCoach, setTeamCoach] = useState('');
  const [teamColor, setTeamColor] = useState('#2563EB');

  // New Player Form State
  const [playerFirstName, setPlayerFirstName] = useState('');
  const [playerLastName, setPlayerLastName] = useState('');
  const [playerRole, setPlayerRole] = useState<PlayerRole>('All-Rounder');
  const [playerBattingStyle, setPlayerBattingStyle] = useState<BattingStyle>('Right Handed Bat');
  const [playerBowlingStyle, setPlayerBowlingStyle] = useState('Right-arm medium');
  const [playerJersey, setPlayerJersey] = useState(10);

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !teamShortName) return;

    addTeam({
      name: teamName,
      shortName: teamShortName.toUpperCase(),
      city: teamCity || 'City',
      logoUrl: teamLogo,
      coach: teamCoach || 'Head Coach',
      primaryColor: teamColor,
      secondaryColor: '#F59E0B'
    });

    setTeamName('');
    setTeamShortName('');
    setTeamCity('');
    setShowAddTeamModal(false);
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !playerFirstName || !playerLastName) return;

    addPlayerToTeam(selectedTeam.id, {
      firstName: playerFirstName,
      lastName: playerLastName,
      knownAs: `${playerFirstName[0]}. ${playerLastName}`,
      primaryRole: playerRole,
      battingStyle: playerBattingStyle,
      bowlingStyle: playerBowlingStyle,
      jerseyNumber: Number(playerJersey),
      country: 'India'
    });

    // Update selected team state so changes reflect immediately
    setSelectedTeam(prev => {
      if (!prev) return null;
      return {
        ...prev,
        squad: [
          ...prev.squad,
          {
            id: `p-${Date.now()}`,
            firstName: playerFirstName,
            lastName: playerLastName,
            knownAs: `${playerFirstName[0]}. ${playerLastName}`,
            primaryRole: playerRole,
            battingStyle: playerBattingStyle,
            bowlingStyle: playerBowlingStyle,
            jerseyNumber: Number(playerJersey),
            country: 'India'
          }
        ]
      };
    });

    setPlayerFirstName('');
    setPlayerLastName('');
    setShowAddPlayerModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Franchises & Squad Rosters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage teams, player profiles, bowling/batting roles, and jersey numbers.
          </p>
        </div>

        <button
          onClick={() => setShowAddTeamModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Franchise</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => {
          const homeVenue = venues.find(v => v.id === team.homeVenueId);

          return (
            <div
              key={team.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Team Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/10"
                      style={{ backgroundColor: team.primaryColor }}
                    >
                      {team.logoUrl}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{team.name}</h3>
                      <span className="font-mono text-xs font-semibold text-blue-400">
                        {team.shortName}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {team.squad.length} Players
                  </span>
                </div>

                {/* Team Details */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Home Ground: <strong className="text-slate-200">{homeVenue?.name || 'National Stadium'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <span>Head Coach: <strong className="text-slate-200">{team.coach}</strong></span>
                  </div>
                </div>

                {/* Squad Preview Pills */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Key Squad Members</div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.squad.slice(0, 4).map(p => (
                      <span
                        key={p.id}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-medium"
                      >
                        {p.knownAs}
                      </span>
                    ))}
                    {team.squad.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-800/40 text-[10px] text-slate-500">
                        +{team.squad.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedTeam(team)}
                className="mt-5 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Full Squad</span>
                <span className="text-blue-400">&rarr;</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* SQUAD DETAILS MODAL */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/10"
                  style={{ backgroundColor: selectedTeam.primaryColor }}
                >
                  {selectedTeam.logoUrl}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedTeam.name} Roster</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedTeam.shortName} • Coach: {selectedTeam.coach} • {selectedTeam.squad.length} Registered Players
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddPlayerModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Enlist Player</span>
                </button>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Players List Table */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 w-12 text-center">#</th>
                      <th className="p-3">Player</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Batting Style</th>
                      <th className="p-3">Bowling Style</th>
                      <th className="p-3 text-right">Country</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedTeam.squad.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="p-3 text-center font-mono font-bold text-slate-500">
                          {p.jerseyNumber ? `#${p.jerseyNumber}` : idx + 1}
                        </td>
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span>{p.knownAs}</span>
                          <span className="text-slate-400 text-[11px] font-normal">({p.firstName} {p.lastName})</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.primaryRole === 'Batsman'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : p.primaryRole === 'Bowler'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : p.primaryRole === 'Wicketkeeper'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {p.primaryRole}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{p.battingStyle}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{p.bowlingStyle}</td>
                        <td className="p-3 text-right text-slate-300">{p.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FRANCHISE MODAL */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Register New Franchise</span>
              </h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Franchise Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Hyderabad Sunrisers"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Short Code (3-4 chars)</label>
                  <input
                    type="text"
                    value={teamShortName}
                    onChange={(e) => setTeamShortName(e.target.value)}
                    placeholder="SRH"
                    maxLength={5}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={teamCity}
                    onChange={(e) => setTeamCity(e.target.value)}
                    placeholder="Hyderabad"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Emoji / Logo</label>
                  <input
                    type="text"
                    value={teamLogo}
                    onChange={(e) => setTeamLogo(e.target.value)}
                    placeholder="☀️"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={teamColor}
                    onChange={(e) => setTeamColor(e.target.value)}
                    className="w-full h-9 bg-slate-800 border border-slate-700 rounded-xl px-1 py-1 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Head Coach</label>
                <input
                  type="text"
                  value={teamCoach}
                  onChange={(e) => setTeamCoach(e.target.value)}
                  placeholder="e.g. Daniel Vettori"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Register Franchise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PLAYER MODAL */}
      {showAddPlayerModal && selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>Enlist Player to {selectedTeam.name}</span>
              </h3>
              <button
                onClick={() => setShowAddPlayerModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlayerSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    value={playerFirstName}
                    onChange={(e) => setPlayerFirstName(e.target.value)}
                    placeholder="e.g. Sanju"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={playerLastName}
                    onChange={(e) => setPlayerLastName(e.target.value)}
                    placeholder="e.g. Samson"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role</label>
                  <select
                    value={playerRole}
                    onChange={(e) => setPlayerRole(e.target.value as PlayerRole)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-Rounder">All-Rounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jersey Number</label>
                  <input
                    type="number"
                    value={playerJersey}
                    onChange={(e) => setPlayerJersey(Number(e.target.value))}
                    min={1}
                    max={99}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Batting Style</label>
                <select
                  value={playerBattingStyle}
                  onChange={(e) => setPlayerBattingStyle(e.target.value as BattingStyle)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Right Handed Bat">Right Handed Bat</option>
                  <option value="Left Handed Bat">Left Handed Bat</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bowling Style</label>
                <input
                  type="text"
                  value={playerBowlingStyle}
                  onChange={(e) => setPlayerBowlingStyle(e.target.value)}
                  placeholder="e.g. Right-arm fast-medium, Slow left-arm orthodox"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Enlist Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
