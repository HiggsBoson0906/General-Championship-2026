import { describe, it, expect } from 'vitest';
import { parseCsvText } from '../csvLoader';
import { RawTeamSchema, transformTeam } from '../schemas';

describe('CSV Loader Utility (parseCsvText)', () => {
  it('parses valid CSV text into typed domain models', () => {
    const csvContent = `id,name,short_name,department,image,primary_color,description
team-1,Arch & MCA,ARCH,Architecture & Computer Applications,/img.png,#f59e0b,Department desc
team-2,Team B,TMB,Computer Science,/img2.png,#3b82f6,CS Dept`;

    const result = parseCsvText(csvContent, 'teams.csv', RawTeamSchema, transformTeam);

    expect(result.errors).toHaveLength(0);
    expect(result.validRows).toBe(2);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      id: 'team-1',
      name: 'Arch & MCA',
      shortName: 'ARCH',
      department: 'Architecture & Computer Applications',
      image: '/img.png',
      primaryColor: '#f59e0b',
      description: 'Department desc',
    });
  });

  it('handles empty rows and whitespace gracefully', () => {
    const csvContent = `id, name , short_name , department, image, primary_color, description
team-1, Arch & MCA , ARCH , Dept 1 , , , 

team-2, Team B , TMB , Dept 2 , , , `;

    const result = parseCsvText(csvContent, 'teams.csv', RawTeamSchema, transformTeam);

    expect(result.validRows).toBe(2);
    expect(result.data[0].name).toBe('Arch & MCA');
    expect(result.data[0].shortName).toBe('ARCH');
  });

  it('captures malformed rows without crashing', () => {
    const malformedCsv = `id,name,short_name,department
,Missing ID Team,MIT,Engineering
team-valid,Valid Team,VT,Valid Dept`;

    const result = parseCsvText(malformedCsv, 'teams.csv', RawTeamSchema, transformTeam);

    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].row).toBe(2);
    expect(result.errors[0].message).toContain('Team ID is required');
    expect(result.validRows).toBe(1);
    expect(result.data[0].id).toBe('team-valid');
  });
});
