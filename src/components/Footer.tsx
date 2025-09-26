import React from 'react';
import { Link } from 'react-router-dom';
export const Footer: React.FC = () => {
  return <footer className="relative z-10 bg-black/40 border-t border-white/10 backdrop-blur-md py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-white">
              WinMix
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
            <Link to="/" className="hover:text-zinc-200">
              Főoldal
            </Link>
            <a href="#" className="hover:text-zinc-200">
              Adatvédelem
            </a>
            <a href="#" className="hover:text-zinc-200">
              Feltételek
            </a>
            <a href="#" className="hover:text-zinc-200">
              Kapcsolat
            </a>
          </div>
          <div className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} WinMix. Minden jog fenntartva.
          </div>
        </div>
      </div>
    </footer>;
};