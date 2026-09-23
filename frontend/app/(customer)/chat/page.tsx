'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { conversationsApi } from '@/lib/api/conversations';

function ChatInitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    const contextType = searchParams.get('context');
    const contextId = searchParams.get('id');

    if (contextType === 'style' && contextId) {
      initialized.current = true;
      conversationsApi.create({
        context_type: 'style',
        context_id: contextId,
      }).then(res => {
        router.replace(`/account/conversations/${res.data.id}`);
      }).catch(err => {
        console.error('Failed to init conversation', err);
        router.replace('/account/conversations');
      });
    } else {
      router.replace('/account/conversations');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[var(--color-black)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm tracking-widest text-[var(--color-black)]">STARTING CONSULTATION...</p>
      </div>
    </div>
  );
}

export default function ChatInitPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[var(--color-black)] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    }>
      <ChatInitContent />
    </Suspense>
  );
}
