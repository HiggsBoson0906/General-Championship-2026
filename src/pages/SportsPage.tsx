import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, GitBranch, MapPin, Award, ChevronRight, Search } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const SportsPage: React.FC = () => {
  const { data } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sports = data?.sports ?? [];

  const categories = ['all', ...Array.from(new Set(sports.map((s) => s.category)))];

  const filteredSports = sports.filter((sport) => {
    const matchesSearch =
      sport.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sport.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sport.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Feature Branch Ownership Banner */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Foundation Route Placeholder
            </span>
            <p className="text-sm text-stone-300">
              Assigned feature branch:{' '}
              <code className="text-amber-300 font-mono font-semibold bg-stone-900 px-2 py-0.5 rounded">
                feature/sports
              </code>
            </p>
          </div>
        </div>
        <Badge variant="gold">Shared Sports Catalog Active</Badge>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Dumbbell className="w-4 h-4" /> Championship Disciplines
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-russo text-white tracking-wide">
            OFFICIAL SPORTS CATALOG
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Explore rules, venues, fixtures, and champions across all 14 championship disciplines.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSports.map((sport) => {
          const matchCount = data?.matches.filter((m) => m.sportId === sport.id).length ?? 0;

          return (
            <Link key={sport.id} to={`/sports/${sport.id}`} className="group block">
              <Card hoverEffect className="h-full flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" size="sm">
                      {sport.category}
                    </Badge>
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Max {sport.maxPoints} pts
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-russo text-white group-hover:text-amber-400 transition-colors">
                    {sport.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {sport.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    {sport.venue}
                  </span>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    {matchCount} Matches <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
