import React from 'react';
import { Link } from 'react-router-dom';
import { ChartLineIcon, SearchIcon, UsersIcon, ShieldIcon } from 'lucide-react';
interface HeaderProps {
  onOpenExtendedStats: () => void;
  onSearch: () => void;
}
export const Header: React.FC<HeaderProps> = ({
  onOpenExtendedStats,
  onSearch
}) => {
  return <header className="relative z-20">
      <div className="bg-black/40 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                WinMix
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/teams" className="flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-white/5" aria-label="Csapatok">
                <UsersIcon size={16} />
                <span className="hidden sm:inline">Csapatok</span>
              </Link>
              <button onClick={onSearch} className="md:hidden p-2 text-zinc-300 hover:text-white" aria-label="Keresés">
                <SearchIcon size={20} />
              </button>
              <button onClick={onOpenExtendedStats} className="hidden sm:flex items-center gap-2 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-4 py-2 hover:bg-white/5" aria-label="Bővített statisztika">
                <ChartLineIcon size={16} />
                <span>Bővített statisztika</span>
              </button>
              <Link to="/admin" className="flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-200 border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-white/5" aria-label="Admin">
                <ShieldIcon size={16} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>;
};