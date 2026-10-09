import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  MapPin,
  Award,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const SportsPage: React.FC = () => {
  const { data } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sports = data?.sports ?? [];
  const matches = data?.matches ?? [];

  const categories = ['all', ...Array.from(new Set(sports.map((s) => s.category)))];

  const filteredSports = useMemo(() => {
    return sports.filter((sport) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        sport.title.toLowerCase().includes(q) ||
        sport.description.toLowerCase().includes(q) ||
        sport.venue.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || sport.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sports, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            <Dumbbell className="w-4 h-4" /> Athletic Disciplines
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-russo text-white tracking-wide">
            SPORTS DIRECTORY
          </h1>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
            Explore rules, campus venues, confirmed match scores, and upcoming schedules across all 6 championship sports.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sports or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              {cat === 'all' ? 'All Disciplines' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-400">
          Showing {filteredSports.length} of {sports.length} sports
        </span>
      </div>

      {/* Sports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSports.length === 0 ? (
          <div className="col-span-full p-12 text-center text-stone-500 border border-dashed border-stone-800 rounded-2xl">
            No sports found matching "{searchQuery}"
          </div>
        ) : (
          filteredSports.map((sport) => {
            const sportMatches = matches.filter((m) => m.sportId === sport.id);
            const completedCount = sportMatches.filter((m) => m.status === 'completed').length;
            const scheduledCount = sportMatches.filter((m) => m.status === 'scheduled').length;

            return (
              <Link key={sport.id} to={`/sports/${sport.id}`} className="group block">
                <Card hoverEffect className="h-full flex flex-col justify-between p-5 space-y-4">
                  <div className="space-y-4">
                    {/* Sport Banner Image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
                      <img
                        src={sport.image}
                        alt={sport.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant="outline" size="sm" className="bg-stone-950/80 backdrop-blur-sm">
                          {sport.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-stone-950 font-russo shadow-md">
                          <Award className="w-3.5 h-3.5" /> Max {sport.maxPoints} pts
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold font-russo text-white group-hover:text-amber-400 transition-colors">
                        {sport.title}
                      </h3>
                      <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                        {sport.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        {sport.venue}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/60">
                      <span className="text-stone-400">
                        {completedCount} Completed • {scheduledCount} Upcoming
                      </span>
                      <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        View Discipline <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
