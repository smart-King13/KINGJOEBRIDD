import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { PaginatedResponse, Conversation } from '@/types/api';

export const metadata = {
  title: 'Consultations | KINGJOEBRIDD FASHION',
};

async function getConversations() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}/api/v1/conversations`, {
    headers: {
      'Cookie': cookieHeader,
      'Accept': 'application/json',
    },
    cache: 'no-store', // Always fetch fresh to get accurate latest message and ordering
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error('Failed to fetch conversations');
  }

  return res.json() as Promise<PaginatedResponse<Conversation>>;
}

export default async function ConversationsPage() {
  const conversations = await getConversations();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
          Your Consultations
        </div>
      </div>

      {!conversations || conversations.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl bg-[var(--color-white)]/80 backdrop-blur-md shadow-lg border border-[var(--color-light-ash)] group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-[var(--color-ash)] mb-6 animate-float relative z-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-3 relative z-10 tracking-wide">No active consultations</h3>
          <p className="text-[var(--color-ash)] text-sm max-w-md mx-auto relative z-10">
            You don't have any active consultations yet. Browse our library or submit a custom request to get started.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-bold">Consultation Subject</th>
                  <th className="px-6 py-4 font-bold">Last Activity</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {conversations.data.map((conversation) => {
                  const lastActivityDate = new Date(conversation.updated_at);
                  const isToday = new Date().toDateString() === lastActivityDate.toDateString();
                  const displayDate = isToday 
                    ? lastActivityDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    : lastActivityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <tr key={conversation.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ash)]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          </div>
                          <div>
                            <div className="font-bold text-[var(--color-black)] uppercase tracking-wide">
                              {conversation.context_type.replace('_', ' ')}
                            </div>
                            <div className="text-[var(--color-ash)] text-xs mt-1 truncate max-w-[200px] sm:max-w-xs">
                              {conversation.latest_message 
                                ? (conversation.latest_message.sender_id === conversation.user_id ? 'You: ' : 'Tailor: ') + (conversation.latest_message.content || 'Sent an attachment')
                                : 'Consultation started'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-black)] font-bold">
                          {displayDate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-background-subtle)] text-[var(--color-black)] border border-[var(--color-light-ash)]/40`}>
                          {conversation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/account/conversations/${conversation.id}`}
                          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:text-[var(--color-black)] text-[var(--color-ash)] transition-colors inline-block relative"
                        >
                          {conversation.latest_message && !conversation.latest_message.is_read && conversation.latest_message.sender_id !== conversation.user_id && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--color-black)] rounded-full"></span>
                          )}
                          Enter
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
