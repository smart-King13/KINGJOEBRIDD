import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ConversationDetailClient } from '@/components/engagement/ConversationDetailClient';
import { ApiResponse, PaginatedResponse, Conversation, Message, Style, StyleRequest, User } from '@/types/api';

export const metadata = {
  title: 'Consultation | KINGJOEBRIDD FASHION',
};

async function getAuthUser(token: string | undefined) {
  if (!token) return null;
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const json = await res.json() as ApiResponse<User>;
  return json.data;
}

async function getConversationAndMessages(id: string, token: string | undefined) {
  if (!token) return null;
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const [convoRes, messagesRes] = await Promise.all([
    fetch(`${apiUrl}/api/v1/conversations/${id}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      cache: 'no-store'
    }),
    fetch(`${apiUrl}/api/v1/conversations/${id}/messages?per_page=100`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      cache: 'no-store'
    })
  ]);

  if (!convoRes.ok) {
    if (convoRes.status === 404 || convoRes.status === 403 || convoRes.status === 401) return null;
    throw new Error('Failed to fetch conversation');
  }

  const convoJson = await convoRes.json() as ApiResponse<Conversation>;
  const messagesJson = await messagesRes.json() as PaginatedResponse<Message>;

  return {
    conversation: convoJson.data,
    messages: messagesJson.data
  };
}

async function getContextData(type: string, id: string, token: string | undefined) {
  if (!token) return null;
  let endpoint = '';
  if (type === 'style') endpoint = `/api/v1/styles/${id}`;
  else if (type === 'style_request') endpoint = `/api/v1/style-requests/${id}`;
  else return null;

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('kb_session')?.value;

  const user = await getAuthUser(token);
  if (!user) return notFound();

  const data = await getConversationAndMessages(resolvedParams.id, token);
  if (!data) notFound();

  const contextData = await getContextData(data.conversation.context_type, data.conversation.context_id, token);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/account/conversations" 
          className="text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO CONSULTATIONS
        </Link>
      </div>
      
      <ConversationDetailClient 
        initialConversation={data.conversation}
        initialMessages={data.messages}
        contextData={contextData}
        currentUserId={user.id}
      />
    </div>
  );
}
