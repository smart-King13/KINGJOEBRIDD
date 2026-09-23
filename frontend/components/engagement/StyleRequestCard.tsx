import React from 'react';
import Link from 'next/link';
import { StyleRequest } from '@/types/api';

export function StyleRequestCard({ request }: { request: StyleRequest }) {
  const date = new Date(request.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link 
      href={`/account/requests/${request.id}`}
      className="block group border border-[var(--color-ash)]/20 bg-white hover:bg-[var(--color-white)]/30 transition-colors p-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="font-display text-xl font-medium text-[var(--color-black)] group-hover:text-[var(--color-off-black)] line-clamp-1">
          Style Request
        </h3>
        <span className="text-xs uppercase tracking-widest px-3 py-1 bg-[var(--color-ash)]/10 text-[var(--color-black)]">
          {request.status.replace('_', ' ')}
        </span>
      </div>
      
      <p className="text-sm text-[var(--color-ash)] line-clamp-2 mb-4">
        {request.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-[var(--color-ash)] border-t border-[var(--color-ash)]/10 pt-4">
        <div className="flex items-center gap-4">
          <span>{date}</span>
          {request.attachments && request.attachments.length > 0 && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>
              {request.attachments.length} files
            </span>
          )}
        </div>
        
        <span className="font-medium text-[var(--color-black)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
