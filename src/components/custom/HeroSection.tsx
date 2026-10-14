import { Link } from "react-router-dom"
import { Button } from "../common/Button"
import { ArrowRight } from "lucide-react"
import { useTournament } from "@/context/TournamentContext";

export const HeroSection: React.FC = () => {
    const { data, standings } = useTournament();
    const teams = data?.teams ?? [];
    const sports = data?.sports ?? [];
    const matches = data?.matches ?? [];
    const completedMatches = matches.filter((m) => m.status === 'completed');
    const leader = standings[0];
    return (
        <section className="relative  overflow-hidden md:h-[60vh] h-[90vh] lg:h-screen   bg-[url('https://plus.unsplash.com/premium_photo-1661881970542-8447015772e8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D')] lg:bg-[url('https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2507&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D')] shadow-2xl bg-cover bg-no-repeat">
            <div className="absolute top-0 min-w-full h-screen bg-gradient-to-b from-black/30 to-black " />
            <div className="relative z-10 max-w-4xl space-y-3 p-4 pt-20 lg:p-12 lg:mt-24 ">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold ">
                    General Championship 2026 Edition
                </div>

                <h1 className="text-4xl sm:text-6xl font-black font-russo tracking-wide text-white leading-tight">
                    THE ARENA OF <span className="text-amber-400">CHAMPIONS</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-200  max-w-2xl">
                    Welcome to the official portal for the inter-departmental athletic championship.
                    Explore live standings, discipline schedules, confirmed scores, and department profiles across 6 sports.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                    <Link to="/rankings">
                        <Button size="lg" className="group">
                            Official Leaderboard <ArrowRight className="w-4 h-4 ml-1.5 group-hover:text-[#6e5c00] duration-200" />
                        </Button>
                    </Link>
                    <Link to="/schedule">
                        <Button variant="secondary" size="lg" className="">
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
    )

}