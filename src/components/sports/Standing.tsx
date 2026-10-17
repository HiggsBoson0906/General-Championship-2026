import { Link } from "react-router-dom";
import { useTournament } from "../../context/TournamentContext";

interface StandingsProps {
  sportId: string | undefined;
  sportGender: string[];
}

export default function Standings({ sportId, sportGender }: StandingsProps) {
  const { standings, getTeam, getTeams } = useTournament();

  const specificTeams = getTeams(sportGender);
  const teamIds = new Set(specificTeams.map((team) => team.id));

  const rankedTeams = [...standings]
    .filter(
      (standing) =>
        teamIds.has(standing.teamId) &&
        standing.distributedPoints?.some(
          (item) =>
            item.sportId === sportId && item.matchesPlayed > 0
        )
    )
    .sort((a, b) => {
      const pointsA =
        a.distributedPoints?.find(
          (item) => item.sportId === sportId
        )?.points ?? 0;
      const pointsB =
        b.distributedPoints?.find(
          (item) => item.sportId === sportId
        )?.points ?? 0;
      return pointsB - pointsA;
    });

  return (
    <div className="w-full max-w-[900px] overflow-hidden rounded-2xl border border-[rgba(var(--accent-rgb),0.25)] bg-slate-950/70 shadow-xl">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
              <th className="whitespace-nowrap px-4 py-4 text-center">
                Rank
              </th>
              <th className="whitespace-nowrap px-4 py-4">
                Team &amp; Department
              </th>
              <th className="whitespace-nowrap px-3 py-4 text-center">
                Win
              </th>
              <th className="whitespace-nowrap px-3 py-4 text-center">
                Lose
              </th>
              <th className="whitespace-nowrap px-3 py-4 text-center">
                Matches
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-center">
                Points
              </th>
            </tr>
          </thead>

          <tbody>
            {rankedTeams.map((standing, index) => {
              const team = getTeam(standing.teamId);
              const sportStats = standing.distributedPoints?.find(
                (item) => item.sportId === sportId
              );
              if (!team || !sportStats) return null;
              const losses = Math.max(0, sportStats.matchesPlayed - sportStats.wins);

              return (
                <tr
                  key={standing.teamId}
                  className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.04]"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 font-bold text-white">
                      {index + 1}
                    </span>
                  </td>
                  <td className="min-w-0 px-3 py-4">
                    <Link
                      to={`/teams/${team.id}`}
                      className="group flex min-w-0 items-center gap-3"
                    >
                      <img
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                        src={team.image}
                        alt={`${team.name} logo`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block break-words font-semibold text-slate-100 group-hover:text-[var(--accent)]">
                          {team.name}
                        </span>
                        <span className="mt-1 block whitespace-normal break-words text-xs leading-relaxed text-slate-400">
                          {team.department}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center font-semibold text-emerald-400">
                    {sportStats.wins}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center font-semibold text-rose-400">
                    {losses}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center font-semibold text-slate-300">
                    {sportStats.matchesPlayed}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-[rgba(var(--accent-rgb),0.1)] px-3 py-2 font-bold text-[var(--accent)]">
                      {sportStats.points}
                    </span>
                  </td>
                </tr>
              );
            })}

            {rankedTeams.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-slate-400"
                >
                  No matches have been played for this sport in{" "}
                  {sportGender.join(" / ") || "selected"} category yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}