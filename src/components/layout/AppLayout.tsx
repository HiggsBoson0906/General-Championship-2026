import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useTournament } from '../../context/TournamentContext';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingState } from '../common/LoadingState';

export const AppLayout: React.FC = () => {
  const { isLoading, error, refetch } = useTournament();

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-slate-100 selection:bg-amber-500 selection:text-black">
      <Navbar />

      <main className="">
        {isLoading ? (
          <LoadingState message="Connecting to shared CSV tournament data..." />
        ) : error ? (
          <ErrorMessage
            title="Tournament Data Unavailable"
            message={error}
            onRetry={refetch}
          />
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
};
