import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { MeasurementProfile, ApiResponse } from '@/types/api';
import { formatDate } from '@/lib/utils/format';
import { buttonClasses } from '@/components/ui/Button';

export const metadata = {
  title: 'My Measurements | KINGJOEBRIDD FASHION',
};

async function getProfiles() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}/api/v1/measurement-profiles`, {
    headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error('Failed to fetch measurement profiles');
  }

  const json = await res.json() as ApiResponse<MeasurementProfile[]>;
  return json.data;
}

export default async function MeasurementsPage() {
  const profiles = await getProfiles();

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
          Your Measurement Profiles
        </div>
        <Link 
          href="/account/measurements/new"
          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] rounded-lg px-4 py-2 hover:bg-[var(--color-black)] hover:text-white transition-colors"
        >
          Create Profile
        </Link>
      </div>

      {!profiles || profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl bg-[var(--color-white)]/80 backdrop-blur-md shadow-lg border border-[var(--color-light-ash)] group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-[var(--color-ash)] mb-6 animate-float relative z-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-3 relative z-10 tracking-wide">
            Your measurements, ready when you need them.
          </h3>
          <p className="text-[var(--color-ash)] text-sm mb-8 max-w-md mx-auto relative z-10">
            Saving your measurements makes future tailoring requests easier and faster. Create a profile to start tracking your perfect fit.
          </p>
          <Link 
            href="/account/measurements/new"
            className="relative z-10 inline-flex items-center justify-center px-8 py-3 bg-[var(--color-white)] text-[var(--color-black)] border border-[var(--color-black)] text-xs font-medium tracking-widest uppercase rounded-sm hover:bg-[var(--color-black)] hover:text-[var(--color-white)] transition-colors"
          >
            CREATE PROFILE
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-bold">Profile Name</th>
                  <th className="px-6 py-4 font-bold">Versions</th>
                  <th className="px-6 py-4 font-bold">Last Updated</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {profiles.map((profile) => {
                  const hasSets = profile.measurement_sets && profile.measurement_sets.length > 0;
                  return (
                    <tr key={profile.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ash)]"><path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"></path></svg>
                          </div>
                          <div className="font-bold text-[var(--color-black)] uppercase tracking-wide">
                            {profile.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[var(--color-ash)] text-xs font-mono">
                          {hasSets ? profile.measurement_sets!.length : 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-black)] font-bold">
                          {hasSets ? formatDate(profile.updated_at) : 'Never'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/account/measurements/${profile.id}`}
                          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:text-[var(--color-black)] text-[var(--color-ash)] transition-colors inline-block"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
