import { CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import type { Sport } from "../../types/index";
import { sportCardStyles } from "../../data/sportCardStyle";

interface SportCardProps {
  sport: Sport;
}

interface SportCardStyle extends CSSProperties {
  "--sport-color": string;
  "--sport-light": string;
}

export default function SportsCard({ sport }: SportCardProps) {
  const { cardColor, cardLight, cardIcon: CardIcon } = sportCardStyles[sport.title.toLowerCase()];

  return (
    <Link
      to={`/sports/${sport.id}`}
      className="block rounded-2xl text-inherit no-underline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[var(--sport-color,#2478ff)]"
    >
      <article
        className="relative flex min-w-0 flex-col overflow-hidden rounded-[19px] border border-[#263b5b] bg-[#111827] shadow-[0_7px_20px_rgba(0,0,0,0.3)] transition-all duration-[250ms] ease-in-out hover:-translate-y-2 hover:border-[#2478ff] hover:shadow-[0_13px_30px_rgba(36,120,255,0.18)]"
        style={
          {
            "--sport-color": cardColor,
            "--sport-light": cardLight,
          } as SportCardStyle
        }
      >
        <img
          className="block h-[clamp(145px,14vw,215px)] w-full shrink-0 bg-[#1e293b] object-cover max-[1100px]:h-[230px]"
          src={sport.image}
          alt={`${sport.title} players`}
          loading="lazy"
          decoding="async"
        />
        <div className="relative z-[1] bg-[#111827] px-[15px] pb-[39px] pt-3 max-[600px]:pb-10">
          <div className="mb-[9px] flex items-center gap-3">
            <div
              className="flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: "var(--sport-color)" }}
            >
              <CardIcon size={29} strokeWidth={2.2} />
            </div>

            <h2 className="m-0 text-[clamp(18px,1.75vw,28px)] font-bold leading-[1.2] text-[#f1f5f9] max-[1100px]:text-[25px] max-[600px]:text-[26px]">
              {sport.title}
            </h2>
          </div>
          <div className="mb-[19px] ml-[5px] flex items-center gap-[9px] text-[clamp(12px,1vw,16px)] text-[#b0c1da] max-[1100px]:text-[15px]">
            <Users size={18} fill="currentColor" className="shrink-0 text-[#91a7c8]" />
            
            <span>
              For {sport.sportCategory[0]}
              {sport.sportCategory[1] &&
                " and " + sport.sportCategory[1]}
            </span>
          </div>

          <div className="ml-[5px] flex items-center gap-2 whitespace-nowrap text-[clamp(12px,1vw,16px)] text-[var(--sport-color)] max-[1100px]:text-[15px] max-[600px]:text-[14px]">
            <CalendarDays
              size={20}
              strokeWidth={2.2}
              className="shrink-0"
            />

            <span>6 Oct 2026 - 19 Oct 2026</span>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -bottom-[26px] -left-[10%] -right-[10%] z-[1] h-[67px] bg-[var(--sport-light)] opacity-25 [clip-path:ellipse(55%_48%_at_50%_100%)]"
          aria-hidden="true"
        />
      </article>
    </Link>
  );
}