import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  MapPin,
  Star,
  Search,
  RotateCcw,
  LayoutList,
  CalendarDays,
  X,
  Sparkles,
  CheckCircle2,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import type { Match } from '../types';

/* =========================================================================
   DATE & FORMATTING HELPERS (Timezone-safe)
   ========================================================================= */

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function getWeekday(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

function formatShortDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function formatDateHeading(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/* =========================================================================
   MAIN SCHEDULE PAGE COMPONENT
   ========================================================================= */

export const SchedulePage: React.FC = () => {
  const { data, getTeam, getSport } = useTournament();

  const matches = data?.matches ?? [];
  const sports = data?.sports ?? [];

  // View state: 'list' (default) or 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filter states
  const [selectedDate, setSelectedDate] = useState<string>(''); // '' = all dates
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'scheduled'>('all');
  const [venueFilter, setVenueFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'points-desc'>('date-asc');

  // Modal state for match details
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);

  // Calendar month selection: '2025-09' (completed series) or '2026-10' (season 2026)
  const [calendarMonth, setCalendarMonth] = useState<'2025-09' | '2026-10'>('2025-09');

  // Derived statistics directly from actual data
  const totalMatches = matches.length;
  const completedCount = matches.filter((m) => m.status === 'completed').length;
  const upcomingCount = matches.filter((m) => m.status === 'scheduled').length;
  const liveCount = matches.filter((m) => m.status === 'live').length;

  // Extract all unique dates with their match counts
  const uniqueDates = useMemo(() => {
    const map = new Map<string, number>();
    matches.forEach((m) => {
      map.set(m.date, (map.get(m.date) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [matches]);

  // Extract all unique venues
  const uniqueVenues = useMemo(() => {
    return Array.from(new Set(matches.map((m) => m.venue))).filter(Boolean).sort();
  }, [matches]);

  // Extract all unique stages
  const uniqueStages = useMemo(() => {
    return Array.from(new Set(matches.map((m) => m.stage))).filter(Boolean).sort();
  }, [matches]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedDate('');
    setSearchQuery('');
    setSportFilter('all');
    setStatusFilter('all');
    setVenueFilter('all');
    setStageFilter('all');
    setSortBy('date-asc');
  };

  const hasActiveFilters =
    selectedDate !== '' ||
    searchQuery.trim() !== '' ||
    sportFilter !== 'all' ||
    statusFilter !== 'all' ||
    venueFilter !== 'all' ||
    stageFilter !== 'all' ||
    sortBy !== 'date-asc';

  // Multi-faceted filtering & sorting logic
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // 1. Date
      if (selectedDate && m.date !== selectedDate) return false;

      // 2. Status
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;

      // 3. Sport
      if (sportFilter !== 'all' && m.sportId !== sportFilter) return false;

      // 4. Venue
      if (venueFilter !== 'all' && m.venue !== venueFilter) return false;

      // 5. Stage
      if (stageFilter !== 'all' && m.stage !== stageFilter) return false;

      // 6. Text Search (matches team name, shortcode, department, sport, player/MVP, venue)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const t1 = getTeam(m.team1Id);
        const t2 = m.team2Id ? getTeam(m.team2Id) : null;
        const sp = getSport(m.sportId);

        const matchT1 =
          t1?.name.toLowerCase().includes(q) ||
          t1?.shortName.toLowerCase().includes(q) ||
          t1?.department.toLowerCase().includes(q);

        const matchT2 =
          t2?.name.toLowerCase().includes(q) ||
          t2?.shortName.toLowerCase().includes(q) ||
          t2?.department.toLowerCase().includes(q);

        const matchSport = sp?.title.toLowerCase().includes(q) || m.sportId.toLowerCase().includes(q);
        const matchVenue = m.venue.toLowerCase().includes(q);
        const matchStage = m.stage.toLowerCase().includes(q);
        const matchMvp = m.mvpName?.toLowerCase().includes(q) || m.mvpTitle?.toLowerCase().includes(q);

        if (!matchT1 && !matchT2 && !matchSport && !matchVenue && !matchStage && !matchMvp) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'points-desc') {
        const diff = (b.pointsAwarded || 0) - (a.pointsAwarded || 0);
        if (diff !== 0) return diff;
      }
      if (sortBy === 'date-desc') {
        const d = b.date.localeCompare(a.date);
        return d !== 0 ? d : b.time.localeCompare(a.time);
      }
      // Default: date-asc
      const d = a.date.localeCompare(b.date);
      return d !== 0 ? d : a.time.localeCompare(b.time);
    });
  }, [matches, selectedDate, statusFilter, sportFilter, venueFilter, stageFilter, searchQuery, sortBy, getTeam, getSport]);

  // Group fixtures by matchday for chronological list
  const matchesByDay = useMemo(() => {
    const map = new Map<string, Match[]>();
    filteredMatches.forEach((m) => {
      const list = map.get(m.date) || [];
      list.push(m);
      map.set(m.date, list);
    });
    return Array.from(map.entries()).map(([date, list]) => ({
      date,
      matches: list,
    }));
  }, [filteredMatches]);

  // Calendar matrix calculation for the chosen month
  const calendarDays = useMemo(() => {
    const [yearStr, monthStr] = calendarMonth.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr) - 1; // 0-indexed

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, dateStr: null, matches: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayMatches = matches.filter((m) => m.date === dateStr);
      days.push({ day: d, dateStr, matches: dayMatches });
    }
    return days;
  }, [calendarMonth, matches]);

  return (
    <div className="space-y-8 pb-16">
      {/* ===================================================================
          1. HERO SECTION
          =================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1A17] via-[#141311] to-[#080807] border border-[#2A2722] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#FFC400]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB000]" />
              GENERAL CHAMPIONSHIP 2026
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-russo text-[#F5F3ED] tracking-wide leading-tight">
              MATCH <span className="text-[#FFC400]">SCHEDULE</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-[#FFB000]">
              "Every fixture. Every rivalry. Every moment."
            </p>

            <p className="text-xs sm:text-sm text-[#A7A39A] leading-relaxed">
              Official schedule, confirmed scores, and department showdowns across all 6 tournament disciplines.
            </p>
          </div>

          {/* List View / Calendar View Switch */}
          <div className="flex items-center gap-1.5 bg-[#080807] p-1.5 rounded-2xl border border-[#2A2722] self-start lg:self-end shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#FFC400] text-[#080807] font-russo shadow-md'
                  : 'text-[#A7A39A] hover:text-[#F5F3ED]'
              }`}
            >
              <LayoutList className="w-4 h-4" /> List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-[#FFC400] text-[#080807] font-russo shadow-md'
                  : 'text-[#A7A39A] hover:text-[#F5F3ED]'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Calendar View
            </button>
          </div>
        </div>

        {/* Fixture Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#2A2722]">
          <div className="bg-[#141311] border border-[#2A2722] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[#A7A39A] text-[10px] uppercase font-bold tracking-wider">
              <span>Total Fixtures</span>
              <Trophy className="w-3.5 h-3.5 text-[#FFC400]" />
            </div>
            <p className="text-2xl font-black font-russo text-[#F5F3ED] mt-1">{totalMatches}</p>
            <span className="text-[11px] text-[#A7A39A]">Across 6 sports</span>
          </div>

          <div className="bg-[#141311] border border-[#2A2722] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[#A7A39A] text-[10px] uppercase font-bold tracking-wider">
              <span>Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-2xl font-black font-russo text-emerald-400 mt-1">{completedCount}</p>
            <span className="text-[11px] text-[#A7A39A]">Results Confirmed</span>
          </div>

          <div className="bg-[#141311] border border-[#2A2722] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[#A7A39A] text-[10px] uppercase font-bold tracking-wider">
              <span>Upcoming</span>
              <Clock className="w-3.5 h-3.5 text-[#FFC400]" />
            </div>
            <p className="text-2xl font-black font-russo text-[#FFC400] mt-1">{upcomingCount}</p>
            <span className="text-[11px] text-[#A7A39A]">Season 2026 Fixtures</span>
          </div>

          <div className="bg-[#141311] border border-[#2A2722] rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[#A7A39A] text-[10px] uppercase font-bold tracking-wider">
              <span>Live Now</span>
              <span className={`w-2 h-2 rounded-full ${liveCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-[#A7A39A]'}`} />
            </div>
            <p className="text-2xl font-black font-russo text-[#F5F3ED] mt-1">{liveCount}</p>
            <span className="text-[11px] text-[#A7A39A]">{liveCount > 0 ? 'In Play' : 'None In Play'}</span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. MATCHDAY NAVIGATION (Horizontal Date Selector)
          =================================================================== */}
      <div className="bg-[#141311] border border-[#2A2722] rounded-2xl p-3 sm:p-4 shadow-md">
        <div className="flex items-center justify-between mb-2.5 px-1 text-xs">
          <span className="font-bold text-[#FFC400] uppercase tracking-wider flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" /> Select Matchday
          </span>
          <span className="text-[#A7A39A]">
            {selectedDate ? (
              <span>Date: <strong className="text-[#F5F3ED]">{selectedDate}</strong></span>
            ) : (
              'All 14 Matchdays'
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* All Dates Button */}
          <button
            onClick={() => setSelectedDate('')}
            className={`flex flex-col items-center justify-center min-w-[95px] h-16 px-3 rounded-xl border text-center transition-all shrink-0 cursor-pointer ${
              selectedDate === ''
                ? 'bg-[#FFC400] text-[#080807] border-[#FFC400] font-black shadow-md'
                : 'bg-[#1C1A17] text-[#F5F3ED] border-[#2A2722] hover:border-[#FFC400]/40'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold opacity-75">Full View</span>
            <span className="text-sm font-russo font-bold">All Dates</span>
            <span className="text-[10px] opacity-75">{totalMatches} matches</span>
          </button>

          {/* Individual Match Dates */}
          {uniqueDates.map(({ date, count }) => {
            const isSelected = selectedDate === date;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[95px] h-16 px-3 rounded-xl border text-center transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFC400] text-[#080807] border-[#FFC400] font-black shadow-md'
                    : 'bg-[#1C1A17] text-[#F5F3ED] border-[#2A2722] hover:border-[#FFC400]/40'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                  {getWeekday(date)}
                </span>
                <span className="text-sm font-russo font-bold">{formatShortDate(date)}</span>
                <span className={`text-[10px] px-1.5 rounded-full font-bold ${
                  isSelected ? 'bg-[#080807] text-[#FFC400]' : 'text-emerald-400'
                }`}>
                  {count} {count === 1 ? 'match' : 'matches'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          3. SEARCH & FILTERS BAR
          =================================================================== */}
      <div className="bg-[#141311] border border-[#2A2722] rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A7A39A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team, sport, venue, or player..."
              className="w-full pl-10 pr-9 py-2 bg-[#080807] border border-[#2A2722] rounded-xl text-xs sm:text-sm text-[#F5F3ED] placeholder-[#A7A39A]/60 focus:outline-none focus:border-[#FFC400]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7A39A] hover:text-[#F5F3ED]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-[#080807] p-1 rounded-xl border border-[#2A2722] text-xs shrink-0">
            {(
              [
                { id: 'all', label: 'All Statuses' },
                { id: 'scheduled', label: 'Upcoming' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === s.id
                    ? 'bg-[#FFC400] text-[#080807]'
                    : 'text-[#A7A39A] hover:text-[#F5F3ED]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#1C1A17] hover:bg-[#2A2722] text-[#FFC400] border border-[#FFC400]/40 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Sport Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A7A39A] uppercase tracking-wider block">
              Discipline
            </label>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#080807] border border-[#2A2722] rounded-xl text-xs text-[#F5F3ED] focus:outline-none focus:border-[#FFC400]"
            >
              <option value="all">All 6 Sports</option>
              {sports.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Venue Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A7A39A] uppercase tracking-wider block">
              Venue
            </label>
            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#080807] border border-[#2A2722] rounded-xl text-xs text-[#F5F3ED] focus:outline-none focus:border-[#FFC400]"
            >
              <option value="all">All Venues</option>
              {uniqueVenues.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A7A39A] uppercase tracking-wider block">
              Stage
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#080807] border border-[#2A2722] rounded-xl text-xs text-[#F5F3ED] focus:outline-none focus:border-[#FFC400]"
            >
              <option value="all">All Stages</option>
              {uniqueStages.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#A7A39A] uppercase tracking-wider block">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#080807] border border-[#2A2722] rounded-xl text-xs text-[#F5F3ED] focus:outline-none focus:border-[#FFC400]"
            >
              <option value="date-asc">Chronological (Earliest First)</option>
              <option value="date-desc">Latest First</option>
              <option value="points-desc">Highest Points Awarded</option>
            </select>
          </div>
        </div>

        {/* Status Count Line */}
        <div className="text-xs text-[#A7A39A] pt-2 border-t border-[#2A2722] flex items-center justify-between">
          <span>
            Showing <strong className="text-[#FFC400]">{filteredMatches.length}</strong> of{' '}
            <strong className="text-[#F5F3ED]">{totalMatches}</strong> fixtures
          </span>
          {hasActiveFilters && (
            <span className="text-[#FFB000] text-[11px] font-semibold">Filtered view active</span>
          )}
        </div>
      </div>

      {/* ===================================================================
          4. CALENDAR VIEW (WHEN TOGGLED)
          =================================================================== */}
      {viewMode === 'calendar' ? (
        <div className="bg-[#141311] border border-[#2A2722] rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#2A2722]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalendarMonth('2025-09')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  calendarMonth === '2025-09'
                    ? 'bg-[#FFC400] text-[#080807] font-russo shadow-md'
                    : 'bg-[#1C1A17] text-[#A7A39A] hover:text-[#F5F3ED]'
                }`}
              >
                September 2025 (Championship Series)
              </button>
              <button
                onClick={() => setCalendarMonth('2026-10')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  calendarMonth === '2026-10'
                    ? 'bg-[#FFC400] text-[#080807] font-russo shadow-md'
                    : 'bg-[#1C1A17] text-[#A7A39A] hover:text-[#F5F3ED]'
                }`}
              >
                October 2026 (Season 2026 Games)
              </button>
            </div>

            <span className="font-russo text-sm text-[#FFC400]">
              {calendarMonth === '2025-09' ? 'September 2025' : 'October 2026'}
            </span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold font-russo uppercase tracking-wider text-[#A7A39A]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((item, idx) => {
              if (!item.day || !item.dateStr) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[60px] sm:min-h-[75px] rounded-xl bg-[#080807]/30 border border-transparent"
                  />
                );
              }

              const isSelected = selectedDate === item.dateStr;
              const hasMatches = item.matches.length > 0;

              return (
                <button
                  key={item.dateStr}
                  disabled={!hasMatches}
                  onClick={() => {
                    setSelectedDate(isSelected ? '' : item.dateStr!);
                  }}
                  className={`flex flex-col items-center sm:items-start justify-between min-h-[60px] sm:min-h-[75px] p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFC400] border-[#FFC400] text-[#080807] font-bold shadow-md'
                      : hasMatches
                      ? 'bg-[#1C1A17] border-[#2A2722] hover:border-[#FFC400]/60 text-[#F5F3ED]'
                      : 'bg-[#080807]/40 border-transparent text-[#A7A39A]/30 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-russo">{item.day}</span>
                    {hasMatches && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-[#080807] text-[#FFC400]' : 'bg-[#FFC400]/15 text-[#FFC400]'
                      }`}>
                        {item.matches.length}
                      </span>
                    )}
                  </div>

                  {hasMatches && (
                    <span className={`text-[10px] hidden sm:block truncate ${
                      isSelected ? 'text-[#080807]' : 'text-[#A7A39A]'
                    }`}>
                      {item.matches.map((m) => getSport(m.sportId)?.title ?? m.sportId).join(', ')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ===================================================================
          5. FIXTURE LIST (CHRONOLOGICAL GROUPED BY MATCHDAY)
          =================================================================== */}
      <div className="space-y-6">
        {filteredMatches.length === 0 ? (
          <div className="p-12 sm:p-16 text-center space-y-3 bg-[#141311] border border-dashed border-[#2A2722] rounded-3xl">
            <Trophy className="w-10 h-10 text-[#A7A39A]/40 mx-auto" />
            <h3 className="text-base font-bold font-russo text-[#F5F3ED]">No Matches Found</h3>
            <p className="text-xs text-[#A7A39A] max-w-sm mx-auto">
              There are no fixtures matching your current filter combination.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 bg-[#FFC400] hover:bg-[#FFB000] text-[#080807] font-russo font-bold rounded-xl text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          matchesByDay.map(({ date, matches: dayMatches }) => (
            <section key={date} className="space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between px-1 pb-1.5 border-b border-[#2A2722]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFC400]" />
                  <h2 className="text-sm sm:text-base font-black font-russo text-[#F5F3ED]">
                    {formatDateHeading(date)}
                  </h2>
                </div>
                <span className="text-[11px] text-[#A7A39A] font-semibold">
                  {dayMatches.length} {dayMatches.length === 1 ? 'fixture' : 'fixtures'}
                </span>
              </div>

              {/* Match Cards */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {dayMatches.map((m) => {
                  const sport = getSport(m.sportId);
                  const t1 = getTeam(m.team1Id);
                  const t2 = m.team2Id ? getTeam(m.team2Id) : null;
                  const winner = m.winnerId ? getTeam(m.winnerId) : null;
                  const isCompleted = m.status === 'completed';

                  return (
                    <div
                      key={m.id}
                      onClick={() => setActiveMatch(m)}
                      className="group bg-[#141311] hover:bg-[#181613] border border-[#2A2722] hover:border-[#FFC400]/40 rounded-2xl p-4 transition-all shadow-md cursor-pointer"
                    >
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#2A2722] text-xs">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/sports/${m.sportId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-russo text-[#FFC400] hover:underline font-bold"
                          >
                            {sport?.title ?? m.sportId}
                          </Link>
                          <span className="px-2 py-0.5 rounded bg-[#080807] border border-[#2A2722] text-[10px] text-[#A7A39A]">
                            {m.stage}
                          </span>
                        </div>

                        <div>
                          {isCompleted ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Completed {m.pointsAwarded > 0 && `(+${m.pointsAwarded} pts)`}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFC400]/10 text-[#FFC400] border border-[#FFC400]/30">
                              Upcoming
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Teams & Score */}
                      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center py-1">
                        {/* Team 1 */}
                        <div className="md:col-span-4 flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-russo text-xs font-bold shrink-0"
                            style={{ backgroundColor: t1?.primaryColor ?? '#ef4444', color: '#080807' }}
                          >
                            {t1?.shortName ?? 'T1'}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/teams/${t1?.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className={`font-russo text-sm hover:underline block truncate ${
                                winner?.id === t1?.id ? 'text-[#FFC400] font-black' : 'text-[#F5F3ED]'
                              }`}
                            >
                              {t1?.name ?? 'Team 1'}
                            </Link>
                            <p className="text-[10px] text-[#A7A39A] truncate">{t1?.department}</p>
                          </div>
                        </div>

                        {/* Center Score / Versus */}
                        <div className="md:col-span-3 text-center py-1.5 px-3 bg-[#080807] rounded-xl border border-[#2A2722]">
                          {isCompleted ? (
                            <div className="space-y-0.5">
                              <span className="text-base sm:text-lg font-black font-russo text-[#FFC400]">
                                {m.scoreTeam1} : {m.scoreTeam2}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider text-[#A7A39A] block font-semibold">
                                Final Result
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-[#FFC400] font-russo">VS</span>
                              <p className="text-[10px] text-[#A7A39A]">{m.time} IST</p>
                            </div>
                          )}
                        </div>

                        {/* Team 2 */}
                        <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3 md:text-right">
                          {t2 ? (
                            <>
                              <div className="min-w-0 order-2 md:order-1">
                                <Link
                                  to={`/teams/${t2.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`font-russo text-sm hover:underline block truncate ${
                                    winner?.id === t2.id ? 'text-[#FFC400] font-black' : 'text-[#F5F3ED]'
                                  }`}
                                >
                                  {t2.name}
                                </Link>
                                <p className="text-[10px] text-[#A7A39A] truncate">{t2.department}</p>
                              </div>
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center font-russo text-xs font-bold shrink-0 order-1 md:order-2"
                                style={{ backgroundColor: t2.primaryColor, color: '#080807' }}
                              >
                                {t2.shortName}
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-[#A7A39A] italic">Single Competitor</span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-[#2A2722] text-xs text-[#A7A39A]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#FFC400]" /> {m.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#FFC400]" /> {m.venue}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {m.mvpName && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#FFC400]">
                              <Star className="w-3 h-3 text-[#FFB000]" /> MVP: {m.mvpName}
                            </span>
                          )}
                          <span className="text-xs text-[#FFC400] font-bold group-hover:underline">
                            Details &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ===================================================================
          6. MATCH DETAIL MODAL
          =================================================================== */}
      {activeMatch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveMatch(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#141311] border border-[#FFC400]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2722]">
              <div>
                <span className="text-xs font-russo text-[#FFC400] uppercase">
                  {getSport(activeMatch.sportId)?.title ?? activeMatch.sportId}
                </span>
                <h3 className="text-xl font-black font-russo text-[#F5F3ED]">{activeMatch.stage}</h3>
              </div>
              <button
                onClick={() => setActiveMatch(null)}
                className="p-1.5 rounded-xl bg-[#1C1A17] hover:bg-[#2A2722] text-[#A7A39A] hover:text-[#F5F3ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date, Time, Venue */}
            <div className="bg-[#080807] border border-[#2A2722] rounded-2xl p-3.5 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#F5F3ED]">
                <Clock className="w-4 h-4 text-[#FFC400]" />
                <div>
                  <p className="font-semibold">{formatDateHeading(activeMatch.date)}</p>
                  <p className="text-[11px] text-[#A7A39A]">{activeMatch.time} IST</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#F5F3ED]">
                <MapPin className="w-4 h-4 text-[#FFC400]" />
                <div>
                  <p className="font-semibold">{activeMatch.venue}</p>
                  <p className="text-[11px] text-[#A7A39A]">Campus Venue</p>
                </div>
              </div>
            </div>

            {/* Teams & Result */}
            <div className="bg-[#1C1A17] border border-[#2A2722] rounded-2xl p-4 text-center space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                {/* Team 1 */}
                <div className="space-y-1">
                  <div
                    className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center font-russo font-bold text-sm shadow-md"
                    style={{
                      backgroundColor: getTeam(activeMatch.team1Id)?.primaryColor ?? '#ef4444',
                      color: '#080807',
                    }}
                  >
                    {getTeam(activeMatch.team1Id)?.shortName}
                  </div>
                  <Link
                    to={`/teams/${activeMatch.team1Id}`}
                    className="text-xs font-russo text-[#F5F3ED] hover:text-[#FFC400] block"
                  >
                    {getTeam(activeMatch.team1Id)?.name}
                  </Link>
                  {activeMatch.winnerId === activeMatch.team1Id && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#FFC400]">
                      <Trophy className="w-2.5 h-2.5" /> Winner
                    </span>
                  )}
                </div>

                {/* Score */}
                <div className="bg-[#080807] p-2.5 rounded-xl border border-[#2A2722]">
                  {activeMatch.status === 'completed' ? (
                    <>
                      <div className="text-lg font-black font-russo text-[#FFC400]">
                        {activeMatch.scoreTeam1} : {activeMatch.scoreTeam2}
                      </div>
                      <span className="text-[9px] uppercase font-bold text-[#A7A39A]">Final</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-[#FFC400] font-russo">VS</span>
                      <p className="text-[10px] text-[#A7A39A]">{activeMatch.time}</p>
                    </>
                  )}
                </div>

                {/* Team 2 */}
                <div className="space-y-1">
                  {activeMatch.team2Id ? (
                    <>
                      <div
                        className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center font-russo font-bold text-sm shadow-md"
                        style={{
                          backgroundColor: getTeam(activeMatch.team2Id)?.primaryColor,
                          color: '#080807',
                        }}
                      >
                        {getTeam(activeMatch.team2Id)?.shortName}
                      </div>
                      <Link
                        to={`/teams/${activeMatch.team2Id}`}
                        className="text-xs font-russo text-[#F5F3ED] hover:text-[#FFC400] block"
                      >
                        {getTeam(activeMatch.team2Id)?.name}
                      </Link>
                      {activeMatch.winnerId === activeMatch.team2Id && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#FFC400]">
                          <Trophy className="w-2.5 h-2.5" /> Winner
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-[#A7A39A] italic">TBD</span>
                  )}
                </div>
              </div>

              {activeMatch.pointsAwarded > 0 && (
                <p className="text-xs text-[#FFC400] pt-2 border-t border-[#2A2722]">
                  +{activeMatch.pointsAwarded} championship points awarded to winner
                </p>
              )}
            </div>

            {/* MVP Section */}
            {activeMatch.mvpName && (
              <div className="bg-[#080807] border border-[#FFC400]/30 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFC400]/20 flex items-center justify-center text-[#FFC400]">
                  <Star className="w-4 h-4 text-[#FFB000]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC400]">
                    Match MVP
                  </span>
                  <p className="font-russo text-sm text-[#F5F3ED]">{activeMatch.mvpName}</p>
                  {activeMatch.mvpTitle && (
                    <p className="text-[11px] text-[#A7A39A]">{activeMatch.mvpTitle}</p>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to={`/sports/${activeMatch.sportId}`}
                className="text-xs font-bold text-[#FFC400] hover:underline"
              >
                View {getSport(activeMatch.sportId)?.title} Directory &rarr;
              </Link>
              <button
                onClick={() => setActiveMatch(null)}
                className="px-4 py-2 bg-[#FFC400] hover:bg-[#FFB000] text-[#080807] font-russo font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
