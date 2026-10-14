import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import type { GalleryItem } from '../types';
import { HeroSection } from '@/components/custom/HeroSection';
import { LeaderBoard } from '@/components/custom/LeaderBoard';
import { SportCatalog } from '@/components/custom/SportCatalog';
import { ChampionshipHistory } from '@/components/custom/ChampionshipHistory';
import PointAllocation from '@/components/custom/PointAllocation';
import { Samar } from '@/components/custom/Samar';

export const HomePage: React.FC = () => {
  const { data, getTeam, getSport } = useTournament();
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const matches = data?.matches ?? [];
  const gallery = data?.gallery ?? [];
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled');

  const galleryCategories = ['all', ...Array.from(new Set(gallery.map((g) => g.category)))];
  const filteredGallery = gallery.filter(
    (g) => galleryCategory === 'all' || g.category === galleryCategory
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroSection />
      {/* Podium / Top Standings Preview */}
      <LeaderBoard />
      {/* Sports Catalog Highlight */}
      <SportCatalog />
      {/* samar */}

      {/* Recent Results & Upcoming Fixtures Row */}
      <section className="grid grid-cols-1 mb-0 lg:grid-cols-2 gap-8 p-4 lg:pt-0 lg:p-12">
        {/* Recent Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-russo text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Recent Results
            </h3>
            <Link to="/schedule" className="text-xs text-amber-400 hover:underline border px-3 py-2 rounded-lg">
              All results →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2">
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
                          className={`font-semibold ${winner?.id === team1?.id ? 'text-amber-400 font-bold' : 'text-stone-200'
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
                            className={`font-semibold ${winner?.id === team2?.id ? 'text-amber-400 font-bold' : 'text-stone-200'
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
            <Link to="/schedule" className="text-xs text-amber-400 hover:underline border px-3 py-2 rounded-lg">
              Full calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-3">
            {upcomingMatches.slice(0, 4).map((m) => {
              const sport = getSport(m.sportId);
              const team1 = getTeam(m.team1Id);
              const team2 = m.team2Id ? getTeam(m.team2Id) : null;

              return (
                <Card key={m.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80 pb-1.5">
                    <span className="font-bold text-amber-400 uppercase tracking-wide">
                      {sport?.title} •  {m.stage}
                    </span>
                    <Badge variant="scheduled" size="sm">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div className="text-sm font-semibold text-white flex gap-2">
                      {team1?.name} <span className=" font-normal">vs</span> {team2?.name ?? 'TBD'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-t border-stone-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 " /> {m.date} at {m.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 " /> {m.venue}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <PointAllocation />

      <Samar />
      {/* Championship History Section */}
      <ChampionshipHistory />


      {/* Championship Photo Moments Gallery */}
      <section className="space-y-6 p-4 lg:pt-0 lg:p-12">
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
          <div className="flex flex-wrap gap-2 ">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${galleryCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item, i) => (
            <Card
              key={i}
              hoverEffect
              onClick={() => setSelectedGalleryItem(item)}
              className={`p-3 gap-2 cursor-pointer flex flex-col justify-between ${i === 0 ? "col-span-2" : i === 6 ? "row-span-2" : ""} `}
            >
              <div className=" relative aspect-video rounded-xl overflow-hidden h-auto bg-stone-950 border border-stone-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover   group-hover:scale-105 transition-transform duration-300"
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
