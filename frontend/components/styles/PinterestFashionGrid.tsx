'use client';

import React, { useState, useEffect } from 'react';
import { PinterestStyle } from '@/lib/fashion-data';
import { StyleCardPinterest } from './StyleCardPinterest';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const categories = [
  { id: 'all', name: 'All Styles' },
  { id: 't-collection', name: 'Traditional & Asoebi' },
  { id: 'm-collection', name: "Men's Native & Agbada" },
  { id: 'w-collection', name: "Women's Couture & Power Suits" },
];

export function PinterestFashionGrid() {
  const [styles, setStyles] = useState<PinterestStyle[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStyles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'all') params.set('category', activeCategory);
        if (searchQuery) params.set('search', searchQuery);

        const response = await fetch(`/api/fashion?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStyles(data.data || []);
      } catch (error) {
        console.error('Error fetching styles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchStyles();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [activeCategory, searchQuery]);

  return (
    <div className="w-full">
      {/* Filter & Search Bar */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-6 py-2.5 text-xs tracking-[0.1em] font-medium uppercase transition-all duration-300 border ${
                activeCategory === category.id
                  ? 'bg-[var(--color-black)] text-white border-[var(--color-black)]'
                  : 'bg-transparent text-[var(--color-black)] border-[var(--color-ash)]/30 hover:border-[var(--color-black)]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72 group">
          <input
            type="text"
            placeholder="SEARCH PINTEREST..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>
      </div>

      {/* Masonry Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-black)]"></div>
        </div>
      ) : styles.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {styles.map((style, idx) => (
            <ScrollReveal key={style.id} direction="up" delay={(idx % 8) * 100}>
              <div className="break-inside-avoid mb-4">
                <StyleCardPinterest style={style} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h3 className="font-display text-2xl text-[var(--color-black)]">No styles found</h3>
          <p className="mt-2 text-sm text-[var(--color-ash)]">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}
