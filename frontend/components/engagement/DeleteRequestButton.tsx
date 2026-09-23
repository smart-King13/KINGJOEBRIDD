'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { styleRequestsApi } from '@/lib/api/styleRequests';

interface DeleteRequestButtonProps {
  id: string;
}

export function DeleteRequestButton({ id }: DeleteRequestButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await styleRequestsApi.delete(id);
      setShowConfirm(false);
      router.push('/account/requests');
      router.refresh();
    } catch (err: any) {
      console.error('Failed to delete request:', err);
      setError(err.message || 'Failed to delete request');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="inline-block relative ml-2">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
          title="Delete Request"
          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)]/30 rounded-lg px-4 py-2 hover:bg-[var(--color-black)] hover:text-[var(--color-white)] text-[var(--color-black)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? '...' : 'Delete'}
        </button>
        {error && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[var(--color-black)] p-2 text-[10px] text-[var(--color-black)] rounded shadow-lg z-10">
            {error}
          </div>
        )}
      </div>

      {mounted && showConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[var(--color-black)]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--color-white)] rounded-2xl w-full max-w-sm p-8 shadow-2xl animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-black)]/10 flex items-center justify-center mb-4 text-[var(--color-black)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-medium text-[var(--color-black)] mb-2">Delete Request</h3>
              <p className="text-sm text-[var(--color-ash)] mb-8">
                Are you sure you want to delete this style request? This action cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border border-[var(--color-light-ash)] rounded-lg text-xs font-bold tracking-widest uppercase text-[var(--color-black)] hover:bg-[var(--color-background-subtle)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-[var(--color-black)] rounded-lg text-xs font-bold tracking-widest uppercase text-[var(--color-white)] hover:bg-[var(--color-black)]/90 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
