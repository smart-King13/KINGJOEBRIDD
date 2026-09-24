'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Style } from '@/types/api';
import { stylesApi } from '@/lib/api/styles';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

interface StyleCardProps {
  style: Style;
}

export function StyleCard({ style }: StyleCardProps) {
  const primaryImage = style.images?.find(img => img.is_primary) || style.images?.[0];
  const [isSaved, setIsSaved] = useState(style.is_saved);
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/explore`);
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    const previousState = isSaved;
    
    // Optimistic UI update
    setIsSaved(!isSaved);

    try {
      if (previousState) {
        await stylesApi.unsaveStyle(style.id);
      } else {
        await stylesApi.saveStyle(style.id);
      }
    } catch (error) {
      // Revert on failure
      setIsSaved(previousState);
      console.error('Failed to toggle save state', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Link href={`/styles/${style.slug}`} className="group block relative overflow-hidden bg-transparent">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--color-ash)]/10 shadow-sm transition-shadow duration-700 group-hover:shadow-xl">
        {primaryImage ? (
          <Image
            src={primaryImage.storage_path || primaryImage.file_path}
            alt={style.name}
            fill
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--color-ash)]/10">
            <span className="text-xs text-[var(--color-ash)] font-medium tracking-widest uppercase">No Image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        
        <button
          onClick={handleSaveToggle}
          disabled={isSaving}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-white)]/90 shadow-sm backdrop-blur transition-all duration-300 hover:bg-[var(--color-black)] hover:text-white hover:scale-110 active:scale-95 disabled:opacity-70"
          aria-label={isSaved ? "Unsave style" : "Save style"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const imgUrl = (primaryImage as any)?.url || (primaryImage as any)?.storage_path || primaryImage?.file_path;
              if (imgUrl) {
                router.push(`/style-requests/new?external_style=${encodeURIComponent(imgUrl)}`);
              } else {
                router.push(`/style-requests/new?style_id=${style.id}`);
              }
            }}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white/95 backdrop-blur-md px-4 text-xs font-bold uppercase tracking-widest text-[var(--color-black)] shadow-lg transition-colors hover:bg-white"
          >
            I WANT THIS
          </button>
        </div>
      </div>

      <div className="py-5 px-1">
        {style.category && (
          <p className="text-xs font-bold tracking-[0.15em] text-[var(--color-ash)] uppercase mb-2">
            {style.category.name}
          </p>
        )}
        <h3 className="font-display text-xl text-[var(--color-black)] leading-tight group-hover:text-[var(--color-off-black)] transition-colors">
          {style.name}
        </h3>
      </div>
    </Link>
  );
}
