'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MeasurementProfile } from '@/types/api';
import { measurementsApi } from '@/lib/api/measurements';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDateTime } from '@/lib/utils/format';

interface MeasurementProfileDetailClientProps {
  profile: MeasurementProfile;
}

const MEASUREMENT_GROUPS = [
  {
    title: 'Upper Body',
    fields: ['chest', 'waist', 'shoulder', 'neck', 'bicep', 'wrist', 'sleeve_length', 'jacket_length']
  },
  {
    title: 'Lower Body',
    fields: ['hips', 'thigh', 'calf', 'trouser_length']
  }
];

export function MeasurementProfileDetailClient({ profile }: MeasurementProfileDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const actionParam = searchParams.get('action');
  const [activeTab, setActiveTab] = useState<'view' | 'add'>(actionParam === 'add' ? 'add' : 'view');
  
  const sets = profile.measurement_sets || [];
  const sortedSets = [...sets].sort((a, b) => b.version - a.version);
  const latestSet = sortedSets[0];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only send fields that have values
    const measurementsToSubmit: Record<string, number> = {};
    for (const [k, v] of Object.entries(formData)) {
      if (v.trim() !== '') {
        const num = parseFloat(v);
        if (!isNaN(num)) {
          measurementsToSubmit[k] = num;
        }
      }
    }

    if (Object.keys(measurementsToSubmit).length === 0) {
      setError('Please provide at least one measurement.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await measurementsApi.addSet(profile.id, measurementsToSubmit);
      // Refresh the page to get the new data and switch to view tab
      router.refresh();
      setActiveTab('view');
      setFormData({}); // Clear form
    } catch (err: any) {
      setError(err.message || 'Failed to add measurement set.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--color-ash)]/20 pb-4">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('view')}
            className={`pb-4 text-sm font-medium tracking-widest transition-colors relative ${
              activeTab === 'view' 
                ? 'text-[var(--color-black)]' 
                : 'text-[var(--color-ash)] hover:text-[var(--color-black)]'
            }`}
          >
            LATEST VERSION
            {activeTab === 'view' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-black)]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`pb-4 text-sm font-medium tracking-widest transition-colors relative ${
              activeTab === 'add' 
                ? 'text-[var(--color-black)]' 
                : 'text-[var(--color-ash)] hover:text-[var(--color-black)]'
            }`}
          >
            ADD NEW VERSION
            {activeTab === 'add' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-black)]" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'view' && (
        <div className="space-y-8">
          {!latestSet ? (
            <div className="text-center py-12 px-4 bg-white border border-[var(--color-ash)]/20">
              <p className="text-[var(--color-ash)]">No measurements recorded yet.</p>
              <Button 
                onClick={() => setActiveTab('add')}
                variant="outline"
                className="mt-4 text-xs tracking-widest border-[var(--color-black)] text-[var(--color-black)]"
              >
                ADD MEASUREMENTS
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl text-[var(--color-black)]">
                    Version {latestSet.version}
                  </h3>
                  <p className="text-xs text-[var(--color-ash)] mt-1">
                    Recorded on {formatDateTime(latestSet.created_at)}
                  </p>
                </div>
                {latestSet.is_approved ? (
                  <span className="text-xs tracking-widest px-3 py-1 bg-green-50 text-green-700 border border-green-200">
                    APPROVED
                  </span>
                ) : (
                  <span className="text-xs tracking-widest px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200">
                    PENDING APPROVAL
                  </span>
                )}
              </div>
              
              <div className="bg-white border border-[var(--color-ash)]/20 p-6 md:p-8">
                {latestSet.values && latestSet.values.length > 0 ? (
                  <div className="space-y-10">
                    {MEASUREMENT_GROUPS.map(group => {
                      const groupValues = latestSet.values!.filter(val => group.fields.includes(val.key));
                      
                      // Also capture any fields not in our groups to put them in an "Other" group later if needed,
                      // but for now, we just show mapped groups.
                      if (groupValues.length === 0) return null;
                      
                      return (
                        <div key={group.title}>
                          <h4 className="text-sm font-bold tracking-widest text-[var(--color-ash)] mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
                            {group.title}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {groupValues.map(val => (
                              <div key={val.id} className="pb-2">
                                <p className="text-xs font-bold tracking-widest text-[var(--color-black)] uppercase mb-1">
                                  {val.key.replace('_', ' ')}
                                </p>
                                <p className="text-sm text-[var(--color-black)]">
                                  {val.value} inches
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Render any "Other" fields that don't fit in the predefined groups */}
                    {(() => {
                      const knownFields = MEASUREMENT_GROUPS.flatMap(g => g.fields);
                      const otherValues = latestSet.values!.filter(val => !knownFields.includes(val.key));
                      if (otherValues.length === 0) return null;
                      return (
                        <div key="Other">
                          <h4 className="text-sm font-bold tracking-widest text-[var(--color-ash)] mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
                            Other
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {otherValues.map(val => (
                              <div key={val.id} className="pb-2">
                                <p className="text-xs font-bold tracking-widest text-[var(--color-black)] uppercase mb-1">
                                  {val.key.replace('_', ' ')}
                                </p>
                                <p className="text-sm text-[var(--color-black)]">
                                  {val.value} inches
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-[var(--color-ash)]/5">
                    <p className="text-[var(--color-black)] text-sm">
                      No dimensional values found for this set.
                    </p>
                  </div>
                )}
              </div>
              
              {sortedSets.length > 1 && (
                <div className="mt-12">
                  <h4 className="text-sm font-bold tracking-widest text-[var(--color-black)] mb-4 uppercase">
                    Measurement History
                  </h4>
                  <ul className="divide-y divide-[var(--color-ash)]/20 border border-[var(--color-ash)]/20 bg-white">
                    {sortedSets.slice(1).map(set => (
                      <li key={set.id} className="p-4 flex justify-between items-center text-sm">
                        <span className="text-[var(--color-black)] font-medium">Version {set.version}</span>
                        <span className="text-[var(--color-ash)]">{formatDate(set.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-ash)]/20 p-6 md:p-8">
          <div className="mb-8">
            <h3 className="font-display text-xl text-[var(--color-black)] mb-2">Record New Measurements</h3>
            <p className="text-sm text-[var(--color-ash)]">
              Enter the measurements exactly as provided by your tailor in inches. We will record this as a new version.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-10">
            {MEASUREMENT_GROUPS.map(group => (
              <div key={group.title}>
                <h4 className="text-sm font-bold tracking-widest text-[var(--color-ash)] mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                  {group.fields.map(field => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-xs font-medium tracking-widest text-[var(--color-black)] mb-2 uppercase">
                        {field.replace('_', ' ')}
                      </label>
                      <input
                        id={field}
                        type="number"
                        step="0.25"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full border border-[var(--color-ash)]/30 bg-white px-4 py-2 text-[var(--color-black)] focus:border-[var(--color-black)] focus:outline-none focus:ring-0 transition-colors"
                        placeholder="Inches"
                        disabled={isSubmitting}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--color-ash)]/20 flex justify-end">
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="w-full sm:w-auto bg-[var(--color-black)] text-[var(--color-white)] hover:bg-[var(--color-off-black)] px-8 py-3 tracking-widest"
            >
              SAVE VERSION
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
