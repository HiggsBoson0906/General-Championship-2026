import { useTournament } from "@/context/TournamentContext";
import type { Team, Match } from "../../types/index";

interface MatchCardProps {
  matchData: Match;
}

const standardTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const normalTime = `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${
    hours >= 12 ? "PM" : "AM"
  }`;
  return normalTime;
};

const formatDate = (date: string): string => {
  const d = new Date(`${date}T00:00:00Z`);
  const weekday = d.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
  const day = d.getUTCDate();
  const month = d.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  return `${weekday}, ${day} ${month}`;
};

function MatchCard({ matchData }: MatchCardProps) {
  const { getTeam } = useTournament();

  const team1 = matchData.team1Id
    ? getTeam(matchData.team1Id)
    : undefined;

  const team2 = matchData.team2Id
    ? getTeam(matchData.team2Id)
    : undefined;

  const today = new Date().toISOString().split("T")[0];
  const isUpcoming = matchData.date >= today;
  const hasWinner = !!matchData.winnerId;

  const winner =
    team1 && matchData.winnerId === team1.id
      ? team1.name
      : team2 && matchData.winnerId === team2.id
        ? team2.name
        : "";

  const winnerIcon = (
    <div className="absolute -left-[18px] w-[10px] fill-[black]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        aria-hidden="true"
        className="block w-full"
      >
        <path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z" />
      </svg>
    </div>
  );

  const renderTeam = (team: Team | undefined) => {
    const isTBD = !team;
    const isWinner = !!team && matchData.winnerId === team.id;

    return (
      <div className="relative flex items-center">
        {isWinner && winnerIcon}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-xs font-bold ${
            isTBD
              ? "border-slate-300 bg-slate-100 text-slate-500"
              : "border-[#c7d2fe] bg-[#eef2ff] text-[#3730a3]"
          }`}
        >
          {team?.image ? (
            <img
              src={team.image}
              alt={`${team.name} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <span>{team?.name?.charAt(0).toUpperCase() ?? "?"}</span>
          )}
        </div>
        <span
          className={`ml-[14px] text-[14px] ${
            isTBD
              ? "font-normal italic text-slate-400"
              : isWinner
                ? "text-[14.5px] font-semibold text-[#1e293b]"
                : "font-normal text-[#1e293b]"
          }`}
        >
          {team?.name ?? "T.B.D"}
        </span>
      </div>
    );
  };

  return (
    <article className="my-5 box-border w-full max-w-[900px] rounded-[14px] border border-[#d8e0ec] bg-white px-[15px] py-[15px] pl-[35px] font-[Arial,Helvetica,sans-serif] text-[#1e293b] shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
      <header className="mb-5 flex items-start justify-between gap-5">
        <div>
          <span className="inline-block font-mono text-sm font-bold text-[#363333]">
            {matchData.stage}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-[#475569]">
            {matchData.date === today
              ? "Today"
              : formatDate(matchData.date)}
          </span>
        </div>
      </header>

      <section className="mb-[10px] flex justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-[11px]">
          {renderTeam(team1)}
          {renderTeam(team2)}
        </div>
        {isUpcoming || !hasWinner ? (
          <div className="flex shrink-0 flex-col justify-center text-[15px] font-normal text-slate-600">
            {standardTime(matchData.time) || "T.B.D"}
          </div>
        ) : (
          <div className="flex shrink-0 flex-col gap-[11px] text-[15px]">
            <div
              className={`flex h-7 items-center justify-end ${
                team1 && matchData.winnerId === team1.id
                  ? "text-base font-semibold"
                  : "text-sm font-normal"
              }`}
            >
              {matchData.scoreTeam1 ?? "-"}
            </div>
            <div
              className={`flex h-7 items-center justify-end ${
                team2 && matchData.winnerId === team2.id
                  ? "text-base font-semibold"
                  : "text-sm font-normal"
              }`}
            >
              {matchData.scoreTeam2 ?? "-"}
            </div>
          </div>
        )}
      </section>

      <footer className="pt-[10px]">
        <p className="m-0 text-sm leading-[1.6] text-[#475569]">
          {winner
            ? `${winner} won the match.`
            : matchData.venue || "Venue T.B.D"}
        </p>
      </footer>
    </article>
  );
}

export default MatchCard;