import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MaterialForm } from '@/components/admin/MaterialForm';

export const metadata = {
  title: 'Create Material | Admin',
};

export default function NewMaterialPage() {
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
        <h2 className="font-display text-3xl font-bold tracking-widest text-[var(--color-black)]">
          CREATE MATERIAL
        </h2>
        <p className="text-sm text-[var(--color-ash)] font-light mt-2">
          Add a new sourcing material to the catalog.
        </p>
      </div>

      <MaterialForm />
    </div>
  );
}
