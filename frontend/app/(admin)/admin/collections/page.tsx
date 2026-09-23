'use client';

import React, { useEffect, useState } from 'react';
import { Collection, ApiResponse } from '@/types/api';
import { collectionsApi } from '@/lib/api/collections';
import { AlertCircle, Library } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await collectionsApi.getCollections();
      // Collections API returns ApiResponse<Collection[]>, so data is an array
      setCollections(response.data);
    } catch (err) {
      setError('Failed to load collections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[var(--color-ash)] border-t-[var(--color-black)] rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-[var(--color-ash)] uppercase tracking-widest font-medium">Loading Collections</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[var(--color-black)] font-medium mb-4">{error}</p>
        <button onClick={fetchCollections} className="text-xs font-bold tracking-widest uppercase border-b border-[var(--color-black)]">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="p-4 bg-[var(--color-black)]/5 border border-[var(--color-light-ash)] rounded-2xl flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-[var(--color-black)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--color-black)] leading-relaxed">
          <strong>Read-only View:</strong> Collection management is not currently supported in this phase. You can view the existing collections that are available for associating with styles.
        </p>
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {collections.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <Library className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No collections found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[11px] font-medium uppercase tracking-wider text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Collection Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--color-black)]">{collection.name}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ash)]">
                      {collection.slug}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
