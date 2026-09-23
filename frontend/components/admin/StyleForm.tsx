'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Style, Category, Collection } from '@/types/api';
import { categoriesApi } from '@/lib/api/categories';
import { collectionsApi } from '@/lib/api/collections';
import { stylesApi } from '@/lib/api/styles';

interface StyleFormProps {
  initialData?: Style;
  isEdit?: boolean;
}

export function StyleForm({ initialData, isEdit = false }: StyleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    category_id: initialData?.category?.id || '',
    collection_id: initialData?.collection?.id || '',
    is_published: initialData?.is_published || false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          categoriesApi.getCategories(),
          collectionsApi.getCollections(),
        ]);
        setCategories(catRes.data);
        setCollections(colRes.data);
      } catch (err) {
        console.error('Failed to load categories/collections', err);
      }
    };
    fetchData();
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEdit && !formData.slug) {
      setFormData({ ...formData, name, slug: generateSlug(name) });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        category_id: formData.category_id,
        collection_id: formData.collection_id || null, // send null if empty string
        is_published: formData.is_published,
      };

      if (isEdit && initialData) {
        await stylesApi.updateStyle(initialData.id, payload);
      } else {
        await stylesApi.createStyle(payload);
      }
      
      router.push('/admin/styles');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-[var(--color-white)] p-8 rounded-xl border border-[var(--color-light-ash)] shadow-sm">
      {error && (
        <div className="p-4 bg-[var(--color-black)]/5 border border-[var(--color-black)] text-[var(--color-black)] text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Style Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors"
            placeholder="e.g. Classic Oxford Shirt"
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Slug</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--color-black)]/5 border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors"
            placeholder="e.g. classic-oxford-shirt"
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors resize-none"
            placeholder="Detailed description of the style..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Category</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] mb-2">Collection (Optional)</label>
            <select
              value={formData.collection_id}
              onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-md focus:outline-none focus:border-[var(--color-black)] transition-colors appearance-none"
            >
              <option value="">None</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="is_published"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-5 h-5 accent-[var(--color-black)] bg-[var(--color-white)] border-[var(--color-light-ash)] rounded cursor-pointer"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-[var(--color-black)] cursor-pointer select-none">
            Publish this style (visible to customers)
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--color-light-ash)] flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-[var(--color-black)] text-[var(--color-white)] text-xs font-bold tracking-widest uppercase rounded-md hover:bg-[var(--color-ash)] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Style' : 'Create Style')}
        </button>
      </div>
    </form>
  );
}
