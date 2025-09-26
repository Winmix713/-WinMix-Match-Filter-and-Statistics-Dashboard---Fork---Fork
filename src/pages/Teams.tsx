import React, { useEffect, useState, Component } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, ShieldIcon, TrophyIcon, SearchIcon, InfoIcon, XIcon, StarIcon, BarChart4Icon, SwordIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react';
import { Team, fetchTeams } from '../utils/supabaseClient';
export const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock team strengths data (in a real app, this would come from the API)
  const teamStrengths: Record<string, {
    attack: number;
    defense: number;
    midfield: number;
    speed: number;
    technique: number;
  }> = {
    Ferencváros: {
      attack: 85,
      defense: 82,
      midfield: 80,
      speed: 78,
      technique: 83
    },
    'Újpest FC': {
      attack: 75,
      defense: 74,
      midfield: 73,
      speed: 76,
      technique: 72
    },
    Debrecen: {
      attack: 72,
      defense: 70,
      midfield: 68,
      speed: 71,
      technique: 69
    },
    'Puskás Akadémia': {
      attack: 78,
      defense: 75,
      midfield: 77,
      speed: 74,
      technique: 76
    },
    'MTK Budapest': {
      attack: 70,
      defense: 69,
      midfield: 72,
      speed: 73,
      technique: 71
    }
  };
  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const data = await fetchTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);
  const filteredTeams = teams.filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const openTeamModal = (team: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };
  const getStrengthColorClass = (value: number) => {
    if (value >= 85) return 'bg-emerald-500';
    if (value >= 75) return 'bg-green-500';
    if (value >= 65) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  return <div className="min-h-screen bg-[#0a0a12] text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
            Csapatok
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300">
            Böngéssz a bajnokság csapatai között és nézd meg az erősségeiket
          </p>
        </div>
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-zinc-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-violet-500 focus:outline-none text-zinc-200 placeholder-zinc-400" placeholder="Keresés csapatok között..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        {loading ? <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-violet-500 rounded-full border-t-transparent"></div>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTeams.map(team => <div key={team.id} className="bg-white/5 ring-1 ring-white/10 rounded-xl overflow-hidden hover:ring-violet-400/30 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1 cursor-pointer" onClick={() => openTeamModal(team)}>
                <div className="p-6 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-white/5 ring-1 ring-white/10 p-2 mb-4 flex items-center justify-center">
                    <img src={team.logoUrl} alt={`${team.name} logo`} className="h-full w-full object-contain" onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/150?text=' + encodeURIComponent(team.name.charAt(0));
              }} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-zinc-400 text-sm">
                    <InfoIcon size={16} />
                    <span>Részletes erősségek</span>
                  </div>
                  <Link to={`/team/${encodeURIComponent(team.name)}`} className="mt-4 text-violet-400 hover:text-violet-300 text-sm font-medium flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <TrophyIcon size={14} />
                    <span>Statisztikák</span>
                  </Link>
                </div>
              </div>)}
            {filteredTeams.length === 0 && <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/5 ring-1 ring-white/10 mb-4">
                  <UsersIcon className="h-6 w-6 text-zinc-400" />
                </div>
                <h3 className="text-lg font-medium text-zinc-200 mb-1">
                  Nincs találat
                </h3>
                <p className="text-zinc-400 text-sm">
                  Próbálj más keresési feltételt használni
                </p>
              </div>}
          </div>}
      </div>
      {/* Team strengths modal */}
      {isModalOpen && selectedTeam && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0f16] ring-1 ring-white/10 rounded-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/5 ring-1 ring-white/10 p-1 flex items-center justify-center">
                  <img src={selectedTeam.logoUrl} alt={`${selectedTeam.name} logo`} className="h-full w-full object-contain" onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/150?text=' + encodeURIComponent(selectedTeam.name.charAt(0));
              }} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {selectedTeam.name}
                </h3>
              </div>
              <button className="text-zinc-400 hover:text-zinc-200" onClick={closeModal} aria-label="Bezárás">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium text-zinc-200 mb-4 flex items-center gap-2">
                <StarIcon size={18} className="text-amber-400" />
                Csapat erősségei
              </h4>
              {teamStrengths[selectedTeam.name] ? <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SwordIcon size={16} className="text-red-400" />
                        <span className="text-zinc-300">Támadás</span>
                      </div>
                      <span className="font-semibold">
                        {teamStrengths[selectedTeam.name].attack}/100
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getStrengthColorClass(teamStrengths[selectedTeam.name].attack)}`} style={{
                  width: `${teamStrengths[selectedTeam.name].attack}%`
                }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon size={16} className="text-blue-400" />
                        <span className="text-zinc-300">Védelem</span>
                      </div>
                      <span className="font-semibold">
                        {teamStrengths[selectedTeam.name].defense}/100
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getStrengthColorClass(teamStrengths[selectedTeam.name].defense)}`} style={{
                  width: `${teamStrengths[selectedTeam.name].defense}%`
                }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart4Icon size={16} className="text-violet-400" />
                        <span className="text-zinc-300">Középpálya</span>
                      </div>
                      <span className="font-semibold">
                        {teamStrengths[selectedTeam.name].midfield}/100
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getStrengthColorClass(teamStrengths[selectedTeam.name].midfield)}`} style={{
                  width: `${teamStrengths[selectedTeam.name].midfield}%`
                }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ZapIcon size={16} className="text-amber-400" />
                        <span className="text-zinc-300">Gyorsaság</span>
                      </div>
                      <span className="font-semibold">
                        {teamStrengths[selectedTeam.name].speed}/100
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getStrengthColorClass(teamStrengths[selectedTeam.name].speed)}`} style={{
                  width: `${teamStrengths[selectedTeam.name].speed}%`
                }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StarIcon size={16} className="text-emerald-400" />
                        <span className="text-zinc-300">Technika</span>
                      </div>
                      <span className="font-semibold">
                        {teamStrengths[selectedTeam.name].technique}/100
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getStrengthColorClass(teamStrengths[selectedTeam.name].technique)}`} style={{
                  width: `${teamStrengths[selectedTeam.name].technique}%`
                }}></div>
                    </div>
                  </div>
                </div> : <div className="text-center py-6 text-zinc-400">
                  Nincs elérhető adat a csapat erősségeiről
                </div>}
              <div className="mt-6 flex justify-end">
                <Link to={`/team/${encodeURIComponent(selectedTeam.name)}`} className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg hover:shadow-[0_12px_24px_-6px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 transform-gpu transition">
                  <TrophyIcon size={16} />
                  Csapat statisztikák
                </Link>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};