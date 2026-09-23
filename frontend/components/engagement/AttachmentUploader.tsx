'use client';

import React, { useRef, useState } from 'react';
import { attachmentsApi } from '@/lib/api/attachments';
import { Attachment } from '@/types/api';
import { Button } from '@/components/ui/Button';

interface AttachmentUploaderProps {
  onAttachmentsChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
  className?: string;
}

export function AttachmentUploader({ 
  onAttachmentsChange, 
  maxFiles = 5,
  className = '' 
}: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (attachments.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const newAttachments = [...attachments];
      for (const file of files) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
          setError(`Invalid file type: ${file.name}. Only JPEG, PNG, and PDF are allowed.`);
          continue;
        }

        // Validate size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(`File too large: ${file.name}. Maximum size is 10MB.`);
          continue;
        }

        const response = await attachmentsApi.upload(file);
        newAttachments.push(response.data);
      }
      
      setAttachments(newAttachments);
      onAttachmentsChange(newAttachments);
    } catch (err: any) {
      setError(err.message || 'Failed to upload attachment.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (idToRemove: string) => {
    const newAttachments = attachments.filter(a => a.id !== idToRemove);
    setAttachments(newAttachments);
    onAttachmentsChange(newAttachments);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          aria-label="Upload attachments"
        />
        <Button 
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || attachments.length >= maxFiles}
          className="border-[var(--color-ash)] text-[var(--color-black)] hover:bg-[var(--color-ash)]/10"
        >
          {isUploading ? 'UPLOADING...' : 'ADD ATTACHMENT'}
        </Button>
        <span className="text-xs text-[var(--color-ash)]">
          {attachments.length} / {maxFiles} files (Max 10MB)
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-none border border-red-100">
          {error}
        </div>
      )}

      {attachments.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="relative group rounded-xl overflow-hidden border border-[var(--color-light-ash)] bg-[var(--color-background-subtle)]/50 shadow-sm">
              {attachment.file_type.startsWith('image/') ? (
                <img 
                  src={attachment.url} 
                  alt={attachment.file_name}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 flex flex-col items-center justify-center p-2 text-center text-xs text-[var(--color-black)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1 text-[var(--color-ash)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="truncate w-full block px-1">{attachment.file_name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="absolute top-1.5 right-1.5 bg-[var(--color-white)]/90 backdrop-blur-md rounded-full p-1.5 shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all text-red-600 hover:text-red-700 hover:bg-[var(--color-white)] hover:scale-110 active:scale-95"
                aria-label={`Remove ${attachment.file_name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
