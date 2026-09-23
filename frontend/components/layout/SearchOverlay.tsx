'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, TrendingUp, Tag } from 'lucide-react';
import { stylesApi } from '@/lib/api/styles';
import { Style } from '@/types/api';
import { StyleCard } from '@/components/styles/StyleCard';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Style[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await stylesApi.getStyles({ search: searchQuery });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col motion-safe-transition">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-2 text-[var(--color-black)] hover:opacity-70 transition-colors z-10"
        aria-label="Close search"
      >
        <X className="w-8 h-8" strokeWidth={1.5} />
      </button>

      <div className="container max-w-5xl mx-auto pt-24 pb-12 flex-1 flex flex-col overflow-y-auto">
        {/* Search Input */}
        <div className="relative mb-16 w-full group">
          <div className="flex items-center w-full bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded-full px-6 py-4 md:py-6 shadow-sm group-focus-within:shadow-md group-focus-within:border-[var(--color-black)]/30 transition-all">
            <Search className="w-6 h-6 md:w-8 md:h-8 text-[var(--color-ash)] mr-4 shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles, categories..."
              className="flex-1 min-w-0 bg-transparent text-lg md:text-3xl font-display text-[var(--color-black)] focus:outline-none placeholder:text-[var(--color-ash)]/60"
            />
            {query && (
              <button 
                onClick={() => { setQuery(''); setResults([]); setHasSearched(false); inputRef.current?.focus(); }}
                className="ml-4 p-2 rounded-full hover:bg-[var(--color-light-ash)]/50 transition-colors"
              >
                <X className="w-6 h-6 text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 px-4 md:px-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-black)]"></div>
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <p className="text-[var(--color-ash)] text-sm tracking-widest uppercase">
                    {results.length} Result{results.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {results.slice(0, 6).map((style) => (
                    <div key={style.id} onClick={onClose}>
                      <StyleCard style={style} />
                    </div>
                  ))}
                </div>
                {results.length > 6 && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => {
                        onClose();
                        router.push(`/styles?search=${encodeURIComponent(query)}`);
                      }}
                      className="inline-flex items-center gap-2 text-[var(--color-black)] font-medium tracking-widest uppercase text-sm hover:opacity-70 transition-opacity"
                    >
                      View All Results <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 animate-in fade-in duration-500">
                <p className="text-2xl font-display text-[var(--color-black)] mb-4">No results found</p>
                <p className="text-[var(--color-ash)] font-light">We couldn't find anything matching "{query}". Try another search term.</p>
              </div>
            )
          ) : (
            <div className="max-w-3xl mx-auto px-4 md:px-0 animate-in fade-in duration-500">
              {/* Trending Searches */}
              <div className="mb-16">
                <h3 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-ash)] mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Trending Searches
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Bespoke Suits', 'Native Wear', 'Agbada', 'Wedding Gowns', 'Senator Styles'].map((term) => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-5 py-2.5 rounded-full border border-[var(--color-light-ash)] bg-[var(--color-white)] text-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-white)] hover:border-[var(--color-black)] transition-all text-sm font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div>
                <h3 className="font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-ash)] mb-6 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Popular Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Men', 'Women', 'Children', 'Accessories'].map((category) => (
                    <button 
                      key={category}
                      onClick={() => {
                        onClose();
                        router.push(`/styles?category=${category.toLowerCase()}`);
                      }}
                      className="flex items-center justify-center p-6 rounded-2xl bg-[var(--color-light-ash)]/20 hover:bg-[var(--color-black)] text-[var(--color-black)] hover:text-[var(--color-white)] transition-all group"
                    >
                      <span className="font-display text-lg tracking-wide group-hover:scale-105 transition-transform">{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
