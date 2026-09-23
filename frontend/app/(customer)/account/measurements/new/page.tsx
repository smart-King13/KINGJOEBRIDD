'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { measurementsApi } from '@/lib/api/measurements';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function NewMeasurementProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await measurementsApi.createProfile(name);
      router.push(`/account/measurements/${res.data.id}?action=add`);
    } catch (err: any) {
      setError(err.message || 'Failed to create profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div>
        <Link 
          href="/account/measurements" 
          className="inline-flex items-center text-xs font-bold tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO MEASUREMENTS
        </Link>
        <h1 className="font-display text-4xl font-medium text-[var(--color-black)] mb-4">
          New Profile
        </h1>
        <p className="text-sm text-[var(--color-ash)]">
          Create a profile to organize measurements. For example: "Self Measurements" or "John's Measurements".
        </p>
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-2xl p-6 md:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-[var(--color-background-subtle)] text-[var(--color-black)] border border-[var(--color-black)]/20 rounded-xl text-sm font-medium flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[10px] sm:text-xs font-bold tracking-widest text-[var(--color-ash)] mb-3 uppercase">
              PROFILE NAME *
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Self Measurements"
              required
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="pt-6 border-t border-[var(--color-light-ash)]/60">
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              className="w-full group"
              isLoading={isSubmitting}
            >
              CREATE PROFILE
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
