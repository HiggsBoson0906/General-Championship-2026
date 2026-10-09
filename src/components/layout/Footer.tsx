import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Database, GitBranch, ShieldCheck } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const Footer: React.FC = () => {
  const { data, validationErrors, scoringConfig } = useTournament();

  return (
    <footer className="w-full bg-stone-950 border-t border-stone-900 mt-20 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-russo text-lg text-white tracking-wider">
                GENERAL CHAMPIONSHIP
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              The premier inter-department sporting championship. Uniting athletes across 14 sports,
              celebrating athletic brilliance and department spirit.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <Database className="w-3.5 h-3.5" />
                Data Source: CSV Static Layer
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                {scoringConfig.provisional ? 'Provisional Scoring Rules' : 'Official Rules'}
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="hover:text-amber-400 transition-colors">
                  Leaderboard & Standings
                </Link>
              </li>
              <li>
                <Link to="/sports" className="hover:text-amber-400 transition-colors">
                  Sports Catalog
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-amber-400 transition-colors">
                  Match Schedule & Results
                </Link>
              </li>
            </ul>
          </div>

          {/* Data & Foundation Stats */}
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider mb-3">
              Data Status
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p>Teams loaded: <span className="text-white font-semibold">{data?.teams.length ?? 0}</span></p>
              <p>Sports tracked: <span className="text-white font-semibold">{data?.sports.length ?? 0}</span></p>
              <p>Matches logged: <span className="text-white font-semibold">{data?.matches.length ?? 0}</span></p>
              <p>
                Schema status:{' '}
                {validationErrors.length === 0 ? (
                  <span className="text-emerald-400 font-medium">All Valid</span>
                ) : (
                  <span className="text-rose-400 font-medium">{validationErrors.length} warnings</span>
                )}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                  <GitBranch className="w-3 h-3 text-amber-500" />
                  Frontend-only foundation
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 General Championship Committee. All rights reserved.</p>
          <p>Built with React, TypeScript, Vite & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};
