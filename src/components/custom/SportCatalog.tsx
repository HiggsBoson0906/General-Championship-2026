import { ChevronRight, Dumbbell, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import { useTournament } from "@/context/TournamentContext";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";

export const SportCatalog: React.FC = () => {
    const { data } = useTournament()

    const sports = data?.sports ?? []
    return (
        <section className="space-y-6 p-4 lg:pt-0 lg:p-12">
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

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sports.map((sport) => {

                    return (
                        <Link key={sport.id} to={`/sports/${sport.id}`} className="group block">
                            <Card hoverEffect className="h-full flex flex-col justify-between space-y-4  bg-cover bg-no-repeat ">
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-3">
                                        <Badge variant="outline" size="sm">
                                            {sport.category}
                                        </Badge>
                                        {/* <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Max {sport.maxPoints} pts
                      </span> */}
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
                                    {/* <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {completedCount} / {sportMatchList.length} Matches <ChevronRight className="w-3.5 h-3.5" />
                    </span> */}
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    )
}