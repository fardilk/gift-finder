import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CityAutocomplete } from './CityAutocomplete';
import { type Person } from '../api';
import { useGenders, useEthnicities, useJobs, useMaritalStatuses } from '../hooks';
import { toast } from '@/components/ui/use-toast';

const SALUTATIONS = ['Mr', 'Ms', 'Mrs', 'Dr'] as const;

const schema = z.object({
  personName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  salutation: z.enum(SALUTATIONS).optional(),
  genderCode: z.string().optional(),
  birthDttm: z.string().optional(),
  birthPlaceCode: z.string().optional(),
  birthPlaceDisplay: z.string().optional(),
  jobCode: z.string().optional(),
  ethnicityCode: z.string().optional(),
  maritalStatus: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof schema>;

export function ProfileForm({ initial, onSubmit, onCancel }: {
  initial: Person | null;
  onSubmit: (values: ProfileFormValues) => Promise<void> | void;
  onCancel: () => void;
}) {
  // Fetch lookup data from API
  const { data: genders = [] } = useGenders();
  const { data: ethnicities = [] } = useEthnicities();
  const { data: jobs = [] } = useJobs();
  const { data: maritalStatuses = [] } = useMaritalStatuses();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      personName: initial?.personName ?? '',
      firstName: initial?.firstName ?? '',
      lastName: initial?.lastName ?? '',
      address: initial?.address ?? '',
      salutation: (initial?.salutation as ProfileFormValues['salutation']) ?? undefined,
      genderCode: initial?.genderCode ?? undefined,
      birthDttm: initial?.birthDttm ?? '',
      birthPlaceCode: initial?.birthPlaceCode ?? '',
      birthPlaceDisplay: (initial as { birthPlaceDisplay?: string } | null)?.birthPlaceDisplay ?? '',
      jobCode: initial?.jobCode ?? undefined,
      ethnicityCode: initial?.ethnicityCode ?? undefined,
      maritalStatus: initial?.maritalStatus ?? undefined,
    },
  });

  const values = form.watch();

  async function handleSubmit(data: ProfileFormValues) {
    await onSubmit(data);
    toast({ title: 'Profile updated', description: 'Your profile changes were saved.' });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid max-w-3xl gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Salutation</span>
          <select
            {...form.register('salutation')}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          >
            <option value="">-</option>
            {SALUTATIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">First name</span>
          <input
            {...form.register('firstName')}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Last name</span>
          <input
            {...form.register('lastName')}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          />
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-sm text-slate-600">Display name</span>
        <input
          {...form.register('personName')}
          className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-slate-600">Address</span>
        <textarea
          rows={3}
          {...form.register('address')}
          className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Gender</span>
          <select
            {...form.register('genderCode')}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          >
            <option value="">-</option>
            {genders.map((g) => (
              <option key={g.code} value={g.code}>{g.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Birth date</span>
          <input
            type="date"
            value={toLocalInput(values.birthDttm)}
            onChange={(e) => {
              const mmdd = mmddFromYMD(e.target.value);
              form.setValue('birthDttm', mmdd ?? '');
            }}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Birth place</span>
          <CityAutocomplete
            valueCode={values.birthPlaceCode}
            valueDisplay={values.birthPlaceDisplay}
            onChange={({ code, name }) => {
              form.setValue('birthPlaceCode', code ?? '');
              form.setValue('birthPlaceDisplay', name ?? '');
            }}
          />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {values.birthPlaceCode && <span>Code: {values.birthPlaceCode}</span>}
            {values.birthPlaceCode && (
              <button
                type="button"
                className="ml-auto rounded px-2 py-1 hover:bg-slate-50"
                onClick={() => {
                  form.setValue('birthPlaceCode', '');
                  form.setValue('birthPlaceDisplay', '');
                }}
              >
                Clear
              </button>
            )}
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Job</span>
          <select
            {...form.register('jobCode')}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          >
            <option value="">-</option>
            {jobs.map((j) => (
              <option key={j.code} value={j.code}>{j.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Ethnicity</span>
          <select
            {...form.register('ethnicityCode')}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          >
            <option value="">-</option>
            {ethnicities.map((x) => (
              <option key={x.code} value={x.code}>{x.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-600">Marital status</span>
          <select
            {...form.register('maritalStatus')}
            className="rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
          >
            <option value="">-</option>
            {maritalStatuses.map((m) => (
              <option key={m.code} value={m.code}>{m.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="pt-2">
        <button type="submit" className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Save profile
        </button>
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}


function mmddFromYMD(val?: string): string | undefined {
  if (!val) return undefined;
  const parts = val.split('-');
  if (parts.length !== 3) return undefined;
  const [y, m, d] = parts;
  if (!/^\d{4}$/.test(y) || !/^\d{1,2}$/.test(m) || !/^\d{1,2}$/.test(d)) return undefined;
  return `${m.padStart(2, '0')}/${d.padStart(2, '0')}/${y}`;
}

function toLocalInput(dt?: string): string {
  if (!dt) return '';
  const isoMatch = dt.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];
  const mmdd = dt.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmdd) {
    const mm = mmdd[1].padStart(2, '0');
    const dd = mmdd[2].padStart(2, '0');
    const yyyy = mmdd[3];
    return `${yyyy}-${mm}-${dd}`;
  }
  return '';
}
