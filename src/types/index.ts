/**
 * Shared TypeScript domain models for the General Championship platform.
 */

export interface Team {
  id: string;
  name: string;
  shortName: string;
  department: string;
  image: string;
  primaryColor: string;
  description: string;
}

export interface Sport {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  venue: string;
  maxPoints: number;
}

export type MatchStatus = 'completed' | 'scheduled' | 'live' | 'cancelled';

export interface Match {
  id: string;
  sportId: string;
  date: string; // ISO YYYY-MM-DD
  time: string; // e.g. "16:00"
  venue: string;
  stage: string; // e.g. "Final", "Semi-Final", "League Stage"
  team1Id: string;
  team2Id: string;
  winnerId: string | null;
  pointsAwarded: number;
  status: MatchStatus;
  scoreTeam1: string;
  scoreTeam2: string;
  mvpName?: string;
  mvpTitle?: string;
  mvpImage?: string;
}

export interface ChampionshipHistory {
  year: number;
  edition: string;
  winnerTeamId: string;
  runnerUpTeamId: string;
  secondRunnerUpTeamId: string;
  winnerPoints: number;
  totalSports: number;
  summary: string;
}

export interface SportPointBreakdown {
  sportId: string;
  sportTitle: string;
  points: number;
  matchesPlayed: number;
  wins: number;
}

export interface TeamStanding {
  rank: number;
  teamId: string;
  teamName: string;
  shortName: string;
  primaryColor: string;
  department: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  overallPoints: number;
  distributedPoints: SportPointBreakdown[];
}

export interface ScoringConfig {
  mode: 'explicit_match_points' | 'standard_match_outcome';
  provisional: boolean;
  notes: string;
  defaultWinPoints: number;
  drawPoints: number;
  lossPoints: number;
  tieBreaker: Array<'overallPoints' | 'wins' | 'matchesPlayed' | 'teamName'>;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  date?: string;
}

export interface TournamentData {
  teams: Team[];
  sports: Sport[];
  matches: Match[];
  history: ChampionshipHistory[];
  gallery: GalleryItem[];
  lastUpdated: string;
}

export interface CsvValidationError {
  file: string;
  row?: number;
  field?: string;
  message: string;
}
