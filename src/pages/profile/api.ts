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
  // Nested objects (API format)
  gender?: LookupItem;
  birthPlace?: LookupItem;
  job?: LookupItem;
  ethnicity?: LookupItem;
  marital?: LookupItem;
  // date-only string. UI uses MM/DD/YYYY; backend accepts DD/MM/YYYY, MM/DD/YYYY, or ISO.
  birthDttm?: string;
  // Legacy/display fields (for backward compatibility)
  genderCode?: string;
  birthPlaceCode?: string;
  birthPlaceDisplay?: string;
  jobCode?: string;
  ethnicityCode?: string;
  maritalStatus?: string;
};

// Backend response wrapper
export type PersonResponse = {
  person: Person & {
    personId?: string;
  };
};

export type City = { code: string; name: string };

export async function fetchMyPerson(): Promise<Person | null> {
  try {
    // Prefer the dedicated person endpoint for reading profile
    // Use cookies (withCredentials) so httpOnly session cookies work
    console.log('[fetchMyPerson] Calling GET /users/me/person (withCredentials)');
    const res = await api.get('/users/me/person', { withCredentials: true });
    console.log('[fetchMyPerson] Raw response:', res);

    // Response may be { person: {...} } or the person object directly.
    let person: Person | null = null;
    if (res.data && typeof res.data === 'object' && 'person' in res.data) {
      person = (res.data as PersonResponse).person;
    } else if (res.data && typeof res.data === 'object') {
      person = res.data as Person;
    }

    if (!person) {
      console.warn('[fetchMyPerson] No person data returned from /users/me/person');
      // fallback to /auth/me which some backends expose
      try {
        console.log('[fetchMyPerson] Trying fallback GET /auth/me');
        const r2 = await api.get('/auth/me', { withCredentials: true });
        const p = (r2.data && typeof r2.data === 'object' && 'person' in r2.data) ? (r2.data as PersonResponse).person : null;
        if (p) person = p;
      } catch (e) {
        console.warn('[fetchMyPerson] Fallback /auth/me failed', e);
      }
    }

    if (!person) return null;

    // Normalize nested lookups into flat fields for the UI
    const result: Person = {
      ...person,
      genderCode: person.gender?.code ?? person.genderCode,
      birthPlaceCode: person.birthPlace?.code ?? person.birthPlaceCode,
      birthPlaceDisplay: person.birthPlace?.name ?? person.birthPlaceDisplay,
      jobCode: person.job?.code ?? person.jobCode,
      ethnicityCode: person.ethnicity?.code ?? person.ethnicityCode,
      maritalStatus: person.marital?.code ?? person.maritalStatus,
    };

    console.log('[fetchMyPerson] Returning person:', result);
    return result;
  } catch (err: unknown) {
    console.error('[fetchMyPerson] Error fetching profile:', err);
    // Re-throw so caller can handle (component will show errors or redirect)
    throw err;
  }
}

export async function savePerson(p: Person): Promise<Person | null> {
  // Transform UI fields to backend nested object format
  const payload: Record<string, unknown> = {
    personName: p.personName,
    firstName: p.firstName,
    lastName: p.lastName,
    salutation: p.salutation,
    address: p.address,
    birthDttm: p.birthDttm,
  };

  // Send nested objects (preferred by backend)
  if (p.genderCode) {
    payload.gender = { code: p.genderCode };
  }
  if (p.birthPlaceCode) {
    payload.birthPlace = { code: p.birthPlaceCode };
  }
  if (p.jobCode) {
    payload.job = { code: p.jobCode };
  }
  if (p.ethnicityCode) {
    payload.ethnicity = { code: p.ethnicityCode };
  }
  if (p.maritalStatus) {
    payload.marital = { code: p.maritalStatus };
  }

  // Clean up undefined values
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) delete payload[key];
  });

  console.log('[savePerson] PATCH /users/me/person with payload:', payload);

  const res = await api.patch('/users/me/person', payload, { withCredentials: true });
  console.log('[savePerson] Response:', res);

  // Response may be wrapped or direct person object
  let person: Person | null = null;
  if (res.data && typeof res.data === 'object' && 'person' in res.data) {
    person = (res.data as PersonResponse).person;
  } else if (res.data && typeof res.data === 'object') {
    person = res.data as Person;
  }

  if (!person) {
    console.warn('[savePerson] No person object returned from PATCH');
    return null;
  }

  // Normalize nested lookups into flat fields for the UI
  const result: Person = {
    ...person,
    genderCode: person.gender?.code ?? person.genderCode,
    birthPlaceCode: person.birthPlace?.code ?? person.birthPlaceCode,
    birthPlaceDisplay: person.birthPlace?.name ?? person.birthPlaceDisplay,
    jobCode: person.job?.code ?? person.jobCode,
    ethnicityCode: person.ethnicity?.code ?? person.ethnicityCode,
    maritalStatus: person.marital?.code ?? person.maritalStatus,
  };

  console.log('[savePerson] Returning updated person:', result);
  return result;
}

export async function searchCities(q: string): Promise<City[]> {
  if (!q || q.trim().length < 1) return [];
  const res = await api.get<Array<{ city_id: string; city_code: string; name: string }>>('/api/cities', { params: { q } });
  // Map backend city format to UI format
  if (Array.isArray(res.data)) {
    return res.data.map(c => ({ code: c.city_code, name: c.name }));
  }
  return [];
}

export async function fetchCityByCode(code: string): Promise<City | null> {
  if (!code) return null;
  const list = await searchCities(code);
  return list.find((c) => c.code === code) ?? list[0] ?? null;
}

// Lookup API functions
export async function fetchGenders(): Promise<LookupItem[]> {
  const res = await api.get<LookupItem[]>('/api/genders');
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchEthnicities(q = ''): Promise<LookupItem[]> {
  const res = await api.get<LookupItem[]>('/api/ethnicities', { params: q ? { q } : undefined });
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchJobs(q = ''): Promise<LookupItem[]> {
  const res = await api.get<LookupItem[]>('/api/jobs', { params: q ? { q } : undefined });
  return Array.isArray(res.data) ? res.data : [];
}

export const MARITAL_STATUSES: LookupItem[] = [
  { code: 'single', name: 'Single' },
  { code: 'married', name: 'Married' },
  { code: 'divorced', name: 'Divorced' },
  { code: 'undisclosed', name: 'Undisclosed' },
];
