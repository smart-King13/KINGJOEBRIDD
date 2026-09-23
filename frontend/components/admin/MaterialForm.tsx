'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Material } from '@/types/api';
import { materialsApi } from '@/lib/api/materials';

interface MaterialFormProps {
  initialData?: Material;
  isEdit?: boolean;
}

export function MaterialForm({ initialData, isEdit = false }: MaterialFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    is_available: initialData?.is_available !== false, // default true
    requires_sourcing: (initialData as any)?.requires_sourcing || false, // assuming this might exist based on controller
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && initialData) {
        await materialsApi.updateMaterial(initialData.id, formData);
      } else {
        await materialsApi.createMaterial(formData);
      }
      
      router.push('/admin/materials');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-[var(--color-white)] p-8 rounded-xl border border-[var(--color-light-ash)] shadow-sm">
      {error && (
        <div className="p-4 bg-[var(--color-black)]/5 border border-[var(--color-black)] text-[var(--color-black)] text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Material Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors"
            placeholder="e.g. Italian Wool"
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Type / Category</label>
          <input
            type="text"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors"
            placeholder="e.g. Fabric, Button, Thread"
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors resize-none"
            placeholder="Material characteristics, origin, etc."
          />
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-5 h-5 accent-[var(--color-black)] bg-[var(--color-white)] border-[var(--color-light-ash)] rounded cursor-pointer"
            />
            <label htmlFor="is_available" className="text-sm font-medium text-[var(--color-black)] cursor-pointer select-none">
              Material is currently available for sourcing
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requires_sourcing"
              checked={formData.requires_sourcing}
              onChange={(e) => setFormData({ ...formData, requires_sourcing: e.target.checked })}
              className="w-5 h-5 accent-[var(--color-black)] bg-[var(--color-white)] border-[var(--color-light-ash)] rounded cursor-pointer"
            />
            <label htmlFor="requires_sourcing" className="text-sm font-medium text-[var(--color-black)] cursor-pointer select-none">
              Requires external sourcing (longer lead time)
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--color-light-ash)] flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-[var(--color-black)] text-[var(--color-white)] text-xs font-bold tracking-widest uppercase rounded-md hover:bg-[var(--color-ash)] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Material' : 'Create Material')}
        </button>
      </div>
    </form>
  );
}
