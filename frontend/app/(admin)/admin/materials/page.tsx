'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Material, PaginatedResponse } from '@/types/api';
import { materialsApi } from '@/lib/api/materials';
import { Plus, Edit3, Trash2, Layers } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/format';

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialsApi.getMaterials({ per_page: 50 });
      setMaterials(response.data);
    } catch (err) {
      setError('Failed to load materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        await materialsApi.deleteMaterial(id);
        setMaterials(materials.filter(m => m.id !== id));
      } catch (err) {
        alert('Failed to delete material.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[var(--color-ash)] border-t-[var(--color-black)] rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-[var(--color-ash)] uppercase tracking-widest font-medium">Loading Materials</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[var(--color-black)] font-medium mb-4">{error}</p>
        <button onClick={fetchMaterials} className="text-xs font-bold tracking-widest uppercase border-b border-[var(--color-black)]">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          {/* Layout handles the h1 page title */}
        </div>
        <Link 
          href="/admin/materials/new"
          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] bg-[var(--color-black)] text-white rounded-xl px-4 py-2.5 hover:bg-[var(--color-white)] hover:text-[var(--color-black)] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Material
        </Link>
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {materials.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <Layers className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No materials found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[11px] font-medium uppercase tracking-wider text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Material Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Availability</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--color-black)]">{material.name}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ash)]">
                      {material.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                        material.is_available 
                          ? 'bg-[var(--color-black)]/5 text-[var(--color-black)]' 
                          : 'bg-[var(--color-ash)]/10 text-[var(--color-ash)]'
                      }`}>
                        {material.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ash)]">
                      {formatDateTime(material.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/materials/${material.id}/edit`}
                          className="p-2 text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors rounded-lg hover:bg-[var(--color-light-ash)]/30"
                          title="Edit Material"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(material.id)}
                          className="p-2 text-[var(--color-ash)] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete Material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
