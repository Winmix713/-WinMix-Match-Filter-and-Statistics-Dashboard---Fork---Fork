import React, { useEffect, useState, useRef } from 'react';
import { FilterIcon, SlidersHorizontalIcon, RotateCcwIcon, DownloadIcon, HomeIcon, FlagIcon, GoalIcon, ShuffleIcon, ChevronDownIcon, SaveIcon, BookmarkIcon, PlusIcon, TrashIcon, CheckIcon } from 'lucide-react';
import { Team, fetchTeams } from '../utils/supabaseClient';
interface FiltersProps {
  onApplyFilters: (filters: FilterState) => void;
  onReset: () => void;
  onExport: () => void;
}
export interface FilterState {
  home: string | null;
  away: string | null;
  btts: boolean | null;
  comeback: boolean | null;
}
interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
}
export const Filters: React.FC<FiltersProps> = ({
  onApplyFilters,
  onReset,
  onExport
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    home: null,
    away: null,
    btts: null,
    comeback: null
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [showSavedFiltersDropdown, setShowSavedFiltersDropdown] = useState(false);
  const dropdownRefs = {
    home: useRef<HTMLDivElement>(null),
    away: useRef<HTMLDivElement>(null),
    btts: useRef<HTMLDivElement>(null),
    comeback: useRef<HTMLDivElement>(null),
    savedFilters: useRef<HTMLDivElement>(null)
  };
  useEffect(() => {
    const loadTeams = async () => {
      const fetchedTeams = await fetchTeams();
      setTeams(fetchedTeams);
    };
    loadTeams();
    // Load saved filters from localStorage
    const loadSavedFilters = () => {
      try {
        const savedFiltersJson = localStorage.getItem('winmix_saved_filters');
        if (savedFiltersJson) {
          const parsedFilters = JSON.parse(savedFiltersJson);
          setSavedFilters(parsedFilters);
        }
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    };
    loadSavedFilters();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const currentRef = dropdownRefs[openDropdown as keyof typeof dropdownRefs];
        if (currentRef.current && !currentRef.current.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
      // Handle saved filters dropdown
      if (showSavedFiltersDropdown && dropdownRefs.savedFilters.current && !dropdownRefs.savedFilters.current.contains(event.target as Node)) {
        setShowSavedFiltersDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, showSavedFiltersDropdown]);
  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };
  const selectTeam = (type: 'home' | 'away', team: Team) => {
    setFilters(prev => ({
      ...prev,
      [type]: team.name
    }));
    setOpenDropdown(null);
  };
  const selectOption = (type: 'btts' | 'comeback', value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setOpenDropdown(null);
  };
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };
  const handleReset = () => {
    setFilters({
      home: null,
      away: null,
      btts: null,
      comeback: null
    });
    onReset();
  };
  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: newFilterName.trim(),
      filters: {
        ...filters
      }
    };
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    // Save to localStorage
    try {
      localStorage.setItem('winmix_saved_filters', JSON.stringify(updatedFilters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
    setNewFilterName('');
    setShowSaveDialog(false);
  };
  const handleDeleteFilter = (id: string) => {
    const updatedFilters = savedFilters.filter(filter => filter.id !== id);
    setSavedFilters(updatedFilters);
    // Update localStorage
    try {
      localStorage.setItem('winmix_saved_filters', JSON.stringify(updatedFilters));
    } catch (error) {
      console.error('Error updating saved filters:', error);
    }
  };
  const handleLoadFilter = (filter: SavedFilter) => {
    setFilters(filter.filters);
    setShowSavedFiltersDropdown(false);
    onApplyFilters(filter.filters);
  };
  return <div className="mt-8 ring-1 ring-white/10 bg-white/5 rounded-2xl backdrop-blur">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-300">
          <FilterIcon style={{
          width: 18,
          height: 18,
          strokeWidth: 1.5
        }} />
          <span className="text-sm font-medium">Szűrők</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="md:hidden text-sm text-zinc-300 hover:text-zinc-100" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Elrejtés' : 'Megjelenítés'}
          </button>
          <div className="hidden sm:flex items-center gap-3">
            {/* Saved filters dropdown */}
            <div className="relative" ref={dropdownRefs.savedFilters}>
              <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5" onClick={() => setShowSavedFiltersDropdown(!showSavedFiltersDropdown)} aria-haspopup="true" aria-expanded={showSavedFiltersDropdown} aria-label="Mentett szűrők">
                <BookmarkIcon style={{
                width: 18,
                height: 18,
                strokeWidth: 1.5
              }} />
                Mentett szűrők
              </button>
              {showSavedFiltersDropdown && <div className="absolute z-30 mt-2 w-64 rounded-xl ring-1 ring-white/10 bg-[#0c0f16] shadow-2xl overflow-hidden">
                  <div className="p-3 border-b border-white/10">
                    <h3 className="text-sm font-medium text-zinc-200">
                      Mentett szűrők
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {savedFilters.length > 0 ? <div className="divide-y divide-white/5">
                        {savedFilters.map(filter => <div key={filter.id} className="p-3 hover:bg-white/5 flex items-center justify-between">
                            <button className="text-left flex-1 text-sm text-zinc-300 hover:text-zinc-100" onClick={() => handleLoadFilter(filter)} aria-label={`Betöltés: ${filter.name}`}>
                              {filter.name}
                            </button>
                            <button className="text-zinc-400 hover:text-red-400 p-1" onClick={() => handleDeleteFilter(filter.id)} aria-label={`Törlés: ${filter.name}`}>
                              <TrashIcon size={16} />
                            </button>
                          </div>)}
                      </div> : <div className="p-3 text-sm text-zinc-400 text-center">
                        Nincsenek mentett szűrők
                      </div>}
                  </div>
                  <div className="p-3 border-t border-white/10">
                    <button className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-md px-3 py-2 hover:bg-white/5" onClick={() => setShowSaveDialog(true)} aria-label="Új szűrő mentése">
                      <PlusIcon size={16} />
                      Új szűrő mentése
                    </button>
                  </div>
                </div>}
            </div>
            <button id="applyBtn" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg hover:shadow-[0_12px_24px_-6px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 transform-gpu transition" onClick={handleApplyFilters} aria-label="Szűrők alkalmazása">
              <SlidersHorizontalIcon style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
              Szűrés
            </button>
            <button id="resetBtn" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5" onClick={handleReset} aria-label="Szűrők visszaállítása">
              <RotateCcwIcon style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
              Visszaállítás
            </button>
            <button id="saveFiltersBtn" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5" onClick={() => setShowSaveDialog(true)} aria-label="Szűrők mentése">
              <SaveIcon style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
              Mentés
            </button>
            <button id="exportBtn" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5 hover:bg-white/5" onClick={onExport} aria-label="CSV exportálás">
              <DownloadIcon style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
              CSV Export
            </button>
          </div>
        </div>
      </div>
      <div className={`px-4 sm:px-6 py-5 ${!showFilters && 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Hazai csapat */}
          <div className="relative" ref={dropdownRefs.home}>
            <label className="block text-xs text-zinc-400 mb-1.5" id="home-team-label">
              Hazai csapat
            </label>
            <button type="button" className="w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10" onClick={() => toggleDropdown('home')} aria-haspopup="listbox" aria-expanded={openDropdown === 'home'} aria-labelledby="home-team-label">
              <div className="flex items-center gap-2 truncate">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 ring-1 ring-white/20">
                  <HomeIcon className="text-white" style={{
                  width: 16,
                  height: 16,
                  strokeWidth: 1.5
                }} />
                </span>
                <span className="text-sm text-zinc-200 font-medium truncate">
                  {filters.home || 'Válassz hazai csapatot'}
                </span>
              </div>
              <ChevronDownIcon className="text-zinc-300" style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
            </button>
            <div className={`absolute z-20 mt-2 w-full rounded-xl ring-1 ring-white/10 bg-[#0c0f16] shadow-2xl overflow-hidden ${openDropdown === 'home' ? '' : 'hidden'}`} role="listbox" aria-labelledby="home-team-label">
              <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                {teams.map(team => <div key={team.id} className="px-3 py-2 flex items-center gap-2 hover:bg-white/5 cursor-pointer dropdown-option" onClick={() => selectTeam('home', team)} role="option" aria-selected={filters.home === team.name}>
                    <img src={team.logoUrl} alt={`${team.name} logo`} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm text-zinc-200">{team.name}</span>
                  </div>)}
              </div>
            </div>
          </div>
          {/* Vendég csapat */}
          <div className="relative" ref={dropdownRefs.away}>
            <label className="block text-xs text-zinc-400 mb-1.5" id="away-team-label">
              Vendég csapat
            </label>
            <button type="button" className="w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10" onClick={() => toggleDropdown('away')} aria-haspopup="listbox" aria-expanded={openDropdown === 'away'} aria-labelledby="away-team-label">
              <div className="flex items-center gap-2 truncate">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 ring-1 ring-white/20">
                  <FlagIcon className="text-white" style={{
                  width: 16,
                  height: 16,
                  strokeWidth: 1.5
                }} />
                </span>
                <span className="text-sm text-zinc-200 font-medium truncate">
                  {filters.away || 'Válassz vendég csapatot'}
                </span>
              </div>
              <ChevronDownIcon className="text-zinc-300" style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
            </button>
            <div className={`absolute z-20 mt-2 w-full rounded-xl ring-1 ring-white/10 bg-[#0c0f16] shadow-2xl overflow-hidden ${openDropdown === 'away' ? '' : 'hidden'}`} role="listbox" aria-labelledby="away-team-label">
              <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                {teams.map(team => <div key={team.id} className="px-3 py-2 flex items-center gap-2 hover:bg-white/5 cursor-pointer dropdown-option" onClick={() => selectTeam('away', team)} role="option" aria-selected={filters.away === team.name}>
                    <img src={team.logoUrl} alt={`${team.name} logo`} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm text-zinc-200">{team.name}</span>
                  </div>)}
              </div>
            </div>
          </div>
          {/* BTTS */}
          <div className="relative" ref={dropdownRefs.btts}>
            <label className="block text-xs text-zinc-400 mb-1.5" id="btts-label">
              Mindkét csapat gólt szerzett
            </label>
            <button type="button" className="w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10" onClick={() => toggleDropdown('btts')} aria-haspopup="listbox" aria-expanded={openDropdown === 'btts'} aria-labelledby="btts-label">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <GoalIcon className="text-zinc-200" style={{
                  width: 16,
                  height: 16,
                  strokeWidth: 1.5
                }} />
                </span>
                <span className="text-sm text-zinc-200 font-medium">
                  {filters.btts === null ? 'Válassz: Igen / Nem' : filters.btts ? 'Igen' : 'Nem'}
                </span>
              </div>
              <ChevronDownIcon className="text-zinc-300" style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
            </button>
            <div className={`absolute z-20 mt-2 w-full rounded-xl ring-1 ring-white/10 bg-[#0c0f16] shadow-2xl overflow-hidden ${openDropdown === 'btts' ? '' : 'hidden'}`} role="listbox" aria-labelledby="btts-label">
              <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                <div className="px-3 py-2 hover:bg-white/5 cursor-pointer dropdown-option" onClick={() => selectOption('btts', true)} role="option" aria-selected={filters.btts === true}>
                  <span className="text-sm text-zinc-200">Igen</span>
                </div>
                <div className="px-3 py-2 hover:bg-white/5 cursor-pointer dropdown-option" onClick={() => selectOption('btts', false)} role="option" aria-selected={filters.btts === false}>
                  <span className="text-sm text-zinc-200">Nem</span>
                </div>
              </div>
            </div>
          </div>
          {/* Fordítás */}
          <div className="relative" ref={dropdownRefs.comeback}>
            <label className="block text-xs text-zinc-400 mb-1.5" id="comeback-label">
              Fordítás történt
            </label>
            <button type="button" className="w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 hover:bg-white/10" onClick={() => toggleDropdown('comeback')} aria-haspopup="listbox" aria-expanded={openDropdown === 'comeback'} aria-labelledby="comeback-label">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <ShuffleIcon className="text-zinc-200" style={{
                  width: 16,
                  height: 16,
                  strokeWidth: 1.5
                }} />
                </span>
                <span className="text-sm text-zinc-200 font-medium">
                  {filters.comeback === null ? 'Válassz: Igen / Nem' : filters.comeback ? 'Igen' : 'Nem'}
                </span>
              </div>
              <ChevronDownIcon className="text-zinc-300" style={{
              width: 18,
              height: 18,
              strokeWidth: 1.5
            }} />
            </button>
            <div className={`absolute z-20 mt-2 w-full rounded-xl ring-1 ring-white/10 bg-[#0c0f16] shadow-2xl overflow-hidden ${openDropdown === 'comeback' ? '' : 'hidden'}`} role="listbox" aria-labelledby="comeback-label">
              <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                <div className="px-3 py-2 hover:bg-white/5 cursor-pointer dropdown-option" onClick={() => selectOption('comeback', true)} role="option" aria-selected={filters.comeback === true}>
                  <span className="text-sm text-zinc-200">Igen</span>
                </div>
                <div className="px-3 py-2 hover:bg-white/5 cursor-pointer dropdown-option" onClick={() => selectOption('comeback', false)} role="option" aria-selected={filters.comeback === false}>
                  <span className="text-sm text-zinc-200">Nem</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="flex-1 sm:hidden inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-tight text-white bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full px-4 py-2.5 shadow-lg" onClick={handleApplyFilters} aria-label="Szűrők alkalmazása">
            <SlidersHorizontalIcon style={{
            width: 18,
            height: 18,
            strokeWidth: 1.5
          }} />
            Szűrés
          </button>
          <button className="flex-1 sm:hidden inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5" onClick={handleReset} aria-label="Szűrők visszaállítása">
            <RotateCcwIcon style={{
            width: 18,
            height: 18,
            strokeWidth: 1.5
          }} />
            Visszaállítás
          </button>
          <button className="flex-1 sm:hidden inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5" onClick={() => setShowSaveDialog(true)} aria-label="Szűrők mentése">
            <SaveIcon style={{
            width: 18,
            height: 18,
            strokeWidth: 1.5
          }} />
            Mentés
          </button>
          <button className="flex-1 sm:hidden inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2.5" onClick={onExport} aria-label="CSV exportálás">
            <DownloadIcon style={{
            width: 18,
            height: 18,
            strokeWidth: 1.5
          }} />
            CSV Export
          </button>
        </div>
      </div>
      {/* Save filter dialog */}
      {showSaveDialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl ring-1 ring-white/10 bg-[#0c0f16] shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Szűrő mentése
            </h3>
            <div className="mb-4">
              <label htmlFor="filterName" className="block text-sm text-zinc-400 mb-1">
                Szűrő neve
              </label>
              <input type="text" id="filterName" className="w-full px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 text-zinc-200 focus:ring-violet-400/50 focus:outline-none" placeholder="Pl. Kedvenc hazai csapatom" value={newFilterName} onChange={e => setNewFilterName(e.target.value)} aria-label="Szűrő neve" />
            </div>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">
                Mentendő szűrők
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <HomeIcon size={14} className="text-zinc-400" />
                  <span className="text-zinc-300">Hazai: </span>
                  <span className="font-medium text-zinc-200">
                    {filters.home || 'Nincs kiválasztva'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FlagIcon size={14} className="text-zinc-400" />
                  <span className="text-zinc-300">Vendég: </span>
                  <span className="font-medium text-zinc-200">
                    {filters.away || 'Nincs kiválasztva'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <GoalIcon size={14} className="text-zinc-400" />
                  <span className="text-zinc-300">BTTS: </span>
                  <span className="font-medium text-zinc-200">
                    {filters.btts === null ? 'Nincs kiválasztva' : filters.btts ? 'Igen' : 'Nem'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ShuffleIcon size={14} className="text-zinc-400" />
                  <span className="text-zinc-300">Fordítás: </span>
                  <span className="font-medium text-zinc-200">
                    {filters.comeback === null ? 'Nincs kiválasztva' : filters.comeback ? 'Igen' : 'Nem'}
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-200 border border-white/10 hover:bg-white/5" onClick={() => setShowSaveDialog(false)} aria-label="Mégsem">
                Mégsem
              </button>
              <button type="button" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-violet-500 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transform-gpu transition" onClick={handleSaveFilter} disabled={!newFilterName.trim()} aria-label="Mentés">
                <span className="flex items-center gap-2">
                  <SaveIcon size={16} />
                  Mentés
                </span>
              </button>
            </div>
          </div>
        </div>}
    </div>;
};