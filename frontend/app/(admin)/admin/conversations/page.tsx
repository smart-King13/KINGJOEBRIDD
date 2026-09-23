'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Conversation } from '@/types/api';
import { conversationsApi } from '@/lib/api/conversations';
import { MessageSquare } from 'lucide-react';

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await conversationsApi.list();
        if (response.data && Array.isArray(response.data)) {
          setConversations(response.data);
        } else if (response.data && Array.isArray((response.data as any).data)) {
          setConversations((response.data as any).data);
        } else if (Array.isArray(response as any)) {
          setConversations(response as any);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-10 bg-[var(--color-ash)]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {conversations.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <MessageSquare className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No active conversations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-background-subtle)] text-[var(--color-ash)] border-b border-[var(--color-light-ash)]/40">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Customer</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Context</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Latest Message</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Updated</th>
                  <th className="px-6 py-4 text-right font-medium uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {conversations.map((conv) => {
                  const lastMessage = conv.messages && conv.messages.length > 0 
                    ? conv.messages[conv.messages.length - 1] 
                    : null;
                  
                  return (
                    <tr key={conv.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        {conv.user ? (
                          <div>
                            <div className="font-medium text-[var(--color-black)] mb-1">{conv.user.name}</div>
                            <div className="text-[11px] text-[var(--color-ash)]">{conv.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-[var(--color-ash)] text-xs italic">Unknown Customer</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold tracking-widest uppercase border border-[var(--color-ash)]/30 rounded-lg text-[var(--color-ash)] shadow-sm">
                          {conv.context_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {lastMessage ? (
                          <div className="max-w-[300px]">
                            <div className="truncate text-[var(--color-black)]">
                              {lastMessage.content}
                            </div>
                            <div className="text-[10px] text-[var(--color-ash)] mt-1 uppercase tracking-widest">
                              From: {lastMessage.sender_id === conv.user_id ? 'Customer' : 'Admin'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[var(--color-ash)] text-xs italic">No messages</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-ash)] text-xs">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/conversations/${conv.id}`}
                          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 text-[var(--color-ash)] hover:text-[var(--color-black)] hover:border-[var(--color-black)] transition-colors inline-block"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
