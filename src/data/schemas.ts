import { z } from 'zod';
import type { Team, Sport, Match, ChampionshipHistory, GalleryItem, MatchStatus } from '../types';

/**
 * Zod schema for Teams CSV records.
 */
export const RawTeamSchema = z.object({
  id: z.string().trim().min(1, 'Team ID is required'),
  name: z.string().trim().min(1, 'Team name is required'),
  teamCategory: z.string().trim().min(1, 'Team category is required'),
  short_name: z.string().trim().min(1, 'Short name is required'),
  department: z.string().trim().min(1, 'Department is required'),
  image: z.string().trim().default('/assets/teams/default.svg'),
  primary_color: z.string().trim().default('#f59e0b'),
  description: z.string().trim().default(''),
});

export function transformTeam(raw: z.infer<typeof RawTeamSchema>): Team {
  return {
    id: raw.id,
    name: raw.name,
    teamCategory: raw.teamCategory,
    shortName: raw.short_name,
    department: raw.department,
    image: raw.image,
    primaryColor: raw.primary_color,
    description: raw.description,
  };
}

/**
 * Zod schema for Sports CSV records.
 */
export const RawSportSchema = z.object({
  id: z.string().trim().min(1, 'Sport ID is required'),
  title: z.string().trim().min(1, 'Sport title is required'),
  sportCategory: z.string().transform((value) => value.split(";").map((sportCategory) => sportCategory.trim()).filter(Boolean)),
  category: z.string().trim().min(1, 'Sport category is required'),
  description: z.string().trim().default(''),
  image: z.string().trim().default('/assets/sports/default.png'),
  bannerImg: z.string().trim().default('/assets/banners/default.png'),
  venue: z.string().trim().default('Main Sports Complex'),
  max_points: z.coerce.number().min(0, 'Max points must be non-negative').default(20),
});

export function transformSport(raw: z.infer<typeof RawSportSchema>): Sport {
  return {
    id: raw.id,
    title: raw.title,
    sportCategory: raw.sportCategory,
    category: raw.category,
    description: raw.description,
    image: raw.image,
    bannerImg: raw.bannerImg,
    venue: raw.venue,
    maxPoints: raw.max_points,
  };
}

/**
 * Zod schema for Matches CSV records.
 */
const MatchStatusEnum = z.enum(['completed', 'scheduled', 'live', 'cancelled']);

export const RawMatchSchema = z.object({
  id: z.string().trim().min(1, 'Match ID is required'),
  sport_id: z.string().trim().min(1, 'Sport ID is required'),
  matchCategory: z.string().trim().min(1, 'Match category is required'),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === val;
    }, 'Date must be a real calendar date'),
  time: z.string().trim().default('TBD'),
  venue: z.string().trim().default('Main Sports Ground'),
  stage: z.string().trim().default('League'),
  team1_id: z.string().trim().min(1, 'Team 1 ID is required'),
  team2_id: z.string().trim().default(''),
  winner_id: z.string().trim().default(''),
  points_awarded: z.coerce.number().min(0).default(0),
  status: z.string().trim().toLowerCase().pipe(MatchStatusEnum).default('scheduled'),
  score_team1: z.string().trim().default(''),
  score_team2: z.string().trim().default(''),
  mvp_name: z.string().trim().optional(),
  mvp_title: z.string().trim().optional(),
  mvp_image: z.string().trim().optional(),
}).refine((data) => {
  // If match is completed, winner_id should be provided if points are awarded
  if (data.status === 'completed' && data.points_awarded > 0 && !data.winner_id) {
    return false;
  }
  return true;
}, {
  message: 'Completed match with points awarded must specify a winner_id',
  path: ['winner_id'],
}).refine((data) => {
  // Scheduled matches must not have final scores
  if (data.status === 'scheduled' && (data.score_team1 || data.score_team2)) {
    return false;
  }
  return true;
}, {
  message: 'Scheduled upcoming matches must not have final scores',
  path: ['status'],
});

export function transformMatch(raw: z.infer<typeof RawMatchSchema>): Match {
  return {
    id: raw.id,
    sportId: raw.sport_id,
    matchCategory: raw.matchCategory,
    date: raw.date,
    time: raw.time || 'TBD',
    venue: raw.venue,
    stage: raw.stage,
    team1Id: raw.team1_id,
    team2Id: raw.team2_id,
    winnerId: raw.winner_id ? raw.winner_id : null,
    pointsAwarded: raw.points_awarded,
    status: raw.status as MatchStatus,
    scoreTeam1: raw.score_team1,
    scoreTeam2: raw.score_team2,
    mvpName: raw.mvp_name || undefined,
    mvpTitle: raw.mvp_title || undefined,
    mvpImage: raw.mvp_image || undefined,
  };
}

/**
 * Zod schema for Championship History CSV records.
 */
export const RawChampionshipHistorySchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100),
  edition: z.string().trim().min(1, 'Edition is required'),
  winner_team_id: z.string().trim().min(1, 'Winner team ID is required'),
  runner_up_team_id: z.string().trim().min(1, 'Runner-up team ID is required'),
  second_runner_up_team_id: z.string().trim().default(''),
  winner_points: z.coerce.number().min(0).default(0),
  total_sports: z.coerce.number().min(0).default(0),
  summary: z.string().trim().default(''),
});

export function transformHistory(raw: z.infer<typeof RawChampionshipHistorySchema>): ChampionshipHistory {
  return {
    year: raw.year,
    edition: raw.edition,
    winnerTeamId: raw.winner_team_id,
    runnerUpTeamId: raw.runner_up_team_id,
    secondRunnerUpTeamId: raw.second_runner_up_team_id,
    winnerPoints: raw.winner_points,
    totalSports: raw.total_sports,
    summary: raw.summary,
  };
}

/**
 * Zod schema for Gallery CSV records.
 */
export const RawGallerySchema = z.object({
  id: z.string().trim().min(1, 'Gallery ID is required'),
  title: z.string().trim().min(1, 'Gallery title is required'),
  description: z.string().trim().min(1, 'Gallery description is required'),
  category: z.string().trim().min(1, 'Gallery category is required'),
  image: z.string().trim().min(1, 'Gallery image path is required'),
  date: z.string().trim().optional(),
});

export function transformGallery(raw: z.infer<typeof RawGallerySchema>): GalleryItem {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    image: raw.image,
    date: raw.date || undefined,
  };
}

/**
 * Foreign key integrity and data consistency validation across all datasets.
 */
export function validateIntegrity(
  teams: Team[],
  sports: Sport[],
  matches: Match[],
  history: ChampionshipHistory[],
  gallery?: GalleryItem[]
): string[] {
  const warnings: string[] = [];
  const teamIds = new Set(teams.map((t) => t.id));
  const sportIds = new Set(sports.map((s) => s.id));

  // Check for duplicate team IDs
  const seenTeamIds = new Set<string>();
  teams.forEach((t) => {
    if (seenTeamIds.has(t.id)) {
      warnings.push(`Duplicate team ID found: "${t.id}"`);
    }
    seenTeamIds.add(t.id);
  });

  // Check for duplicate sport IDs
  const seenSportIds = new Set<string>();
  sports.forEach((s) => {
    if (seenSportIds.has(s.id)) {
      warnings.push(`Duplicate sport ID found: "${s.id}"`);
    }
    seenSportIds.add(s.id);
  });

  // Check for duplicate match IDs and reference integrity
  const seenMatchIds = new Set<string>();
  matches.forEach((m) => {
    if (seenMatchIds.has(m.id)) {
      warnings.push(`Duplicate match ID found: "${m.id}"`);
    }
    seenMatchIds.add(m.id);

    if (!sportIds.has(m.sportId)) {
      warnings.push(`Match ${m.id} references non-existent sport "${m.sportId}"`);
    }
    if (m.team1Id && !teamIds.has(m.team1Id)) {
      warnings.push(`Match ${m.id} references non-existent team1 "${m.team1Id}"`);
    }
    if (m.team2Id && !teamIds.has(m.team2Id)) {
      warnings.push(`Match ${m.id} references non-existent team2 "${m.team2Id}"`);
    }
    if (m.winnerId && !teamIds.has(m.winnerId)) {
      warnings.push(`Match ${m.id} references non-existent winner "${m.winnerId}"`);
    }
    if (m.status === 'scheduled' && (m.scoreTeam1 || m.scoreTeam2)) {
      warnings.push(`Scheduled match ${m.id} has final scores assigned`);
    }
  });

  // Check history references
  history.forEach((h) => {
    if (h.winnerTeamId && !teamIds.has(h.winnerTeamId)) {
      warnings.push(`History year ${h.year} references non-existent winner "${h.winnerTeamId}"`);
    }
    if (h.runnerUpTeamId && !teamIds.has(h.runnerUpTeamId)) {
      warnings.push(`History year ${h.year} references non-existent runner-up "${h.runnerUpTeamId}"`);
    }
    if (h.secondRunnerUpTeamId && !teamIds.has(h.secondRunnerUpTeamId)) {
      warnings.push(`History year ${h.year} references non-existent second runner-up "${h.secondRunnerUpTeamId}"`);
    }
  });

  // Check gallery duplicates if provided
  if (gallery) {
    const seenGalleryIds = new Set<string>();
    gallery.forEach((g) => {
      if (seenGalleryIds.has(g.id)) {
        warnings.push(`Duplicate gallery ID found: "${g.id}"`);
      }
      seenGalleryIds.add(g.id);
    });
  }

  return warnings;
}
