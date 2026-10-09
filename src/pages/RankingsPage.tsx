import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Search,
  ArrowUpDown,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import type { TeamStanding } from '../types';

type SortField = 'rank' | 'teamName' | 'matchesPlayed' | 'wins' | 'overallPoints';

export const RankingsPage: React.FC = () => {
  const { standings, scoringConfig } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectedStanding, setSelectedStanding] = useState<TeamStanding | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'rank' || field === 'teamName');
    }
  };

  const filteredAndSortedStandings = useMemo(() => {
    let list = standings.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.teamName.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      let result = 0;
      if (sortField === 'rank') result = a.rank - b.rank;
      else if (sortField === 'overallPoints') result = b.overallPoints - a.overallPoints;
      else if (sortField === 'wins') result = b.wins - a.wins;
      else if (sortField === 'matchesPlayed') result = b.matchesPlayed - a.matchesPlayed;
      else if (sortField === 'teamName') result = a.teamName.localeCompare(b.teamName);

      return sortAsc ? result : -result;
    });

    return list;
  }, [standings, searchQuery, sortField, sortAsc]);

  return (
    <div className="space-y-8">
      {/* Page Title & Scoring System Notice */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            <Trophy className="w-4 h-4" /> Championship Table
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-russo text-white tracking-wide">
            OVERALL RANKINGS
          </h1>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
            Live aggregated tournament standings computed dynamically across completed fixtures in all 6 sports.
            Click any team for comprehensive records or open their sport breakdown.
          </p>
        </div>

        {/* Scoring engine info badge */}
        <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl text-xs text-stone-300 max-w-md shrink-0 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <Info className="w-4 h-4" />
            <span>Scoring Engine: {scoringConfig.mode}</span>
          </div>
          <p className="text-stone-400 leading-relaxed">{scoringConfig.notes}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter teams by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900/90 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="text-xs text-stone-400 flex items-center justify-between sm:justify-end gap-2">
          <span>Showing {filteredAndSortedStandings.length} of {standings.length} teams</span>
        </div>
      </div>

      {/* Standings Table Card */}
      <Card className="overflow-hidden p-0 border-stone-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-950 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800">
              <tr>
                <th
                  scope="col"
                  onClick={() => handleSort('rank')}
                  className="px-6 py-4 cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1.5">
                    Rank <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort('teamName')}
                  className="px-6 py-4 cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1.5">
                    Team & Department <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort('matchesPlayed')}
                  className="px-4 py-4 text-center cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1.5">
                    P <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort('wins')}
                  className="px-4 py-4 text-center cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1.5">
                    W <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th scope="col" className="px-4 py-4 text-center whitespace-nowrap">
                  L
                </th>
                <th scope="col" className="px-4 py-4 text-center whitespace-nowrap">
                  D
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort('overallPoints')}
                  className="px-6 py-4 text-right cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center justify-end gap-1.5 text-amber-400">
                    Points <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th scope="col" className="px-6 py-4 text-center whitespace-nowrap">
                  Breakdown
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 font-medium">
              {filteredAndSortedStandings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-stone-500">
                    No teams found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredAndSortedStandings.map((s) => {
                  const isLeader = s.rank === 1;
                  const isPodium = s.rank <= 3;

                  return (
                    <tr
                      key={s.teamId}
                      className={`hover:bg-stone-800/40 transition-colors ${
                        isLeader ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isPodium ? (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-russo text-xs font-bold ${
                                s.rank === 1
                                  ? 'bg-amber-500 text-stone-950 shadow-sm shadow-amber-500/40'
                                  : s.rank === 2
                                  ? 'bg-slate-300 text-stone-950'
                                  : 'bg-amber-700 text-white'
                              }`}
                            >
                              {s.rank}
                            </div>
                          ) : (
                            <span className="font-russo text-stone-400 pl-2">
                              #{s.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Team Name & Department Link */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/teams/${s.teamId}`}
                          className="group flex items-center gap-3.5"
                        >
                          <div
                            className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: s.primaryColor }}
                          />
                          <div>
                            <div className="text-white font-bold group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                              {s.teamName}
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-xs text-stone-400 font-normal">
                              {s.department}
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Played */}
                      <td className="px-4 py-4 text-center text-stone-300 font-semibold">
                        {s.matchesPlayed}
                      </td>

                      {/* Wins */}
                      <td className="px-4 py-4 text-center text-emerald-400 font-bold">
                        {s.wins}
                      </td>

                      {/* Losses */}
                      <td className="px-4 py-4 text-center text-stone-400">
                        {s.losses}
                      </td>

                      {/* Draws */}
                      <td className="px-4 py-4 text-center text-stone-400">
                        {s.draws}
                      </td>

                      {/* Overall Points */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="font-russo text-xl text-amber-400 font-bold">
                          {s.overallPoints}
                        </span>
                      </td>

                      {/* Sport Breakdown Button */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedStanding(s)}
                          className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Layers className="w-3 h-3 text-amber-400" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sport Breakdown Modal */}
      <Modal
        isOpen={selectedStanding !== null}
        onClose={() => setSelectedStanding(null)}
        title={`${selectedStanding?.teamName} — Points By Sport`}
      >
        {selectedStanding && (
          <div className="space-y-5">
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-stone-400 block">Overall Standing</span>
                <span className="text-white font-bold text-sm">
                  Rank #{selectedStanding.rank} • {selectedStanding.wins} Wins
                </span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block">Total Points</span>
                <span className="font-russo text-2xl text-amber-400 font-bold">
                  {selectedStanding.overallPoints} PTS
                </span>
              </div>
            </div>

            <div className="divide-y divide-stone-800 text-xs">
              {selectedStanding.distributedPoints.map((sb) => (
                <div key={sb.sportId} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm text-white block">{sb.sportTitle}</span>
                    <span className="text-stone-400">
                      {sb.matchesPlayed} Matches ({sb.wins} Wins)
                    </span>
                  </div>
                  <Badge variant={sb.points > 0 ? 'gold' : 'neutral'} size="sm">
                    {sb.points} pts
                  </Badge>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <Link
                to={`/teams/${selectedStanding.teamId}`}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
              >
                Go to full team profile & match history <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
