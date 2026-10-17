import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { calculateStandings, DEFAULT_SCORING_CONFIG } from '../rankings';
import { parseCsvText } from '../csvLoader';
import {
  RawTeamSchema,
  transformTeam,
  RawSportSchema,
  transformSport,
  RawMatchSchema,
  transformMatch,
} from '../schemas';
import type { Team, Sport, Match } from '../../types';

describe('Rankings Calculation Engine', () => {
  const mockTeams: Team[] = [
    { id: 'team-red', name: 'Red Phoenix', teamCategory: 'Male', shortName: 'RED', department: 'Mech', image: '', primaryColor: '#ef4444', description: '' },
    { id: 'team-blue', name: 'Blue Titans', teamCategory: 'Male', shortName: 'BLU', department: 'CS', image: '', primaryColor: '#3b82f6', description: '' },
    { id: 'team-gold', name: 'Golden Eagles', teamCategory: 'Male', shortName: 'GLD', department: 'Arch', image: '', primaryColor: '#f59e0b', description: '' },
  ];

  const mockSports: Sport[] = [
    { id: 'cricket', title: 'Cricket', sportCategory: ['Male'], category: 'Team', description: '', image: '', bannerImg: '', venue: 'Oval', maxPoints: 35 },
    { id: 'football', title: 'Football', sportCategory: ['Male','Female'], category: 'Team', description: '', image: '', bannerImg: '', venue: 'Ground', maxPoints: 30 },
  ];

  it('aggregates explicit match points and assigns correct ranks', () => {
    const mockMatches: Match[] = [
      {
        id: 'm1',
        sportId: 'cricket',
        matchCategory: 'Male',
        date: '2025-09-29',
        time: '16:00',
        venue: 'Oval',
        stage: 'Final',
        team1Id: 'team-gold',
        team2Id: 'team-blue',
        winnerId: 'team-gold',
        pointsAwarded: 20,
        status: 'completed',
        scoreTeam1: '155/4',
        scoreTeam2: '152/9',
      },
      {
        id: 'm2',
        sportId: 'football',
        matchCategory: 'Female',
        date: '2025-09-28',
        time: '17:00',
        venue: 'Ground',
        stage: 'Final',
        team1Id: 'team-blue',
        team2Id: 'team-red',
        winnerId: 'team-blue',
        pointsAwarded: 10,
        status: 'completed',
        scoreTeam1: '2',
        scoreTeam2: '1',
      },
    ];

    const standings = calculateStandings(mockTeams, mockSports, mockMatches, DEFAULT_SCORING_CONFIG);

    expect(standings[0].teamId).toBe('team-gold');
    expect(standings[0].rank).toBe(1);
    expect(standings[0].overallPoints).toBe(20);
    expect(standings[0].wins).toBe(1);

    expect(standings[1].teamId).toBe('team-blue');
    expect(standings[1].rank).toBe(2);
    expect(standings[1].overallPoints).toBe(10);
    expect(standings[1].wins).toBe(1);

    expect(standings[2].teamId).toBe('team-red');
    expect(standings[2].rank).toBe(3);
    expect(standings[2].overallPoints).toBe(0);
    expect(standings[2].losses).toBe(1);
  });

  it('handles tied scores by assigning the same rank to equal point holders', () => {
    const mockMatches: Match[] = [
      {
        id: 'm1',
        sportId: 'cricket',
        matchCategory: 'Male',
        date: '2025-09-29',
        time: '16:00',
        venue: 'Oval',
        stage: 'League',
        team1Id: 'team-red',
        team2Id: 'team-gold',
        winnerId: 'team-red',
        pointsAwarded: 8,
        status: 'completed',
        scoreTeam1: '100',
        scoreTeam2: '90',
      },
      {
        id: 'm2',
        sportId: 'cricket',
        matchCategory: 'Male',
        date: '2025-09-28',
        time: '16:00',
        venue: 'Oval',
        stage: 'League',
        team1Id: 'team-blue',
        team2Id: 'team-gold',
        winnerId: 'team-blue',
        pointsAwarded: 8,
        status: 'completed',
        scoreTeam1: '100',
        scoreTeam2: '90',
      },
    ];

    const standings = calculateStandings(mockTeams, mockSports, mockMatches, DEFAULT_SCORING_CONFIG);

    // Both team-red and team-blue have 8 points and 1 win, so they should share rank 1
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
        matchCategory: 'Male',
        date: '2026-10-24',
        time: '16:00',
        venue: 'Oval',
        stage: 'Final',
        team1Id: 'team-gold',
        team2Id: 'team-red',
        winnerId: null,
        pointsAwarded: 50,
        status: 'scheduled',
        scoreTeam1: '',
        scoreTeam2: '',
      },
    ];

    const standings = calculateStandings(mockTeams, mockSports, mockMatches, DEFAULT_SCORING_CONFIG);

    expect(standings.every((s) => s.overallPoints === 0)).toBe(true);
  });

  it('calculates consistent realistic sample standings from production CSV files', () => {
    const publicDataDir = path.resolve(import.meta.dirname, '../../../public/data');
    const teams = parseCsvText(fs.readFileSync(path.join(publicDataDir, 'teams.csv'), 'utf8'), 'teams.csv', RawTeamSchema, transformTeam).data;
    const sports = parseCsvText(fs.readFileSync(path.join(publicDataDir, 'sports.csv'), 'utf8'), 'sports.csv', RawSportSchema, transformSport).data;
    const matches = parseCsvText(fs.readFileSync(path.join(publicDataDir, 'matches.csv'), 'utf8'), 'matches.csv', RawMatchSchema, transformMatch).data;

    const standings = calculateStandings(teams, sports, matches, DEFAULT_SCORING_CONFIG);

    expect(standings).toHaveLength(teams.length);
    // Highest points team should be rank 1
    
    if (standings.length > 0) {
      expect(standings[0].rank).toBe(1);
    }

     // Standings should be sorted by descending overall points.
    for (let i = 1; i < standings.length; i++) {
      expect(standings[i - 1].overallPoints).toBeGreaterThanOrEqual(
        standings[i].overallPoints
      );
    }

    standings.forEach((team) => {
      expect(team.distributedPoints).toHaveLength(sports.length);
    });
  });
});
