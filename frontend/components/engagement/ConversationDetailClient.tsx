'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Conversation, Message, Style, StyleRequest } from '@/types/api';
import { ContextBanner } from './ContextBanner';
import { MessageFeed } from './MessageFeed';
import { MessageComposer } from './MessageComposer';
import { messagesApi } from '@/lib/api/messages';

interface ConversationDetailClientProps {
  initialConversation: Conversation;
  initialMessages: Message[];
  contextData: Style | StyleRequest | null;
  currentUserId: string;
}

export function ConversationDetailClient({ 
  initialConversation, 
  initialMessages, 
  contextData,
  currentUserId 
}: ConversationDetailClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isPolling, setIsPolling] = useState(true);
  
  // Ref for tracking the latest fetched message to avoid duplicates
  const latestMessageIdRef = useRef(initialMessages.length > 0 ? initialMessages[initialMessages.length - 1].id : null);
  
  // Ensure the latest message ID is updated if initialMessages changes
  useEffect(() => {
    if (messages.length > 0) {
      latestMessageIdRef.current = messages[messages.length - 1].id;
    }
  }, [messages]);

  const pollMessages = useCallback(async () => {
    if (document.visibilityState !== 'visible' || !isPolling) return;
    
    try {
      const response = await messagesApi.list(initialConversation.id, 1);
      const fetchedMessages = response.data; // Backend returns ASC (chronological) already
      
      if (fetchedMessages.length > 0) {
        setMessages(prev => {
          // Merge to prevent duplicates
          const newMap = new Map(prev.map(m => [m.id, m]));
          let addedNew = false;
          
          fetchedMessages.forEach(m => {
            if (!newMap.has(m.id)) {
              newMap.set(m.id, m);
              addedNew = true;
            }
          });
          
          if (addedNew) {
            // Re-sort chronologically
            return Array.from(newMap.values()).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          }
          
          return prev;
        });
      }
    } catch (error) {
      // Silently fail polling
    }
  }, [initialConversation.id, isPolling]);

  useEffect(() => {
    // Poll every 5 seconds
    const intervalId = setInterval(pollMessages, 5000);
    
    // Visibility change handler to throttle/stop polling when inactive
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsPolling(true);
        pollMessages(); // Immediate poll on return
      } else {
        setIsPolling(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pollMessages]);

  const handleSendMessage = async (content: string, attachmentIds: string[]) => {
    try {
      const response = await messagesApi.send(initialConversation.id, { content, attachment_ids: attachmentIds });
      // Optimistically append the real returned message
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      throw error; // Let composer handle error UI
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] border border-[var(--color-ash)]/20 bg-white">
      <div className="shrink-0">
        <ContextBanner 
          contextType={initialConversation.context_type} 
          contextData={contextData} 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--color-ash)]/5">
        <MessageFeed messages={messages} currentUserId={currentUserId} />
      </div>
      
      <div className="shrink-0">
        <MessageComposer onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
