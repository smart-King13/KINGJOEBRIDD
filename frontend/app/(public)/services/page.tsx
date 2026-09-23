import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Scissors, Image as ImageIcon, Wand2, PackageSearch } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Services | KINGJOEBRIDD',
  description: 'Bespoke tailoring, style recreation, customization, and material sourcing services.',
};

export default function ServicesPage() {
  const services = [
    {
      title: 'Bespoke Tailoring',
      description: 'Custom garments made perfectly to your measurements. We specialize in both English wear and traditional Native wear for men, women, and children.',
      icon: Scissors,
      align: 'left',
      image: '/images/services/bespoke.jpg'
    },
    {
      title: 'Style Recreation',
      description: 'Have a reference image? Show us an inspiration piece and our tailors will craft an interpretation that captures the essence while fitting you flawlessly.',
      icon: ImageIcon,
      align: 'right',
      image: '/images/services/recreation.jpg'
    },
    {
      title: 'Style Customization',
      description: 'Choose any style from our library and make it your own. Adjust the length, change the collar, or request a different fabric—the choice is yours.',
      icon: Wand2,
      align: 'left',
      image: '/images/services/customization.jpg'
    },
    {
      title: 'Material Sourcing',
      description: 'You can provide your own fabric, or let KINGJOEBRIDD source premium materials for you. We select only the highest quality textiles for our creations.',
      icon: PackageSearch,
      align: 'right',
      image: '/images/services/material.jpg'
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-black)] relative overflow-hidden pt-32 selection:bg-[var(--color-white)] selection:text-[var(--color-black)]">
      {/* Decorative large background text with premium hollow effect */}
      <div className="absolute top-24 left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-50 z-0">
        <span 
          className="text-[9vw] font-display font-normal leading-none tracking-[0.2em] whitespace-nowrap text-transparent"
          style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.4)' }}
        >
          KINGJOEBRIDD
        </span>
      </div>

      <div className="container max-w-7xl relative z-10">
        <header className="mb-32 text-center max-w-4xl mx-auto relative pt-8">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center justify-center mb-8">
              {/* Elegant vertical accent line */}
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-[var(--color-white)]/30 to-transparent mb-8"></div>
              
              <h1 className="font-display flex flex-col items-center">
                <span className="text-sm md:text-lg tracking-[0.6em] text-[var(--color-ash)] font-light mb-4 uppercase ml-[0.6em]">
                  Signature
                </span>
                <span className="text-5xl md:text-8xl text-[var(--color-white)] tracking-widest uppercase">
                  Services
                </span>
              </h1>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <div className="relative inline-block mt-2">
              <p className="text-lg md:text-2xl text-[var(--color-ash)] font-light leading-relaxed max-w-2xl mx-auto italic">
                "Elevating your wardrobe through precision, creativity, and the finest materials available."
              </p>
            </div>
          </ScrollReveal>
        </header>

        <div className="flex flex-col gap-24 md:gap-32">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isRight = service.align === 'right';
            return (
              <div 
                key={idx} 
                className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 group`}
              >
                {/* Visual Image Block */}
                <ScrollReveal direction={isRight ? 'right' : 'left'} className="w-full md:w-1/2 aspect-[4/3] bg-white/5 relative overflow-hidden flex items-center justify-center">
                   
                   <Image 
                     src={service.image} 
                     alt={service.title} 
                     fill 
                     className="object-cover transition-transform duration-1000 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, 50vw"
                   />
                   
                   <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700"></div>

                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--color-white)] shadow-xl flex items-center justify-center relative z-10 transition-transform duration-700">
                     <Icon className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-black)]" strokeWidth={1} />
                   </div>
                   
                   <div className="absolute bottom-8 right-8 font-display text-8xl text-white/40 font-normal z-10 drop-shadow-md">
                     0{idx + 1}
                   </div>
                </ScrollReveal>
                
                {/* Text Content */}
                <ScrollReveal direction={isRight ? 'left' : 'right'} delay={150} className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-display text-2xl text-[var(--color-ash)]">0{idx + 1}</span>
                    <div className="h-px bg-[var(--color-white)] w-12"></div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display text-[var(--color-white)] mb-6 tracking-wide font-normal">{service.title}</h2>
                  <p className="text-lg md:text-xl text-[var(--color-ash)] leading-relaxed font-light">
                    {service.description}
                  </p>
                </ScrollReveal>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer CTA */}
      <section className="relative mt-32 py-40 bg-[var(--color-black)] text-white text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 z-0 flex items-center justify-center motion-safe-transition duration-[2s]">
          <Image
            src="/images/ready-to-begin-img.jpg"
            alt="Bespoke fashion design"
            fill
            className="object-contain object-center"
          />
          {/* Gradient fades for side-by-side blending */}
          <div className="absolute inset-y-0 left-0 w-1/4 md:w-1/3 bg-gradient-to-r from-[var(--color-black)] via-[var(--color-black)]/80 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-1/4 md:w-1/3 bg-gradient-to-l from-[var(--color-black)] via-[var(--color-black)]/80 to-transparent z-10" />
          {/* Gradient fade for the bottom */}
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/80 to-transparent z-10" />
        </div>
        
        <ScrollReveal direction="up" className="container relative z-10 max-w-4xl mx-auto px-4">
          <h3 className="text-5xl md:text-7xl font-display mb-8 uppercase tracking-widest drop-shadow-lg">Ready to begin?</h3>
          <p className="text-white/80 text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Book a consultation with our master tailors and start your bespoke journey today.
          </p>
          <Link
            href="/contact"
            className={buttonClasses({ variant: 'secondary-dark', size: 'lg', className: 'inline-flex px-12 py-6 text-sm tracking-[0.2em]' })}
          >
            START A REQUEST
          </Link>
        </ScrollReveal>
      </section>
    </main>
  );
}
