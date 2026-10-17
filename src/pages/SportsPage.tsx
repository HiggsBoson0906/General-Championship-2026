import { useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";
import SportsCard from "../components/sports/SportsCard";

export default function SportsPage() {
  const { getAllSports } = useTournament();
  const sports = getAllSports();

  useEffect(() => {
    const images = sports.map((sport) => {
      const img = new Image();
      img.src = sport.image;
      return img;
    });
    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [sports]);

  return (
    <main className="relative overflow-hidden">
      <div className="relative min-h-screen overflow-hidden bg-[#0b0909] px-[3.2%] pb-[55px] pt-[35px] text-[#f1f5f9] max-[1100px]:px-[3%] max-[1100px]:py-[30px] max-[600px]:px-4 max-[600px]:pb-10 max-[600px]:pt-[25px]">
        <header className="relative z-[1] mb-[38px] flex items-center justify-between gap-6 max-[600px]:mb-7">
          <div className="flex items-center gap-6 max-[600px]:gap-3">
            <div>
              <h1 className="m-0 text-[clamp(32px,4vw,58px)] font-extrabold tracking-[-1.5px] text-[#eaf2ff] max-[600px]:text-[31px] max-[600px]:tracking-[-0.7px]">
                All <span className="text-[#2478ff]">Sports</span>
              </h1>
              <p className="mt-[10px] text-[clamp(12px,1.25vw,18px)] text-[#a8bddb] max-[600px]:max-w-[230px] max-[600px]:text-[11px] max-[600px]:leading-[1.5]">
                Play · Compete · Be a Part of Something Bigger
              </p>
            </div>
          </div>

          <div className="flex -rotate-[5deg] flex-col items-center font-[cursive] text-[clamp(17px,1.8vw,27px)] italic text-[#3985ff] max-[1100px]:hidden">
            <span>Different Sports,</span>
            <span>Same Spirit</span>

            <div className="mt-[5px] h-[10px] w-[85%] rounded-[50%] border-b-4 border-[#3985ff]" />
          </div>
        </header>

        <section
          className="relative z-[1] grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:gap-[22px]"
          aria-label="Available sports"
        >
          {sports.map((sport) => (
            <SportsCard key={sport.title} sport={sport} />
          ))}
        </section>
      </div>
    </main>
  );
}