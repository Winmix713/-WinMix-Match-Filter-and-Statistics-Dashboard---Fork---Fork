import React from 'react';
import { Match } from '../utils/supabaseClient';
import { ChartLineIcon, XIcon, CircleDotIcon, CircleIcon, TrophyIcon } from 'lucide-react';
interface ExtendedStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  homeTeam: string | null;
  awayTeam: string | null;
}
export const ExtendedStatsModal: React.FC<ExtendedStatsModalProps> = ({
  isOpen,
  onClose,
  matches,
  homeTeam,
  awayTeam
}) => {
  if (!isOpen) return null;
  // Filter matches for selected teams
  const filteredMatches = matches.filter(match => {
    if (homeTeam && awayTeam) {
      return match.home === homeTeam && match.away === awayTeam;
    } else if (homeTeam) {
      return match.home === homeTeam;
    } else if (awayTeam) {
      return match.away === awayTeam;
    }
    return true;
  });
  // Calculate statistics
  const totalMatches = filteredMatches.length;
  const homeWins = filteredMatches.filter(match => {
    const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
    return homeGoals > awayGoals;
  }).length;
  const draws = filteredMatches.filter(match => {
    const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
    return homeGoals === awayGoals;
  }).length;
  const awayWins = filteredMatches.filter(match => {
    const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
    return homeGoals < awayGoals;
  }).length;
  // Calculate average goals
  const homeGoalsTotal = filteredMatches.reduce((sum, match) => sum + match.homeGoals, 0);
  const awayGoalsTotal = filteredMatches.reduce((sum, match) => sum + match.awayGoals, 0);
  const homeGoalAvg = totalMatches > 0 ? (homeGoalsTotal / totalMatches).toFixed(1) : '0.0';
  const awayGoalAvg = totalMatches > 0 ? (awayGoalsTotal / totalMatches).toFixed(1) : '0.0';
  // Calculate BTTS percentage
  const bttsMatches = filteredMatches.filter(match => match.btts).length;
  const bttsPercentage = totalMatches > 0 ? Math.round(bttsMatches / totalMatches * 100) : 0;
  // Find most frequent results
  const resultCounts: Record<string, number> = {};
  filteredMatches.forEach(match => {
    if (!resultCounts[match.ft]) {
      resultCounts[match.ft] = 0;
    }
    resultCounts[match.ft]++;
  });
  const frequentResults = Object.entries(resultCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  // Find team logos
  const homeTeamLogo = filteredMatches.find(m => m.home === homeTeam)?.homeTeam.logoUrl || '';
  const awayTeamLogo = filteredMatches.find(m => m.away === awayTeam)?.awayTeam.logoUrl || '';
  return <div id="extendedStatsModal" className={`fixed z-[80] inset-0 ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative mx-auto my-4 sm:my-10 w-full max-w-3xl px-4 max-h-[90vh] overflow-y-auto">
        <div className="rounded-2xl ring-1 ring-white/10 bg-[#0c0f16] shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChartLineIcon className="text-violet-300" style={{
                width: 20,
                height: 20,
                strokeWidth: 1.5
              }} />
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Bővített statisztika
                </h3>
              </div>
              <button className="text-zinc-400 hover:text-zinc-200" onClick={onClose}>
                <XIcon style={{
                width: 22,
                height: 22,
                strokeWidth: 1.5
              }} />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              {homeTeam && <div className="flex items-center gap-3">
                  {homeTeamLogo && <img src={homeTeamLogo} alt="Hazai csapat logó" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-1 ring-white/10 object-cover" />}
                  <div>
                    <div className="font-medium text-white">{homeTeam}</div>
                    <div className="text-xs text-zinc-400">Hazai csapat</div>
                  </div>
                </div>}
              {(homeTeam || awayTeam) && <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-zinc-300">
                    <CircleDotIcon style={{
                  width: 16,
                  height: 16,
                  strokeWidth: 1.5
                }} />
                    vs
                    <CircleIcon style={{
                  width: 16,
                  height: 16,
                  strokeWidth: 1.5
                }} />
                  </span>
                </div>}
              {awayTeam && <div className="flex items-center justify-end gap-3">
                  <div className="text-right">
                    <div className="font-medium text-white">{awayTeam}</div>
                    <div className="text-xs text-zinc-400">Vendég csapat</div>
                  </div>
                  {awayTeamLogo && <img src={awayTeamLogo} alt="Vendég csapat logó" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-1 ring-white/10 object-cover" />}
                </div>}
            </div>
          </div>
          <div className="px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-emerald-300">
                  {totalMatches}
                </div>
                <div className="text-xs text-emerald-200 mt-1">
                  Mérkőzések száma
                </div>
              </div>
              <div className="rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/30 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-emerald-300">
                  {homeWins}
                </div>
                <div className="text-xs text-emerald-200 mt-1">
                  Hazai győzelmek
                </div>
              </div>
              <div className="rounded-xl bg-amber-500/10 ring-1 ring-amber-400/30 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-amber-300">
                  {draws}
                </div>
                <div className="text-xs text-amber-200 mt-1">Döntetlenek</div>
              </div>
              <div className="rounded-xl bg-sky-500/10 ring-1 ring-sky-400/30 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-sky-300">
                  {awayWins}
                </div>
                <div className="text-xs text-sky-200 mt-1">
                  Vendég győzelmek
                </div>
              </div>
              <div className="rounded-xl bg-violet-500/10 ring-1 ring-violet-400/30 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-violet-300">
                  {homeGoalAvg}
                </div>
                <div className="text-xs text-violet-200 mt-1">
                  Hazai gól átlag
                </div>
              </div>
              <div className="rounded-xl bg-indigo-500/10 ring-1 ring-indigo-400/30 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-indigo-300">
                  {awayGoalAvg}
                </div>
                <div className="text-xs text-indigo-200 mt-1">
                  Vendég gól átlag
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="text-sm text-zinc-300">
                Összes mérkőzésből hány mérkőzésen szerzett mind a két csapat
                gólt: <span className="font-semibold">{bttsPercentage}%</span>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-zinc-200 mb-2 inline-flex items-center gap-2">
                <TrophyIcon style={{
                width: 16,
                height: 16,
                strokeWidth: 1.5
              }} />
                Leggyakoribb eredmények
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-300">
                {frequentResults.length > 0 ? frequentResults.map(([result, count], index) => <li key={index}>
                      {result} ({count} alkalom)
                    </li>) : <li>Nincs elérhető adat</li>}
              </ol>
            </div>
          </div>
          <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex justify-end">
            <button type="button" className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-200 border border-white/10 hover:bg-white/5" onClick={onClose}>
              <XIcon style={{
              width: 16,
              height: 16,
              strokeWidth: 1.5
            }} />
              Bezárás
            </button>
          </div>
        </div>
      </div>
    </div>;
};