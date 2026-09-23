import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { StyleRequestCard } from '@/components/engagement/StyleRequestCard';
import { PaginatedResponse, StyleRequest } from '@/types/api';
import { buttonClasses } from '@/components/ui/Button';
import { DeleteRequestButton } from '@/components/engagement/DeleteRequestButton';

export const metadata = {
  title: 'My Style Requests | KINGJOEBRIDD FASHION',
};

async function getStyleRequests() {
  const cookieStore = await cookies();
  const token = cookieStore.get('kb_session')?.value;
  
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${apiUrl}/api/v1/style-requests`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error('Failed to fetch style requests');
  }

  return res.json() as Promise<PaginatedResponse<StyleRequest>>;
}

export default async function StyleRequestsPage() {
  const requests = await getStyleRequests();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
          Your Style Requests
        </div>
        <Link 
          href="/style-requests/new"
          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] rounded-lg px-4 py-2 hover:bg-[var(--color-black)] hover:text-white transition-colors"
        >
          New Request
        </Link>
      </div>

      {!requests || requests.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl bg-[var(--color-white)]/80 backdrop-blur-md shadow-lg border border-[var(--color-light-ash)] group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-[var(--color-ash)] mb-6 animate-float relative z-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-3 relative z-10 tracking-wide">No style requests yet</h3>
          <p className="text-[var(--color-ash)] text-sm mb-8 max-w-md mx-auto relative z-10">
            You haven't submitted any custom style requests. Have an inspiration you want us to bring to life?
          </p>
          <Link 
            href="/style-requests/new"
            className="relative z-10 inline-flex items-center justify-center px-8 py-3 bg-[var(--color-white)] text-[var(--color-black)] border border-[var(--color-black)] text-xs font-medium tracking-widest uppercase rounded-sm hover:bg-[var(--color-black)] hover:text-[var(--color-white)] transition-colors"
          >
            SHOW US YOUR STYLE
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-bold">Request Details</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Preferences</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {requests.data.map((request) => (
                  <tr key={request.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ash)]"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M10 4v4"></path><path d="M2 8h20"></path><path d="M6 4v4"></path></svg>
                        </div>
                        <div>
                          <div className="font-bold text-[var(--color-black)] tracking-wide">
                            {request.description ? request.description.substring(0, 30) + '...' : 'Custom Style Request'}
                          </div>
                          <div className="text-[var(--color-ash)] text-[10px] mt-1 uppercase tracking-widest">
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)]/40 text-[var(--color-black)]`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-[var(--color-ash)] uppercase tracking-widest">
                        {request.preferred_color && <div className="truncate w-32">Color: {request.preferred_color}</div>}
                        {request.preferred_material && <div className="truncate w-32 mt-1">Material: {request.preferred_material}</div>}
                        {!request.preferred_color && !request.preferred_material && 'No preferences'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/account/requests/${request.id}`}
                        className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:text-[var(--color-black)] text-[var(--color-ash)] transition-colors inline-block"
                      >
                        View
                      </Link>
                      <DeleteRequestButton id={request.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
