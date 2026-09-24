import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { stylesApi } from '@/lib/api/styles';
import { StyleLibrary } from '@/components/styles/StyleLibrary';
import { buttonClasses } from '@/components/ui/Button';
import { SavedStylesClient } from './SavedStylesClient';

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

      <SavedStylesClient initialStyles={initialStyles} initialMeta={initialMeta} search={search} />
    </div>
  );
}
