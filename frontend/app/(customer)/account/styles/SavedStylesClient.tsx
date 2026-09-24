'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Style, PaginationMeta } from '@/types/api';
import { StyleLibrary } from '@/components/styles/StyleLibrary';
import { fallbackFashionData } from '@/lib/fashion-data';

interface SavedStylesClientProps {
  initialStyles: Style[];
  initialMeta: PaginationMeta;
  search?: string;
}

export function SavedStylesClient({ initialStyles, initialMeta, search }: SavedStylesClientProps) {
  const [styles, setStyles] = useState<Style[]>(initialStyles);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read from localStorage to support frontend demo mode
    const savedIds = JSON.parse(localStorage.getItem('kj_saved_styles') || '[]');
    
    // Find mock styles that are saved
    const localSavedStyles = fallbackFashionData
      .filter(style => savedIds.includes(style.id))
      .map(pinterestStyle => ({
        id: pinterestStyle.id,
        name: pinterestStyle.title,
        slug: pinterestStyle.id,
        description: 'Bespoke design from the KINGJOEBRIDD archives.',
        collection_id: '',
        category_id: '',
        is_published: true,
        images: [{ 
          id: 'mock', 
          style_id: pinterestStyle.id, 
          url: pinterestStyle.imageUrl, 
          file_path: pinterestStyle.imageUrl, 
          storage_path: pinterestStyle.imageUrl,
          is_primary: true, 
          order: 0 
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

    // Merge API styles and local mock styles
    const allStyles = [...initialStyles];
    localSavedStyles.forEach(localStyle => {
      if (!allStyles.find(s => s.id === localStyle.id)) {
        allStyles.push(localStyle as unknown as Style);
      }
    });

    setStyles(allStyles);
    setIsLoaded(true);
  }, [initialStyles]);

  if (!isLoaded) {
    return null; // Avoid hydration mismatch flash
  }

  if (styles.length === 0 && !search) {
    return (
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
    );
  }

  return (
    <StyleLibrary 
      initialStyles={styles}
      initialMeta={initialMeta}
      categories={[]} // Not filtering by category here based on API limitation
      currentSearch={search}
      fetchEndpoint="saved"
    />
  );
}
