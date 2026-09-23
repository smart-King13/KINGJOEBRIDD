import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StyleForm } from '@/components/admin/StyleForm';

export const metadata = {
  title: 'Create Style | Admin',
};

export default function NewStylePage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="border-b border-[var(--color-light-ash)] pb-4">
        <Link 
          href="/admin/styles"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] uppercase mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Styles
        </Link>
        <h2 className="font-display text-3xl font-bold tracking-widest text-[var(--color-black)]">
          CREATE STYLE
        </h2>
        <p className="text-sm text-[var(--color-ash)] font-light mt-2">
          Add a new bespoke style to the catalog.
        </p>
      </div>

      <StyleForm />
    </div>
  );
}
