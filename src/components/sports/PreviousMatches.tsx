import MatchCard from "./MatchCard";
import NoMatches from "./NoMatches";
import { Match } from "../../types/index";

interface PreviousMatchesProps {
  matches: Match[];
}

export default function PreviousMatches({ matches }: PreviousMatchesProps) {
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
          title="No Previous Matches"
          image={"/assets/other/previous.png"}
          description="No matches have been played yet. Once the action begins, match results and scores will appear here."
        />
      )}
    </>
  );
}