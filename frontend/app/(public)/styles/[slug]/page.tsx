import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { stylesApi } from '@/lib/api/styles';
import { StyleDetailActions } from '@/components/styles/StyleDetailActions';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await stylesApi.getStyle(params.slug);
    return {
      title: `${response.data.name} | KINGJOEBRIDD`,
      description: response.data.description || 'Explore this style in the KINGJOEBRIDD library.',
    };
  } catch {
    return { title: 'Style Not Found | KINGJOEBRIDD' };
  }
}

export default async function StyleDetailPage({ params }: { params: { slug: string } }) {
  let style;
  try {
    const response = await stylesApi.getStyle(params.slug);
    style = response.data;
  } catch (error) {
    notFound();
  }

  const images = style.images || [];
  const primaryImage = images.find(img => img.is_primary) || images[0];
  const secondaryImages = images.filter(img => img.id !== primaryImage?.id);

  return (
    <main className="min-h-screen bg-[var(--color-white)] pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <Link href="/explore" className="inline-flex items-center text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors mb-8 text-sm font-medium uppercase tracking-widest">
          &larr; Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Visual Gallery - Left Side */}
          <div className="lg:col-span-7 space-y-6">
            {primaryImage && (
              <div className="relative aspect-[3/4] w-full bg-[var(--color-ash)]/10">
                <Image
                  src={primaryImage.file_path}
                  alt={style.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            )}
            
            {secondaryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {secondaryImages.map((img) => (
                  <div key={img.id} className="relative aspect-[3/4] w-full bg-[var(--color-ash)]/10">
                    <Image
                      src={img.file_path}
                      alt={`${style.name} detail`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 30vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Typography & Context - Right Side */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <div className="mb-4 flex flex-wrap gap-3">
                {style.category && (
                  <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ash)]">
                    {style.category.name}
                  </span>
                )}
                {style.collection && (
                  <>
                    <span className="text-[var(--color-ash)]/50">&bull;</span>
                    <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-black)]">
                      {style.collection.name}
                    </span>
                  </>
                )}
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-black)] mb-8 leading-tight">
                {style.name}
              </h1>

              {style.description && (
                <div className="prose prose-lg prose-p:text-[var(--color-ash)] prose-p:leading-relaxed mb-12 font-sans">
                  <p>{style.description}</p>
                </div>
              )}

              <div className="bg-white/50 backdrop-blur border border-[var(--color-ash)]/10 p-6 md:p-8">
                <h3 className="font-display text-xl text-[var(--color-black)] mb-4">
                  Bespoke Creation
                </h3>
                <p className="text-[var(--color-ash)] text-sm leading-relaxed mb-6">
                  Every KINGJOEBRIDD piece is tailored specifically for you. Select &quot;I Want This&quot; to begin a conversation with our style advisors. We will adapt this design to your measurements, preferred materials, and personal aesthetic.
                </p>
                
                <StyleDetailActions style={style} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
