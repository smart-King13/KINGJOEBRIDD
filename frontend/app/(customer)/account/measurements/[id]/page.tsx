import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { MeasurementProfileDetailClient } from '@/components/measurements/MeasurementProfileDetailClient';
import { MeasurementProfile, ApiResponse } from '@/types/api';

export const metadata = {
  title: 'Measurement Profile | KINGJOEBRIDD FASHION',
};

async function getProfile(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  
  // Since backend doesn't have a specific GET /measurement-profiles/{id}, fetch all and filter
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
  return json.data.find(p => p.id === id) || null;
}

export default async function MeasurementProfilePage({ params }: { params: { id: string } }) {
  const profile = await getProfile(params.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/account/measurements" className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO PROFILES
        </Link>
        <h1 className="font-display text-3xl font-medium text-[var(--color-black)] uppercase">
          {profile.name}
        </h1>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse bg-[var(--color-ash)]/10"></div>}>
        <MeasurementProfileDetailClient profile={profile} />
      </Suspense>
    </div>
  );
}
