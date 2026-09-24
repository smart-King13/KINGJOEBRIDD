import React from 'react';
import { StyleRequestForm } from '@/components/engagement/StyleRequestForm';
import { StyleRequestSlider } from '@/components/engagement/StyleRequestSlider';

export const metadata = {
  title: 'Show Us Your Style | KINGJOEBRIDD FASHION',
};

export default async function NewStyleRequestPage(props: {
  searchParams: Promise<{ style_id?: string; external_style?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-white)]">
      
      {/* Left side: Editorial Brand / Reference Image (Desktop Only) */}
      <div className="hidden lg:flex w-1/3 xl:w-2/5 bg-[var(--color-black)] relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-20">
          <h1 className="font-display text-2xl font-bold tracking-[0.3em] text-white uppercase mb-2">
            KingJoeBridd
          </h1>
          <p className="text-white/60 text-xs tracking-widest uppercase">Bespoke Tailoring Request</p>
        </div>
        
        {searchParams.external_style ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={searchParams.external_style} 
              alt="Reference Style" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 animate-pan-image" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80" />
          </>
        ) : (
          <StyleRequestSlider />
        )}
        
        <div className="relative z-20">
          <p className="text-white/80 font-serif italic text-xl mb-4">
            "True luxury is understanding that every detail matters."
          </p>
          <div className="w-12 h-[1px] bg-white/40" />
        </div>
      </div>

      {/* Right side: Form Area */}
      <div className="flex-1 lg:h-screen lg:overflow-y-auto hide-scrollbar">
        <div className="max-w-4xl mx-auto py-12 px-6 sm:py-20 sm:px-12 lg:px-16 xl:px-24">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden mb-12 flex flex-col items-center text-center">
             <h2 className="font-display text-xl font-bold tracking-[0.3em] text-[var(--color-black)] uppercase mb-2">
               KingJoeBridd
             </h2>
             <div className="w-8 h-[1px] bg-[var(--color-black)]" />
          </div>

          <div className="mb-12">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-widest text-[var(--color-black)] mb-4 uppercase">
              New Style Request
            </h1>
            <p className="text-[var(--color-ash)] text-sm sm:text-base leading-relaxed font-light">
              Tell us about the bespoke piece you'd like us to create for you. Be as detailed as you like—every element helps us bring your vision to life.
            </p>
          </div>

          <StyleRequestForm styleId={searchParams.style_id} externalStyle={searchParams.external_style} />
        </div>
      </div>
    </div>
  );
}
