import MatchCard from "./MatchCard";
import NoMatches from "./NoMatches";
import { Match } from "../../types/index";

interface UpcomingMatchesProps {
  matches: Match[];
}

export default function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  return (
    <>
      {matches.length > 0 ? (
        <div className="matches-card">
          {matches.map((el) => (
            <MatchCard key={el.id} matchData={el} />
          ))}
        </div>
      ) : (
        <NoMatches
          title="No Upcoming Matches"
          image={"/assets/other/upcoming.png"}
          description="Stay tuned! The next matches will be listed here once they are scheduled."
        />
      )}
    </>
  );
}