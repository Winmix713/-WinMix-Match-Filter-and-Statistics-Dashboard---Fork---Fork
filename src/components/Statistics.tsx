import React, { useEffect, useRef } from 'react';
import { Match } from '../utils/supabaseClient';
import { ListIcon, CircleDotIcon, MinusIcon, CircleIcon, ChartLineIcon, InfoIcon, ChartNoAxesColumnIcon } from 'lucide-react';
import Chart from 'chart.js/auto';
interface StatisticsProps {
  matches: Match[];
  onOpenExtendedStats: () => void;
}
export const Statistics: React.FC<StatisticsProps> = ({
  matches,
  onOpenExtendedStats
}) => {
  const resultsChartRef = useRef<HTMLCanvasElement>(null);
  const bttsChartRef = useRef<HTMLCanvasElement>(null);
  const resultsChartInstance = useRef<Chart | null>(null);
  const bttsChartInstance = useRef<Chart | null>(null);
  // Calculate statistics
  const totalMatches = matches.length;
  const homeWins = matches.filter(match => {
    const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
    return homeGoals > awayGoals;
  }).length;
  const draws = matches.filter(match => {
    const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
    return homeGoals === awayGoals;
  }).length;
  const awayWins = matches.filter(match => {
    const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
    return homeGoals < awayGoals;
  }).length;
  const bttsYes = matches.filter(match => match.btts).length;
  const bttsNo = matches.filter(match => !match.btts).length;
  useEffect(() => {
    // Create charts
    if (resultsChartRef.current && bttsChartRef.current) {
      // Destroy previous charts if they exist
      if (resultsChartInstance.current) {
        resultsChartInstance.current.destroy();
      }
      if (bttsChartInstance.current) {
        bttsChartInstance.current.destroy();
      }
      // Create results chart
      resultsChartInstance.current = new Chart(resultsChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Hazai győzelem', 'Döntetlen', 'Vendég győzelem'],
          datasets: [{
            data: [homeWins, draws, awayWins],
            backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(14, 165, 233, 0.7)' // Sky for away wins
            ],
            borderColor: ['rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)', 'rgba(14, 165, 233, 1)'],
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
      // Create BTTS chart
      bttsChartInstance.current = new Chart(bttsChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Igen', 'Nem'],
          datasets: [{
            data: [bttsYes, bttsNo],
            backgroundColor: ['rgba(139, 92, 246, 0.7)', 'rgba(71, 85, 105, 0.7)' // Slate for No
            ],
            borderColor: ['rgba(139, 92, 246, 1)', 'rgba(71, 85, 105, 1)'],
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
    }
    // Cleanup function
    return () => {
      if (resultsChartInstance.current) {
        resultsChartInstance.current.destroy();
      }
      if (bttsChartInstance.current) {
        bttsChartInstance.current.destroy();
      }
    };
  }, [matches, homeWins, draws, awayWins, bttsYes, bttsNo]);
  return <section id="stats" className="mt-10">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Statisztikák
        </h2>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/5" onClick={onOpenExtendedStats}>
            <ChartLineIcon style={{
            width: 16,
            height: 16,
            strokeWidth: 1.5
          }} />
            <span className="hidden sm:inline">Bővített statisztika</span>
            <span className="sm:hidden">Bővített stat.</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <InfoIcon style={{
            width: 16,
            height: 16,
            strokeWidth: 1.5
          }} />
            <span>Szűrt eredmények alapján</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-3 sm:px-4 py-3 sm:py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Összes mérkőzés</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <ListIcon className="text-zinc-200" style={{
              width: 16,
              height: 16,
              strokeWidth: 1.5
            }} />
            </span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">
            {totalMatches}
          </p>
        </div>
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-3 sm:px-4 py-3 sm:py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Hazai győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-400/10 ring-1 ring-emerald-400/30">
              <CircleDotIcon className="text-emerald-300" style={{
              width: 16,
              height: 16,
              strokeWidth: 1.5
            }} />
            </span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">
            {homeWins}
          </p>
        </div>
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-3 sm:px-4 py-3 sm:py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Döntetlen</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-400/10 ring-1 ring-amber-400/30">
              <MinusIcon className="text-amber-300" style={{
              width: 16,
              height: 16,
              strokeWidth: 1.5
            }} />
            </span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">
            {draws}
          </p>
        </div>
        <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 px-3 sm:px-4 py-3 sm:py-4 stats-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Vendég győzelem</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/15 to-sky-400/10 ring-1 ring-sky-400/30">
              <CircleIcon className="text-sky-300" style={{
              width: 16,
              height: 16,
              strokeWidth: 1.5
            }} />
            </span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">
            {awayWins}
          </p>
        </div>
      </div>
      {/* Részletes statisztika */}
      <div className="mt-6 ring-1 ring-white/10 bg-white/5 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Részletes statisztika
          </h3>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <ChartNoAxesColumnIcon style={{
            width: 16,
            height: 16,
            strokeWidth: 1.5
          }} />
            <span>Megoszlások</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-300 mb-2">
              Eredmény megoszlás (H/D/V)
            </p>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/10 p-3">
              <div className="relative h-56 sm:h-64">
                <canvas ref={resultsChartRef}></canvas>
              </div>
            </div>
          </div>
          <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-300 mb-2">
              BTTS (Mindkét csapat gólt szerzett)
            </p>
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/10 p-3">
              <div className="relative h-56 sm:h-64">
                <canvas ref={bttsChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};