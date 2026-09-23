'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/api';

export function MessageFeed({ messages, currentUserId }: { messages: Message[], currentUserId: string }) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on load and when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--color-ash)]">
        <p className="text-sm">This is the start of your consultation.</p>
        <p className="text-sm mt-1">Send a message to speak with a tailor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-live="polite">
      {messages.map((message) => {
        const isMe = message.sender_id === currentUserId;
        const time = new Date(message.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        return (
          <div key={message.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? 'order-1' : 'order-1'}`}>
              <span className="text-[10px] text-[var(--color-ash)] mb-1 block px-1">
                {isMe ? 'YOU' : 'TAILOR'} • {time}
              </span>
              
              <div 
                className={`p-4 text-sm whitespace-pre-wrap ${
                  isMe 
                    ? 'bg-[var(--color-black)] text-[var(--color-white)]' 
                    : 'bg-white border border-[var(--color-ash)]/20 text-[var(--color-black)]'
                }`}
              >
                {message.content && <p>{message.content}</p>}
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className={`grid grid-cols-2 gap-2 ${message.content ? 'mt-3' : ''}`}>
                    {message.attachments.map(att => (
                      <a 
                        key={att.id} 
                        href={att.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`block relative overflow-hidden group ${isMe ? 'border-[var(--color-white)]/20' : 'border-[var(--color-ash)]/20'} border`}
                      >
                        {att.file_type.startsWith('image/') ? (
                          <img src={att.url} alt="Attachment" className="w-full h-24 object-cover group-hover:opacity-90 transition-opacity" />
                        ) : (
                          <div className={`flex flex-col items-center justify-center h-24 p-2 ${isMe ? 'bg-[var(--color-white)]/10 text-white' : 'bg-[var(--color-ash)]/5 text-[var(--color-black)]'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <span className="text-[10px] truncate w-full text-center px-1">{att.file_name}</span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
