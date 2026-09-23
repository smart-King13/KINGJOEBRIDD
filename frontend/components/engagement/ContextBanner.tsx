import React from 'react';
import Link from 'next/link';
import { Style, StyleRequest } from '@/types/api';

interface ContextBannerProps {
  contextType: 'style' | 'style_request' | 'order';
  contextData: Style | StyleRequest | null;
}

export function ContextBanner({ contextType, contextData }: ContextBannerProps) {
  if (!contextData) return null;

  if (contextType === 'style') {
    const style = contextData as Style;
    const primaryImage = style.images?.find(i => i.is_primary) || style.images?.[0];
    
    return (
      <div className="bg-[var(--color-white)]/30 border border-[var(--color-ash)]/20 p-4 flex gap-4 items-center">
        {primaryImage && (
          <div className="w-16 h-16 shrink-0 bg-white">
            <img 
              src={primaryImage.file_path.startsWith('http') ? primaryImage.file_path : `${process.env.NEXT_PUBLIC_API_URL}${primaryImage.file_path}`} 
              alt={style.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs tracking-widest text-[var(--color-ash)] mb-1">STYLE REFERENCE</p>
          <h3 className="font-display font-medium text-[var(--color-black)] text-lg line-clamp-1">{style.name}</h3>
        </div>
        <Link 
          href={`/styles/${style.slug}`}
          className="text-xs font-medium tracking-widest border border-[var(--color-black)] px-4 py-2 hover:bg-[var(--color-ash)]/10 transition-colors"
        >
          VIEW STYLE
        </Link>
      </div>
    );
  }

  if (contextType === 'style_request') {
    const request = contextData as StyleRequest;
    return (
      <div className="bg-[var(--color-white)]/30 border border-[var(--color-ash)]/20 p-4 flex gap-4 items-center">
        <div className="flex-1">
          <p className="text-xs tracking-widest text-[var(--color-ash)] mb-1">CUSTOM REQUEST</p>
          <h3 className="font-display font-medium text-[var(--color-black)] text-lg line-clamp-1">Style Request</h3>
        </div>
        <Link 
          href={`/account/requests/${request.id}`}
          className="text-xs font-medium tracking-widest border border-[var(--color-black)] px-4 py-2 hover:bg-[var(--color-ash)]/10 transition-colors"
        >
          VIEW DETAILS
        </Link>
      </div>
    );
  }

  return null;
}
