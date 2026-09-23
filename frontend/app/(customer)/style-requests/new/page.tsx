import React from 'react';
import { StyleRequestForm } from '@/components/engagement/StyleRequestForm';

export const metadata = {
  title: 'Show Us Your Style | KINGJOEBRIDD FASHION',
};

export default function NewStyleRequestPage({
  searchParams,
}: {
  searchParams: { style_id?: string; external_style?: string };
}) {
  return (
    <div className="min-h-screen bg-[var(--color-white)] sm:bg-transparent">
      <div className="max-w-3xl mx-auto py-8 px-6 sm:py-12 sm:px-6">
        <div className="sm:bg-[var(--color-white)] sm:p-12 sm:rounded-3xl sm:border sm:border-[var(--color-light-ash)]/60 sm:shadow-xl sm:shadow-[var(--color-black)]/[0.03]">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-widest text-[var(--color-black)] mb-2">
              NEW STYLE REQUEST
            </h1>
            <p className="text-[var(--color-ash)] text-sm sm:text-base">
              Tell us about the bespoke piece you'd like us to create for you.
            </p>
          </div>

          <StyleRequestForm styleId={searchParams.style_id} externalStyle={searchParams.external_style} />
        </div>
      </div>
    </div>
  );
}
