import { BarChart3, Users } from "lucide-react";
import { Card } from "../common/Card";

type PointRule = {
    label: string;
    points: number;
};

type Team = {
    number: string;
    name: string;
};

const pointRules: PointRule[] = [
    { label: "Winner", points: 100 },
    { label: "1st Runner Up", points: 75 },
    { label: "2nd Runner Up", points: 50 },
    { label: "Fourth", points: 30 },
    { label: "Participation", points: 20 },
    { label: "Non-participation", points: 0 },
];

const teams: Team[] = [
    { number: "01", name: "CSE" },
    { number: "02", name: "EE" },
    { number: "03", name: "ECE" },
    { number: "04", name: "MCA" },
    { number: "05", name: "ME" },
    { number: "06", name: "BT" },
    { number: "07", name: "CE" },
    { number: "08", name: "CHE" },
];

const PointAllocation = () => {
    const maxPoints = Math.max(...pointRules.map((rule) => rule.points));

    return (
        <section className="  lg:pt-0  lg:p-12 pt-0 p-4 text-white sm:p-5 ">
            <div className=" flex   flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5  lg:w-full">

                {/* Point Allocation - first on mobile */}
                <Card className="min-w-0 flex-1 rounded-xl  p-4 sm:p-5">
                    <h2 className="mb-5 flex items-center gap-3 font-russo text-sm font-bold uppercase tracking-wide sm:text-base">
                        <BarChart3 className="h-6 w-6 text-amber-400" />
                        Point Allocation
                    </h2>

                    <div className="space-y-3">
                        {pointRules.map((rule) => {
                            const percentage =
                                maxPoints > 0
                                    ? (rule.points / maxPoints) * 100
                                    : 0;

                            return (
                                <div
                                    key={rule.label}
                                    className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-3"
                                >
                                    <div className="relative h-7 overflow-hidden rounded-xl bg-white/[0.04]">
                                        {/* Progressive gold bar */}
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/10 via-amber-500 to-yellow-500 transition-[width] duration-700 ease-out"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />

                                        <span className="relative z-10 flex h-full items-center px-2 text-xs font-medium sm:text-sm">
                                            {rule.label}
                                        </span>
                                    </div>

                                    <span className="whitespace-nowrap text-right text-xs font-semibold text-white/90 sm:text-sm">
                                        {rule.points} pts
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Composite Teams - second on mobile */}
                <Card className="min-w-0 flex-1 rounded-xl  p-4 sm:p-5">
                    <h2 className="mb-5 flex items-center gap-3 font-russo text-sm font-bold uppercase tracking-wide sm:text-base">
                        <Users className="h-6 w-6 fill-amber-400 text-amber-400" />
                        8 Composite Teams
                    </h2>

                    <div className="grid grid-cols-2 gap-2">
                        {teams.map((team) => (
                            <div
                                key={team.number}
                                className="flex min-w-0 items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2 py-3 transition-colors hover:border-amber-400/30 hover:bg-amber-400/[0.04] sm:px-3"
                            >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/80 font-russo text-xs font-bold text-amber-400">
                                    {team.number}
                                </span>

                                <span className="truncate text-xs font-medium text-white/85 sm:text-sm">
                                    {team.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-3">
                        <p className="text-[10px] leading-relaxed text-white/40 sm:text-xs">
                            Eight departments competing as composite teams.
                        </p>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default PointAllocation;