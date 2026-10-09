import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  RotateCcw,
  Star,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const SchedulePage: React.FC = () => {
  const { data, getTeam, getSport } = useTournament();

  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'scheduled'>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const matches = data?.matches ?? [];
  const sports = data?.sports ?? [];
  const teams = data?.teams ?? [];

  // Available unique dates in matches
  const availableDates = useMemo(() => {
    return Array.from(new Set(matches.map((m) => m.date))).sort();
  }, [matches]);

  const resetFilters = () => {
    setStatusFilter('all');
    setSelectedSport('all');
    setSelectedTeam('all');
    setSelectedDate('');
  };

  const hasActiveFilters =
    statusFilter !== 'all' || selectedSport !== 'all' || selectedTeam !== 'all' || selectedDate !== '';

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchSport = selectedSport === 'all' || m.sportId === selectedSport;
      const matchTeam =
        selectedTeam === 'all' || m.team1Id === selectedTeam || m.team2Id === selectedTeam;
      const matchDate = !selectedDate || m.date === selectedDate;

      return matchStatus && matchSport && matchTeam && matchDate;
    }).sort((a, b) => {
      // Sort upcoming chronologically, completed reverse chronologically
      if (a.status === 'scheduled' && b.status === 'scheduled') {
        const d = a.date.localeCompare(b.date);
        return d !== 0 ? d : a.time.localeCompare(b.time);
      }
      const d = b.date.localeCompare(a.date);
      return d !== 0 ? d : b.time.localeCompare(a.time);
    });
  }, [matches, statusFilter, selectedSport, selectedTeam, selectedDate]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            <Calendar className="w-4 h-4" /> Master Schedule & Results
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-russo text-white tracking-wide">
            TOURNAMENT SCHEDULE
          </h1>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
            Filter all 36 fixtures across the 6 sports by match status, department team, sport discipline, or specific tournament dates.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl text-xs font-semibold border border-stone-800 transition-colors inline-flex items-center gap-1.5 self-start cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Filters
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <Card className="p-5 space-y-4 bg-stone-900/90 border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Tab Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Match Status
            </label>
            <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              {(['all', 'completed', 'scheduled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer text-center ${
                    statusFilter === status
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {status === 'scheduled' ? 'Upcoming' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Sport Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Discipline
            </label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/60"
            >
              <option value="all">All 6 Sports</option>
              {sports.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Department Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/60"
            >
              <option value="all">All 8 Teams</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.shortName})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Date Filter
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/60"
            >
              <option value="">All Match Dates</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>
          Showing <span className="text-white font-bold">{filteredMatches.length}</span> matches
        </span>
        <span className="text-stone-500">Live static CSV data source</span>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="p-16 text-center space-y-3 border border-dashed border-stone-800 rounded-2xl bg-stone-900/30">
            <Trophy className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="text-base font-bold text-stone-300">No matches found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              There are no tournament fixtures matching your selected filter combination.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredMatches.map((m) => {
            const sport = getSport(m.sportId);
            const team1 = getTeam(m.team1Id);
            const team2 = m.team2Id ? getTeam(m.team2Id) : null;
            const winner = m.winnerId ? getTeam(m.winnerId) : null;

            return (
              <Card key={m.id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Sport, Stage, Date */}
                  <div className="space-y-1.5 md:w-1/4">
                    <Link
                      to={`/sports/${m.sportId}`}
                      className="font-russo text-amber-400 text-base hover:underline block"
                    >
                      {sport?.title ?? m.sportId}
                    </Link>
                    <span className="text-xs font-semibold text-stone-300 block">
                      {m.stage}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-stone-400 pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{m.date} • {m.time}</span>
                    </div>
                  </div>

                  {/* Center: Teams & Scores */}
                  <div className="flex-1 space-y-3 border-y md:border-y-0 md:border-x border-stone-800/80 py-3 md:py-0 md:px-6">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: team1?.primaryColor ?? '#f59e0b' }}
                        />
                        <Link
                          to={`/teams/${team1?.id}`}
                          className={`font-semibold text-sm hover:underline ${
                            winner?.id === team1?.id ? 'text-amber-400 font-bold' : 'text-white'
                          }`}
                        >
                          {team1?.name}
                        </Link>
                        {winner?.id === team1?.id && (
                          <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                        )}
                      </div>

                      {m.scoreTeam1 && (
                        <span className="font-mono text-xs font-bold text-stone-200 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800">
                          {m.scoreTeam1}
                        </span>
                      )}
                    </div>

                    {/* Team 2 */}
                    {team2 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: team2.primaryColor }}
                          />
                          <Link
                            to={`/teams/${team2.id}`}
                            className={`font-semibold text-sm hover:underline ${
                              winner?.id === team2.id ? 'text-amber-400 font-bold' : 'text-white'
                            }`}
                          >
                            {team2.name}
                          </Link>
                          {winner?.id === team2.id && (
                            <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                          )}
                        </div>

                        {m.scoreTeam2 && (
                          <span className="font-mono text-xs font-bold text-stone-200 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800">
                            {m.scoreTeam2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-stone-500 italic pl-6.5">Open Field / Single Competitor</div>
                    )}

                    {m.mvpName && (
                      <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-xs text-amber-300/80">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" /> MVP: {m.mvpName}
                        </span>
                        {m.mvpTitle && <span className="text-stone-400">{m.mvpTitle}</span>}
                      </div>
                    )}
                  </div>

                  {/* Right: Venue & Status Badge */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:w-1/4 gap-2">
                    <span className="flex items-center gap-1 text-xs text-stone-400 truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      {m.venue}
                    </span>

                    <div>
                      {m.status === 'completed' ? (
                        <Badge variant="completed" size="sm">
                          Completed (+{m.pointsAwarded} pts)
                        </Badge>
                      ) : (
                        <Badge variant="scheduled" size="sm">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
