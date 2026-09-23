'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MaterialForm } from '@/components/admin/MaterialForm';
import { materialsApi } from '@/lib/api/materials';
import { Material } from '@/types/api';

export default function EditMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await materialsApi.getMaterial(resolvedParams.id);
        setMaterial(response.data);
      } catch (err) {
        setError('Failed to load material.');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[var(--color-ash)] border-t-[var(--color-black)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[var(--color-black)] font-medium mb-4">{error || 'Material not found'}</p>
        <Link href="/admin/materials" className="text-xs font-bold tracking-widest uppercase border-b border-[var(--color-black)]">Back to Materials</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="border-b border-[var(--color-light-ash)] pb-4">
        <Link 
          href="/admin/materials"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] uppercase mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Materials
        </Link>
        <h2 className="font-display text-3xl font-bold tracking-widest text-[var(--color-black)] uppercase">
          EDIT: {material.name}
        </h2>
      </div>

      <MaterialForm initialData={material} isEdit />
    </div>
  );
}
