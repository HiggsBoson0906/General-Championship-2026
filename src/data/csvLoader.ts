import Papa from 'papaparse';
import { z } from 'zod';
import type { CsvValidationError } from '../types';

export interface ParseResult<T> {
  data: T[];
  errors: CsvValidationError[];
  totalRows: number;
  validRows: number;
}

/**
 * Parses raw CSV string using PapaParse and validates with a Zod schema.
 */
export function parseCsvText<TRaw, TDomain>(
  csvText: string,
  fileName: string,
  schema: z.ZodType<TRaw>,
  transform: (raw: TRaw) => TDomain
): ParseResult<TDomain> {
  const parseOutput = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  });

  const errors: CsvValidationError[] = [];
  const validData: TDomain[] = [];

  // Capture PapaParse syntax errors
  if (parseOutput.errors && parseOutput.errors.length > 0) {
    parseOutput.errors.forEach((err) => {
      errors.push({
        file: fileName,
        row: err.row !== undefined ? err.row + 2 : undefined,
        message: `CSV Syntax Error: ${err.message}`,
      });
    });
  }

  // Validate each row with the Zod schema
  parseOutput.data.forEach((row, index) => {
    const rowNumber = index + 2; // header is row 1
    const validationResult = schema.safeParse(row);

    if (validationResult.success) {
      try {
        validData.push(transform(validationResult.data));
      } catch (err) {
        errors.push({
          file: fileName,
          row: rowNumber,
          message: `Transform Error: ${(err as Error).message}`,
        });
      }
    } else {
      validationResult.error.issues.forEach((issue) => {
        errors.push({
          file: fileName,
          row: rowNumber,
          field: issue.path.join('.'),
          message: issue.message,
        });
      });
    }
  });

  return {
    data: validData,
    errors,
    totalRows: parseOutput.data.length,
    validRows: validData.length,
  };
}

/**
 * Fetches and parses a CSV file from a given path (e.g., /data/teams.csv).
 */
export async function fetchAndParseCsv<TRaw, TDomain>(
  url: string,
  schema: z.ZodType<TRaw>,
  transform: (raw: TRaw) => TDomain
): Promise<ParseResult<TDomain>> {
  const fileName = url.split('/').pop() || url;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} when fetching ${url}`);
    }
    const text = await response.text();
    return parseCsvText(text, fileName, schema, transform);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network failure';
    return {
      data: [],
      errors: [
        {
          file: fileName,
          message: `Failed to load CSV file: ${message}`,
        },
      ],
      totalRows: 0,
      validRows: 0,
    };
  }
}
