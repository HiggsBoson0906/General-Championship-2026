import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Trophy,
  Clock,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const SportDetailPage: React.FC = () => {
  const { sportId } = useParams<{ sportId: string }>();
  const { getSport, getTeam, standings, data } = useTournament();
  const [activeTab, setActiveTab] = useState<'matches' | 'standings'>('matches');

  const sport = sportId ? getSport(sportId) : undefined;
  const sportMatches = (data?.matches ?? []).filter((m) => m.sportId === sportId);

  const completedMatches = sportMatches.filter((m) => m.status === 'completed');
  const upcomingMatches = sportMatches.filter((m) => m.status === 'scheduled');

  // Compute sport-specific standings
  const sportStandings = useMemo(() => {
    if (!sport) return [];

    const list = standings.map((s) => {
      const breakdown = s.distributedPoints.find((dp) => dp.sportId === sport.id);
      return {
        teamId: s.teamId,
        teamName: s.teamName,
        shortName: s.shortName,
        department: s.department,
        primaryColor: s.primaryColor,
        points: breakdown?.points ?? 0,
        matchesPlayed: breakdown?.matchesPlayed ?? 0,
        wins: breakdown?.wins ?? 0,
      };
    });

    // Sort by points descending, then wins descending
    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.wins - a.wins;
    });

    return list;
  }, [sport, standings]);

  if (!sport) {
    return (
      <EmptyState
        title="Sport Not Found"
        description={`The requested sport discipline "${sportId}" does not exist in championship data.`}
        action={
          <Link to="/sports">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Sports Directory
            </button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/sports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Sports
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-950 border border-amber-900/40 p-8 sm:p-12 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="gold">{sport.category}</Badge>
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> {sport.venue}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-russo text-white tracking-wide">
              {sport.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
              {sport.description}
            </p>
          </div>

          <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 text-center shrink-0 shadow-md">
            <span className="text-xs uppercase font-bold text-stone-400 tracking-wider block">
              Discipline Weight
            </span>
            <span className="text-4xl font-black font-russo text-amber-400 block mt-1">
              {sport.maxPoints} PTS
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              {completedMatches.length} / {sportMatches.length} Completed
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'matches'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
              : 'text-stone-400 hover:text-white bg-stone-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Fixtures & Results ({sportMatches.length})
        </button>

        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'standings'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
              : 'text-stone-400 hover:text-white bg-stone-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Sport Standings
        </button>
      </div>

      {/* Tab Content: Matches */}
      {activeTab === 'matches' && (
        <div className="space-y-8">
          {/* Completed Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-russo text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Completed Results ({completedMatches.length})
              </h3>
              <Badge variant="completed" size="sm">Points Allocated</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedMatches.map((m) => {
                const team1 = getTeam(m.team1Id);
                const team2 = m.team2Id ? getTeam(m.team2Id) : null;
                const winner = m.winnerId ? getTeam(m.winnerId) : null;

                return (
                  <Card key={m.id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
                      <span className="font-bold text-amber-400">{m.stage}</span>
                      <span>{m.date} • {m.time}</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/teams/${team1?.id}`}
                            className={`font-semibold text-sm hover:underline ${
                              winner?.id === team1?.id ? 'text-amber-400 font-bold' : 'text-white'
                            }`}
                          >
                            {team1?.name}
                          </Link>
                          {m.scoreTeam1 && (
                            <span className="font-mono text-xs font-bold text-stone-300">
                              {m.scoreTeam1}
                            </span>
                          )}
                        </div>

                        {team2 && (
                          <div className="flex items-center justify-between">
                            <Link
                              to={`/teams/${team2.id}`}
                              className={`font-semibold text-sm hover:underline ${
                                winner?.id === team2?.id ? 'text-amber-400 font-bold' : 'text-white'
                              }`}
                            >
                              {team2.name}
                            </Link>
                            {m.scoreTeam2 && (
                              <span className="font-mono text-xs font-bold text-stone-300">
                                {m.scoreTeam2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <Badge variant="completed" size="sm">
                          Winner: {winner?.shortName ?? 'N/A'} (+{m.pointsAwarded} pts)
                        </Badge>
                      </div>
                    </div>

                    {m.mvpName && (
                      <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-xs text-amber-300/80">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" /> MVP: {m.mvpName}
                        </span>
                        {m.mvpTitle && <span className="text-stone-400">{m.mvpTitle}</span>}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Upcoming Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-russo text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Upcoming Fixtures ({upcomingMatches.length})
              </h3>
              <Badge variant="scheduled" size="sm">Scheduled</Badge>
            </div>

            {upcomingMatches.length === 0 ? (
              <div className="p-8 text-center text-stone-500 border border-dashed border-stone-800 rounded-2xl text-xs">
                All fixtures for this sport have concluded.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMatches.map((m) => {
                  const team1 = getTeam(m.team1Id);
                  const team2 = m.team2Id ? getTeam(m.team2Id) : null;

                  return (
                    <Card key={m.id} className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
                        <span className="font-bold text-amber-400">{m.stage}</span>
                        <Badge variant="scheduled" size="sm">Scheduled</Badge>
                      </div>

                      <div className="text-base font-bold text-white py-1">
                        {team1?.name} <span className="text-stone-500 font-normal">vs</span> {team2?.name ?? 'TBD'}
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/60">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" /> {m.date} at {m.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-500" /> {m.venue}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Standings */}
      {activeTab === 'standings' && (
        <Card className="overflow-hidden p-0 border-stone-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-950 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th scope="col" className="px-6 py-4">Rank</th>
                  <th scope="col" className="px-6 py-4">Team</th>
                  <th scope="col" className="px-4 py-4 text-center">Played</th>
                  <th scope="col" className="px-4 py-4 text-center">Wins</th>
                  <th scope="col" className="px-6 py-4 text-right">Points in {sport.title}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 font-medium">
                {sportStandings.map((s, index) => (
                  <tr key={s.teamId} className="hover:bg-stone-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-russo text-amber-400">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/teams/${s.teamId}`}
                        className="group flex items-center gap-3"
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: s.primaryColor }}
                        />
                        <div>
                          <div className="text-white font-bold group-hover:text-amber-400 transition-colors">
                            {s.teamName}
                          </div>
                          <div className="text-xs text-stone-400">{s.department}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center text-stone-300">
                      {s.matchesPlayed}
                    </td>
                    <td className="px-4 py-4 text-center text-emerald-400 font-bold">
                      {s.wins}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap font-russo text-lg text-amber-400 font-bold">
                      {s.points} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
