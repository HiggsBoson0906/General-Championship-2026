import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { getTeam, getSport, standings, data } = useTournament();

  const team = teamId ? getTeam(teamId) : undefined;
  const standing = standings.find((s) => s.teamId === teamId);
  const teamMatches = data?.matches.filter(
    (m) => m.team1Id === teamId || m.team2Id === teamId
  ) ?? [];

  if (!team) {
    return (
      <EmptyState
        title="Team Not Found"
        description={`The requested team identifier "${teamId}" does not exist in the tournament records.`}
        action={
          <Link to="/rankings" className="inline-flex items-center gap-1.5 text-amber-400 font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Standings
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/rankings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
        </Link>
      </div>

      {/* Team Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-800 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-russo text-2xl text-stone-950 font-bold shadow-lg"
              style={{ backgroundColor: team.primaryColor }}
            >
              {team.shortName}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold font-russo text-white tracking-wide">
                  {team.name}
                </h1>
                <Badge variant="gold">Rank #{standing?.rank ?? '—'}</Badge>
              </div>
              <p className="text-stone-300 font-medium text-sm mt-1">{team.department}</p>
              <p className="text-stone-400 text-xs mt-2 max-w-xl">{team.description}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-stone-800 pt-4 sm:pt-0">
            <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
              Championship Points
            </span>
            <span className="text-4xl font-extrabold font-russo text-amber-400">
              {standing?.overallPoints ?? 0}
            </span>
            <span className="text-xs text-stone-400">
              {standing?.wins ?? 0} Wins / {standing?.matchesPlayed ?? 0} Matches
            </span>
          </div>
        </div>
      </div>

      {/* Sport Contribution Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-russo text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Points by Sport
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {standing?.distributedPoints.map((sb) => (
            <Card key={sb.sportId} className="p-3 text-center space-y-1">
              <span className="text-xs text-stone-300 font-semibold block truncate">
                {sb.sportTitle}
              </span>
              <span className="font-russo text-lg text-amber-400 block">
                {sb.points}
              </span>
              <span className="text-[10px] text-stone-500 block">
                {sb.wins}W / {sb.matchesPlayed}M
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* Matches Involving This Team */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-russo text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" /> Match Records ({teamMatches.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMatches.map((m) => {
            const sport = getSport(m.sportId);
            const isWinner = m.winnerId === team.id;
            const opponentId = m.team1Id === team.id ? m.team2Id : m.team1Id;
            const opponent = opponentId ? getTeam(opponentId) : null;

            return (
              <Card key={m.id} className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-bold text-amber-400 uppercase">{sport?.title}</span>
                  <span>{m.stage} • {m.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">
                      vs {opponent ? opponent.name : 'TBD'}
                    </span>
                    <span className="text-xs text-stone-400">{m.venue}</span>
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
                        Scheduled
                      </Badge>
                    )}
                  </div>
                </div>

                {m.scoreTeam1 && (
                  <div className="p-2 bg-stone-950/60 rounded-lg text-xs font-mono text-stone-300 flex justify-between">
                    <span>Score: {m.scoreTeam1}</span>
                    {m.scoreTeam2 && <span>{m.scoreTeam2}</span>}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
