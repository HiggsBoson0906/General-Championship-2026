import { describe, it, expect } from 'vitest';
import {
  RawTeamSchema,
  transformTeam,
  RawSportSchema,
  transformSport,
  RawMatchSchema,
  transformMatch,
  RawGallerySchema,
  transformGallery,
  validateIntegrity,
} from '../schemas';

describe('Data Schemas & Validation', () => {
  it('validates and transforms team schema correctly', () => {
    const rawTeam = {
      id: 'team-red',
      name: 'Red Phoenix',
      teamCategory: 'Male',
      short_name: 'RED',
      department: 'Mechanical',
      image: '/assets/teams/team-red.svg',
      primary_color: '#ef4444',
      description: 'Fiery competitors',
    };

    const parsed = RawTeamSchema.parse(rawTeam);
    const domain = transformTeam(parsed);

    expect(domain.id).toBe('team-red');
    expect(domain.shortName).toBe('RED');
    expect(domain.primaryColor).toBe('#ef4444');
  });

  it('validates and transforms sport schema correctly', () => {
    const rawSport = {
      id: 'cricket',
      title: 'Cricket',
      sportCategory: ['Male'],
      category: 'Team Sport',
      description: 'Exciting matches',
      image: '/cricket.jpg',
      bannerImg: '/banner/cricket.png',
      venue: 'Main Oval',
      max_points: '35',
    };

    const parsed = RawSportSchema.parse(rawSport);
    const domain = transformSport(parsed);

    expect(domain.id).toBe('cricket');
    expect(domain.maxPoints).toBe(35);
  });

  it('validates and transforms gallery schema correctly', () => {
    const rawGallery = {
      id: 'gal-01',
      title: 'Trophy Lift',
      description: 'Celebration moment',
      category: 'Cricket',
      image: '/assets/gallery/cricket.svg',
      date: '2025-09-29',
    };

    const parsed = RawGallerySchema.parse(rawGallery);
    const domain = transformGallery(parsed);

    expect(domain.id).toBe('gal-01');
    expect(domain.title).toBe('Trophy Lift');
  });

  it('validates match status enum and coerces points', () => {
    const rawMatch = {
      id: 'm-1',
      sport_id: 'cricket',
      matchCategory: 'Male',
      date: '2025-09-29',
      time: '16:00',
      venue: 'Main Oval',
      stage: 'Final',
      team1_id: 'team-red',
      team2_id: 'team-blue',
      winner_id: 'team-red',
      points_awarded: '15',
      status: 'completed',
      score_team1: '150/4',
      score_team2: '140/8',
    };

    const parsed = RawMatchSchema.parse(rawMatch);
    const domain = transformMatch(parsed);

    expect(domain.status).toBe('completed');
    expect(domain.pointsAwarded).toBe(15);
    expect(domain.winnerId).toBe('team-red');
  });

  it('rejects invalid match date format and impossible dates', () => {
    const badFormatMatch = {
      id: 'm-bad-1',
      sport_id: 'cricket',
      date: '29-09-2025', // invalid format
      team1_id: 'team-red',
    };
    expect(RawMatchSchema.safeParse(badFormatMatch).success).toBe(false);

    const impossibleDateMatch = {
      id: 'm-bad-2',
      sport_id: 'cricket',
      date: '2025-02-30', // Feb 30 does not exist!
      team1_id: 'team-red',
    };
    expect(RawMatchSchema.safeParse(impossibleDateMatch).success).toBe(false);
  });

  it('rejects scheduled match that specifies scores', () => {
    const scheduledWithScore = {
      id: 'm-sch-err',
      sport_id: 'cricket',
      date: '2026-10-15',
      team1_id: 'team-red',
      status: 'scheduled',
      score_team1: '150/4', // Invalid! Scheduled match cannot have score
    };
    expect(RawMatchSchema.safeParse(scheduledWithScore).success).toBe(false);
  });

  it('detects broken foreign key references in validateIntegrity', () => {
    const teams = [
      { id: 'team-red', name: 'Team Red', teamCategory: 'Male', shortName: 'TR', department: 'D1', image: '', primaryColor: '', description: '' },
    ];
    const sports = [
      { id: 'cricket', title: 'Cricket', sportCategory: ['Male'], category: 'Team', description: '', image: '', bannerImg: '', venue: '', maxPoints: 20 },
    ];
    const matches = [
      {
        id: 'm-bad',
        sportId: 'non-existent-sport',
        matchCategory: 'Male',
        date: '2025-09-29',
        time: '16:00',
        venue: 'Oval',
        stage: 'Final',
        team1Id: 'team-red',
        team2Id: 'ghost-team',
        winnerId: 'ghost-team',
        pointsAwarded: 5,
        status: 'completed' as const,
        scoreTeam1: '10',
        scoreTeam2: '5',
      },
    ];
    const history = [
      {
        year: 2024,
        edition: 'GC 2024',
        winnerTeamId: 'ghost-winner',
        runnerUpTeamId: 'team-red',
        secondRunnerUpTeamId: '',
        winnerPoints: 100,
        totalSports: 12,
        summary: '',
      },
    ];

    const warnings = validateIntegrity(teams, sports, matches, history);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes('non-existent-sport'))).toBe(true);
    expect(warnings.some((w) => w.includes('ghost-team'))).toBe(true);
    expect(warnings.some((w) => w.includes('ghost-winner'))).toBe(true);
  });
});
