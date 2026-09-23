'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Style } from '@/types/api';
import { stylesApi } from '@/lib/api/styles';
import { apiClient } from '@/lib/api/apiClient';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';

export function StyleDetailActions({ style }: { style: Style }) {
  const [isSaved, setIsSaved] = useState(style.is_saved);
  const [isSaving, setIsSaving] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/styles/${style.slug}`);
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    const previousState = isSaved;
    setIsSaved(!isSaved);

    try {
      if (previousState) {
        await stylesApi.unsaveStyle(style.id);
      } else {
        await stylesApi.saveStyle(style.id);
      }
    } catch (error) {
      setIsSaved(previousState);
      console.error('Failed to toggle save state', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleIWantThis = async () => {
    if (!isAuthenticated) {
      // Bridge: Phase 2 unauthenticated redirect
      router.push(`/login?redirect=/chat&context=style&id=${style.id}`);
      return;
    }

    if (isRequesting) return;
    setIsRequesting(true);

    try {
      // Create/open conversation context for this style
      const response = await apiClient<{ data: { id: string } }>('/conversations', {
        method: 'POST',
        data: {
          context_type: 'style',
          context_id: style.id,
        },
      });
      
      router.push(`/chat/${response.data.id}`);
    } catch (error) {
      console.error('Failed to initiate request', error);
      // Fallback/error handling gracefully
      setIsRequesting(false);
    }
  };

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 border-t border-[var(--color-ash)]/20 pt-8">
      <Button 
        onClick={handleIWantThis} 
        isLoading={isRequesting}
        className="w-full sm:w-auto flex-1 bg-[var(--color-black)] text-[var(--color-white)] hover:bg-[var(--color-off-black)] py-4 text-sm tracking-widest"
      >
        I WANT THIS
      </Button>
      
      <Button 
        onClick={handleSaveToggle}
        disabled={isSaving}
        variant="outline"
        className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 border-[var(--color-black)] text-[var(--color-black)] hover:bg-[var(--color-ash)]/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        {isSaved ? 'SAVED' : 'SAVE STYLE'}
      </Button>
    </div>
  );
}
