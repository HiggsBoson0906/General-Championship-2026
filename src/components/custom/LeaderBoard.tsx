import { Bird, ChevronRight, Flame, Shield, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { useTournament } from "@/context/TournamentContext";

export const LeaderBoard: React.FC = () => {
    const { standings } = useTournament();
    const topTeams = standings.slice(0, 3);
    return (

        <section className="space-y-6 p-4 pt-0 lg:p-12  lg:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4   ">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                        <Trophy className="w-4 h-4" /> Live Leaderboard
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-russo text-white">
                        CHAMPIONSHIP PODIUM
                    </h2>
                    <p className="text-sm text-stone-400 mt-1">
                        Current top 3 department in GC.
                    </p>
                </div>
                <Link to="/rankings">
                    <Button variant="outline" size="sm" className="font-semibold">
                        Full Standings Table <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="mx-auto grid max-w-3xl grid-cols-3 items-end gap-2 sm:gap-4  lg:items-stretch lg:gap-4 lg:max-w-full ">
                {[...topTeams]
                    .sort((a, b) => a.rank - b.rank)
                    .slice(0, 3)
                    .sort((a, b) => {
                        const order = [1, 2, 3];
                        return order.indexOf(a.rank) - order.indexOf(b.rank);
                    })
                    .map((standing) => {
                        const rank = standing.rank;
                        const isFirst = rank === 1;
                        const isSecond = rank === 2;

                        const theme = isFirst
                            ? {
                                border: "border-amber-400/30",
                                background:
                                    "from-amber-400/20 via-yellow-900/30 to-black/90",
                                glow: "shadow-amber-400/10",
                                badge:
                                    "bg-amber-300/20 text-amber-100 border-amber-200/30",
                                text: "text-amber-300",
                                emblem: "text-amber-300",
                                accent: "from-amber-200/20",
                            }
                            : isSecond
                                ? {
                                    border: "border-red-400/25",
                                    background:
                                        "from-red-500/20 via-red-950/40 to-black/90",
                                    glow: "shadow-red-500/10",
                                    badge:
                                        "bg-red-500/20 text-red-200 border-red-300/25",
                                    text: "text-red-400",
                                    emblem: "text-red-400",
                                    accent: "from-red-300/15",
                                }
                                : {
                                    border: "border-blue-400/25",
                                    background:
                                        "from-blue-500/20 via-blue-950/40 to-black/90",
                                    glow: "shadow-blue-500/10",
                                    badge:
                                        "bg-blue-500/20 text-blue-200 border-blue-300/25",
                                    text: "text-blue-400",
                                    emblem: "text-blue-400",
                                    accent: "from-blue-300/15",
                                };

                        return (
                            <Link
                                key={standing.teamId}
                                to={`/teams/${standing.teamId}`}
                                className={`group block min-w-0 ${standing.rank === 1
                                    ? "order-2 lg:order-1"
                                    : standing.rank === 2
                                        ? "order-1 lg:order-2"
                                        : "order-3"
                                    }`}
                            >
                                <Card
                                    hoverEffect
                                    className={`relative flex flex-col items-center overflow-hidden rounded-2xl border bg-gradient-to-b ${theme.border} ${theme.background} shadow-xl ${theme.glow} backdrop-blur-2xl transition-all duration-300 group-hover:-translate-y-1 ${isFirst ? "min-h-[280px] px-2 py-5 sm:min-h-[320px] sm:px-4 sm:py-6" : "min-h-[225px] px-2 py-4 sm:min-h-[260px] sm:px-4 sm:py-5"} lg:min-h-0 lg:h-[150px] lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:rounded-xl lg:px-3 lg:py-3
                                        }`}
                                >
                                    {/* Glass reflections */}
                                    <div
                                        className={`pointer-events-none  absolute inset-0 bg-gradient-to-br ${theme.accent} via-transparent to-transparent`}
                                    />

                                    <div className="pointer-events-none absolute -top-12 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full bg-white/[0.08] blur-2xl" />

                                    <div className="pointer-events-none absolute inset-x-3 top-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                                    {/* MOBILE LAYOUT — preserve the existing design */}
                                    <div className="flex flex-1 flex-col items-center lg:hidden">
                                        {/* Rank badge */}
                                        <div
                                            className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl border font-russo text-xl font-bold shadow-lg backdrop-blur-xl sm:h-10 sm:w-10 sm:text-2xl ${theme.border} ${theme.badge}`}
                                        >
                                            {rank}
                                        </div>

                                        {/* Lucide team emblem */}
                                        <div className="relative z-10 my-3 flex flex-1 items-center justify-center">
                                            {isFirst ? (
                                                <Bird
                                                    aria-hidden="true"
                                                    strokeWidth={1.5}
                                                    className="h-16 w-16 text-amber-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.45)] transition-transform duration-300 group-hover:scale-110 sm:h-[76px] sm:w-[76px]"
                                                />
                                            ) : isSecond ? (
                                                <Flame
                                                    aria-hidden="true"
                                                    strokeWidth={1.5}
                                                    className="h-14 w-14 text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.4)] transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16"
                                                />
                                            ) : (
                                                <Shield
                                                    aria-hidden="true"
                                                    strokeWidth={1.5}
                                                    className="h-14 w-14 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.4)] transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16"
                                                />
                                            )}
                                        </div>

                                        {/* Team name */}
                                        <div className="relative z-10 w-full text-center">
                                            <h3
                                                className={`mx-auto max-w-full  font-russo font-bold leading-tight text-white ${isFirst ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                                                    }`}
                                            >
                                                {standing.teamName}
                                            </h3>

                                            <p className="mt-1  text-[10px] text-white/50 sm:text-xs">
                                                {standing.department}
                                            </p>
                                        </div>

                                        {/* Total points */}
                                        <div
                                            className={`relative z-10 mt-4 font-russo font-bold tracking-tight ${theme.text} ${isFirst ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                                                }`}
                                            style={{
                                                textShadow: isFirst
                                                    ? "0 0 16px rgba(251,191,36,0.3)"
                                                    : isSecond
                                                        ? "0 0 12px rgba(248,113,113,0.25)"
                                                        : "0 0 12px rgba(96,165,250,0.25)",
                                            }}
                                        >
                                            {standing.overallPoints} PTS
                                        </div>
                                    </div>

                                    {/* DESKTOP LAYOUT — two rows */}
                                    <div className="relative z-10 hidden w-full flex-col gap-3 lg:flex">
                                        {/* Row 1: Rank badge + Team emblem */}
                                        <div className="flex items-center gap-3  w-2/4 justify-between">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-russo text-xl font-bold shadow-lg ${theme.border} ${theme.badge}`}
                                            >
                                                {rank}
                                            </div>

                                            {isFirst ? (
                                                <Bird
                                                    aria-hidden="true"
                                                    strokeWidth={1.5}
                                                    className="h-16 w-16 text-amber-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.45)]"
                                                />
                                            ) : isSecond ? (
                                                <Flame
                                                    aria-hidden="true"
                                                    strokeWidth={1.5}
                                                    className="h-16 w-16 text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.4)]"
                                                />
                                            ) : (
                                                <Shield
                                                    aria-hidden="true"
                                                    strokeWidth={1.5}
                                                    className="h-16 w-16 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.4)]"
                                                />
                                            )}
                                        </div>

                                        {/* Row 2: Team name + Total points */}
                                        <div className="flex w-full items-center justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="break-words font-russo text-sm font-bold leading-tight text-white">
                                                    {standing.teamName}
                                                </h3>

                                                <p className="mt-1 truncate text-[10px] text-white/50">
                                                    {standing.department}
                                                </p>
                                            </div>

                                            <div
                                                className={`shrink-0 whitespace-nowrap font-russo text-base font-bold text-yellow-400 ${theme.text}`}
                                                style={{
                                                    textShadow: isFirst
                                                        ? "0 0 16px rgba(251,191,36,0.3)"
                                                        : isSecond
                                                            ? "0 0 12px rgba(248,113,113,0.25)"
                                                            : "0 0 12px rgba(96,165,250,0.25)",
                                                }}
                                            >
                                                {standing.overallPoints} PTS
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom glass highlight */}
                                    <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                                </Card>
                            </Link>
                        );
                    })}
            </div>
        </section>
    )

}