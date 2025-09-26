import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, TrophyIcon, BarChart4Icon, GoalIcon, ShuffleIcon, HomeIcon, FlagIcon, CalendarIcon, ListIcon, PieChartIcon } from 'lucide-react';
import { Match, Team } from '../utils/supabaseClient';
import { Chart } from 'chart.js/auto';
export const TeamStats = () => {
  const {
    teamName
  } = useParams<{
    teamName: string;
  }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Chart references
  const resultsChartRef = useRef<HTMLCanvasElement>(null);
  const goalsChartRef = useRef<HTMLCanvasElement>(null);
  const resultsChartInstance = useRef<Chart | null>(null);
  const goalsChartInstance = useRef<Chart | null>(null);
  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a proper API call
        // For now, we'll simulate fetching from localStorage or a mock
        setTimeout(() => {
          // Mock team data
          const mockTeam: Team = {
            id: 1,
            name: teamName || 'Unknown Team',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Ferencv%C3%A1rosi_TC.svg'
          };
          // Generate mock matches for this team
          const mockMatches: Match[] = Array.from({
            length: 20
          }, (_, i) => {
            const isHome = Math.random() > 0.5;
            const homeGoals = Math.floor(Math.random() * 5);
            const awayGoals = Math.floor(Math.random() * 5);
            const htHomeGoals = Math.min(homeGoals, Math.floor(Math.random() * 3));
            const htAwayGoals = Math.min(awayGoals, Math.floor(Math.random() * 3));
            return {
              id: i + 1,
              home: isHome ? teamName || 'Unknown Team' : `Opponent ${i + 1}`,
              away: isHome ? `Opponent ${i + 1}` : teamName || 'Unknown Team',
              homeTeam: {
                id: isHome ? 1 : i + 2,
                name: isHome ? teamName || 'Unknown Team' : `Opponent ${i + 1}`,
                logoUrl: isHome ? 'https://upload.wikimedia.org/wikipedia/en/5/5c/Ferencv%C3%A1rosi_TC.svg' : `https://via.placeholder.com/40x40?text=${i + 1}`
              },
              awayTeam: {
                id: isHome ? i + 2 : 1,
                name: isHome ? `Opponent ${i + 1}` : teamName || 'Unknown Team',
                logoUrl: isHome ? `https://via.placeholder.com/40x40?text=${i + 1}` : 'https://upload.wikimedia.org/wikipedia/en/5/5c/Ferencv%C3%A1rosi_TC.svg'
              },
              ht: `${htHomeGoals} - ${htAwayGoals}`,
              ft: `${homeGoals} - ${awayGoals}`,
              btts: homeGoals > 0 && awayGoals > 0,
              comeback: htHomeGoals > htAwayGoals && homeGoals < awayGoals || htHomeGoals < htAwayGoals && homeGoals > awayGoals,
              homeGoals,
              awayGoals
            };
          });
          setTeam(mockTeam);
          setMatches(mockMatches);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching team stats:', err);
        setError('Hiba történt a csapat adatainak betöltése közben');
        setLoading(false);
      }
    };
    fetchTeamStats();
  }, [teamName]);
  useEffect(() => {
    if (!loading && matches.length > 0) {
      createCharts();
    }
    return () => {
      // Clean up charts when component unmounts
      if (resultsChartInstance.current) {
        resultsChartInstance.current.destroy();
      }
      if (goalsChartInstance.current) {
        goalsChartInstance.current.destroy();
      }
    };
  }, [loading, matches]);
  const createCharts = () => {
    if (!resultsChartRef.current || !goalsChartRef.current) return;
    // Calculate statistics for charts
    const wins = matches.filter(match => {
      const isHome = match.home === teamName;
      const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
      return isHome ? homeGoals > awayGoals : awayGoals > homeGoals;
    }).length;
    const draws = matches.filter(match => {
      const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
      return homeGoals === awayGoals;
    }).length;
    const losses = matches.length - wins - draws;
    const goalsScored = matches.reduce((sum, match) => {
      const isHome = match.home === teamName;
      return sum + (isHome ? match.homeGoals : match.awayGoals);
    }, 0);
    const goalsConceded = matches.reduce((sum, match) => {
      const isHome = match.home === teamName;
      return sum + (isHome ? match.awayGoals : match.homeGoals);
    }, 0);
    // Create results chart
    if (resultsChartInstance.current) {
      resultsChartInstance.current.destroy();
    }
    resultsChartInstance.current = new Chart(resultsChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Győzelmek', 'Döntetlenek', 'Vereségek'],
        datasets: [{
          data: [wins, draws, losses],
          backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)'],
          borderColor: ['rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                size: 12
              },
              padding: 20,
              boxWidth: 12,
              boxHeight: 12
            }
          }
        }
      }
    });
    // Create goals chart
    if (goalsChartInstance.current) {
      goalsChartInstance.current.destroy();
    }
    goalsChartInstance.current = new Chart(goalsChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Rúgott gólok', 'Kapott gólok'],
        datasets: [{
          data: [goalsScored, goalsConceded],
          backgroundColor: ['rgba(139, 92, 246, 0.7)', 'rgba(239, 68, 68, 0.7)'],
          borderColor: ['rgba(139, 92, 246, 1)', 'rgba(239, 68, 68, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        }
      }
    });
  };
  // Calculate team statistics
  const calculateStats = () => {
    if (!matches.length) return null;
    const totalMatches = matches.length;
    const homeMatches = matches.filter(m => m.home === teamName).length;
    const awayMatches = totalMatches - homeMatches;
    const wins = matches.filter(match => {
      const isHome = match.home === teamName;
      const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
      return isHome ? homeGoals > awayGoals : awayGoals > homeGoals;
    }).length;
    const draws = matches.filter(match => {
      const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
      return homeGoals === awayGoals;
    }).length;
    const losses = totalMatches - wins - draws;
    const goalsScored = matches.reduce((sum, match) => {
      const isHome = match.home === teamName;
      return sum + (isHome ? match.homeGoals : match.awayGoals);
    }, 0);
    const goalsConceded = matches.reduce((sum, match) => {
      const isHome = match.home === teamName;
      return sum + (isHome ? match.awayGoals : match.homeGoals);
    }, 0);
    const bttsMatches = matches.filter(m => m.btts).length;
    const comebackMatches = matches.filter(m => m.comeback).length;
    const winPercentage = Math.round(wins / totalMatches * 100);
    const bttsPercentage = Math.round(bttsMatches / totalMatches * 100);
    const goalDifference = goalsScored - goalsConceded;
    return {
      totalMatches,
      homeMatches,
      awayMatches,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
      bttsMatches,
      comebackMatches,
      winPercentage,
      bttsPercentage,
      goalDifference,
      averageGoalsScored: (goalsScored / totalMatches).toFixed(2),
      averageGoalsConceded: (goalsConceded / totalMatches).toFixed(2)
    };
  };
  const stats = calculateStats();
  // Generate form (last 5 matches)
  const generateForm = () => {
    if (!matches.length) return [];
    return matches.slice(0, 5).map(match => {
      const isHome = match.home === teamName;
      const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
      let result: 'W' | 'D' | 'L';
      if (homeGoals === awayGoals) {
        result = 'D';
      } else if (isHome) {
        result = homeGoals > awayGoals ? 'W' : 'L';
      } else {
        result = awayGoals > homeGoals ? 'W' : 'L';
      }
      return {
        opponent: isHome ? match.away : match.home,
        result,
        score: match.ft,
        id: match.id
      };
    });
  };
  const form = generateForm();
  if (loading) {
    return <div className="min-h-screen bg-[#0a0a12] text-zinc-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 rounded-full border-t-transparent"></div>
      </div>;
  }
  if (error || !team) {
    return <div className="min-h-screen bg-[#0a0a12] text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="text-red-400 mb-4">
          {error || 'Csapat nem található'}
        </div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5">
          <ArrowLeftIcon size={16} />
          Vissza a főoldalra
        </Link>
      </div>;
  }
  return <div className="min-h-screen bg-[#0a0a12] text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100">
            <ArrowLeftIcon size={16} />
            Vissza a mérkőzésekhez
          </Link>
        </div>
        {/* Team header */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img src={team.logoUrl} alt={`${team.name} logo`} className="w-24 h-24 rounded-full object-cover ring-1 ring-white/10" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{team.name}</h1>
              <p className="text-zinc-400 mt-1">Csapat statisztikák</p>
            </div>
          </div>
        </div>
        {/* Key statistics */}
        {stats && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 text-center team-stat-card">
              <div className="text-zinc-400 text-xs mb-1">Mérkőzések</div>
              <div className="text-2xl font-semibold">{stats.totalMatches}</div>
            </div>
            <div className="bg-emerald-500/10 ring-1 ring-emerald-400/30 rounded-xl p-4 text-center team-stat-card">
              <div className="text-emerald-300 text-xs mb-1">Győzelmek</div>
              <div className="text-2xl font-semibold text-emerald-300">
                {stats.wins}
              </div>
            </div>
            <div className="bg-amber-500/10 ring-1 ring-amber-400/30 rounded-xl p-4 text-center team-stat-card">
              <div className="text-amber-300 text-xs mb-1">Döntetlenek</div>
              <div className="text-2xl font-semibold text-amber-300">
                {stats.draws}
              </div>
            </div>
            <div className="bg-red-500/10 ring-1 ring-red-400/30 rounded-xl p-4 text-center team-stat-card">
              <div className="text-red-300 text-xs mb-1">Vereségek</div>
              <div className="text-2xl font-semibold text-red-300">
                {stats.losses}
              </div>
            </div>
            <div className="bg-violet-500/10 ring-1 ring-violet-400/30 rounded-xl p-4 text-center team-stat-card">
              <div className="text-violet-300 text-xs mb-1">Nyerési %</div>
              <div className="text-2xl font-semibold text-violet-300">
                {stats.winPercentage}%
              </div>
            </div>
          </div>}
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Results chart */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <PieChartIcon size={18} />
              Eredmények megoszlása
            </h3>
            <div className="h-64">
              <canvas ref={resultsChartRef}></canvas>
            </div>
          </div>
          {/* Goals chart */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <BarChart4Icon size={18} />
              Gólok
            </h3>
            <div className="h-64">
              <canvas ref={goalsChartRef}></canvas>
            </div>
          </div>
        </div>
        {/* Detailed statistics */}
        {stats && <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ListIcon size={18} />
              Részletes statisztikák
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                <div className="text-zinc-400 text-xs mb-1">
                  Hazai / Vendég mérkőzések
                </div>
                <div className="flex items-center gap-2">
                  <HomeIcon size={16} className="text-emerald-400" />
                  <span>{stats.homeMatches}</span>
                  <span className="text-zinc-400 mx-1">/</span>
                  <FlagIcon size={16} className="text-sky-400" />
                  <span>{stats.awayMatches}</span>
                </div>
              </div>
              <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                <div className="text-zinc-400 text-xs mb-1">Gólkülönbség</div>
                <div className={`font-medium ${stats.goalDifference > 0 ? 'text-emerald-400' : stats.goalDifference < 0 ? 'text-red-400' : 'text-zinc-300'}`}>
                  {stats.goalDifference > 0 ? '+' : ''}
                  {stats.goalDifference}
                </div>
              </div>
              <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                <div className="text-zinc-400 text-xs mb-1">
                  Átlag gólok / meccs
                </div>
                <div className="flex items-center gap-2">
                  <GoalIcon size={16} className="text-emerald-400" />
                  <span>{stats.averageGoalsScored}</span>
                  <span className="text-zinc-400 mx-1">/</span>
                  <GoalIcon size={16} className="text-red-400" />
                  <span>{stats.averageGoalsConceded}</span>
                </div>
              </div>
              <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                <div className="text-zinc-400 text-xs mb-1">
                  BTTS mérkőzések
                </div>
                <div className="flex items-center gap-2">
                  <span>{stats.bttsMatches}</span>
                  <span className="text-zinc-400">
                    ({stats.bttsPercentage}%)
                  </span>
                </div>
              </div>
              <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                <div className="text-zinc-400 text-xs mb-1">Fordítások</div>
                <div className="flex items-center gap-2">
                  <ShuffleIcon size={16} className="text-violet-400" />
                  <span>{stats.comebackMatches}</span>
                </div>
              </div>
            </div>
          </div>}
        {/* Form (last 5 matches) */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <CalendarIcon size={18} />
            Forma (utolsó 5 mérkőzés)
          </h3>
          <div className="flex gap-2 mb-4">
            {form.map((match, index) => <div key={index} className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${match.result === 'W' ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30' : match.result === 'D' ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30' : 'bg-red-500/20 text-red-300 ring-1 ring-red-400/30'}`} title={`${match.result === 'W' ? 'Győzelem' : match.result === 'D' ? 'Döntetlen' : 'Vereség'} - ${match.opponent} ellen (${match.score})`}>
                {match.result}
              </div>)}
          </div>
          <div className="space-y-2">
            {form.map((match, index) => <Link key={index} to={`/match/${match.id}`} className="block bg-white/5 hover:bg-white/10 transition rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${match.result === 'W' ? 'bg-emerald-500/20 text-emerald-300' : match.result === 'D' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                      {match.result}
                    </div>
                    <span>{match.opponent}</span>
                  </div>
                  <div className="text-zinc-400">{match.score}</div>
                </div>
              </Link>)}
          </div>
        </div>
        {/* Recent matches */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <TrophyIcon size={18} />
            Mérkőzések
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {matches.map((match, index) => <Link key={index} to={`/match/${match.id}`} className="block bg-white/5 hover:bg-white/10 transition rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {match.home === teamName ? <>
                        <HomeIcon size={16} className="text-emerald-400" />
                        <span className="font-medium">{match.home}</span>
                        <span className="text-zinc-400">vs</span>
                        <span>{match.away}</span>
                      </> : <>
                        <FlagIcon size={16} className="text-sky-400" />
                        <span>{match.home}</span>
                        <span className="text-zinc-400">vs</span>
                        <span className="font-medium">{match.away}</span>
                      </>}
                  </div>
                  <div className="text-zinc-300">{match.ft}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  {match.btts && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/30">
                      <GoalIcon size={12} />
                      BTTS
                    </span>}
                  {match.comeback && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/30">
                      <ShuffleIcon size={12} />
                      Fordítás
                    </span>}
                </div>
              </Link>)}
          </div>
        </div>
      </div>
    </div>;
};