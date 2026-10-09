import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Trophy, Calendar, Dumbbell, BarChart3, Menu, X, FileText } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Trophy, end: true },
  { to: '/rankings', label: 'Rankings', icon: BarChart3, end: false },
  { to: '/sports', label: 'Sports', icon: Dumbbell, end: false },
  { to: '/schedule', label: 'Schedule', icon: Calendar, end: false },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-950/85 border-b border-amber-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 overflow-hidden group-hover:border-amber-400/60 transition-colors">
              <img
                src="/assets/gclogo.png"
                alt="General Championship Logo"
                className="w-10 h-10 object-contain drop-shadow"
                onError={(e) => {
                  // Fallback to icon if logo not loaded
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Trophy className="w-6 h-6 text-amber-400 absolute" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-russo text-xl tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors">
                  GENERAL
                </span>
                <span className="font-russo text-xl tracking-wider text-white">
                  CHAMPIONSHIP
                </span>
              </div>
              <p className="text-xs text-amber-200/60 font-medium tracking-widest uppercase">
                2026 Season Edition
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/40 shadow-sm shadow-amber-500/10 font-russo'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Rulebook Download Button */}
            <a
              href="/data/teams.csv"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-amber-500/40 transition-colors"
              title="Inspect tournament data source"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Tournament Data
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-800 bg-stone-950/95 px-4 pt-2 pb-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`
              }
            >
              <item.icon className="w-4 h-4 text-amber-400" />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
