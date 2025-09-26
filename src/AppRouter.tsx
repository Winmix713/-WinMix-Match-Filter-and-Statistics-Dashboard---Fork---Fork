import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { MatchDetails } from './pages/MatchDetails';
import { TeamStats } from './pages/TeamStats';
export function AppRouter() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/match/:matchId" element={<MatchDetails />} />
        <Route path="/team/:teamName" element={<TeamStats />} />
      </Routes>
    </BrowserRouter>;
}