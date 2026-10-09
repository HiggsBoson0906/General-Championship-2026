import type { Team, Sport, Match, TeamStanding, ScoringConfig } from '../types';

/**
 * Explicit default scoring configuration.
 *
 * NOTE ON RULES:
 * - Mode 'explicit_match_points' honors the exact match-level points awarded (e.g. 44, 8, 5)
 *   from the verified existing deployment (https://general-championship-seven.vercel.app/).
 * - This configuration is flagged as `provisional: true` pending formal athletic council signoff,
 *   with full flexibility to switch to standard outcome weights if designated.
 */
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  mode: 'explicit_match_points',
  provisional: true,
  notes: 'Provisional scoring based on existing tournament deployment match-level points. Winning teams receive points specified per match; non-winners receive 0.',
  defaultWinPoints: 5,
  drawPoints: 2,
  lossPoints: 0,
  tieBreaker: ['overallPoints', 'wins', 'matchesPlayed', 'teamName'],
};

/**
 * Calculates official championship team standings from teams, sports, and matches.
 *
 * All pages must consume this central utility to ensure consistent rankings
 * across the Leaderboard, Home hero standings, Team profiles, and Sport overviews.
 */
export function calculateStandings(
  teams: Team[],
  sports: Sport[],
  matches: Match[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): TeamStanding[] {
  // Only completed matches count towards official championship points
  const completedMatches = matches.filter((m) => m.status === 'completed');

  const standings: TeamStanding[] = teams.map((team) => {
    let overallPoints = 0;
    let matchesPlayed = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;

    const distributedPoints = sports.map((sport) => {
      const sportMatches = completedMatches.filter((m) => m.sportId === sport.id);
      let sportPoints = 0;
      let sportMatchesPlayed = 0;
      let sportWins = 0;

      sportMatches.forEach((match) => {
        const isParticipant = match.team1Id === team.id || match.team2Id === team.id;
        if (!isParticipant) return;

        sportMatchesPlayed++;
        matchesPlayed++;

        const isWinner = match.winnerId === team.id;
        const isDraw = !match.winnerId && match.team1Id && match.team2Id;

        if (isWinner) {
          sportWins++;
          wins++;
          const matchPts = config.mode === 'explicit_match_points' && match.pointsAwarded > 0
            ? match.pointsAwarded
            : config.defaultWinPoints;
          sportPoints += matchPts;
          overallPoints += matchPts;
        } else if (isDraw) {
          draws++;
          sportPoints += config.drawPoints;
          overallPoints += config.drawPoints;
        } else {
          losses++;
          sportPoints += config.lossPoints;
          overallPoints += config.lossPoints;
        }
      });

      return {
        sportId: sport.id,
        sportTitle: sport.title,
        points: sportPoints,
        matchesPlayed: sportMatchesPlayed,
        wins: sportWins,
      };
    });

    return {
      rank: -1, // will be assigned below
      teamId: team.id,
      teamName: team.name,
      shortName: team.shortName,
      primaryColor: team.primaryColor,
      department: team.department,
      matchesPlayed,
      wins,
      losses,
      draws,
      overallPoints,
      distributedPoints,
    };
  });

  // Sort according to tieBreaker criteria
  standings.sort((a, b) => {
    for (const criterion of config.tieBreaker) {
      if (criterion === 'overallPoints' && b.overallPoints !== a.overallPoints) {
        return b.overallPoints - a.overallPoints;
      }
      if (criterion === 'wins' && b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      if (criterion === 'matchesPlayed' && a.matchesPlayed !== b.matchesPlayed) {
        return a.matchesPlayed - b.matchesPlayed;
      }
      if (criterion === 'teamName') {
        const cmp = a.teamName.localeCompare(b.teamName);
        if (cmp !== 0) return cmp;
      }
    }
    return 0;
  });

  // Assign ranks with proper tie handling (teams with equal overallPoints share rank)
  let currentRank = 1;
  let previousPoints: number | null = null;

  standings.forEach((standing, index) => {
    if (index === 0 || standing.overallPoints < (previousPoints ?? 0)) {
      currentRank = index + 1;
      standing.rank = currentRank;
    } else {
      standing.rank = currentRank;
    }
    previousPoints = standing.overallPoints;
  });

  return standings;
}
