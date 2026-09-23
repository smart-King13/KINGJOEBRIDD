import { Metadata } from 'next';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'How It Works | KINGJOEBRIDD',
  description: 'The journey from inspiration to creation at KINGJOEBRIDD.',
};

export default function HowItWorksPage() {
  const steps = [
    { title: 'Discover', desc: 'Explore styles and find something you love.' },
    { title: 'Choose or Inspire', desc: 'Choose an existing style or show us your own inspiration.' },
    { title: 'Tell Us', desc: 'Describe what you want.' },
    { title: 'Material', desc: 'Use your own material or ask KINGJOEBRIDD to source it.' },
    { title: 'Measure', desc: 'Provide your measurements or arrange measurement with the tailor.' },
    { title: 'Quote', desc: 'Receive a personalized quote.' },
    { title: 'Create', desc: 'KINGJOEBRIDD cuts, sews, finishes and prepares your garment.' },
    { title: 'Receive', desc: 'Pick it up or have it delivered.' },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-black)] pt-32 pb-32 overflow-hidden selection:bg-[var(--color-white)] selection:text-[var(--color-black)]">
      <div className="container max-w-4xl">
        <header className="mb-24 text-center">
          <ScrollReveal direction="up">
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-white)] mb-6 tracking-widest uppercase">
              How It Works
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl text-[var(--color-ash)] font-light leading-relaxed max-w-2xl mx-auto">
              Our process is built around collaboration and craftsmanship. Here is the journey of your garment from vision to reality.
            </p>
          </ScrollReveal>
        </header>

        <div className="space-y-12 md:space-y-24 relative before:absolute before:inset-0 before:ml-[27px] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--color-white)]/10">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className="relative flex md:justify-between flex-col md:flex-row gap-8 md:gap-0 pt-6 md:pt-0">
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 transform md:-translate-y-1/2 md:-translate-x-1/2 z-10 flex justify-center w-14">
                  <ScrollReveal direction="up" className="w-14 h-14 rounded-full border-4 border-[var(--color-black)] bg-[var(--color-white)] text-[var(--color-black)] flex items-center justify-center font-display text-lg shadow-sm">
                    0{idx + 1}
                  </ScrollReveal>
                </div>

                {/* Content */}
                <ScrollReveal direction={isEven ? 'left' : 'right'} delay={150} className={`w-full md:w-5/12 pl-24 md:pl-0 ${isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16 md:ml-auto'}`}>
                  <h3 className="text-2xl font-display text-[var(--color-white)] mb-3">{step.title}</h3>
                  <p className="text-[var(--color-ash)] leading-relaxed">{step.desc}</p>
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        <div className="mt-32 text-center">
          <Link
            href="/styles"
            className={buttonClasses({ variant: 'secondary-dark', size: 'lg', className: 'inline-flex' })}
          >
            START YOUR JOURNEY
          </Link>
        </div>
      </div>
    </main>
  );
}
