import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Layers,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { getTeam, getSport, standings, data } = useTournament();
  const [matchTab, setMatchTab] = useState<'all' | 'completed' | 'upcoming'>('all');

  const team = teamId ? getTeam(teamId) : undefined;
  const standing = standings.find((s) => s.teamId === teamId);
  const teamMatches = (data?.matches ?? []).filter(
    (m) => m.team1Id === teamId || m.team2Id === teamId
  );

  const completedMatches = teamMatches.filter((m) => m.status === 'completed');
  const upcomingMatches = teamMatches.filter((m) => m.status === 'scheduled');

  const displayedMatches =
    matchTab === 'all'
      ? teamMatches
      : matchTab === 'completed'
      ? completedMatches
      : upcomingMatches;

  if (!team) {
    return (
      <EmptyState
        title="Team Not Found"
        description={`The requested team identifier "${teamId}" does not exist in the championship records.`}
        action={
          <Link to="/rankings">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Standings
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
          to="/rankings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Rankings Leaderboard
        </Link>
      </div>

      {/* Team Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-stone-950 border border-stone-800 p-8 sm:p-12 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-start sm:items-center gap-6">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center font-russo text-3xl font-black shadow-2xl shrink-0"
              style={{ backgroundColor: team.primaryColor, color: '#09090b' }}
            >
              {team.shortName}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black font-russo text-white tracking-wide">
                  {team.name}
                </h1>
                <Badge variant="gold" size="md">
                  Rank #{standing?.rank ?? '—'}
                </Badge>
              </div>
              <p className="text-sm sm:text-base font-semibold text-amber-300/90">
                {team.department}
              </p>
              <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
                {team.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t md:border-t-0 border-stone-800 pt-4 md:pt-0 shrink-0">
            <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
              Total Points
            </span>
            <span className="text-4xl sm:text-5xl font-black font-russo text-amber-400">
              {standing?.overallPoints ?? 0}
            </span>
            <span className="text-xs text-stone-400 mt-1">
              {standing?.wins ?? 0} Wins • {standing?.matchesPlayed ?? 0} Played
            </span>
          </div>
        </div>
      </section>

      {/* Sport Contribution Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-russo text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" /> Points by Sport
          </h2>
          <span className="text-xs text-stone-400">6 Championship Disciplines</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {standing?.distributedPoints.map((sb) => (
            <Link key={sb.sportId} to={`/sports/${sb.sportId}`} className="group block">
              <Card hoverEffect className="p-4 text-center space-y-1 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs text-stone-300 font-semibold block truncate group-hover:text-amber-400 transition-colors">
                    {sb.sportTitle}
                  </span>
                  <span className="font-russo text-2xl text-amber-400 block font-bold mt-1">
                    {sb.points}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 block pt-1 border-t border-stone-800/80">
                  {sb.wins}W / {sb.matchesPlayed}M
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Match History & Upcoming Fixtures */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-russo text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" /> Match Records ({teamMatches.length})
          </h2>

          {/* Filter Tabs */}
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            {(['all', 'completed', 'upcoming'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMatchTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                  matchTab === tab
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {displayedMatches.length === 0 ? (
          <div className="p-12 text-center text-stone-500 border border-dashed border-stone-800 rounded-2xl">
            No matches found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedMatches.map((m) => {
              const sport = getSport(m.sportId);
              const isWinner = m.winnerId === team.id;
              const opponentId = m.team1Id === team.id ? m.team2Id : m.team1Id;
              const opponent = opponentId ? getTeam(opponentId) : null;

              return (
                <Card key={m.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
                    <Link
                      to={`/sports/${m.sportId}`}
                      className="font-bold text-amber-400 hover:underline"
                    >
                      {sport?.title} • {m.stage}
                    </Link>
                    <span>{m.date}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        vs{' '}
                        {opponent ? (
                          <Link
                            to={`/teams/${opponent.id}`}
                            className="hover:text-amber-400 hover:underline transition-colors"
                          >
                            {opponent.name}
                          </Link>
                        ) : (
                          'TBD'
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                        <MapPin className="w-3 h-3 text-stone-500" />
                        <span>{m.venue}</span>
                        <span>•</span>
                        <span>{m.time}</span>
                      </div>
                    </div>

                    <div>
                      {m.status === 'completed' ? (
                        isWinner ? (
                          <Badge variant="completed" size="sm">
                            Won (+{m.pointsAwarded} pts)
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            Loss (0 pts)
                          </Badge>
                        )
                      ) : (
                        <Badge variant="scheduled" size="sm">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  </div>

                  {m.scoreTeam1 && (
                    <div className="p-2.5 bg-stone-950/70 rounded-xl text-xs font-mono text-stone-300 flex justify-between items-center border border-stone-800/80">
                      <span>{team.shortName}: {m.team1Id === team.id ? m.scoreTeam1 : m.scoreTeam2}</span>
                      <span>{opponent?.shortName ?? 'OPP'}: {m.team1Id === team.id ? m.scoreTeam2 : m.scoreTeam1}</span>
                    </div>
                  )}

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
        )}
      </section>
    </div>
  );
};
