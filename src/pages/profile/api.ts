import api from 'src/lib/api';

// Lookup types for nested objects
export type LookupItem = {
  id?: string;
  code?: string;
  name?: string;
};

// API contract uses camelCase
export type Person = {
  personName?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  salutation?: string;

  gender?: LookupItem;
  birthPlace?: LookupItem;
  job?: LookupItem;
  ethnicity?: LookupItem;
  marital?: LookupItem;

  birthDttm?: string; // date-only

  // Legacy / backward-compat fields
  genderCode?: string;
  birthPlaceCode?: string;
  birthPlaceDisplay?: string;
  jobCode?: string;
  ethnicityCode?: string;
  maritalStatus?: string;
};

// Wrapped backend response
export type PersonResponse = {
  person: Person & { personId?: string };
};

export type City = { code: string; name: string };

/**
 * Safe extractor: returns Person object if available.
 */
function extractPerson(raw: unknown): Person | null {
  if (raw && typeof raw === 'object') {
    if ('person' in raw) {
      const wrapped = raw as PersonResponse;
      return wrapped.person ?? null;
    }
    return raw as Person;
  }
  return null;
}

/**
 * Normalization: flatten nested lookup into UI codes
 */
function normalizePerson(p: Person | null): Person | null {
  if (!p) return null;

  return {
    ...p,
    genderCode: p.gender?.code ?? p.genderCode,
    birthPlaceCode: p.birthPlace?.code ?? p.birthPlaceCode,
    birthPlaceDisplay: p.birthPlace?.name ?? p.birthPlaceDisplay,
    jobCode: p.job?.code ?? p.jobCode,
    ethnicityCode: p.ethnicity?.code ?? p.ethnicityCode,
    maritalStatus: p.marital?.code ?? p.maritalStatus,
  };
}

/**
 * GET my person
 */
export async function fetchMyPerson(): Promise<Person | null> {
  try {
    const res = await api.get('/users/me/person', { withCredentials: true });
    let person = extractPerson(res.data);

    // Fallback to /auth/me
    if (!person) {
      try {
        const r2 = await api.get('/auth/me', { withCredentials: true });
        person = extractPerson(r2.data);
      } catch {
        return null;
      }
    }

    return normalizePerson(person);
  } catch {
    throw new Error('Failed to fetch person profile');
  }
}

/**
 * PATCH person profile
 */
export async function savePerson(p: Person): Promise<Person | null> {
  const payload: Record<string, unknown> = {
    personName: p.personName,
    firstName: p.firstName,
    lastName: p.lastName,
    salutation: p.salutation,
    address: p.address,
    birthDttm: p.birthDttm,
  };

  if (p.genderCode) payload.gender = { code: p.genderCode };
  if (p.birthPlaceCode) payload.birthPlace = { code: p.birthPlaceCode };
  if (p.jobCode) payload.job = { code: p.jobCode };
  if (p.ethnicityCode) payload.ethnicity = { code: p.ethnicityCode };
  if (p.maritalStatus) payload.marital = { code: p.maritalStatus };

  Object.keys(payload).forEach((k) => {
    if (payload[k] === undefined) delete payload[k];
  });

  const res = await api.patch('/users/me/person', payload, {
    withCredentials: true,
  });

  const person = extractPerson(res.data);
  return normalizePerson(person);
}

/**
 * Search cities
 */
export async function searchCities(q: string): Promise<City[]> {
  if (!q.trim()) return [];

  const res = await api.get<
    Array<{ city_id: string; city_code: string; name: string }>
  >('/api/cities', { params: { q } });

  return Array.isArray(res.data)
    ? res.data.map((c) => ({ code: c.city_code, name: c.name }))
    : [];
}

/**
 * Get city by code
 */
export async function fetchCityByCode(code: string): Promise<City | null> {
  if (!code) return null;
  const list = await searchCities(code);
  return list.find((c) => c.code === code) ?? list[0] ?? null;
}

/**
 * Lookups
 */
export async function fetchGenders(): Promise<LookupItem[]> {
  const res = await api.get<LookupItem[]>('/api/genders');
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchEthnicities(q = ''): Promise<LookupItem[]> {
  const res = await api.get<LookupItem[]>('/api/ethnicities', {
    params: q ? { q } : undefined,
  });
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchJobs(q = ''): Promise<LookupItem[]> {
  const res = await api.get<LookupItem[]>('/api/jobs', {
    params: q ? { q } : undefined,
  });
  return Array.isArray(res.data) ? res.data : [];
}

/**
 * Static marital statuses
 */
export const MARITAL_STATUSES: LookupItem[] = [
  { code: 'single', name: 'Single' },
  { code: 'married', name: 'Married' },
  { code: 'divorced', name: 'Divorced' },
  { code: 'undisclosed', name: 'Undisclosed' },
];
