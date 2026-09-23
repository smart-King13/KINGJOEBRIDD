import { Metadata } from 'next';
import Image from 'next/image';
import { Scissors, Ruler, Gem, Heart } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'About KINGJOEBRIDD',
  description: 'A digital fashion house where inspiration becomes craftsmanship. Redefining bespoke tailoring.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-white)] overflow-hidden selection:bg-[var(--color-black)] selection:text-[var(--color-white)]">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 flex flex-col items-center justify-center min-h-[90vh] bg-[var(--color-black)]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about hero-image.png"
            alt="The House fashion design hero"
            fill
            unoptimized
            priority
            className="object-contain"
          />
          {/* Asymmetrical bulletproof vignette - guarantees the left image edge is completely hidden without darkening the model */}
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `
                linear-gradient(to right, var(--color-black) 0%, var(--color-black) 35%, transparent 50%),
                linear-gradient(to left, var(--color-black) 0%, var(--color-black) 5%, transparent 25%),
                linear-gradient(to bottom, var(--color-black) 0%, transparent 20%),
                linear-gradient(to top, var(--color-black) 0%, var(--color-black) 15%, transparent 35%)
              `
            }}
          />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center group">
          <ScrollReveal direction="up">
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white mb-8 tracking-[0.15em] uppercase leading-none drop-shadow-2xl">
              The <br className="md:hidden" /> House
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl md:text-3xl text-white/90 font-light leading-relaxed max-w-3xl drop-shadow-lg translate-y-4">
              KINGJOEBRIDD is more than a tailoring service. We are a digital fashion house bridging the gap between imagination and craftsmanship.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative bg-[var(--color-white)]">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <ScrollReveal direction="right" className="relative aspect-[3/4] rounded-none overflow-hidden group shadow-2xl">
              <Image
                src="/images/Philosopy-img.jpg"
                alt="Tailoring philosophy"
                fill
                quality={100}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700" />
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={200} className="flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[var(--color-black)]" />
                <h2 className="text-sm font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">Our Philosophy</h2>
              </div>
              <h3 className="text-4xl md:text-5xl font-display text-[var(--color-black)] mb-10 leading-tight">
                Bespoke tailoring, redefined for the modern connoisseur.
              </h3>
              
              <div className="space-y-8 text-[var(--color-ash)] text-lg leading-relaxed font-light">
                <p className="first-letter:text-5xl first-letter:font-display first-letter:text-[var(--color-black)] first-letter:mr-2 first-letter:float-left">
                  We believe that clothing should be a reflection of your identity, crafted with precision and care. Fast fashion forces you into pre-determined boxes; bespoke tailoring empowers you to break out of them.
                </p>
                <p>
                  At KINGJOEBRIDD, we combine traditional African craftsmanship with contemporary editorial design. Whether it's a perfectly fitted suit, a majestic agbada, or an elegant evening gown, our tailors treat every garment as a masterpiece.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-[var(--color-ash)]/20 pt-12">
                <div>
                  <h4 className="text-3xl font-display text-[var(--color-black)] mb-2">100+</h4>
                  <p className="text-sm text-[var(--color-ash)] uppercase tracking-wider">Bespoke Pieces</p>
                </div>
                <div>
                  <h4 className="text-3xl font-display text-[var(--color-black)] mb-2">15+</h4>
                  <p className="text-sm text-[var(--color-ash)] uppercase tracking-wider">Master Tailors</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-32 relative bg-[var(--color-black)] text-[var(--color-white)] overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up" className="flex flex-col items-center text-center mb-20">
            <h2 className="text-sm font-bold tracking-[0.2em] text-white/50 mb-6 uppercase">The Craft</h2>
            <h3 className="text-5xl md:text-6xl font-display leading-tight max-w-3xl">
              Every stitch tells a <span className="italic text-white/70">story</span>.
            </h3>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            {/* Portrait Image on the Left */}
            <ScrollReveal direction="right" className="relative aspect-[3/4] lg:aspect-auto w-full h-full rounded-none overflow-hidden shadow-2xl ring-1 ring-white/20">
              <Image
                src="/images/craftman.jpg"
                alt="Craftsmanship detail"
                fill
                quality={100}
                className="object-cover object-center scale-110 hover:scale-[1.2] transition-transform duration-[2s]"
              />
            </ScrollReveal>

            {/* 2x2 Feature Cards Grid on the Right */}
            <div className="grid sm:grid-cols-2 gap-6 h-full">
              {[
                { icon: Ruler, title: "Precision", desc: "Exacting measurements for a flawless silhouette." },
                { icon: Scissors, title: "Craftsmanship", desc: "Hand-cut patterns tailored to your form." },
                { icon: Gem, title: "Quality", desc: "Premium fabrics sourced globally." },
                { icon: Heart, title: "Passion", desc: "Decades of dedication in every garment." },
              ].map((feature, idx) => (
                <ScrollReveal key={idx} direction="up" delay={idx * 150} className="relative overflow-hidden bg-white/5 border border-white/10 p-8 rounded-none hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm cursor-default flex flex-col justify-center h-full min-h-[250px]">
                  {/* Big background icon overlay */}
                  <feature.icon strokeWidth={1} className="absolute -bottom-6 -right-6 w-48 h-48 text-white/[0.02] group-hover:text-white/[0.05] transition-all duration-700 pointer-events-none transform -rotate-12 group-hover:rotate-0 group-hover:scale-110" />
                  
                  {/* Normal icon (no background, bolder) */}
                  <div className="mb-6 group-hover:-translate-y-1 transition-transform duration-500 relative z-10">
                    <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-xl font-display mb-3 tracking-wide relative z-10">{feature.title}</h4>
                  <p className="text-white/60 font-light text-sm relative z-10">{feature.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
