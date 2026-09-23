import Link from 'next/link';
import Image from 'next/image';
import { buttonClasses } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { CategoryCarousel } from '@/components/ui/CategoryCarousel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-[var(--color-black)] text-[var(--color-white)] flex flex-col justify-end overflow-hidden pb-20 md:pb-32 pt-32">
        <HeroCarousel images={['/images/hero-img1.jpg', '/images/hero-img2.jpg']} />

        <div className="container relative z-30 px-4 md:px-8">
          <div className="max-w-4xl flex flex-col items-center text-center sm:items-start sm:text-left mx-auto sm:mx-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display uppercase tracking-widest mb-6 leading-tight">
              Bespoke <br className="hidden sm:block" /> Elegance
            </h1>
            <p className="text-lg md:text-xl font-sans mb-10 max-w-xl text-[var(--color-light-ash)] leading-relaxed">
              A digital fashion house where inspiration becomes craftsmanship. Explore our curated collections or bring your unique vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/styles" 
                className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full sm:w-auto px-10 !bg-[var(--color-white)] !text-[var(--color-black)] hover:!bg-[var(--color-light-ash)]' })}
              >
                EXPLORE STYLES
              </Link>
              <Link 
                href="/style-requests/new" 
                className={buttonClasses({ variant: 'secondary-dark', size: 'lg', className: 'w-full sm:w-auto px-10' })}
              >
                SHOW US YOUR STYLE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Styles Section */}
      <section className="py-24 bg-[var(--color-white)]">
        <div className="container max-w-7xl">
          <div className="text-center mb-16">
            <ScrollReveal direction="up">
              <h2 className="text-3xl font-display tracking-widest text-[var(--color-black)] mb-4 uppercase">Curated For You</h2>
              <div className="h-px w-16 bg-[var(--color-black)] mx-auto" />
            </ScrollReveal>
          </div>
          
          <CategoryCarousel categories={[
            { 
              title: 'Men\'s Collection', 
              desc: 'Impeccable suits and native wear', 
              images: [
                '/images/m-collection 1.jpg',
                '/images/m-collection 2.jpg',
                '/images/m-collection 3.jpg',
                '/images/m-collection 4.jpg',
                '/images/m-collection 5.jpg',
                '/images/m-collection 6.jpg',
                '/images/m-collection 7.jpg',
                '/images/m-collection 8.jpg',
                '/images/m-collection 9.jpg',
                '/images/m-collection 10.jpg',
              ] 
            },
            { 
              title: 'Women\'s Collection', 
              desc: 'Elegant gowns and casual chic', 
              images: [
                '/images/w-collection 1.jpg',
                '/images/w-collection 2.jpg',
                '/images/w-collection 3.jpg',
                '/images/w-collection 4.jpg',
                '/images/w-collection 5.jpg',
                '/images/w-collection 6.jpg',
                '/images/w-collection 7.jpg',
                '/images/w-collection 8.jpg',
                '/images/w-collection 9.jpg',
                '/images/w-collection 10.jpg',
                '/images/w-collection 11.jpg',
              ] 
            },
            { 
              title: 'Couples Collection', 
              desc: 'Elegant traditional attire for couples', 
              images: [
                '/images/t-collection 1.jpg',
                '/images/t-collection 2.jpg',
                '/images/t-collection 3.jpg',
                '/images/t-collection 4.jpg',
                '/images/t-collection 5.jpg',
                '/images/t-collection 6.jpg',
              ] 
            },
          ]} />
          
          <div className="mt-16 text-center">
            <Link href="/styles" className="inline-block border-b border-[var(--color-black)] pb-1 text-sm font-medium tracking-widest text-[var(--color-black)] hover:opacity-50 transition-opacity">
              VIEW ALL COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* The KINGJOEBRIDD Experience */}
      <section className="py-24 bg-[var(--color-white)]/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <ScrollReveal direction="up">
                <h2 className="text-3xl font-display tracking-widest text-[var(--color-black)] mb-8">THE EXPERIENCE</h2>
              </ScrollReveal>
              <ul className="space-y-12 text-left w-full max-w-md md:max-w-none">
                {[
                  { step: '01', title: 'Discover & Tell Us', desc: 'Find a style you love or bring your own inspiration. Tell us exactly what you want.' },
                  { step: '02', title: 'Discuss & Measure', desc: 'Chat directly with our master tailors to refine the details and provide your measurements.' },
                  { step: '03', title: 'Quote & Create', desc: 'Approve your personalized quote. We source the materials (or use yours) and bring your vision to life.' },
                ].map((item, i) => (
                  <ScrollReveal key={i} direction="up" delay={i * 150}>
                    <li className="flex gap-6">
                      <span className="text-xl font-display font-bold text-[var(--color-ash)] mt-1">{item.step}</span>
                      <div>
                        <h4 className="font-bold text-[var(--color-black)] tracking-wide mb-2 text-base">{item.title}</h4>
                        <p className="text-[var(--color-black)]/70 font-medium text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
              <ScrollReveal direction="up" delay={450} className="mt-10">
                <Link href="/how-it-works" className="text-sm font-bold tracking-widest text-[var(--color-black)] hover:opacity-70 transition-colors flex items-center gap-2">
                  LEARN MORE <span aria-hidden="true">&rarr;</span>
                </Link>
              </ScrollReveal>
            </div>
            <div className="flex justify-center md:justify-end mt-10 md:mt-0">
              <ScrollReveal direction="left" className="relative w-full max-w-md rounded-none overflow-hidden group shadow-2xl">
                <Image 
                  src="/images/experience-img.jpg"
                  alt="The tailoring experience"
                  width={1200}
                  height={1600}
                  quality={100}
                  unoptimized
                  className="w-full h-auto"
                />
                <div className="absolute inset-4 border border-[var(--color-black)]/20 z-10 pointer-events-none" />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-5xl text-center">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-display tracking-widest text-[var(--color-black)] mb-6">AFRICAN CRAFTSMANSHIP</h2>
            <p className="text-lg text-[var(--color-ash)] max-w-2xl mx-auto leading-relaxed mb-12">
              Every stitch is a testament to our dedication. We blend traditional techniques with modern aesthetics to create garments that are uniquely yours.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '/images/m-collection 1.jpg',
              '/images/w-collection 3.jpg',
              '/images/t-collection 3.jpg',
              '/images/w-collection 7.jpg'
            ].map((img, item) => (
              <ScrollReveal key={item} direction="up" delay={item * 100} className="aspect-square bg-[var(--color-ash)]/10 overflow-hidden relative">
                <img 
                  src={img} 
                  alt="Craftsmanship detail" 
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[var(--color-black)] text-[var(--color-white)] text-center">
        <ScrollReveal direction="up" className="container max-w-2xl">
          <h2 className="text-4xl font-display tracking-widest mb-6">HAVE SOMETHING IN MIND?</h2>
          <p className="text-[var(--color-ash)] mb-10 text-lg">
            Whether it is a custom suit, a traditional agbada, or an elegant evening gown, our tailors are ready to craft it for you.
          </p>
          <Link 
            href="/style-requests/new" 
            className={buttonClasses({ variant: 'secondary-dark', size: 'lg', className: 'w-full sm:w-auto' })}
          >
            START YOUR REQUEST
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
