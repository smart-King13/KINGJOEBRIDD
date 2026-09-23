import React from 'react';
import Link from 'next/link';
import { Conversation } from '@/types/api';

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl bg-[var(--color-white)]/80 backdrop-blur-md shadow-lg border border-[var(--color-light-ash)] group overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-[var(--color-ash)] mb-6 animate-float relative z-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
        <h3 className="font-display text-2xl text-[var(--color-black)] mb-3 relative z-10 tracking-wide">No active consultations</h3>
        <p className="text-[var(--color-ash)] text-sm mb-8 max-w-md mx-auto relative z-10">
          You don't have any active consultations yet. Browse our library or submit a custom request to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link 
            href="/explore"
            className="inline-flex items-center justify-center px-8 py-3 bg-[var(--color-black)] text-[var(--color-white)] text-xs font-medium tracking-widest uppercase rounded-sm hover:opacity-80 transition-opacity"
          >
            EXPLORE STYLES
          </Link>
          <Link 
            href="/style-requests/new"
            className="inline-flex items-center justify-center px-8 py-3 bg-[var(--color-white)] text-[var(--color-black)] border border-[var(--color-black)] text-xs font-medium tracking-widest uppercase rounded-sm hover:bg-[var(--color-black)] hover:text-[var(--color-white)] transition-colors"
          >
            CUSTOM REQUEST
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {conversations.map((conversation, index) => {
        const lastActivityDate = new Date(conversation.updated_at);
        const isToday = new Date().toDateString() === lastActivityDate.toDateString();
        
        const displayDate = isToday 
          ? lastActivityDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : lastActivityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <li key={conversation.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
            <Link 
              href={`/account/conversations/${conversation.id}`}
              className="block p-4 sm:p-6 border border-[var(--color-light-ash)] bg-[var(--color-white)]/80 backdrop-blur-sm rounded-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex justify-between items-start mb-1">
                <h4 className="font-display font-medium text-[var(--color-black)] text-lg capitalize flex items-center gap-2">
                  {conversation.context_type.replace('_', ' ')}
                </h4>
                <span className="text-xs text-[var(--color-ash)] whitespace-nowrap ml-4 font-mono">
                  {displayDate}
                </span>
              </div>
              
              <div className="relative z-10 flex items-center justify-between mt-2">
                <p className="text-sm text-[var(--color-ash)] line-clamp-1 flex-1 pr-4">
                  {conversation.latest_message 
                    ? (conversation.latest_message.sender_id === conversation.user_id ? 'You: ' : 'Tailor: ') + (conversation.latest_message.content || 'Sent an attachment')
                    : 'Consultation started'}
                </p>
                {conversation.latest_message && !conversation.latest_message.is_read && conversation.latest_message.sender_id !== conversation.user_id && (
                  <div className="w-2.5 h-2.5 bg-[var(--color-black)] rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]"></div>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
