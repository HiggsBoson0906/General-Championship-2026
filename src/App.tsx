import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './context/TournamentContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { RankingsPage } from './pages/RankingsPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { SportsPage } from './pages/SportsPage';
import { SportDetailPage } from './pages/SportDetailPage';
import { SchedulePage } from './pages/SchedulePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TournamentProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rankings" element={<RankingsPage />} />
            <Route path="teams/:teamId" element={<TeamDetailPage />} />
            <Route path="sports" element={<SportsPage />} />
            <Route path="sports/:sportId" element={<SportDetailPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </TournamentProvider>
    </BrowserRouter>
  );
};

export default App;
