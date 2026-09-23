'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MeasurementProfile } from '@/types/api';
import { measurementsApi } from '@/lib/api/measurements';

export default function AdminMeasurementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [profile, setProfile] = useState<MeasurementProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;
      try {
        const response = await measurementsApi.listProfiles();
        const data = response.data || (response as any).data?.data || response;
        if (Array.isArray(data)) {
          const found = data.find(p => p.id === id);
          if (found) {
            setProfile(found);
          } else {
            setError('Measurement profile not found');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  const handleApprove = async (setId: string) => {
    setIsApproving(setId);
    try {
      await measurementsApi.approveSet(setId);
      // Update local state to reflect approval
      if (profile && profile.measurement_sets) {
        setProfile({
          ...profile,
          measurement_sets: profile.measurement_sets.map(set => 
            set.id === setId ? { ...set, is_approved: true } : set
          )
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to approve measurement set');
    } finally {
      setIsApproving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Measurement Profile</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-64 bg-[var(--color-ash)]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Measurement Profile</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error || 'Profile not found'}
        </div>
        <button onClick={() => router.back()} className="text-sm underline">
          &larr; Back
        </button>
      </div>
    );
  }

  const sortedSets = [...(profile.measurement_sets || [])].sort((a, b) => b.version - a.version);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/measurements" className="text-sm text-[var(--color-ash)] hover:text-[var(--color-black)] mb-2 inline-block transition-colors">
            &larr; Back to Measurements
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
          <div className="text-sm text-[var(--color-ash)] mt-1">
            Customer ID: {profile.user_id}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sortedSets.length === 0 ? (
          <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 rounded-lg p-12 text-center text-[var(--color-ash)]">
            No measurement sets recorded for this profile yet.
          </div>
        ) : (
          sortedSets.map((set) => (
            <div key={set.id} className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 rounded-lg overflow-hidden">
              <div className="bg-[var(--color-ash)]/5 p-4 flex items-center justify-between border-b border-[var(--color-ash)]/20">
                <div>
                  <h2 className="font-bold tracking-tight">Version {set.version}</h2>
                  <p className="text-xs text-[var(--color-ash)]">
                    Submitted on {new Date(set.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {set.is_approved ? (
                    <span className="inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-[var(--color-black)] text-white">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(set.id)}
                      disabled={isApproving === set.id}
                      className="text-[10px] font-bold tracking-widest uppercase bg-transparent border border-[var(--color-black)] text-[var(--color-black)] px-4 py-1.5 hover:bg-[var(--color-black)] hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isApproving === set.id ? 'Approving...' : 'Approve Set'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {set.values && set.values.length > 0 ? (
                  set.values.map(val => (
                    <div key={val.id} className="space-y-1">
                      <p className="text-xs text-[var(--color-ash)] font-medium uppercase tracking-wider">{val.key.replace(/_/g, ' ')}</p>
                      <p className="text-lg font-bold">{val.value}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--color-ash)] col-span-3">No values recorded.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
