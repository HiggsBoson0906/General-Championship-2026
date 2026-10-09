import { fetchAndParseCsv } from './csvLoader';
import {
  RawTeamSchema,
  transformTeam,
  RawSportSchema,
  transformSport,
  RawMatchSchema,
  transformMatch,
  RawChampionshipHistorySchema,
  transformHistory,
  RawGallerySchema,
  transformGallery,
  validateIntegrity,
} from './schemas';
import type {
  Team,
  Sport,
  Match,
  ChampionshipHistory,
  GalleryItem,
  TournamentData,
  CsvValidationError,
  MatchStatus,
} from '../types';

let cachedTournamentData: TournamentData | null = null;
let cachedErrors: CsvValidationError[] = [];
let loadPromise: Promise<{ data: TournamentData; errors: CsvValidationError[] }> | null = null;

/**
 * Loads all tournament data files from public/data/, validates schemas,
 * checks relational integrity, and caches the results.
 */
export async function loadAllTournamentData(
  forceReload = false
): Promise<{ data: TournamentData; errors: CsvValidationError[] }> {
  if (!forceReload && cachedTournamentData) {
    return { data: cachedTournamentData, errors: cachedErrors };
  }

  if (loadPromise && !forceReload) {
    return loadPromise;
  }

  loadPromise = (async () => {
    // Attempt loading history from history.csv first, fallback to championship_history.csv
    let historyRes = await fetchAndParseCsv('/data/history.csv', RawChampionshipHistorySchema, transformHistory);
    if (historyRes.errors.length > 0 && historyRes.data.length === 0) {
      historyRes = await fetchAndParseCsv('/data/championship_history.csv', RawChampionshipHistorySchema, transformHistory);
    }

    const [teamsRes, sportsRes, matchesRes, galleryRes] = await Promise.all([
      fetchAndParseCsv('/data/teams.csv', RawTeamSchema, transformTeam),
      fetchAndParseCsv('/data/sports.csv', RawSportSchema, transformSport),
      fetchAndParseCsv('/data/matches.csv', RawMatchSchema, transformMatch),
      fetchAndParseCsv('/data/gallery.csv', RawGallerySchema, transformGallery),
    ]);

    const combinedErrors: CsvValidationError[] = [
      ...teamsRes.errors,
      ...sportsRes.errors,
      ...matchesRes.errors,
      ...historyRes.errors,
      ...galleryRes.errors,
    ];

    // Check relational foreign key integrity
    const integrityWarnings = validateIntegrity(
      teamsRes.data,
      sportsRes.data,
      matchesRes.data,
      historyRes.data,
      galleryRes.data
    );

    integrityWarnings.forEach((warning) => {
      combinedErrors.push({
        file: 'relational_integrity',
        message: warning,
      });
    });

    const data: TournamentData = {
      teams: teamsRes.data,
      sports: sportsRes.data,
      matches: matchesRes.data,
      history: historyRes.data,
      gallery: galleryRes.data,
      lastUpdated: new Date().toISOString(),
    };

    cachedTournamentData = data;
    cachedErrors = combinedErrors;
    loadPromise = null;

    return { data, errors: combinedErrors };
  })();

  return loadPromise;
}

/**
 * Retrieves all teams.
 */
export async function getTeams(): Promise<Team[]> {
  const { data } = await loadAllTournamentData();
  return data.teams;
}

/**
 * Retrieves a single team by its ID.
 */
export async function getTeamById(teamId: string): Promise<Team | undefined> {
  const teams = await getTeams();
  return teams.find((t) => t.id === teamId);
}

/**
 * Retrieves all sports.
 */
export async function getSports(): Promise<Sport[]> {
  const { data } = await loadAllTournamentData();
  return data.sports;
}

/**
 * Retrieves a single sport by its ID.
 */
export async function getSportById(sportId: string): Promise<Sport | undefined> {
  const sports = await getSports();
  return sports.find((s) => s.id === sportId);
}

/**
 * Retrieves all matches.
 */
export async function getMatches(): Promise<Match[]> {
  const { data } = await loadAllTournamentData();
  return data.matches;
}

/**
 * Retrieves matches filtered by sport ID.
 */
export async function getMatchesBySport(sportId: string): Promise<Match[]> {
  const matches = await getMatches();
  return matches.filter((m) => m.sportId === sportId);
}

/**
 * Retrieves matches involving a specific team (as team1 or team2).
 */
export async function getMatchesByTeam(teamId: string): Promise<Match[]> {
  const matches = await getMatches();
  return matches.filter((m) => m.team1Id === teamId || m.team2Id === teamId);
}

/**
 * Retrieves schedule matches with optional status, date, or sport filters.
 */
export async function getSchedule(filters?: {
  status?: MatchStatus;
  sportId?: string;
  teamId?: string;
  date?: string;
}): Promise<Match[]> {
  let matches = await getMatches();

  if (filters?.status) {
    matches = matches.filter((m) => m.status === filters.status);
  }
  if (filters?.sportId) {
    matches = matches.filter((m) => m.sportId === filters.sportId);
  }
  if (filters?.teamId) {
    matches = matches.filter((m) => m.team1Id === filters.teamId || m.team2Id === filters.teamId);
  }
  if (filters?.date) {
    matches = matches.filter((m) => m.date === filters.date);
  }

  // Sort upcoming chronologically, completed in reverse chronological order
  return matches.sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.time.localeCompare(b.time);
  });
}

/**
 * Retrieves historical championship winners.
 */
export async function getChampionshipHistory(): Promise<ChampionshipHistory[]> {
  const { data } = await loadAllTournamentData();
  return data.history.sort((a, b) => b.year - a.year);
}

/**
 * Retrieves championship gallery items.
 */
export async function getGallery(): Promise<GalleryItem[]> {
  const { data } = await loadAllTournamentData();
  return data.gallery;
}
