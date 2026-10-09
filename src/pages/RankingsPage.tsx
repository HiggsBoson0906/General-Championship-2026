import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, GitBranch, Info, ChevronRight } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import type { TeamStanding } from '../types';

export const RankingsPage: React.FC = () => {
  const { standings, scoringConfig } = useTournament();
  const [selectedStanding, setSelectedStanding] = useState<TeamStanding | null>(null);

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
                feature/rankings
              </code>
            </p>
          </div>
        </div>
        <Badge variant="gold">Reusable Ranking Calculation Active</Badge>
      </div>

      {/* Header & Scoring Rules info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Trophy className="w-4 h-4" /> Official Standings
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-russo text-white tracking-wide">
            CHAMPIONSHIP LEADERBOARD
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Live points tally aggregated directly from match outcomes in the shared data layer.
          </p>
        </div>

        <div className="p-3 bg-stone-900/90 border border-stone-800 rounded-xl text-xs text-stone-400 max-w-md">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>Scoring Engine: {scoringConfig.mode}</span>
          </div>
          <p className="line-clamp-2">{scoringConfig.notes}</p>
        </div>
      </div>

      {/* Standings Table Card */}
      <Card className="overflow-hidden p-0 border-stone-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-950/80 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800">
              <tr>
                <th scope="col" className="px-6 py-4">Rank</th>
                <th scope="col" className="px-6 py-4">Team & Department</th>
                <th scope="col" className="px-4 py-4 text-center">Played</th>
                <th scope="col" className="px-4 py-4 text-center">Wins</th>
                <th scope="col" className="px-6 py-4 text-right">Points</th>
                <th scope="col" className="px-6 py-4 text-center">Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-medium">
              {standings.map((teamStanding) => {
                const isLeader = teamStanding.rank === 1;
                const isPodium = teamStanding.rank <= 3;

                return (
                  <tr
                    key={teamStanding.teamId}
                    className={`hover:bg-stone-800/40 transition-colors ${
                      isLeader ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isPodium ? (
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-russo text-xs font-bold ${
                              teamStanding.rank === 1
                                ? 'bg-amber-500 text-stone-950 shadow-sm shadow-amber-500/30'
                                : teamStanding.rank === 2
                                ? 'bg-slate-300 text-stone-950'
                                : 'bg-amber-700 text-white'
                            }`}
                          >
                            {teamStanding.rank}
                          </div>
                        ) : (
                          <span className="font-russo text-stone-400 pl-2">
                            #{teamStanding.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/teams/${teamStanding.teamId}`}
                        className="group flex items-center gap-3"
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: teamStanding.primaryColor }}
                        />
                        <div>
                          <div className="text-white font-bold group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                            {teamStanding.teamName}
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-xs text-stone-400 font-normal">
                            {teamStanding.department}
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-4 py-4 text-center text-stone-300">
                      {teamStanding.matchesPlayed}
                    </td>

                    <td className="px-4 py-4 text-center text-stone-300">
                      {teamStanding.wins}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="font-russo text-lg text-amber-400 font-bold">
                        {teamStanding.overallPoints}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStanding(teamStanding)}
                        className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                      >
                        Sport Breakdown
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sport Breakdown Modal */}
      <Modal
        isOpen={selectedStanding !== null}
        onClose={() => setSelectedStanding(null)}
        title={`${selectedStanding?.teamName} - Sport Breakdown`}
      >
        {selectedStanding && (
          <div className="space-y-4">
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center text-xs">
              <span className="text-stone-400">Total Tournament Points:</span>
              <span className="font-russo text-lg text-amber-400 font-bold">
                {selectedStanding.overallPoints} PTS
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-stone-800 text-xs">
              {selectedStanding.distributedPoints.map((sb) => (
                <div key={sb.sportId} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-white">{sb.sportTitle}</span>
                    <span className="text-stone-500 block">
                      Matches: {sb.matchesPlayed} | Wins: {sb.wins}
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
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-bold"
              >
                Go to Full Team Profile <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
