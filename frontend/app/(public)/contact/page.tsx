import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Contact | KINGJOEBRIDD',
  description: 'Get in touch with KINGJOEBRIDD for tailoring inquiries, consultations, and more.',
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[var(--color-black)] pt-16 pb-16 selection:bg-[var(--color-white)] selection:text-[var(--color-black)]">
      
      {/* Abstract Background Elements Removed */}

      <div className="container max-w-5xl relative z-10 mx-auto px-4 md:px-6">
        
        <header className="mb-10 text-center">
          <ScrollReveal direction="up">
            <h1 className="font-display text-5xl md:text-8xl text-[var(--color-white)] mb-6 tracking-widest uppercase">
              Contact
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl md:text-2xl text-[var(--color-ash)] font-light max-w-2xl mx-auto leading-relaxed">
              We are here to answer your questions and help you bring your vision to life.
            </p>
          </ScrollReveal>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Contact Details Card */}
          <ScrollReveal direction="left" delay={300} className="lg:col-span-6 flex flex-col justify-center h-full">
            <h2 className="text-3xl md:text-4xl font-display font-light text-[var(--color-white)] mb-8 tracking-wider">The Atelier</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-5 group/item">
                <div className="bg-[var(--color-white)]/10 p-3 rounded-full group-hover/item:bg-[var(--color-white)] group-hover/item:text-[var(--color-black)] transition-colors duration-300 text-[var(--color-white)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-1">Tailoring Inquiries</h3>
                  <p className="text-lg md:text-xl text-[var(--color-white)] font-light">hello@kingjoebridd.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group/item">
                <div className="bg-[var(--color-white)]/10 p-3 rounded-full group-hover/item:bg-[var(--color-white)] group-hover/item:text-[var(--color-black)] transition-colors duration-300 text-[var(--color-white)]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-1">WhatsApp / Phone</h3>
                  <p className="text-lg md:text-xl text-[var(--color-white)] font-light">+234 800 000 0000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group/item">
                <div className="bg-[var(--color-white)]/10 p-3 rounded-full group-hover/item:bg-[var(--color-white)] group-hover/item:text-[var(--color-black)] transition-colors duration-300 text-[var(--color-white)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-1">Location (By Appointment)</h3>
                  <p className="text-lg md:text-xl text-[var(--color-white)] font-light mb-1">Lagos, Nigeria</p>
                  <p className="text-xs text-[var(--color-ash)] italic">Exact location provided upon booking.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group/item">
                <div className="bg-[var(--color-white)]/10 p-3 rounded-full group-hover/item:bg-[var(--color-white)] group-hover/item:text-[var(--color-black)] transition-colors duration-300 text-[var(--color-white)]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-1">Business Hours</h3>
                  <p className="text-lg md:text-xl text-[var(--color-white)] font-light">Mon – Sat: 9:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
          
          {/* Call to Action Side */}
          <ScrollReveal direction="right" delay={400} className="lg:col-span-6 flex flex-col justify-center p-8 md:p-12 lg:p-12">
            <h2 className="text-4xl md:text-5xl font-display text-[var(--color-white)] mb-6 leading-tight">
              Ready to start your bespoke journey?
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-white)] mb-8" />
            <p className="text-xl text-[var(--color-ash)] leading-relaxed mb-12 font-light">
              The fastest way to get started is to submit a style request. Show us what you have in mind, and our tailors will reach out to discuss the details, fabrics, and measurements.
            </p>
            <div>
              <Link 
                href="/style-requests/new" 
                className={`${buttonClasses({ variant: 'secondary-dark', size: 'lg' })} group inline-flex items-center gap-4 text-sm tracking-[0.1em] py-5 px-8 rounded-full`}
              >
                START A REQUEST
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </main>
  );
}
