'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Style, Category, PaginationMeta } from '@/types/api';
import { StyleCard } from './StyleCard';
import { stylesApi } from '@/lib/api/styles';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface StyleLibraryProps {
  initialStyles: Style[];
  initialMeta: PaginationMeta;
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
  fetchEndpoint?: 'explore' | 'saved'; // determines if we use getStyles or getSavedStyles
}

export function StyleLibrary({
  initialStyles,
  initialMeta,
  categories,
  currentCategory,
  currentSearch,
  fetchEndpoint = 'explore',
}: StyleLibraryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [styles, setStyles] = useState<Style[]>(initialStyles);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchValue, setSearchValue] = useState(currentSearch || '');

  // Reset styles when initialStyles change (due to URL params change)
  const [prevInitial, setPrevInitial] = useState(initialStyles);
  if (initialStyles !== prevInitial) {
    setPrevInitial(initialStyles);
    setStyles(initialStyles);
    setMeta(initialMeta);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to page 1
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category_slug', slug);
    } else {
      params.delete('category_slug');
    }
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const loadMore = async () => {
    if (meta.current_page >= meta.last_page || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = meta.current_page + 1;
      const filters = {
        page: nextPage,
        search: currentSearch,
        category_slug: currentCategory,
      };
      
      const response = fetchEndpoint === 'saved' 
        ? await stylesApi.getSavedStyles(filters)
        : await stylesApi.getStyles(filters);
        
      setStyles(prev => [...prev, ...response.data]);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to load more styles', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="w-full">
      {/* Filter & Search Bar */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {fetchEndpoint === 'explore' && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCategoryChange('')}
              className={`rounded-full px-6 py-2.5 text-xs tracking-[0.1em] font-medium uppercase transition-all duration-300 border ${
                !currentCategory
                  ? 'bg-[var(--color-black)] text-white border-[var(--color-black)]'
                  : 'bg-transparent text-[var(--color-black)] border-[var(--color-ash)]/30 hover:border-[var(--color-black)]'
              }`}
            >
              All Styles
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`rounded-full px-6 py-2.5 text-xs tracking-[0.1em] font-medium uppercase transition-all duration-300 border ${
                  currentCategory === category.slug
                    ? 'bg-[var(--color-black)] text-white border-[var(--color-black)]'
                    : 'bg-transparent text-[var(--color-black)] border-[var(--color-ash)]/30 hover:border-[var(--color-black)]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSearch} className="relative w-full md:w-72 group">
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-12 bg-transparent border-0 border-b border-[var(--color-ash)]/40 py-2 pl-8 pr-4 text-sm font-medium tracking-widest text-[var(--color-black)] focus:outline-none focus:ring-0 focus:border-[var(--color-black)] transition-all placeholder:text-[var(--color-ash)]/70 placeholder:uppercase"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ash)] transition-colors group-focus-within:text-[var(--color-black)]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </form>
      </div>

      {/* Grid */}
      {styles.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {styles.map((style, idx) => (
            <ScrollReveal key={style.id} direction="up" delay={(idx % 8) * 100}>
              <StyleCard style={style} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h3 className="font-display text-2xl text-[var(--color-black)]">No styles found</h3>
          <p className="mt-2 text-sm text-[var(--color-ash)]">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
          {(currentSearch || currentCategory) && (
            <Button
              onClick={() => {
                setSearchValue('');
                router.push(fetchEndpoint === 'saved' ? '/account/styles' : '/explore', { scroll: false });
              }}
              variant="outline"
              className="mt-6"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Load More */}
      {meta.current_page < meta.last_page && (
        <div className="mt-16 flex justify-center">
          <Button
            onClick={loadMore}
            isLoading={isLoadingMore}
            variant="outline"
            className="w-full sm:w-auto px-12"
          >
            Load More Inspiration
          </Button>
        </div>
      )}
    </div>
  );
}
