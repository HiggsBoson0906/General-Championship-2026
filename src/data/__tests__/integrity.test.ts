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
  validateIntegrity,
} from '../schemas';

describe('Production CSV Datasets Integrity', () => {
  const publicDataDir = path.resolve(__dirname, '../../../public/data');

  it('validates public/data/teams.csv', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'teams.csv'), 'utf8');
    const result = parseCsvText(content, 'teams.csv', RawTeamSchema, transformTeam);

    expect(result.errors).toHaveLength(0);
    expect(result.data.length).toBeGreaterThanOrEqual(8);
  });

  it('validates public/data/sports.csv', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'sports.csv'), 'utf8');
    const result = parseCsvText(content, 'sports.csv', RawSportSchema, transformSport);

    expect(result.errors).toHaveLength(0);
    expect(result.data.length).toBe(14);
  });

  it('validates public/data/matches.csv', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'matches.csv'), 'utf8');
    const result = parseCsvText(content, 'matches.csv', RawMatchSchema, transformMatch);

    expect(result.errors).toHaveLength(0);
    expect(result.data.length).toBeGreaterThanOrEqual(30);
  });

  it('validates public/data/championship_history.csv', () => {
    const content = fs.readFileSync(path.join(publicDataDir, 'championship_history.csv'), 'utf8');
    const result = parseCsvText(content, 'championship_history.csv', RawChampionshipHistorySchema, transformHistory);

    expect(result.errors).toHaveLength(0);
    expect(result.data.length).toBeGreaterThanOrEqual(4);
  });

  it('guarantees 100% foreign key integrity across all production CSV files', () => {
    const teamsCsv = fs.readFileSync(path.join(publicDataDir, 'teams.csv'), 'utf8');
    const sportsCsv = fs.readFileSync(path.join(publicDataDir, 'sports.csv'), 'utf8');
    const matchesCsv = fs.readFileSync(path.join(publicDataDir, 'matches.csv'), 'utf8');
    const historyCsv = fs.readFileSync(path.join(publicDataDir, 'championship_history.csv'), 'utf8');

    const teams = parseCsvText(teamsCsv, 'teams.csv', RawTeamSchema, transformTeam).data;
    const sports = parseCsvText(sportsCsv, 'sports.csv', RawSportSchema, transformSport).data;
    const matches = parseCsvText(matchesCsv, 'matches.csv', RawMatchSchema, transformMatch).data;
    const history = parseCsvText(historyCsv, 'championship_history.csv', RawChampionshipHistorySchema, transformHistory).data;

    const warnings = validateIntegrity(teams, sports, matches, history);
    expect(warnings).toHaveLength(0);
  });
});
