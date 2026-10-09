import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Dumbbell, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const { data, standings } = useTournament();

  const top3 = standings.slice(0, 3);
  const recentMatches = data?.matches.filter((m) => m.status === 'completed').slice(0, 4) ?? [];

  return (
    <div className="space-y-12">
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
                feature/home
              </code>
            </p>
          </div>
        </div>
        <Badge variant="gold">Shared Data Layer Connected</Badge>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900/90 to-stone-950 border border-amber-900/30 p-8 sm:p-12">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            General Championship 2026 Edition
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-russo tracking-wide text-white leading-tight">
            THE PURSUIT OF <span className="text-amber-400">EXCELLENCE</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
            The central hub for official standings, department rivalries, and fixture schedules across 14 sports.
            Powered entirely by the shared static CSV data layer.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/rankings">
              <Button size="lg" className="font-russo">
                View Standings <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/schedule">
              <Button variant="secondary" size="lg" className="font-russo">
                Match Schedule
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Data Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Standings Preview */}
        <Card hoverEffect className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2 font-russo text-white text-lg">
              <Trophy className="w-5 h-5 text-amber-400" />
              Leaderboard Preview
            </div>
            <Link to="/rankings" className="text-xs text-amber-400 hover:underline">
              Full table →
            </Link>
          </div>
          <div className="space-y-3">
            {top3.map((s) => (
              <div
                key={s.teamId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-russo font-bold text-amber-400">
                    #{s.rank}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.teamName}</p>
                    <p className="text-xs text-stone-400">{s.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-russo text-amber-400 text-base">{s.overallPoints}</span>
                  <span className="text-[10px] text-stone-400 block">PTS</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sports Preview */}
        <Card hoverEffect className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2 font-russo text-white text-lg">
              <Dumbbell className="w-5 h-5 text-amber-400" />
              Sports Tracked
            </div>
            <Link to="/sports" className="text-xs text-amber-400 hover:underline">
              All sports →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data?.sports.slice(0, 8).map((sp) => (
              <Link
                key={sp.id}
                to={`/sports/${sp.id}`}
                className="p-2 rounded-lg bg-stone-950/50 hover:bg-stone-800/60 border border-stone-800 text-stone-300 hover:text-amber-400 transition-colors"
              >
                {sp.title}
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Matches */}
        <Card hoverEffect className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2 font-russo text-white text-lg">
              <Calendar className="w-5 h-5 text-amber-400" />
              Latest Match Results
            </div>
            <Link to="/schedule" className="text-xs text-amber-400 hover:underline">
              Schedule →
            </Link>
          </div>
          <div className="space-y-2">
            {recentMatches.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/80 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-stone-400 font-semibold uppercase">{m.sportId}</span>
                  <span className="text-stone-500 ml-1.5">{m.stage}</span>
                  <p className="font-medium text-stone-200 mt-0.5">
                    {data?.teams.find((t) => t.id === m.winnerId)?.name ?? 'Match Concluded'}
                  </p>
                </div>
                <Badge variant="completed" size="sm">
                  +{m.pointsAwarded} pts
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
