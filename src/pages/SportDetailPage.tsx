import { useState } from "react";
import type { CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTournament } from "../context/TournamentContext";
import { NotFoundPage } from "../pages/NotFoundPage";
import { Button } from "../components/common/Button";
import GenderSwitch from "../components/common/GenderSwitch";
import PreviousMatches from "../components/sports/PreviousMatches";
import Standing from "../components/sports/Standing";
import UpcomingMatches from "../components/sports/UpcomingMatches";

interface ThemeStyle extends CSSProperties {
  "--accent": string;
  "--accent-rgb": string;
}

export default function SportsDetailPage() {
  const { getSport, getMatches } = useTournament();
  const { sportId } = useParams<{ sportId: string }>();

  const [active, setActive] = useState<
    "Standing" | "Upcoming" | "Previous"
  >("Standing");

  const [isMale, setIsMale] = useState(true);

  const sportData = sportId ? getSport(sportId) : undefined;

  if (!sportData) {
    return <NotFoundPage />;
  }

  const sportGender = isMale ? ["Male"] : ["Female"];

  const matchData = sportId
    ? getMatches(sportId, sportGender)
    : [];

  const themeStyle: ThemeStyle = {
    "--accent": isMale ? "#60a5fa" : "#f0abfc",
    "--accent-rgb": isMale ? "96, 165, 250" : "240, 171, 252",
  };

  const navButtonClass =
    "relative rounded-[10px] border px-5 py-3 text-sm font-[650] transition-[color,background-color,border-color,transform] duration-[220ms] ease-in-out hover:-translate-y-0.5 hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[3px] max-[600px]:flex-1 max-[600px]:px-2.5 max-[600px]:py-3 max-[600px]:text-xs";

  const getNavButtonClass = (
    tab: "Standing" | "Upcoming" | "Previous"
  ) =>
    `${navButtonClass} ${
      active === tab
        ? "border-[rgba(var(--accent-rgb),0.35)] bg-[rgba(var(--accent-rgb),0.16)] text-white shadow-[inset_0_0_20px_rgba(var(--accent-rgb),0.05)]"
        : "border-transparent bg-transparent text-[#9caec4] hover:bg-white/[0.06]"
    }`;

  return (
    <>
      <Link to="/sports" className="mb-5 inline-block">
        <Button
          variant="outline"
          size="md"
          className="gap-2 rounded-xl border-amber-500/40 bg-amber-500/[0.06] px-4 py-2 text-sm text-amber-400 shadow-sm shadow-amber-500/5 transition-all duration-300 hover:border-amber-400/70 hover:bg-amber-500/15 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to Sports
        </Button>
      </Link>

      <div
        style={themeStyle}
        className={`relative isolate min-h-screen w-full min-w-0 px-[clamp(16px,4vw,56px)] pb-12 pt-8 text-[#f8fafc] transition-[background] duration-[400ms] ease-in-out max-[600px]:px-[14px] max-[600px]:pb-8 max-[600px]:pt-5 ${
          isMale
            ? "bg-[radial-gradient(ellipse_at_10%_0%,rgba(96,165,250,0.16),transparent_45%),linear-gradient(145deg,#080f1e_0%,#101a2d_55%,#0b1220_100%)]"
            : "bg-[radial-gradient(ellipse_at_90%_0%,rgba(240,171,252,0.17),transparent_45%),linear-gradient(145deg,#150d20_0%,#21132e_55%,#100f20_100%)]"
        } motion-reduce:transition-none`}
      >
        <div
          className="relative isolate mb-7 w-full min-w-0 max-w-[900px] overflow-hidden rounded-3xl border border-[rgb(39,57,79)] bg-cover bg-center p-[clamp(22px,4vw,38px)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] max-[600px]:rounded-[18px] max-[600px]:px-[18px] max-[600px]:py-[22px]"
          style={{
            backgroundImage: sportData.bannerImg
              ? `linear-gradient(90deg, rgba(15,23,42,0.94), rgba(15,23,42,0.72)), url("${sportData.bannerImg}")`
              : "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-[18px] max-[475px]:flex-col max-[475px]:items-start">
            <div className="text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.15] tracking-[-1.5px] text-white max-[600px]:tracking-[-0.8px]">
              {sportData.title}
            </div>
            {sportData.venue && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-[5px] text-[13px] text-[#cbd5e1]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="h-[18px] w-[18px] shrink-0 fill-[var(--accent)]"
                  aria-hidden="true"
                >
                  <path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                </svg>

                <span>{sportData.venue}</span>
              </div>
            )}
          </div>
          {sportData.description && (
            <p className="mt-[18px] max-w-[760px] text-[15px] leading-[1.8] text-[#aab8cc]">
              {sportData.description}
            </p>
          )}
          <div className="mt-5 flex items-center gap-2.5 text-[var(--accent)]">
            {(sportData.sportCategory?.length ?? 0) > 1 ? (
              <GenderSwitch
                isMale={isMale}
                setIsMale={setIsMale}
              />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="h-[18px] w-[18px] fill-current"
                  aria-hidden="true"
                >
                  <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
                </svg>

                <span className="text-base text-[var(--accent)]">
                  {sportData.sportCategory[0].charAt(0).toUpperCase() +
                    sportData.sportCategory[0].slice(1)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mb-6 flex w-fit max-w-full flex-wrap gap-2 rounded-[14px] border border-white/[0.08] bg-white/[0.045] p-1 max-[600px]:w-full">
          <button
            type="button"
            className={getNavButtonClass("Standing")}
            onClick={() => setActive("Standing")}
          >
            Standings
          </button>

          <button
            type="button"
            className={getNavButtonClass("Upcoming")}
            onClick={() => setActive("Upcoming")}
          >
            Upcoming Matches
          </button>

          <button
            type="button"
            className={getNavButtonClass("Previous")}
            onClick={() => setActive("Previous")}
          >
            Previous Matches
          </button>
        </div>

        <div className="relative w-full min-w-0 text-[#f8fafc]">
          {active === "Upcoming" && (
            <UpcomingMatches
              matches={matchData.filter(
                (match) =>
                  match.status !== "completed" &&
                  match.status !== "cancelled"
              )}
            />
          )}
          {active === "Previous" && (
            <PreviousMatches
              matches={matchData.filter(
                (match) => match.status === "completed"
              )}
            />
          )}
          {active === "Standing" && (
            <Standing
              sportId={sportId}
              sportGender={sportGender}
            />
          )}
        </div>
      </div>
    </>
  );
}