import React, { useEffect, useState, Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ClockIcon, TrophyIcon, BarChart4Icon, GoalIcon, ShuffleIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, InfoIcon } from 'lucide-react';
import { Match } from '../utils/supabaseClient';
export const MatchDetails: React.FC = () => {
  const {
    matchId
  } = useParams<{
    matchId: string;
  }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a proper API call
        // For now, we'll simulate fetching from localStorage or a mock
        setTimeout(() => {
          // Mock data for demonstration
          const mockMatch: Match = {
            id: parseInt(matchId || '0'),
            home: 'Ferencváros',
            away: 'Újpest FC',
            homeTeam: {
              id: 1,
              name: 'Ferencváros',
              logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Ferencv%C3%A1rosi_TC.svg'
            },
            awayTeam: {
              id: 2,
              name: 'Újpest FC',
              logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/%C3%9Ajpest_FC.svg'
            },
            ht: '1 - 0',
            ft: '2 - 1',
            btts: true,
            comeback: false,
            homeGoals: 2,
            awayGoals: 1
          };
          setMatch(mockMatch);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Hiba történt a mérkőzés adatainak betöltése közben');
        setLoading(false);
      }
    };
    fetchMatchDetails();
  }, [matchId]);
  if (loading) {
    return <div className="min-h-screen bg-[#0a0a12] text-zinc-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 rounded-full border-t-transparent"></div>
      </div>;
  }
  if (error || !match) {
    return <div className="min-h-screen bg-[#0a0a12] text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="text-red-400 mb-4">
          {error || 'Mérkőzés nem található'}
        </div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5">
          <ArrowLeftIcon size={16} />
          Vissza a főoldalra
        </Link>
      </div>;
  }
  // Calculate additional statistics
  const totalGoals = match.homeGoals + match.awayGoals;
  const [htHomeGoals, htAwayGoals] = match.ht.split(' - ').map(Number);
  const htTotalGoals = htHomeGoals + htAwayGoals;
  const secondHalfGoals = totalGoals - htTotalGoals;
  // Create timeline events (in a real app, this would come from the API)
  const timelineEvents = [{
    time: 23,
    team: 'home',
    type: 'goal',
    player: 'Tokmac Nguen'
  }, {
    time: 58,
    team: 'away',
    type: 'goal',
    player: 'Stieber Zoltán'
  }, {
    time: 76,
    team: 'home',
    type: 'goal',
    player: 'Myrto Uzuni'
  }];
  return <div className="min-h-screen bg-[#0a0a12] text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100">
            <ArrowLeftIcon size={16} />
            Vissza a mérkőzésekhez
          </Link>
        </div>
        {/* Match header */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Home team */}
            <div className="flex flex-col items-center text-center">
              <img src={match.homeTeam.logoUrl} alt={`${match.home} logo`} className="w-20 h-20 rounded-full object-cover mb-3 ring-1 ring-white/10" />
              <Link to={`/team/${encodeURIComponent(match.home)}`} className="text-xl font-semibold hover:text-violet-300">
                {match.home}
              </Link>
            </div>
            {/* Score */}
            <div className="flex flex-col items-center text-center">
              <div className="text-xs text-zinc-400 mb-1 flex items-center gap-1">
                <CalendarIcon size={12} />
                <span>Mérkőzés #{match.id}</span>
              </div>
              <div className="text-4xl font-bold mb-2">
                {match.homeGoals} - {match.awayGoals}
              </div>
              <div className="text-sm text-zinc-400">Félidő: {match.ht}</div>
              <div className="mt-4 flex gap-3">
                {match.btts && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/30">
                    <GoalIcon size={12} />
                    BTTS
                  </span>}
                {match.comeback && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/30">
                    <ShuffleIcon size={12} />
                    Fordítás
                  </span>}
              </div>
            </div>
            {/* Away team */}
            <div className="flex flex-col items-center text-center">
              <img src={match.awayTeam.logoUrl} alt={`${match.away} logo`} className="w-20 h-20 rounded-full object-cover mb-3 ring-1 ring-white/10" />
              <Link to={`/team/${encodeURIComponent(match.away)}`} className="text-xl font-semibold hover:text-violet-300">
                {match.away}
              </Link>
            </div>
          </div>
        </div>
        {/* Match statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Goals statistics */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <BarChart4Icon size={18} />
              Gól statisztikák
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-zinc-400 mb-1">
                  <span>Összes gól</span>
                  <span>{totalGoals}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-600" style={{
                  width: `${totalGoals / 10 * 100}%`
                }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-zinc-400 mb-1">
                  <span>Első félidő</span>
                  <span>{htTotalGoals}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600" style={{
                  width: `${htTotalGoals / totalGoals * 100}%`
                }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-zinc-400 mb-1">
                  <span>Második félidő</span>
                  <span>{secondHalfGoals}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600" style={{
                  width: `${secondHalfGoals / totalGoals * 100}%`
                }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-sm text-zinc-400 mb-1">
                  <span>Gólok megoszlása</span>
                  <span>
                    {match.homeGoals} - {match.awayGoals}
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{
                  width: `${match.homeGoals / totalGoals * 100}%`
                }}></div>
                  <div className="h-full bg-sky-500" style={{
                  width: `${match.awayGoals / totalGoals * 100}%`
                }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-emerald-400">{match.home}</span>
                  <span className="text-sky-400">{match.away}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Match timeline */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ClockIcon size={18} />
              Mérkőzés idővonal
            </h3>
            <div className="relative pl-8 pb-1">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10"></div>
              {/* Timeline events */}
              {timelineEvents.map((event, index) => <div key={index} className={`relative mb-6 timeline-event ${event.team === 'home' ? 'pr-4' : 'pr-4'}`}>
                  {/* Timeline dot */}
                  <div className={`absolute left-3 top-0 w-3 h-3 rounded-full -translate-x-1.5 ${event.type === 'goal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  {/* Event content */}
                  <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-medium">
                          {event.time}'
                        </span>
                        <span className={`text-sm font-medium ${event.team === 'home' ? 'text-emerald-400' : 'text-sky-400'}`}>
                          {event.team === 'home' ? match.home : match.away}
                        </span>
                      </div>
                      <GoalIcon size={16} className="text-amber-400" />
                    </div>
                    <p className="text-sm text-zinc-300">
                      {event.type === 'goal' ? 'Gól' : 'Esemény'}:{' '}
                      {event.player}
                    </p>
                  </div>
                </div>)}
              {/* Half time marker */}
              <div className="relative mb-6">
                <div className="absolute left-3 top-0 w-3 h-3 rounded-full -translate-x-1.5 bg-violet-500"></div>
                <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                  <p className="text-sm text-zinc-300">Félidő: {match.ht}</p>
                </div>
              </div>
              {/* Full time marker */}
              <div className="relative">
                <div className="absolute left-3 top-0 w-3 h-3 rounded-full -translate-x-1.5 bg-indigo-500"></div>
                <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                  <p className="text-sm text-zinc-300">
                    Végeredmény: {match.ft}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Team comparison */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <TrophyIcon size={18} />
            Csapat összehasonlítás
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {/* Headers */}
            <div className="text-center font-medium text-emerald-400">
              {match.home}
            </div>
            <div className="text-center text-sm text-zinc-400">Mutató</div>
            <div className="text-center font-medium text-sky-400">
              {match.away}
            </div>
            {/* Possession */}
            <div className="text-center text-lg">55%</div>
            <div className="text-center text-sm text-zinc-400">
              Labdabirtoklás
            </div>
            <div className="text-center text-lg">45%</div>
            {/* Shots */}
            <div className="text-center text-lg">12</div>
            <div className="text-center text-sm text-zinc-400">Lövések</div>
            <div className="text-center text-lg">8</div>
            {/* Shots on target */}
            <div className="text-center text-lg">5</div>
            <div className="text-center text-sm text-zinc-400">
              Kapura lövések
            </div>
            <div className="text-center text-lg">3</div>
            {/* Corners */}
            <div className="text-center text-lg">7</div>
            <div className="text-center text-sm text-zinc-400">Szögletek</div>
            <div className="text-center text-lg">4</div>
            {/* Fouls */}
            <div className="text-center text-lg">10</div>
            <div className="text-center text-sm text-zinc-400">
              Szabálytalanságok
            </div>
            <div className="text-center text-lg">12</div>
          </div>
        </div>
        {/* Head to head history */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <InfoIcon size={18} />
            Korábbi mérkőzések
          </h3>
          <div className="space-y-3">
            {/* Previous match examples */}
            <div className="bg-white/5 hover:bg-white/10 transition rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">2023.10.15</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{match.home}</span>
                    <span className="text-zinc-400">vs</span>
                    <span>{match.away}</span>
                  </div>
                </div>
                <div className="text-zinc-300">3 - 1</div>
              </div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">2023.05.21</span>
                  <div className="flex items-center gap-1">
                    <span>{match.away}</span>
                    <span className="text-zinc-400">vs</span>
                    <span className="font-medium">{match.home}</span>
                  </div>
                </div>
                <div className="text-zinc-300">0 - 2</div>
              </div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">2022.11.06</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{match.home}</span>
                    <span className="text-zinc-400">vs</span>
                    <span>{match.away}</span>
                  </div>
                </div>
                <div className="text-zinc-300">1 - 1</div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation between matches */}
        <div className="flex justify-between mt-8">
          <Link to={`/match/${parseInt(matchId || '0') - 1}`} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100">
            <ChevronLeftIcon size={16} />
            Előző mérkőzés
          </Link>
          <Link to={`/match/${parseInt(matchId || '0') + 1}`} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100">
            Következő mérkőzés
            <ChevronRightIcon size={16} />
          </Link>
        </div>
      </div>
    </div>;
};