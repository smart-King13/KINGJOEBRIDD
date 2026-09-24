'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { PinterestStyle } from '@/lib/fashion-data';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

interface StyleCardPinterestProps {
  style: PinterestStyle;
}

export function StyleCardPinterest({ style }: StyleCardPinterestProps) {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedStyles = JSON.parse(localStorage.getItem('kj_saved_styles') || '[]');
    if (savedStyles.includes(style.id)) {
      setIsSaved(true);
    }
  }, [style.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const savedStyles = JSON.parse(localStorage.getItem('kj_saved_styles') || '[]');
    if (isSaved) {
      const newStyles = savedStyles.filter((id: string) => id !== style.id);
      localStorage.setItem('kj_saved_styles', JSON.stringify(newStyles));
      setIsSaved(false);
    } else {
      savedStyles.push(style.id);
      localStorage.setItem('kj_saved_styles', JSON.stringify(savedStyles));
      setIsSaved(true);
    }
  };

  const handleRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/style-requests/new?external_style=${encodeURIComponent(style.imageUrl)}`);
  };

  return (
    <>
      <div 
        className="relative group rounded-2xl overflow-hidden cursor-zoom-in bg-[var(--color-ash)]/10 transition-transform duration-300 hover:-translate-y-1"
        style={{ aspectRatio: style.aspectRatio ? `${1 / style.aspectRatio}` : 'auto' }}
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={style.imageUrl}
          alt={style.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={style.imageUrl.startsWith('http')}
        />
        
        {/* Hover Overlay - Only shows on desktop hover */}
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 opacity-0 md:group-hover:opacity-100 pointer-events-none flex items-center justify-center">
          <div className="translate-y-4 opacity-0 transition-all duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="text-white text-xs font-bold tracking-[0.3em] uppercase">
              View Details
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal rendered via Portal to escape CSS transforms */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-white)] md:bg-black/90 p-0 md:p-8" onClick={() => setIsModalOpen(false)}>
          <button 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white md:text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/20 md:bg-transparent rounded-full backdrop-blur-sm md:backdrop-blur-none"
            onClick={() => setIsModalOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="relative w-full h-[100dvh] md:h-auto md:max-w-5xl md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row bg-[var(--color-white)] rounded-none md:rounded-xl shadow-none md:shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Left: Image (Top on mobile, Left on desktop) */}
            <div className="relative w-full flex-1 min-h-0 md:flex-none md:w-1/2 md:h-[80vh] shrink-0 bg-[#0a0a0a]">
              <Image
                src={style.imageUrl}
                alt={style.title}
                fill
                className="object-cover object-top md:object-center"
                unoptimized={style.imageUrl.startsWith('http')}
              />
            </div>

            {/* Right: Content (Bottom on mobile, Right on desktop) */}
            <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-14 flex flex-col justify-center bg-[var(--color-white)] shrink-0">
              <div className="mb-4 md:mb-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ash)] font-bold mb-1 md:mb-4">
                  KingJoeBridd Archive
                </p>
                <h2 className="font-display text-2xl md:text-5xl text-[var(--color-black)] leading-tight mb-2 md:mb-6">
                  {style.title}
                </h2>
                
                <div className="w-12 h-[1px] bg-[var(--color-black)] mb-3 md:mb-6" />
                
                <p className="hidden md:block text-sm text-[var(--color-ash)] leading-relaxed font-sans">
                  A signature look from the KINGJOEBRIDD collection. This piece embodies our commitment to exceptional tailoring, premium fabrics, and visionary design. Perfect for making a statement.
                </p>
              </div>
              
              <div className="flex flex-col gap-2 md:gap-4 mt-2 md:mt-10">
                <button
                  onClick={handleRequest}
                  className="w-full bg-[var(--color-black)] text-white border border-[var(--color-black)] rounded-full py-3 md:py-4 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-transparent hover:text-[var(--color-black)] transition-all duration-300"
                >
                  Request Bespoke
                </button>
                <button
                  onClick={handleSave}
                  className={`w-full rounded-full py-3 md:py-4 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                    isSaved 
                      ? 'bg-[var(--color-ash)] text-white border border-[var(--color-ash)] shadow-inner'
                      : 'bg-transparent text-[var(--color-black)] border border-[var(--color-ash)]/30 hover:border-[var(--color-black)]'
                  }`}
                >
                  {isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
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
