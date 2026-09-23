import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { stylesApi } from '@/lib/api/styles';
import { StyleLibrary } from '@/components/styles/StyleLibrary';
import { buttonClasses } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'My Saved Styles | KINGJOEBRIDD',
  description: 'Your personal collection of KINGJOEBRIDD inspiration.',
};

export default async function SavedStylesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  // Fetch initial saved styles data server-side
  let initialStyles: import('@/types/api').Style[] = [];
  let initialMeta = { current_page: 1, last_page: 1, per_page: 15, total: 0 };
  
  try {
    const response = await stylesApi.getSavedStyles({ page, search });
    initialStyles = response.data;
    if (response.meta) {
      initialMeta = response.meta;
    }
  } catch (error) {
    console.error('Failed to load saved styles', error);
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
          Your Saved Styles
        </div>
      </div>

      {initialStyles.length === 0 && !search ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl bg-[var(--color-white)]/80 backdrop-blur-md shadow-lg border border-[var(--color-light-ash)] group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            className="w-16 h-16 mb-6 text-[var(--color-ash)] animate-float relative z-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <h2 className="font-display text-2xl text-[var(--color-black)] mb-3 relative z-10 tracking-wide">
            Your style library is waiting.
          </h2>
          <p className="text-[var(--color-ash)] max-w-md mx-auto mb-8 relative z-10 text-sm">
            Explore our collection and save the designs that inspire you. We'll keep them here for when you're ready to create.
          </p>
          <Link 
            href="/explore" 
            className="relative z-10 inline-flex items-center justify-center px-8 py-3 bg-[var(--color-black)] text-[var(--color-white)] text-xs font-medium tracking-widest uppercase rounded-sm hover:opacity-80 transition-opacity"
          >
            EXPLORE STYLES
          </Link>
        </div>
      ) : (
        <StyleLibrary 
          initialStyles={initialStyles}
          initialMeta={initialMeta}
          categories={[]} // Not filtering by category here based on API limitation (GET /saved-styles only supports search/page)
          currentSearch={search}
          fetchEndpoint="saved"
        />
      )}
    </div>
  );
}
