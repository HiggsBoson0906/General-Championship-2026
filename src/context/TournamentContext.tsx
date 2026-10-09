import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { loadAllTournamentData } from '../data/api';
import { calculateStandings, DEFAULT_SCORING_CONFIG } from '../data/rankings';
import type {
  TournamentData,
  TeamStanding,
  ScoringConfig,
  CsvValidationError,
  Team,
  Sport,
} from '../types';

interface TournamentContextValue {
  data: TournamentData | null;
  standings: TeamStanding[];
  isLoading: boolean;
  error: string | null;
  validationErrors: CsvValidationError[];
  scoringConfig: ScoringConfig;
  updateScoringConfig: (config: Partial<ScoringConfig>) => void;
  refetch: () => Promise<void>;
  getTeam: (id: string) => Team | undefined;
  getSport: (id: string) => Sport | undefined;
}

const TournamentContext = createContext<TournamentContextValue | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<TournamentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<CsvValidationError[]>([]);
  const [scoringConfig, setScoringConfig] = useState<ScoringConfig>(DEFAULT_SCORING_CONFIG);

  const fetchData = useCallback(async (forceReload = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: loadedData, errors } = await loadAllTournamentData(forceReload);
      setData(loadedData);
      setValidationErrors(errors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tournament data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const standings = useMemo(() => {
    if (!data) return [];
    return calculateStandings(data.teams, data.sports, data.matches, scoringConfig);
  }, [data, scoringConfig]);

  const getTeam = useCallback(
    (id: string) => data?.teams.find((t) => t.id === id),
    [data]
  );

  const getSport = useCallback(
    (id: string) => data?.sports.find((s) => s.id === id),
    [data]
  );

  const updateScoringConfig = useCallback((newConfig: Partial<ScoringConfig>) => {
    setScoringConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const value = useMemo(
    () => ({
      data,
      standings,
      isLoading,
      error,
      validationErrors,
      scoringConfig,
      updateScoringConfig,
      refetch: () => fetchData(true),
      getTeam,
      getSport,
    }),
    [data, standings, isLoading, error, validationErrors, scoringConfig, updateScoringConfig, fetchData, getTeam, getSport]
  );

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export function useTournament(): TournamentContextValue {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
