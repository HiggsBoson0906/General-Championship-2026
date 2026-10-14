import { useTournament } from "@/context/TournamentContext";
import { History, Trophy } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const ChampionshipHistory: React.FC = () => {

    const { data, getTeam } = useTournament()
    const history = data?.history ?? [];
    return (
        <section className="space-y-6 p-4 overflow-hidden lg:pt-0 lg:p-12">
            <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                    <History className="w-4 h-4" /> Tournament Legacy
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-russo text-white">
                    CHAMPIONSHIP HALL OF FAME
                </h2>
            </div>

            <div className="relative history-carousel">
                <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    navigation={{
                        prevEl: ".history-prev",
                        nextEl: ".history-next",
                    }}
                    pagination={{
                        clickable: true,
                        el: ".history-pagination",
                    }}
                    spaceBetween={16}
                    slidesPerView={1.15}
                    breakpoints={{
                        480: {
                            slidesPerView: 1.5,
                            spaceBetween: 16,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 16,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    }}
                    className="!overflow-visible"
                >
                    {history.map((h) => {
                        const winner = getTeam(h.winnerTeamId);
                        const runnerUp = getTeam(h.runnerUpTeamId);

                        return (
                            <SwiperSlide key={h.year} className="!h-auto">
                                <Card className="group relative flex h-full min-h-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-stone-700/70 bg-gradient-to-br from-stone-800/80 via-stone-900/90 to-black/90 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-amber-500/10">
                                    {/* Glossy glass effect */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-amber-500/[0.04]" />

                                    <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                                    <div className="relative z-10">
                                        {/* Year and winning points */}
                                        <div className="mb-5 flex items-center justify-between gap-2">
                                            <span className="font-russo text-2xl font-bold text-amber-400">
                                                {h.year}
                                            </span>

                                            <Badge variant="gold" size="sm">
                                                {h.winnerPoints} PTS
                                            </Badge>
                                        </div>

                                        {/* Champion */}
                                        <div className="mb-4">
                                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                                                Champion
                                            </span>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/25 bg-gradient-to-br from-amber-300/20 to-amber-700/10 shadow-inner">
                                                    <Trophy className="h-5 w-5 text-amber-400" />
                                                </div>

                                                <span className="break-words text-sm font-bold text-white transition-colors group-hover:text-amber-300">
                                                    {winner?.name ?? h.winnerTeamId}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Runner-up */}
                                        <div>
                                            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                                                Runner-up
                                            </span>

                                            <p className="text-sm text-stone-300">
                                                {runnerUp?.name ?? h.runnerUpTeamId}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <p className="relative z-10 mt-5 border-t border-white/10 pt-3 text-xs leading-relaxed text-stone-400">
                                        {h.summary}
                                    </p>
                                </Card>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Pagination dots */}
                <div className="history-pagination mt-5 flex justify-center gap-2" />
            </div>
        </section>
    )
}