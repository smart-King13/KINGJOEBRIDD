'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MeasurementProfile } from '@/types/api';
import { measurementsApi } from '@/lib/api/measurements';
import { Ruler } from 'lucide-react';

export default function AdminMeasurementsPage() {
  const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfiles() {
      try {
        const response = await measurementsApi.listProfiles();
        const data = response.data || (response as any).data?.data || response;
        if (Array.isArray(data)) {
          setProfiles(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load measurement profiles');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfiles();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Measurements</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Measurements</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {profiles.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <Ruler className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No measurement profiles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-background-subtle)] text-[var(--color-ash)] border-b border-[var(--color-light-ash)]/40">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Customer ID (Profile)</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Profile Name</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Latest Set Version</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Status</th>
                  <th className="px-6 py-4 text-right font-medium uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {profiles.map((profile) => {
                  const sets = profile.measurement_sets || [];
                  const latestSet = sets.length > 0 ? sets.reduce((prev, current) => (prev.version > current.version) ? prev : current) : null;
                  
                  return (
                    <tr key={profile.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-[var(--color-black)] truncate block max-w-[200px]" title={profile.user_id}>
                          {profile.user_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {profile.name}
                      </td>
                      <td className="px-6 py-4">
                        {latestSet ? `v${latestSet.version}` : 'No sets'}
                      </td>
                      <td className="px-6 py-4">
                        {latestSet ? (
                          latestSet.is_approved ? (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-[var(--color-black)] text-white shadow-sm">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-[var(--color-light-ash)] text-[var(--color-black)]">
                              Pending Review
                            </span>
                          )
                        ) : (
                          <span className="text-[var(--color-ash)] italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/measurements/${profile.id}`}
                          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 text-[var(--color-ash)] hover:text-[var(--color-black)] hover:border-[var(--color-black)] transition-colors inline-block"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
