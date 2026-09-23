import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { StyleRequest, ApiResponse } from '@/types/api';
import { DeleteRequestButton } from '@/components/engagement/DeleteRequestButton';

export const metadata = {
  title: 'Style Request Details | KINGJOEBRIDD FASHION',
};

async function getStyleRequest(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('kb_session')?.value;
  
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${apiUrl}/api/v1/style-requests/${id}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 403) return null;
    const errText = await res.text();
    throw new Error(`Failed to fetch style request: ${res.status} ${res.statusText} - ${errText}`);
  }

  const json = await res.json() as ApiResponse<StyleRequest>;
  return json.data;
}

export default async function StyleRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const request = await getStyleRequest(resolvedParams.id);

  if (!request) {
    notFound();
  }

  const date = new Date(request.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      <div>
        <Link 
          href="/account/requests" 
          className="inline-flex items-center text-xs font-bold tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO REQUESTS
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <h1 className="font-display text-4xl font-medium text-[var(--color-black)]">
            Style Request
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-4 py-2 bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)] rounded-full">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-black)]">
                {request.status.replace('_', ' ')}
              </span>
            </div>
            <DeleteRequestButton id={request.id} />
          </div>
        </div>
        <p className="text-sm text-[var(--color-ash)]">Submitted on {date}</p>
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-2xl p-6 md:p-10 shadow-sm space-y-10">
        
        {/* Description Section */}
        <div>
          <h4 className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--color-ash)] mb-3 uppercase">DESCRIPTION</h4>
          <p className="text-[var(--color-black)] whitespace-pre-wrap text-base sm:text-lg leading-relaxed font-light">
            {request.description}
          </p>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[var(--color-light-ash)]/60">
          <div>
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">PREFERRED COLOR</h4>
            <p className="text-[var(--color-black)] text-base font-medium">
              {request.preferred_color || 'Not specified'}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">PREFERRED MATERIAL</h4>
            <p className="text-[var(--color-black)] text-base font-medium">
              {request.preferred_material || 'Not specified'}
            </p>
          </div>
          
          <div className="sm:col-span-2">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--color-ash)] mb-2 uppercase">SOURCING PREFERENCE</h4>
            <p className="text-[var(--color-black)] text-base font-medium">
              {request.sourcing_preference 
                ? request.sourcing_preference.replace('_', ' ').toUpperCase()
                : 'Not specified'}
            </p>
          </div>
        </div>

        {/* Notes Section */}
        {request.notes && (
          <div className="pt-8 border-t border-[var(--color-light-ash)]/60">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--color-ash)] mb-3 uppercase">ADDITIONAL NOTES</h4>
            <div className="bg-[var(--color-background-subtle)]/50 p-6 rounded-2xl border border-[var(--color-light-ash)]/50">
              <p className="text-[var(--color-black)] text-sm whitespace-pre-wrap leading-relaxed">
                {request.notes}
              </p>
            </div>
          </div>
        )}

        {/* Attachments Section */}
        {request.attachments && request.attachments.length > 0 && (
          <div className="pt-8 border-t border-[var(--color-light-ash)]/60">
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--color-ash)] mb-4 uppercase">ATTACHMENTS ({request.attachments.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {request.attachments.map(attachment => (
                <div key={attachment.id} className="group relative rounded-xl overflow-hidden border border-[var(--color-light-ash)] bg-[var(--color-background-subtle)]/50 shadow-sm hover:shadow-md transition-all duration-300">
                  {attachment.file_type.startsWith('image/') ? (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block relative aspect-square">
                      <img 
                        src={attachment.url} 
                        alt={attachment.file_name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </a>
                  ) : (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center aspect-square p-4 text-center hover:bg-[var(--color-white)] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-[var(--color-ash)] group-hover:text-[var(--color-black)] transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <span className="text-xs truncate w-full font-medium text-[var(--color-black)]">{attachment.file_name}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
