'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Style, PaginatedResponse } from '@/types/api';
import { stylesApi } from '@/lib/api/styles';
import { Plus, Edit3, Eye, Trash2, LayoutTemplate } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/format';

export default function AdminStylesPage() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStyles = async () => {
    try {
      setLoading(true);
      const response = await stylesApi.getStyles({ per_page: 50 });
      setStyles(response.data);
    } catch (err) {
      setError('Failed to load styles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this style?')) {
      try {
        await stylesApi.deleteStyle(id);
        setStyles(styles.filter(s => s.id !== id));
      } catch (err) {
        alert('Failed to delete style.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[var(--color-ash)] border-t-[var(--color-black)] rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-[var(--color-ash)] uppercase tracking-widest font-medium">Loading Styles</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[var(--color-black)] font-medium mb-4">{error}</p>
        <button onClick={fetchStyles} className="text-xs font-bold tracking-widest uppercase border-b border-[var(--color-black)]">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          {/* Layout handles the h1 page title */}
        </div>
        <Link 
          href="/admin/styles/new"
          className="text-xs font-bold tracking-widest uppercase border border-[var(--color-black)] bg-[var(--color-black)] text-white rounded-xl px-4 py-2.5 hover:bg-[var(--color-white)] hover:text-[var(--color-black)] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Style
        </Link>
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {styles.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <LayoutTemplate className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No styles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[11px] font-medium uppercase tracking-wider text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Style Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {styles.map((style) => (
                  <tr key={style.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--color-black)]">{style.name}</div>
                      <div className="text-[var(--color-ash)] text-xs mt-1">{style.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ash)]">
                      {style.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                        style.is_published 
                          ? 'bg-[var(--color-black)]/5 text-[var(--color-black)]' 
                          : 'bg-[var(--color-ash)]/10 text-[var(--color-ash)]'
                      }`}>
                        {style.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ash)]">
                      {formatDateTime(style.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/styles/${style.slug}`}
                          className="p-2 text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors rounded-lg hover:bg-[var(--color-light-ash)]/30"
                          title="View Style"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/styles/${style.slug}/edit`}
                          className="p-2 text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors rounded-lg hover:bg-[var(--color-light-ash)]/30"
                          title="Edit Style"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(style.id)}
                          className="p-2 text-[var(--color-ash)] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete Style"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
