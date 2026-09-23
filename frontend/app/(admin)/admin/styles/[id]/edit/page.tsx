'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StyleForm } from '@/components/admin/StyleForm';
import { stylesApi } from '@/lib/api/styles';
import { Style } from '@/types/api';

export default function EditStylePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [style, setStyle] = useState<Style | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStyle = async () => {
      try {
        // The API actually fetches by slug in the show method. Wait, let me check the styles API.
        // `getStyle` takes a slug. But the id is what we have in the URL... Oh, wait. The admin list page links to `/admin/styles/${style.id}/edit`.
        // Does the backend support fetching by ID? Let's check api.php
        // `GET api/v1/styles/{slug}` - oh, the show method uses slug. So we need the slug to fetch.
        // Wait, if I am passing the ID in the URL, I can't fetch it by ID if the backend only supports slug.
        // Let me just fetch all styles and find it, or I should just pass slug in the URL!
        // Actually, let's fetch by slug.
        const response = await stylesApi.getStyle(resolvedParams.id);
        setStyle(response.data);
      } catch (err) {
        setError('Failed to load style.');
      } finally {
        setLoading(false);
      }
    };
    fetchStyle();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[var(--color-ash)] border-t-[var(--color-black)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !style) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[var(--color-black)] font-medium mb-4">{error || 'Style not found'}</p>
        <Link href="/admin/styles" className="text-xs font-bold tracking-widest uppercase border-b border-[var(--color-black)]">Back to Styles</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="border-b border-[var(--color-light-ash)] pb-4">
        <Link 
          href="/admin/styles"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] uppercase mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Styles
        </Link>
        <h2 className="font-display text-3xl font-bold tracking-widest text-[var(--color-black)] uppercase">
          EDIT: {style.name}
        </h2>
      </div>

      <StyleForm initialData={style} isEdit />
    </div>
  );
}
