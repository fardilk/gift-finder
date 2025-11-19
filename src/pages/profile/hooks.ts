import * as React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  fetchMyPerson, 
  savePerson, 
  searchCities, 
  fetchCityByCode, 
  fetchGenders,
  fetchEthnicities,
  fetchJobs,
  MARITAL_STATUSES,
  type Person, 
  type City,
  type LookupItem 
} from './api';

export function useProfileQuery() {
  return useQuery({ queryKey: ['person', 'me'], queryFn: fetchMyPerson });
}

export function useSaveProfile() {
  return useMutation({ mutationFn: savePerson });
}

export function useCitySearch(q: string) {
  return useQuery({
    queryKey: ['cities', q],
    queryFn: () => searchCities(q),
    enabled: q.trim().length >= 2,
  });
}

export function useCityByCode(code?: string) {
  return useQuery({
    queryKey: ['city', code ?? ''],
    queryFn: () => fetchCityByCode(code || ''),
    enabled: !!code,
  });
}

export function useGenders() {
  return useQuery({ queryKey: ['genders'], queryFn: fetchGenders });
}

export function useEthnicities(q = '') {
  return useQuery({ 
    queryKey: ['ethnicities', q], 
    queryFn: () => fetchEthnicities(q) 
  });
}

export function useJobs(q = '') {
  return useQuery({ 
    queryKey: ['jobs', q], 
    queryFn: () => fetchJobs(q) 
  });
}

export function useMaritalStatuses() {
  return { data: MARITAL_STATUSES };
}

export type { Person, City, LookupItem };

// Small local hook for debouncing values
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
