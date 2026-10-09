import { describe, it, expect } from 'vitest';
import { calculateStandings, DEFAULT_SCORING_CONFIG } from '../rankings';
import type { Team, Sport, Match } from '../../types';

describe('Rankings Calculation Engine', () => {
  const mockTeams: Team[] = [
    { id: 'team-1', name: 'Alpha Squad', shortName: 'ALP', department: 'Arch', image: '', primaryColor: '#f59e0b', description: '' },
    { id: 'team-2', name: 'Beta Force', shortName: 'BET', department: 'CS', image: '', primaryColor: '#3b82f6', description: '' },
    { id: 'team-3', name: 'Gamma Crew', shortName: 'GAM', department: 'Mech', image: '', primaryColor: '#10b981', description: '' },
  ];

  const mockSports: Sport[] = [
    { id: 'cricket', title: 'Cricket', category: 'Team', description: '', image: '', venue: 'Oval', maxPoints: 44 },
    { id: 'football', title: 'Football', category: 'Team', description: '', image: '', venue: 'Ground', maxPoints: 20 },
  ];

  it('aggregates explicit match points and assigns correct ranks', () => {
    const mockMatches: Match[] = [
      {
        id: 'm1',
        sportId: 'cricket',
        date: '2025-09-29',
        time: '16:00',
        venue: 'Oval',
        stage: 'Final',
        team1Id: 'team-1',
        team2Id: 'team-2',
        winnerId: 'team-1',
        pointsAwarded: 44,
        status: 'completed',
        scoreTeam1: '150',
        scoreTeam2: '140',
      },
      {
        id: 'm2',
        sportId: 'football',
        date: '2025-09-28',
        time: '17:00',
        venue: 'Ground',
        stage: 'Final',
        team1Id: 'team-2',
        team2Id: 'team-3',
        winnerId: 'team-2',
        pointsAwarded: 10,
        status: 'completed',
        scoreTeam1: '2',
        scoreTeam2: '1',
      },
    ];

    const standings = calculateStandings(mockTeams, mockSports, mockMatches, DEFAULT_SCORING_CONFIG);

    expect(standings[0].teamId).toBe('team-1');
    expect(standings[0].rank).toBe(1);
    expect(standings[0].overallPoints).toBe(44);
    expect(standings[0].wins).toBe(1);

    expect(standings[1].teamId).toBe('team-2');
    expect(standings[1].rank).toBe(2);
    expect(standings[1].overallPoints).toBe(10);
    expect(standings[1].wins).toBe(1);

    expect(standings[2].teamId).toBe('team-3');
    expect(standings[2].rank).toBe(3);
    expect(standings[2].overallPoints).toBe(0);
    expect(standings[2].losses).toBe(1);
  });

  it('handles tied scores by assigning the same rank to equal point holders', () => {
    const mockMatches: Match[] = [
      {
        id: 'm1',
        sportId: 'cricket',
        date: '2025-09-29',
        time: '16:00',
        venue: 'Oval',
        stage: 'League',
        team1Id: 'team-1',
        team2Id: 'team-3',
        winnerId: 'team-1',
        pointsAwarded: 8,
        status: 'completed',
        scoreTeam1: '',
        scoreTeam2: '',
      },
      {
        id: 'm2',
        sportId: 'cricket',
        date: '2025-09-28',
        time: '16:00',
        venue: 'Oval',
        stage: 'League',
        team1Id: 'team-2',
        team2Id: 'team-3',
        winnerId: 'team-2',
        pointsAwarded: 8,
        status: 'completed',
        scoreTeam1: '',
        scoreTeam2: '',
      },
    ];

    const standings = calculateStandings(mockTeams, mockSports, mockMatches, DEFAULT_SCORING_CONFIG);

    // Both team-1 and team-2 have 8 points and 1 win, so they should share rank 1
    expect(standings[0].overallPoints).toBe(8);
    expect(standings[1].overallPoints).toBe(8);
    expect(standings[0].rank).toBe(1);
    expect(standings[1].rank).toBe(1);
    expect(standings[2].rank).toBe(3);
  });

  it('excludes scheduled upcoming matches from points calculation', () => {
    const mockMatches: Match[] = [
      {
        id: 'm-scheduled',
        sportId: 'cricket',
        date: '2026-10-15',
        time: '16:00',
        venue: 'Oval',
        stage: 'Final',
        team1Id: 'team-3',
        team2Id: 'team-1',
        winnerId: null,
        pointsAwarded: 50,
        status: 'scheduled', // upcoming
        scoreTeam1: '',
        scoreTeam2: '',
      },
    ];

    const standings = calculateStandings(mockTeams, mockSports, mockMatches, DEFAULT_SCORING_CONFIG);

    expect(standings.every((s) => s.overallPoints === 0)).toBe(true);
  });
});
