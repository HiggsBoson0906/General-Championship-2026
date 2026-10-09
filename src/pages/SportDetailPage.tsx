import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const SportDetailPage: React.FC = () => {
  const { sportId } = useParams<{ sportId: string }>();
  const { getSport, getTeam, data } = useTournament();

  const sport = sportId ? getSport(sportId) : undefined;
  const sportMatches = data?.matches.filter((m) => m.sportId === sportId) ?? [];

  if (!sport) {
    return (
      <EmptyState
        title="Sport Not Found"
        description={`The requested sport discipline "${sportId}" does not exist in tournament data.`}
        action={
          <Link to="/sports" className="inline-flex items-center gap-1.5 text-amber-400 font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Sports
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
          to="/sports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Sports
        </Link>
      </div>

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-950 border border-amber-900/40 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="gold">{sport.category}</Badge>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> {sport.venue}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-russo text-white tracking-wide">
              {sport.title}
            </h1>
            <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
              {sport.description}
            </p>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 text-center shrink-0">
            <span className="text-xs uppercase font-bold text-stone-400 tracking-wider block">
              Max Championship Weight
            </span>
            <span className="text-3xl font-russo text-amber-400 font-bold">
              {sport.maxPoints} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Matches for this Sport */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-russo text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" /> Match Records & Fixtures ({sportMatches.length})
          </h2>
          <Badge variant="neutral">Central Match Source</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sportMatches.map((m) => {
            const team1 = getTeam(m.team1Id);
            const team2 = m.team2Id ? getTeam(m.team2Id) : null;
            const winner = m.winnerId ? getTeam(m.winnerId) : null;

            return (
              <Card key={m.id} className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80 pb-2">
                  <span className="font-bold text-amber-400">{m.stage}</span>
                  <span>{m.date} • {m.time}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${winner?.id === team1?.id ? 'text-amber-400' : 'text-white'}`}>
                        {team1?.name ?? m.team1Id}
                      </span>
                      {m.scoreTeam1 && (
                        <span className="text-xs font-mono text-stone-400">({m.scoreTeam1})</span>
                      )}
                    </div>

                    {team2 && (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${winner?.id === team2?.id ? 'text-amber-400' : 'text-white'}`}>
                          {team2.name}
                        </span>
                        {m.scoreTeam2 && (
                          <span className="text-xs font-mono text-stone-400">({m.scoreTeam2})</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    {m.status === 'completed' ? (
                      <Badge variant="completed" size="sm">
                        Winner: {winner?.shortName ?? 'N/A'} (+{m.pointsAwarded} pts)
                      </Badge>
                    ) : (
                      <Badge variant="scheduled" size="sm">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>

                {m.mvpName && (
                  <div className="mt-2 pt-2 border-t border-stone-800/60 flex items-center justify-between text-xs text-amber-300/90">
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
      </section>
    </div>
  );
};
