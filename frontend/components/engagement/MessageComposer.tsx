'use client';

import React, { useState, useRef } from 'react';
import { AttachmentUploader } from './AttachmentUploader';
import { Attachment } from '@/types/api';
import { Button } from '@/components/ui/Button';

interface MessageComposerProps {
  onSendMessage: (content: string, attachmentIds: string[]) => Promise<void>;
}

export function MessageComposer({ onSendMessage }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && attachments.length === 0) return;

    setIsSending(true);
    try {
      await onSendMessage(content.trim(), attachments.map(a => a.id));
      setContent('');
      setAttachments([]);
      setShowAttachments(false);
      
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      // Error is handled by parent, we keep the state here so they can retry
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="bg-white border-t border-[var(--color-ash)]/20 p-4">
      {showAttachments && (
        <div className="mb-4 p-4 border border-[var(--color-ash)]/20 bg-[var(--color-ash)]/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium tracking-widest text-[var(--color-black)]">ATTACHMENTS</span>
            <button 
              type="button" 
              onClick={() => setShowAttachments(false)}
              className="text-[var(--color-ash)] hover:text-[var(--color-black)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <AttachmentUploader onAttachmentsChange={setAttachments} maxFiles={3} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <button
          type="button"
          onClick={() => setShowAttachments(!showAttachments)}
          className={`shrink-0 p-3 flex items-center justify-center transition-colors ${
            attachments.length > 0 
              ? 'bg-[var(--color-black)] text-[var(--color-white)]' 
              : 'text-[var(--color-ash)] hover:bg-[var(--color-ash)]/10 hover:text-[var(--color-black)]'
          }`}
          aria-label="Add attachments"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
          {attachments.length > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {attachments.length}
            </span>
          )}
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder="Type your message..."
            className="w-full bg-white border border-[var(--color-ash)]/30 px-4 py-3 text-[var(--color-black)] focus:border-[var(--color-black)] focus:outline-none focus:ring-0 resize-none min-h-[48px] max-h-[150px] overflow-y-auto"
            rows={1}
          />
        </div>

        <Button
          type="submit"
          disabled={(!content.trim() && attachments.length === 0) || isSending}
          isLoading={isSending}
          className="shrink-0 bg-[var(--color-black)] text-[var(--color-white)] hover:bg-[var(--color-off-black)] px-6 py-3 h-[48px]"
        >
          SEND
        </Button>
      </form>
    </div>
  );
}
