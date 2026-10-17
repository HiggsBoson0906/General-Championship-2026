import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCsvText } from '../csvLoader';
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
} from '../schemas';

describe('Production CSV Datasets Integrity & Consistency', () => {
  const publicDataDir = path.resolve(import.meta.dirname, '../../../public/data');

  it('validates public/data/teams.csv with 8 fictional teams and consistent IDs', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'teams.csv'), 'utf8');
    const result = parseCsvText(content, 'teams.csv', RawTeamSchema, transformTeam);

    expect(result.errors).toHaveLength(0);
    expect(result.data).toHaveLength(8);

    const teamIds = result.data.map((t) => t.id);
    expect(teamIds).toContain('team-red');
    expect(teamIds).toContain('team-blue');
    expect(teamIds).toContain('team-gold');
    expect(teamIds).toContain('team-green');

    result.data.forEach((team) => {
      expect(team.teamCategory.trim()).not.toBe('');
    });
  });

  it('validates public/data/sports.csv with the 13 required sports', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'sports.csv'), 'utf8');
    const result = parseCsvText(content, 'sports.csv', RawSportSchema, transformSport);

    expect(result.errors).toHaveLength(0);
    expect(result.data).toHaveLength(6);

    const sportIds = result.data.map((s) => s.id);
    expect(sportIds).toEqual(
      expect.arrayContaining(['football', 'cricket', 'basketball', 'volleyball', 'badminton', 'table-tennis', 'athletics', 'chess', 'kabaddi', 'kho-kho', 'tug-of-war', 'yoga', 'power-lifting'])
    );

    result.data.forEach((sport) => {
      expect(sport.sportCategory.length).toBeGreaterThan(0);
      sport.sportCategory.forEach((category) => {
        expect(category.trim()).not.toBe('');
      });
    });
  });

  it('validates public/data/matches.csv with >= 30 matches and valid scores/statuses', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'matches.csv'), 'utf8');
    const result = parseCsvText(content, 'matches.csv', RawMatchSchema, transformMatch);

    expect(result.errors).toHaveLength(0);
    expect(result.data.length).toBeGreaterThanOrEqual(30);

    // Verify completed matches have scores and scheduled matches do not
    const completedMatches = result.data.filter((m) => m.status === 'completed');
    const scheduledMatches = result.data.filter((m) => m.status === 'scheduled');

    expect(completedMatches.length).toBeGreaterThan(0);
    expect(scheduledMatches.length).toBeGreaterThan(0);

    completedMatches.forEach((m) => {
      expect(m.scoreTeam1.length).toBeGreaterThan(0);
      expect(m.winnerId).toBeTruthy();
    });

    scheduledMatches.forEach((m) => {
      expect(m.scoreTeam1).toBe('');
      expect(m.scoreTeam2).toBe('');
      expect(m.winnerId).toBeNull();
    });

    result.data.forEach((match) => {
      expect(match.matchCategory.trim()).not.toBe('');
    });
  });

  it('validates public/data/history.csv with valid team references', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'history.csv'), 'utf8');
    const result = parseCsvText(content, 'history.csv', RawChampionshipHistorySchema, transformHistory);

    expect(result.errors).toHaveLength(0);
    expect(result.data.length).toBeGreaterThanOrEqual(4);
  });

  it('validates public/data/gallery.csv with valid categories and images', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'gallery.csv'), 'utf8');
    const result = parseCsvText(content, 'gallery.csv', RawGallerySchema, transformGallery);

    expect(result.errors).toHaveLength(0);
    expect(result.data.length).toBeGreaterThanOrEqual(6);
  });

  it('guarantees 100% foreign key integrity across all production CSV files', () => {
    const teamsCsv = fs.readFileSync(path.join(publicDataDir, 'teams.csv'), 'utf8');
    const sportsCsv = fs.readFileSync(path.join(publicDataDir, 'sports.csv'), 'utf8');
    const matchesCsv = fs.readFileSync(path.join(publicDataDir, 'matches.csv'), 'utf8');
    const historyCsv = fs.readFileSync(path.join(publicDataDir, 'history.csv'), 'utf8');
    const galleryCsv = fs.readFileSync(path.join(publicDataDir, 'gallery.csv'), 'utf8');

    const teams = parseCsvText(teamsCsv, 'teams.csv', RawTeamSchema, transformTeam).data;
    const sports = parseCsvText(sportsCsv, 'sports.csv', RawSportSchema, transformSport).data;
    const matches = parseCsvText(matchesCsv, 'matches.csv', RawMatchSchema, transformMatch).data;
    const history = parseCsvText(historyCsv, 'history.csv', RawChampionshipHistorySchema, transformHistory).data;
    const gallery = parseCsvText(galleryCsv, 'gallery.csv', RawGallerySchema, transformGallery).data;

    const warnings = validateIntegrity(teams, sports, matches, history, gallery);
    expect(warnings).toHaveLength(0);
  });

  describe('Integrity validation error detection tests', () => {
    const validTeams = [
      { id: 'team-red', name: 'Red', teamCategory: 'Male',shortName: 'R', department: 'D', image: '', primaryColor: '', description: '' },
      { id: 'team-blue', name: 'Blue', teamCategory: 'Female',shortName: 'B', department: 'D', image: '', primaryColor: '', description: '' },
    ];
    const validSports = [
      { id: 'cricket', title: 'Cricket', sportCategory: ['Male'], category: 'Team', description: '', image: '', bannerImg: '', venue: '', maxPoints: 20 },
    ];

    it('catches duplicate IDs', () => {
      const duplicateTeams = [
        ...validTeams,
        { id: 'team-red', name: 'Duplicate Red', teamCategory: 'Male',shortName: 'R2', department: 'D', image: '', bannerImg: '',primaryColor: '', description: '' },
      ];
      const warnings = validateIntegrity(duplicateTeams, validSports, [], []);
      expect(warnings.some((w) => w.includes('Duplicate team ID'))).toBe(true);
    });

    it('catches non-existent foreign keys in matches', () => {
      const invalidMatches = [
        {
          id: 'm-err',
          sportId: 'hockey', // non-existent
          matchCategory: 'Male',
          date: '2025-09-24',
          time: '16:00',
          venue: 'Ground',
          stage: 'Final',
          team1Id: 'team-red',
          team2Id: 'team-ghost', // non-existent
          winnerId: 'team-red',
          pointsAwarded: 10,
          status: 'completed' as const,
          scoreTeam1: '2',
          scoreTeam2: '1',
        },
      ];

      const warnings = validateIntegrity(validTeams, validSports, invalidMatches, []);
      expect(warnings.some((w) => w.includes('non-existent sport'))).toBe(true);
      expect(warnings.some((w) => w.includes('non-existent team2'))).toBe(true);
    });

    it('catches scheduled matches that mistakenly have scores', () => {
      const invalidMatches = [
        {
          id: 'm-err2',
          sportId: 'football',
          matchCategory: 'Men', // non-existent
          date: '2026-10-24',
          time: '16:00',
          venue: 'Ground',
          stage: 'Final',
          team1Id: 'team-red',
          team2Id: 'team-blue',
          winnerId: null,
          pointsAwarded: 0,
          status: 'scheduled' as const,
          scoreTeam1: '1', // should be empty!
          scoreTeam2: '',
        },
      ];

      const warnings = validateIntegrity(validTeams, validSports, invalidMatches, []);
      expect(warnings.some((w) => w.includes('invalid matchCategory'))).toBe(true);
      expect(warnings.some((w) => w.includes('has final scores assigned'))).toBe(true);
    });
  });
});
