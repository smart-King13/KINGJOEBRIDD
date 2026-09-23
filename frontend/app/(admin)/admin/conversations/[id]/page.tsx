'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Conversation, Message } from '@/types/api';
import { conversationsApi } from '@/lib/api/conversations';
import { messagesApi } from '@/lib/api/messages';

export default function AdminConversationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const convResponse = await conversationsApi.get(id as string);
        const convData = convResponse.data || (convResponse as any).data?.data || convResponse;
        setConversation(convData);

        const msgsResponse = await messagesApi.list(id as string);
        const msgsData = msgsResponse.data || (msgsResponse as any).data?.data || msgsResponse;
        
        if (Array.isArray(msgsData)) {
          // Assuming API returns newest first due to pagination, reverse for chat UI
          setMessages([...msgsData].reverse());
        }

        // Mark as read when opening
        await conversationsApi.markAsRead(id as string);

      } catch (err: any) {
        setError(err.message || 'Failed to load conversation');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !id) return;
    
    setIsSending(true);
    try {
      const response = await messagesApi.send(id as string, { content: replyText });
      const newMsg = response.data || (response as any).data?.data || response;
      setMessages(prev => [...prev, newMsg]);
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Conversation</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[var(--color-ash)]/20 rounded"></div>
          <div className="h-64 bg-[var(--color-ash)]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Conversation</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error || 'Conversation not found'}
        </div>
        <button onClick={() => router.back()} className="text-sm underline">
          &larr; Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] -mt-6">
      
      {/* Header */}
      <div className="flex-none bg-[var(--color-white)] border-b border-[var(--color-ash)]/20 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin/conversations" className="text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors mr-2">
              &larr;
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                {conversation.user ? conversation.user.name : 'Unknown Customer'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[var(--color-ash)]">
                  {conversation.user?.email}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border border-[var(--color-ash)]/30 rounded text-[var(--color-ash)]">
                  {conversation.context_type.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Context Link & Actions */}
        <div className="flex gap-2">
          {conversation.context_type === 'style_request' && (
            <Link href={`/admin/requests/${conversation.context_id}`} className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] px-3 py-1.5 hover:bg-[var(--color-black)] hover:text-white transition-colors rounded">
              View Request
            </Link>
          )}
          <Link href={`/admin/quotes/new?user_id=${conversation.user_id}&conversation_id=${conversation.id}`} className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] bg-[var(--color-black)] text-white px-3 py-1.5 hover:bg-[var(--color-black)]/80 transition-colors rounded">
            Create Quote
          </Link>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-white)]/50 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-[var(--color-ash)]">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((msg) => {
            // Because admin sender_id logic in backend: if sender_id != user_id, it's admin.
            // Or if sender_id === user_id, it's the customer.
            // Wait, earlier I noticed backend ConversationController markAsRead uses "sender_id != request->user()->id".
            // Since we are admin, if sender_id matches the conversation's customer ID, it's from the customer.
            const isCustomer = msg.sender_id === conversation.user_id;

            return (
              <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-ash)]">
                    {isCustomer ? (conversation.user?.name || 'Customer') : 'You'}
                  </span>
                  <span className="text-xs text-[var(--color-ash)]/60">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className={`max-w-[75%] px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${
                  isCustomer 
                    ? 'bg-[var(--color-ash)]/10 text-[var(--color-black)] rounded-tl-none' 
                    : 'bg-[var(--color-black)] text-white rounded-tr-none'
                }`}>
                  {msg.content}
                </div>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div className={`mt-2 flex gap-2 ${isCustomer ? 'justify-start' : 'justify-end'} w-full max-w-[75%]`}>
                    {msg.attachments.map(att => (
                      <a key={att.id} href={att.url} target="_blank" rel="noreferrer" className={`block p-2 border rounded hover:opacity-80 transition-opacity ${
                        isCustomer ? 'border-[var(--color-ash)]/20' : 'border-[var(--color-ash)]/20 bg-[var(--color-white)]'
                      }`}>
                        {att.file_type.startsWith('image/') ? (
                          <img src={att.url} alt={att.file_name} className="w-20 h-20 object-cover rounded" />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-[var(--color-ash)]/5 rounded">
                            <span className="text-[10px] font-bold uppercase">{att.file_type.split('/')[1] || 'FILE'}</span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none bg-[var(--color-white)] border-t border-[var(--color-ash)]/20 p-4">
        <form onSubmit={handleSend} className="flex gap-4 max-w-4xl mx-auto">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-[var(--color-ash)]/30 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-[var(--color-black)] min-h-[60px]"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={isSending || !replyText.trim()}
              className="bg-[var(--color-black)] text-white text-[12px] font-bold tracking-widest uppercase px-6 py-3 rounded hover:bg-[var(--color-black)]/80 disabled:opacity-50 transition-colors"
            >
              {isSending ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
