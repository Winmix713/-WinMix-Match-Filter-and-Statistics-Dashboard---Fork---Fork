import React, { useEffect, useState, createElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { Filters, FilterState } from './components/Filters';
import { Statistics } from './components/Statistics';
import { ResultsTable } from './components/ResultsTable';
import { Footer } from './components/Footer';
import { ExtendedStatsModal } from './components/ExtendedStatsModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ToastContainer, ToastType } from './components/ToastNotification';
import { fetchMatches, Match } from './utils/supabaseClient';
import { TeamStats } from './pages/TeamStats';
import { MatchDetails } from './pages/MatchDetails';
import { Teams } from './pages/Teams';
import { Admin } from './pages/Admin';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeftIcon, UsersIcon } from 'lucide-react';
// Main dashboard component that contains the filters, statistics, and results table
const Dashboard = ({
  matches,
  filteredMatches,
  filters,
  isLoading,
  isModalOpen,
  toasts,
  setIsModalOpen,
  handleApplyFilters,
  handleReset,
  handleExport,
  removeToast
}) => {
  return <>
      <LoadingOverlay isLoading={isLoading} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Header onOpenExtendedStats={() => setIsModalOpen(true)} onSearch={() => handleApplyFilters(filters)} />
      <main className="relative z-10">
        <section className="bg-black/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 page-content">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
                Mérkőzés szűrő és statisztikák
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300">
                Szűrd a meccseket csapatokra és eseményekre, elemezd a
                kimeneteleket, és exportáld CSV-be.
              </p>
            </div>
            <Filters onApplyFilters={handleApplyFilters} onReset={handleReset} onExport={handleExport} />
            <Statistics matches={filteredMatches} onOpenExtendedStats={() => setIsModalOpen(true)} />
            <ResultsTable matches={filteredMatches} />
          </div>
        </section>
      </main>
      <Footer />
      <ExtendedStatsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} matches={matches} homeTeam={filters.home} awayTeam={filters.away} />
    </>;
};
export function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    home: null,
    away: null,
    btts: null,
    comeback: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: ToastType;
  }>>([]);
  // Load initial data
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMatches({});
        setMatches(data);
        setFilteredMatches(data);
      } catch (error) {
        console.error('Error loading matches:', error);
        addToast('Hiba történt az adatok betöltése közben', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, []);
  const addToast = (message: string, type: ToastType) => {
    const id = uuidv4();
    setToasts(prev => [...prev, {
      id,
      message,
      type
    }]);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  const handleApplyFilters = async (newFilters: FilterState) => {
    try {
      setIsLoading(true);
      setFilters(newFilters);
      // Apply filters
      const data = await fetchMatches({
        home: newFilters.home || undefined,
        away: newFilters.away || undefined,
        btts: newFilters.btts !== null ? newFilters.btts : undefined,
        comeback: newFilters.comeback !== null ? newFilters.comeback : undefined
      });
      setFilteredMatches(data);
      addToast('Szűrők sikeresen alkalmazva', 'success');
    } catch (error) {
      console.error('Error applying filters:', error);
      addToast('Hiba történt a szűrők alkalmazása közben', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleReset = async () => {
    try {
      setIsLoading(true);
      setFilters({
        home: null,
        away: null,
        btts: null,
        comeback: null
      });
      const data = await fetchMatches({});
      setFilteredMatches(data);
      addToast('Szűrők visszaállítva', 'success');
    } catch (error) {
      console.error('Error resetting filters:', error);
      addToast('Hiba történt a szűrők visszaállítása közben', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Hazai csapat', 'Vendég csapat', 'Félidő eredmény', 'Végeredmény', 'Mindkét csapat gólt szerzett', 'Fordítás'];
      const rows = filteredMatches.map(match => [match.home, match.away, match.ht, match.ft, match.btts ? 'Igen' : 'Nem', match.comeback ? 'Igen' : 'Nem']);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      // Create and download the file
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'winmix_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('CSV export sikeres', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      addToast('Hiba történt a CSV exportálása közben', 'error');
    }
  };
  return <div className="antialiased text-zinc-100 bg-[#0a0a12]">
      <Background />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard matches={matches} filteredMatches={filteredMatches} filters={filters} isLoading={isLoading} isModalOpen={isModalOpen} toasts={toasts} setIsModalOpen={setIsModalOpen} handleApplyFilters={handleApplyFilters} handleReset={handleReset} handleExport={handleExport} removeToast={removeToast} />} />
          <Route path="/team/:teamName" element={<TeamStats />} />
          <Route path="/match/:matchId" element={<MatchDetails />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>;
}