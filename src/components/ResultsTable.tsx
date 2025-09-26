import React, { useEffect, useState, Component } from 'react';
import { Match } from '../utils/supabaseClient';
import { TableIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon, ChevronDownIcon, ChevronUpIcon, BarChart4Icon, InfoIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface ResultsTableProps {
  matches: Match[];
}
export const ResultsTable: React.FC<ResultsTableProps> = ({
  matches
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(matches.length / itemsPerPage);
  // Sort matches if needed
  const sortedMatches = [...matches];
  if (sortKey) {
    sortedMatches.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      switch (sortKey) {
        case 'home':
          valueA = a.home;
          valueB = b.home;
          break;
        case 'away':
          valueA = a.away;
          valueB = b.away;
          break;
        case 'ht':
          valueA = a.ht;
          valueB = b.ht;
          break;
        case 'ft':
          valueA = a.ft;
          valueB = b.ft;
          break;
        case 'btts':
          valueA = a.btts ? 1 : 0;
          valueB = b.btts ? 1 : 0;
          break;
        case 'comeback':
          valueA = a.comeback ? 1 : 0;
          valueB = b.comeback ? 1 : 0;
          break;
        default:
          return 0;
      }
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  const currentMatches = sortedMatches.slice(indexOfFirstItem, indexOfLastItem);
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const toggleMatchExpansion = (matchId: number) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null);
    } else {
      setExpandedMatchId(matchId);
    }
  };
  // Calculate quick stats for a match
  const calculateQuickStats = (match: Match) => {
    const [homeGoals, awayGoals] = match.ft.split(' - ').map(Number);
    const [htHomeGoals, htAwayGoals] = match.ht.split(' - ').map(Number);
    const totalGoals = homeGoals + awayGoals;
    const htTotalGoals = htHomeGoals + htAwayGoals;
    const secondHalfGoals = totalGoals - htTotalGoals;
    return {
      totalGoals,
      htGoals: htTotalGoals,
      secondHalfGoals,
      homeScorePercentage: totalGoals > 0 ? Math.round(homeGoals / totalGoals * 100) : 0,
      btts: match.btts,
      comeback: match.comeback
    };
  };
  // Create mobile card view for each match
  const renderMobileMatchCard = (match: Match) => {
    const isExpanded = expandedMatchId === match.id;
    const quickStats = calculateQuickStats(match);
    return <div key={match.id} className="p-4 border-b border-white/10 last:border-b-0" aria-expanded={isExpanded}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <img src={match.homeTeam.logoUrl} alt={`${match.home} logo`} className="w-6 h-6 rounded-full object-cover" />
            <Link to={`/team/${encodeURIComponent(match.home)}`} className="text-zinc-200 font-medium hover:text-violet-300">
              {match.home}
            </Link>
          </div>
          <span className="text-sm text-zinc-400">vs</span>
          <div className="flex items-center gap-2">
            <Link to={`/team/${encodeURIComponent(match.away)}`} className="text-zinc-200 font-medium hover:text-violet-300">
              {match.away}
            </Link>
            <img src={match.awayTeam.logoUrl} alt={`${match.away} logo`} className="w-6 h-6 rounded-full object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Félidő</span>
            <span className="text-zinc-300">{match.ht}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Végeredmény</span>
            <span className="text-zinc-300">{match.ft}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">BTTS</span>
            {match.btts ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30">
                Igen
              </span> : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-500/10 text-slate-300 ring-1 ring-slate-400/30">
                Nem
              </span>}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Fordítás</span>
            {match.comeback ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/30">
                Igen
              </span> : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-500/10 text-slate-300 ring-1 ring-slate-400/30">
                Nem
              </span>}
          </div>
        </div>
        {/* Expansion toggle button */}
        <button onClick={() => toggleMatchExpansion(match.id)} className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-zinc-400 hover:text-zinc-300 border border-white/10 rounded-md py-1.5" aria-label={isExpanded ? 'Kevesebb részlet mutatása' : 'Több részlet mutatása'} aria-controls={`match-details-${match.id}`}>
          {isExpanded ? <>
              Kevesebb <ChevronUpIcon size={14} />
            </> : <>
              Több részlet <ChevronDownIcon size={14} />
            </>}
        </button>
        {/* Expanded content */}
        {isExpanded && <div id={`match-details-${match.id}`} className="mt-3 bg-white/5 rounded-lg p-3 text-sm animate-fadeIn">
            <h4 className="text-zinc-300 font-medium mb-2 flex items-center gap-2">
              <BarChart4Icon size={14} />
              Gyors statisztika
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-md p-2">
                <div className="text-xs text-zinc-400">Összes gól</div>
                <div className="text-lg text-zinc-200 font-medium">
                  {quickStats.totalGoals}
                </div>
              </div>
              <div className="bg-white/5 rounded-md p-2">
                <div className="text-xs text-zinc-400">Első félidő gólok</div>
                <div className="text-lg text-zinc-200 font-medium">
                  {quickStats.htGoals}
                </div>
              </div>
              <div className="bg-white/5 rounded-md p-2">
                <div className="text-xs text-zinc-400">
                  Második félidő gólok
                </div>
                <div className="text-lg text-zinc-200 font-medium">
                  {quickStats.secondHalfGoals}
                </div>
              </div>
              <div className="bg-white/5 rounded-md p-2">
                <div className="text-xs text-zinc-400">Hazai gól arány</div>
                <div className="text-lg text-zinc-200 font-medium">
                  {quickStats.homeScorePercentage}%
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link to={`/match/${match.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200" aria-label={`${match.home} vs ${match.away} mérkőzés részleteinek megtekintése`}>
                Mérkőzés részletei <ArrowRightIcon size={12} />
              </Link>
            </div>
          </div>}
      </div>;
  };
  return <section id="results" className="mt-10">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Listázott eredmények
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
            <TableIcon style={{
            width: 14,
            height: 14,
            strokeWidth: 1.5
          }} />
            Mérkőzések: {matches.length}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <CalendarIcon style={{
          width: 16,
          height: 16,
          strokeWidth: 1.5
        }} />
          <span>Supabase adatbázis</span>
        </div>
      </div>
      {/* Pagination Controls (Top) */}
      {matches.length > 0 && <div className="mb-4 flex flex-wrap items-center justify-between bg-white/5 ring-1 ring-white/10 rounded-lg px-3 sm:px-4 py-3 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-zinc-400">
              Oldalanként:
            </span>
            <select className="bg-white/10 ring-1 ring-white/20 rounded-md px-1 sm:px-2 py-1 text-xs sm:text-sm text-zinc-200 border-none" value={itemsPerPage} onChange={handleItemsPerPageChange} aria-label="Oldalanként megjelenített elemek száma">
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
          <div className="flex items-center gap-2" role="navigation" aria-label="Lapozás">
            <button className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-zinc-200 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Előző oldal">
              <ChevronLeftIcon style={{
            width: 16,
            height: 16
          }} />
              <span className="hidden sm:inline">Előző</span>
            </button>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-zinc-300 bg-white/10 rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-zinc-200 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Következő oldal">
              <span className="hidden sm:inline">Következő</span>
              <ChevronRightIcon style={{
            width: 16,
            height: 16
          }} />
            </button>
          </div>
        </div>}
      <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5">
        {matches.length > 0 ? <>
            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Mérkőzés eredmények táblázata">
                <thead className="bg-white/5 text-zinc-300">
                  <tr className="border-b border-white/10">
                    <th className={`text-left font-medium px-4 py-3 cursor-pointer select-none hover:bg-white/5 ${sortKey === 'home' ? `sorted-${sortDirection}` : ''}`} onClick={() => handleSort('home')} aria-sort={sortKey === 'home' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}>
                      <div className="inline-flex items-center gap-1">
                        Hazai csapat
                        <ChevronsUpDownIcon className="opacity-60" style={{
                      width: 14,
                      height: 14,
                      strokeWidth: 1.5
                    }} />
                      </div>
                    </th>
                    <th className={`text-left font-medium px-4 py-3 cursor-pointer select-none hover:bg-white/5 ${sortKey === 'away' ? `sorted-${sortDirection}` : ''}`} onClick={() => handleSort('away')} aria-sort={sortKey === 'away' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}>
                      <div className="inline-flex items-center gap-1">
                        Vendég csapat
                        <ChevronsUpDownIcon className="opacity-60" style={{
                      width: 14,
                      height: 14,
                      strokeWidth: 1.5
                    }} />
                      </div>
                    </th>
                    <th className={`text-left font-medium px-4 py-3 cursor-pointer select-none hover:bg-white/5 ${sortKey === 'ht' ? `sorted-${sortDirection}` : ''}`} onClick={() => handleSort('ht')} aria-sort={sortKey === 'ht' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}>
                      <div className="inline-flex items-center gap-1">
                        Félidő eredmény
                        <ChevronsUpDownIcon className="opacity-60" style={{
                      width: 14,
                      height: 14,
                      strokeWidth: 1.5
                    }} />
                      </div>
                    </th>
                    <th className={`text-left font-medium px-4 py-3 cursor-pointer select-none hover:bg-white/5 ${sortKey === 'ft' ? `sorted-${sortDirection}` : ''}`} onClick={() => handleSort('ft')} aria-sort={sortKey === 'ft' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}>
                      <div className="inline-flex items-center gap-1">
                        Végeredmény
                        <ChevronsUpDownIcon className="opacity-60" style={{
                      width: 14,
                      height: 14,
                      strokeWidth: 1.5
                    }} />
                      </div>
                    </th>
                    <th className={`text-left font-medium px-4 py-3 cursor-pointer select-none hover:bg-white/5 ${sortKey === 'btts' ? `sorted-${sortDirection}` : ''}`} onClick={() => handleSort('btts')} aria-sort={sortKey === 'btts' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}>
                      <div className="inline-flex items-center gap-1">
                        BTTS
                        <ChevronsUpDownIcon className="opacity-60" style={{
                      width: 14,
                      height: 14,
                      strokeWidth: 1.5
                    }} />
                      </div>
                    </th>
                    <th className={`text-left font-medium px-4 py-3 cursor-pointer select-none hover:bg-white/5 ${sortKey === 'comeback' ? `sorted-${sortDirection}` : ''}`} onClick={() => handleSort('comeback')} aria-sort={sortKey === 'comeback' ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}>
                      <div className="inline-flex items-center gap-1">
                        Fordítás
                        <ChevronsUpDownIcon className="opacity-60" style={{
                      width: 14,
                      height: 14,
                      strokeWidth: 1.5
                    }} />
                      </div>
                    </th>
                    <th className="text-left font-medium px-4 py-3">
                      <span className="sr-only">Műveletek</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentMatches.map(match => <tr key={match.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={match.homeTeam.logoUrl} alt={`${match.home} logo`} className="w-6 h-6 rounded-full object-cover team-logo" />
                          <Link to={`/team/${encodeURIComponent(match.home)}`} className="text-zinc-200 hover:text-violet-300">
                            {match.home}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={match.awayTeam.logoUrl} alt={`${match.away} logo`} className="w-6 h-6 rounded-full object-cover team-logo" />
                          <Link to={`/team/${encodeURIComponent(match.away)}`} className="text-zinc-200 hover:text-violet-300">
                            {match.away}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{match.ht}</td>
                      <td className="px-4 py-3 text-zinc-300">{match.ft}</td>
                      <td className="px-4 py-3">
                        {match.btts ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30">
                            Igen
                          </span> : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-500/10 text-slate-300 ring-1 ring-slate-400/30">
                            Nem
                          </span>}
                      </td>
                      <td className="px-4 py-3">
                        {match.comeback ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/30">
                            Igen
                          </span> : <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-500/10 text-slate-300 ring-1 ring-slate-400/30">
                            Nem
                          </span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/match/${match.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200" aria-label={`${match.home} vs ${match.away} mérkőzés részleteinek megtekintése`}>
                          Részletek <InfoIcon size={14} />
                        </Link>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            {/* Mobile card view */}
            <div className="md:hidden">
              <div className="divide-y divide-white/10">
                {currentMatches.map(renderMobileMatchCard)}
              </div>
            </div>
          </> : <div className="px-6 py-10 text-center text-sm text-zinc-300">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 mb-3">
              <i className="text-zinc-300" style={{
            width: 18,
            height: 18,
            strokeWidth: 1.5
          }}>
                🔍
              </i>
            </div>
            <p>Nincs találat a megadott szűrőkkel. Módosítsd a feltételeket.</p>
          </div>}
      </div>
      {/* Pagination Controls (Bottom) */}
      {matches.length > 0 && <div className="mt-4 flex flex-wrap items-center justify-between bg-white/5 ring-1 ring-white/10 rounded-lg px-3 sm:px-4 py-3 gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-400">
            <span>
              Összesen:{' '}
              <span className="font-medium text-zinc-200">
                {matches.length}
              </span>{' '}
              mérkőzés
            </span>
          </div>
          <div className="flex items-center gap-2" role="navigation" aria-label="Lapozás">
            <button className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-zinc-200 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Előző oldal">
              <ChevronLeftIcon style={{
            width: 16,
            height: 16
          }} />
              <span className="hidden sm:inline">Előző</span>
            </button>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-zinc-300 bg-white/10 rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-zinc-200 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Következő oldal">
              <span className="hidden sm:inline">Következő</span>
              <ChevronRightIcon style={{
            width: 16,
            height: 16
          }} />
            </button>
          </div>
        </div>}
    </section>;
};