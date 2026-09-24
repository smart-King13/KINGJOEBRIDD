import { Suspense } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { PinterestFashionGrid } from '@/components/styles/PinterestFashionGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { StyleHeroCarousel } from '@/components/ui/StyleHeroCarousel';

export const metadata: Metadata = {
  title: 'Explore Styles | KINGJOEBRIDD',
  description: 'Discover the KINGJOEBRIDD editorial style library. Find inspiration for your next bespoke creation.',
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Data is fetched client-side by PinterestFashionGrid

  return (
    <main className="min-h-screen bg-[var(--color-white)] overflow-hidden selection:bg-[var(--color-black)] selection:text-[var(--color-white)]">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 flex flex-col items-center justify-center min-h-[90vh] bg-[var(--color-black)]">
        <StyleHeroCarousel />
        
        {/* Symmetrical vignette overlay for the alternating carousel */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `
              linear-gradient(to right, var(--color-black) 0%, var(--color-black) 10%, transparent 40%),
              linear-gradient(to left, var(--color-black) 0%, var(--color-black) 10%, transparent 40%),
              linear-gradient(to bottom, var(--color-black) 0%, transparent 20%),
              linear-gradient(to top, var(--color-black) 0%, var(--color-black) 25%, transparent 50%)
            `
          }}
        />

        <header className="relative z-10 text-center max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Explore the Library
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="font-sans text-lg text-white/60 leading-relaxed">
              Discover our curated collection of styles. Find your inspiration, and when you see something that speaks to you, tell us: <em className="text-white/80">I want this.</em>
            </p>
          </ScrollReveal>
        </header>
      </section>

      <div className="container mx-auto px-4 md:px-8 py-24">
        <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-black)]"></div></div>}>
          <PinterestFashionGrid />
        </Suspense>
      </div>
    </main>
  );
}
