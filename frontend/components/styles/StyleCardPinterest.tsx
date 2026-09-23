'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PinterestStyle } from '@/lib/fashion-data';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

interface StyleCardPinterestProps {
  style: PinterestStyle;
}

export function StyleCardPinterest({ style }: StyleCardPinterestProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/styles`);
      return;
    }
    // TODO: Implement save logic (requires creating Style in backend first if it's external)
    alert('Style saved! (Demo mode)');
  };

  const handleRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/styles`);
      return;
    }
    // TODO: Implement request logic mapping to external image URL
    router.push(`/style-requests/new?external_style=${encodeURIComponent(style.imageUrl)}`);
  };

  return (
    <>
      <div 
        className="relative group rounded-2xl overflow-hidden cursor-zoom-in bg-[var(--color-ash)]/10 transition-transform duration-300 hover:-translate-y-1"
        style={{ aspectRatio: style.aspectRatio ? `${1 / style.aspectRatio}` : 'auto' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSave}
              className="bg-red-600 text-white rounded-full px-4 py-2 font-bold text-sm hover:bg-red-700 transition-colors shadow-lg"
            >
              Save
            </button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleRequest}
              className="w-full bg-white/95 backdrop-blur-md text-black rounded-full py-3 font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span>I Want This</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8" onClick={() => setIsModalOpen(false)}>
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setIsModalOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="relative w-full max-w-4xl max-h-full flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full md:w-2/3 min-h-[40vh] md:min-h-[80vh] bg-[var(--color-ash)]/10">
              <Image
                src={style.imageUrl}
                alt={style.title}
                fill
                className="object-contain"
                unoptimized={style.imageUrl.startsWith('http')}
              />
            </div>
            <div className="w-full md:w-1/3 p-8 flex flex-col justify-between bg-[var(--color-white)]">
              <div>
                <h2 className="font-display text-3xl text-[var(--color-black)] mb-4">{style.title}</h2>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-ash)] flex items-center justify-center text-white font-bold">
                    K
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--color-black)]">KINGJOEBRIDD</p>
                    <p className="text-xs text-[var(--color-ash)]">Fashion Lookbook</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white rounded-full py-4 font-bold text-sm hover:bg-red-700 transition-colors shadow-md"
                >
                  Save to Board
                </button>
                <button
                  onClick={handleRequest}
                  className="w-full bg-[var(--color-black)] text-white rounded-full py-4 font-bold text-sm hover:bg-[var(--color-off-black)] transition-colors shadow-md"
                >
                  Request This Style
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
