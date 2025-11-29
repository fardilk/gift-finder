import * as React from 'react';
import { useProfileQuery, useSaveProfile, useGenders, useEthnicities, useJobs, useMaritalStatuses, type Person } from './hooks';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileForm, type ProfileFormValues } from './components/ProfileForm';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import { showSuccessToast } from 'src/shared/components/toast/successToast';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const { data: initial, isLoading, error } = useProfileQuery();
  const [editing, setEditing] = React.useState(false);
  const save = useSaveProfile();
  const queryClient = useQueryClient();
  
  // Debug logging
  React.useEffect(() => {
    console.log('[ProfilePage] initial data:', initial);
    console.log('[ProfilePage] isLoading:', isLoading);
    console.log('[ProfilePage] isAuthenticated:', isAuthenticated);
    console.log('[ProfilePage] error:', error);
  }, [initial, isLoading, isAuthenticated, error]);
  
  // Only redirect after loading is complete and auth check failed
  // This prevents premature redirects on hard refresh
  if (!isLoading && !isAuthenticated && !initial) {
    return <Navigate to="/login" replace />;
  }
  
  // Fetch lookups for display names
  const { data: genders = [] } = useGenders();
  const { data: ethnicities = [] } = useEthnicities();
  const { data: jobs = [] } = useJobs();
  const { data: maritalStatuses = [] } = useMaritalStatuses();
  
  // Helper to get display name from code
  const getGenderName = (code?: string) => genders.find(g => g.code === code)?.name ?? code;
  const getJobName = (code?: string) => jobs.find(j => j.code === code)?.name ?? code;
  const getEthnicityName = (code?: string) => ethnicities.find(e => e.code === code)?.name ?? code;
  const getMaritalName = (code?: string) => maritalStatuses.find(m => m.code === code)?.name ?? code;

  async function onSubmit(values: ProfileFormValues) {
    console.log('='.repeat(80));
    console.log('[ProfilePage] ⏳ Starting profile save...');
    console.log('[ProfilePage] Submitting values:', values);
    
    const payload: Person = { ...values } as Person;
    
    try {
      const updated = await save.mutateAsync(payload);
      console.log('[ProfilePage] ✅ Save successful! Result:', updated);
      
      if (updated) {
        // update cache immediately with server-returned person
        queryClient.setQueryData<Person | null>(['person', 'me'], (prev) => ({ ...(prev ?? {} as Person), ...updated }));
      } else {
        // fallback: invalidate so fetchMyPerson re-reads from server
        await queryClient.invalidateQueries({ queryKey: ['person', 'me'] });
      }
      
      console.log('[ProfilePage] 🎉 About to show success toast...');
      showSuccessToast('Profile');
      console.log('[ProfilePage] 🎉 Success toast called');
      
      setEditing(false);
      console.log('[ProfilePage] ✅ Profile save complete!');
      console.log('='.repeat(80));
    } catch (error) {
      console.error('[ProfilePage] ❌ Save failed:', error);
      console.log('='.repeat(80));
      throw error;
    }
  }

  // Display name with fallback
  const displayName = initial?.personName || 
    (initial?.firstName && initial?.lastName ? `${initial.firstName} ${initial.lastName}` : initial?.firstName || 'User');
  
  const staticRole = 'Admin';
  const headerLocation = initial?.address ?? (initial as { birthPlaceDisplay?: string } | null)?.birthPlaceDisplay ?? '';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Card - Identity Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-purple-400 to-purple-600">
              <img 
                src="/images/avatar-placeholder.png" 
                alt={displayName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<div class="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">${displayName.charAt(0).toUpperCase()}</div>`;
                }}
              />
            </div>
            
            {/* Identity Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{displayName}</h1>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-slate-600">{staticRole}</p>
                <p className="text-sm text-slate-500">{headerLocation || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card - Personal Information & Address */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Card Header */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-semibold text-slate-900">My Profile</h2>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : !editing ? (
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Personal Information</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoItem label="Salutation" value={initial?.salutation} />
                  <InfoItem label="First Name" value={initial?.firstName} />
                  <InfoItem label="Last Name" value={initial?.lastName} />
                  <InfoItem label="Display Name" value={initial?.personName} />
                  <InfoItem label="Gender" value={getGenderName(initial?.genderCode)} />
                  <InfoItem label="Date of Birth" value={initial?.birthDttm ? formatToMMDDYYYY(initial.birthDttm) : undefined} />
                  <InfoItem label="Birth Place" value={(initial as { birthPlaceDisplay?: string } | null)?.birthPlaceDisplay ?? initial?.birthPlaceCode} />
                  <InfoItem label="Job" value={getJobName(initial?.jobCode)} />
                  <InfoItem label="Ethnicity" value={getEthnicityName(initial?.ethnicityCode)} />
                  <InfoItem label="Marital Status" value={getMaritalName(initial?.maritalStatus)} />
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Address</h3>
                <div className="grid gap-6">
                  <InfoItem label="Full Address" value={initial?.address} multiline />
                </div>
              </div>
            </div>
          ) : (
            <ProfileForm
              initial={initial ?? null}
              onSubmit={onSubmit}
              onCancel={() => setEditing(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Info display component
function InfoItem({ label, value, multiline }: { label: string; value?: string; multiline?: boolean }) {
  const displayValue = value && String(value).trim().length > 0 ? value : '-';
  return (
    <div className={multiline ? 'sm:col-span-2 lg:col-span-3' : ''}>
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className={`mt-1 text-sm text-slate-900 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
        {displayValue}
      </dd>
    </div>
  );
}

// String-only conversion to avoid timezone/time components.
// Accepts either MM/DD/YYYY or a value starting with YYYY-MM-DD (ISO-like), returns MM/DD/YYYY; else undefined.
function formatToMMDDYYYY(dt?: string): string | undefined {
  if (!dt) return undefined;
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dt)) return dt;
  const isoMatch = dt.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const yyyy = isoMatch[1];
    const mm = isoMatch[2];
    const dd = isoMatch[3];
    return `${mm}/${dd}/${yyyy}`;
  }
  return undefined;
}
