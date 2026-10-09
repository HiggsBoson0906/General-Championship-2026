import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Dumbbell,
  ArrowRight,
  Award,
  ChevronRight,
  Sparkles,
  Clock,
  MapPin,
  Star,
  History,
  Image as ImageIcon,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import type { GalleryItem } from '../types';

export const HomePage: React.FC = () => {
  const { data, standings, getTeam, getSport } = useTournament();
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<string>('all');

  const teams = data?.teams ?? [];
  const sports = data?.sports ?? [];
  const matches = data?.matches ?? [];
  const history = data?.history ?? [];
  const gallery = data?.gallery ?? [];

  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled');
  const topTeams = standings.slice(0, 3);
  const leader = standings[0];

  const galleryCategories = ['all', ...Array.from(new Set(gallery.map((g) => g.category)))];
  const filteredGallery = gallery.filter(
    (g) => galleryCategory === 'all' || g.category === galleryCategory
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/50 via-stone-900 to-stone-950 border border-amber-900/40 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            General Championship 2026 Edition
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-russo tracking-wide text-white leading-tight">
            THE ARENA OF <span className="text-amber-400">CHAMPIONS</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
            Welcome to the official portal for the inter-departmental athletic championship.
            Explore live standings, discipline schedules, confirmed scores, and department profiles across 6 sports.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/rankings">
              <Button size="lg" className="font-russo">
                Official Leaderboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/schedule">
              <Button variant="secondary" size="lg" className="font-russo">
                View All Matches
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-stone-800/80">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Departments
              </span>
              <p className="text-2xl font-russo text-white font-bold">{teams.length} Teams</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Disciplines
              </span>
              <p className="text-2xl font-russo text-white font-bold">{sports.length} Sports</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Matches Played
              </span>
              <p className="text-2xl font-russo text-amber-400 font-bold">
                {completedMatches.length} / {matches.length}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Table Leader
              </span>
              <p className="text-lg font-russo text-amber-300 truncate">
                {leader ? leader.teamName : 'TBD'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Podium / Top Standings Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Trophy className="w-4 h-4" /> Live Leaderboard
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-russo text-white">
              CHAMPIONSHIP PODIUM
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Current top 3 department leaders in points aggregate.
            </p>
          </div>
          <Link to="/rankings">
            <Button variant="outline" size="sm" className="font-semibold">
              Full Standings Table <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topTeams.map((standing, index) => {
            const isFirst = index === 0;

            return (
              <Link
                key={standing.teamId}
                to={`/teams/${standing.teamId}`}
                className="group block"
              >
                <Card
                  hoverEffect
                  className={`h-full relative overflow-hidden flex flex-col justify-between ${
                    isFirst ? 'border-amber-500/50 bg-gradient-to-b from-stone-900 to-amber-950/20 shadow-lg shadow-amber-500/10' : ''
                  }`}
                >
                  {isFirst && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950 font-russo">
                        <Award className="w-3.5 h-3.5" /> 1ST PLACE
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-russo text-xl font-bold shadow-md shrink-0"
                        style={{ backgroundColor: standing.primaryColor, color: '#09090b' }}
                      >
                        {standing.shortName}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-stone-400 font-semibold uppercase">
                          Rank #{standing.rank}
                        </div>
                        <h3 className="text-xl font-bold text-white font-russo group-hover:text-amber-400 transition-colors truncate">
                          {standing.teamName}
                        </h3>
                        <p className="text-xs text-stone-400 truncate">{standing.department}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-400 block">Matches Record</span>
                        <span className="text-white font-semibold">
                          {standing.wins}W - {standing.losses}L - {standing.draws}D
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-400 block">Total Points</span>
                        <span className="font-russo text-xl text-amber-400 font-bold">
                          {standing.overallPoints} PTS
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:underline">
                    <span>View Team Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sports Catalog Highlight */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Dumbbell className="w-4 h-4" /> Athletic Disciplines
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-russo text-white">
              6 CHAMPIONSHIP SPORTS
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Compete for glory across field, court, and racquet tournaments.
            </p>
          </div>
          <Link to="/sports">
            <Button variant="outline" size="sm" className="font-semibold">
              Browse All Sports <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport) => {
            const sportMatchList = matches.filter((m) => m.sportId === sport.id);
            const completedCount = sportMatchList.filter((m) => m.status === 'completed').length;

            return (
              <Link key={sport.id} to={`/sports/${sport.id}`} className="group block">
                <Card hoverEffect className="h-full flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <Badge variant="outline" size="sm">
                        {sport.category}
                      </Badge>
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
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
                    <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      {sport.venue}
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {completedCount} / {sportMatchList.length} Matches <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Results & Upcoming Fixtures Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-russo text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Recent Results
            </h3>
            <Link to="/schedule" className="text-xs text-amber-400 hover:underline">
              All results →
            </Link>
          </div>

          <div className="space-y-3">
            {completedMatches.slice(0, 4).map((m) => {
              const sport = getSport(m.sportId);
              const team1 = getTeam(m.team1Id);
              const team2 = m.team2Id ? getTeam(m.team2Id) : null;
              const winner = m.winnerId ? getTeam(m.winnerId) : null;

              return (
                <Card key={m.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80 pb-1.5">
                    <span className="font-bold text-amber-400 uppercase tracking-wide">
                      {sport?.title} • {m.stage}
                    </span>
                    <span>{m.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`font-semibold ${
                            winner?.id === team1?.id ? 'text-amber-400 font-bold' : 'text-stone-200'
                          }`}
                        >
                          {team1?.name}
                        </span>
                        {m.scoreTeam1 && (
                          <span className="text-xs font-mono text-stone-400">({m.scoreTeam1})</span>
                        )}
                      </div>
                      {team2 && (
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={`font-semibold ${
                              winner?.id === team2?.id ? 'text-amber-400 font-bold' : 'text-stone-200'
                            }`}
                          >
                            {team2.name}
                          </span>
                          {m.scoreTeam2 && (
                            <span className="text-xs font-mono text-stone-400">({m.scoreTeam2})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <Badge variant="completed" size="sm">
                      +{m.pointsAwarded} pts
                    </Badge>
                  </div>

                  {m.mvpName && (
                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-amber-300/80 border-t border-stone-800/60">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" /> MVP: {m.mvpName}
                      </span>
                      {m.mvpTitle && <span className="text-stone-400">{m.mvpTitle}</span>}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-russo text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> Upcoming Fixtures
            </h3>
            <Link to="/schedule" className="text-xs text-amber-400 hover:underline">
              Full calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingMatches.slice(0, 4).map((m) => {
              const sport = getSport(m.sportId);
              const team1 = getTeam(m.team1Id);
              const team2 = m.team2Id ? getTeam(m.team2Id) : null;

              return (
                <Card key={m.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80 pb-1.5">
                    <span className="font-bold text-amber-400 uppercase tracking-wide">
                      {sport?.title} • {m.stage}
                    </span>
                    <Badge variant="scheduled" size="sm">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div className="text-sm font-semibold text-white">
                      {team1?.name} <span className="text-stone-500 font-normal">vs</span> {team2?.name ?? 'TBD'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-t border-stone-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" /> {m.date} at {m.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" /> {m.venue}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Championship History Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <History className="w-4 h-4" /> Tournament Legacy
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-russo text-white">
            CHAMPIONSHIP HALL OF FAME
          </h2>
          <p className="text-sm text-stone-400">
            Historical roll of champions and runners-up from past tournament editions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {history.map((h) => {
            const winner = getTeam(h.winnerTeamId);
            const runnerUp = getTeam(h.runnerUpTeamId);

            return (
              <Card key={h.year} className="p-5 space-y-3 bg-stone-900/60 border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="font-russo text-xl font-bold text-amber-400">{h.year}</span>
                  <Badge variant="gold" size="sm">
                    {h.winnerPoints} PTS
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                      Champion
                    </span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {winner?.name ?? h.winnerTeamId}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                      Runner-up
                    </span>
                    <span className="text-xs text-stone-300">
                      {runnerUp?.name ?? h.runnerUpTeamId}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-400 pt-2 border-t border-stone-800 leading-relaxed">
                  {h.summary}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Championship Photo Moments Gallery */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <ImageIcon className="w-4 h-4" /> Moments & Action
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-russo text-white">
              TOURNAMENT GALLERY
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Captured moments, game-winning plays, and celebration highlights.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  galleryCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item) => (
            <Card
              key={item.id}
              hoverEffect
              onClick={() => setSelectedGalleryItem(item)}
              className="p-3 space-y-2 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="neutral" size="sm">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                <p className="text-xs text-stone-400 line-clamp-2 mt-1">{item.description}</p>
                {item.date && (
                  <span className="text-[10px] text-stone-500 block mt-2 font-mono">{item.date}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Gallery Lightbox Modal */}
      <Modal
        isOpen={selectedGalleryItem !== null}
        onClose={() => setSelectedGalleryItem(null)}
        title={selectedGalleryItem?.title}
      >
        {selectedGalleryItem && (
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
              <img
                src={selectedGalleryItem.image}
                alt={selectedGalleryItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <Badge variant="gold">{selectedGalleryItem.category}</Badge>
                {selectedGalleryItem.date && (
                  <span className="font-mono">{selectedGalleryItem.date}</span>
                )}
              </div>
              <p className="text-sm text-stone-300 leading-relaxed">
                {selectedGalleryItem.description}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
