import { describe, it, expect } from 'vitest';
import {
  RawSportSchema,
  transformSport,
  RawMatchSchema,
  transformMatch,
  validateIntegrity,
} from '../schemas';

describe('Data Schemas & Validation', () => {
  it('validates and transforms sport schema correctly', () => {
    const rawSport = {
      id: 'cricket',
      title: 'Cricket',
      category: 'Team Sport',
      description: 'Exciting matches',
      image: '/cricket.jpg',
      venue: 'Main Oval',
      max_points: '44',
    };

    const parsed = RawSportSchema.parse(rawSport);
    const domain = transformSport(parsed);

    expect(domain.id).toBe('cricket');
    expect(domain.maxPoints).toBe(44);
  });

  it('validates match status enum and coerces points', () => {
    const rawMatch = {
      id: 'm-1',
      sport_id: 'cricket',
      date: '2025-09-29',
      time: '16:00',
      venue: 'Main Oval',
      stage: 'Final',
      team1_id: 'team-1',
      team2_id: 'team-2',
      winner_id: 'team-1',
      points_awarded: '44',
      status: 'completed',
      score_team1: '150/4',
      score_team2: '140/8',
    };

    const parsed = RawMatchSchema.parse(rawMatch);
    const domain = transformMatch(parsed);

    expect(domain.status).toBe('completed');
    expect(domain.pointsAwarded).toBe(44);
    expect(domain.winnerId).toBe('team-1');
  });

  it('rejects invalid match date format', () => {
    const rawMatch = {
      id: 'm-bad-date',
      sport_id: 'cricket',
      date: '29-09-2025', // invalid format (expected YYYY-MM-DD)
      team1_id: 'team-1',
    };

    const result = RawMatchSchema.safeParse(rawMatch);
    expect(result.success).toBe(false);
  });

  it('detects broken foreign key references in validateIntegrity', () => {
    const teams = [
      { id: 'team-1', name: 'Team 1', shortName: 'T1', department: 'D1', image: '', primaryColor: '', description: '' },
    ];
    const sports = [
      { id: 'cricket', title: 'Cricket', category: 'Team', description: '', image: '', venue: '', maxPoints: 20 },
    ];
    const matches = [
      {
        id: 'm-bad',
        sportId: 'non-existent-sport',
        date: '2025-09-29',
        time: '16:00',
        venue: 'Oval',
        stage: 'Final',
        team1Id: 'team-1',
        team2Id: 'ghost-team',
        winnerId: 'ghost-team',
        pointsAwarded: 5,
        status: 'completed' as const,
        scoreTeam1: '',
        scoreTeam2: '',
      },
    ];
    const history = [
      {
        year: 2024,
        edition: 'GC 2024',
        winnerTeamId: 'ghost-winner',
        runnerUpTeamId: 'team-1',
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
