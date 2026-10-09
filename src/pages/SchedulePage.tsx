import React, { useState, useMemo } from 'react';
import { Calendar, GitBranch, MapPin, Clock, Trophy } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const SchedulePage: React.FC = () => {
  const { data, getTeam, getSport } = useTournament();

  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const matches = data?.matches ?? [];
  const sports = data?.sports ?? [];

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchSport = selectedSport === 'all' || m.sportId === selectedSport;
      return matchStatus && matchSport;
    });
  }, [matches, statusFilter, selectedSport]);

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
                feature/schedule
              </code>
            </p>
          </div>
        </div>
        <Badge variant="gold">Consumes Central Matches CSV</Badge>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Calendar className="w-4 h-4" /> Tournament Calendar
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-russo text-white tracking-wide">
            SCHEDULE & RESULTS
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Comprehensive fixtures and confirmed scores across all departments and sports.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Status Tabs */}
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            {(['all', 'scheduled', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sport Selector */}
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Sports</option>
            {sports.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="p-12 text-center text-stone-500 border border-dashed border-stone-800 rounded-2xl">
            No matches match the selected filters.
          </div>
        ) : (
          filteredMatches.map((m) => {
            const sport = getSport(m.sportId);
            const team1 = getTeam(m.team1Id);
            const team2 = m.team2Id ? getTeam(m.team2Id) : null;
            const winner = m.winnerId ? getTeam(m.winnerId) : null;

            return (
              <Card key={m.id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Sport, Stage, Date */}
                  <div className="space-y-1 md:w-1/4">
                    <span className="font-russo text-amber-400 text-sm block">
                      {sport?.title ?? m.sportId}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold block">
                      {m.stage}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{m.date} • {m.time}</span>
                    </div>
                  </div>

                  {/* Middle: Teams & Score */}
                  <div className="flex-1 space-y-2 border-y md:border-y-0 md:border-x border-stone-800/80 py-3 md:py-0 md:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${winner?.id === team1?.id ? 'text-amber-400' : 'text-white'}`}>
                          {team1?.name ?? m.team1Id}
                        </span>
                        {winner?.id === team1?.id && (
                          <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                        )}
                      </div>
                      {m.scoreTeam1 && (
                        <span className="font-mono text-xs text-stone-300 font-bold bg-stone-950 px-2 py-0.5 rounded">
                          {m.scoreTeam1}
                        </span>
                      )}
                    </div>

                    {team2 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${winner?.id === team2?.id ? 'text-amber-400' : 'text-white'}`}>
                            {team2.name}
                          </span>
                          {winner?.id === team2?.id && (
                            <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                          )}
                        </div>
                        {m.scoreTeam2 && (
                          <span className="font-mono text-xs text-stone-300 font-bold bg-stone-950 px-2 py-0.5 rounded">
                            {m.scoreTeam2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-stone-500 italic">Individual / Open Field</div>
                    )}
                  </div>

                  {/* Right: Venue & Status */}
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
                          Scheduled
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
