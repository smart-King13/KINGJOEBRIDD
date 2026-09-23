'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const isHiddenPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/account') || pathname?.startsWith('/admin');

  if (isHiddenPage) {
    return null;
  }

  return (
    <footer className="bg-[var(--color-black)] text-white pt-24 pb-8 overflow-hidden relative">
      {/* Decorative top border for transition from white pages */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="container px-6 md:px-8 relative z-10">
        {/* Top Section: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-left gap-16 mb-16">
          
          {/* Brand & Mission */}
          <div className="max-w-md flex flex-col items-center lg:items-start">
            <h2 className="font-display text-2xl tracking-[0.3em] mb-6 uppercase">KingJoeBridd</h2>
            <p className="text-white/50 text-sm leading-relaxed font-light mb-8 lg:pr-8">
              A digital fashion house where inspiration becomes craftsmanship. Bespoke tailoring redefined for the modern connoisseur.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <a href="#" aria-label="Instagram" className="text-white/40 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-white/40 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.039z"/>
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="text-white/40 hover:text-white transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:gap-24 w-full lg:w-auto text-center lg:text-left">
            <div>
              <h4 className="font-display text-xs tracking-[0.2em] text-white/40 mb-8 uppercase">Explore</h4>
              <ul className="space-y-4 text-sm font-light text-white/80">
                <li><Link href="/about" className="hover:text-white transition-colors">The House</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/styles" className="hover:text-white transition-colors">Collections</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">Process</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-xs tracking-[0.2em] text-white/40 mb-8 uppercase">Support</h4>
              <ul className="space-y-4 text-sm font-light text-white/80">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
            <h4 className="font-display text-xs tracking-[0.2em] text-white/40 mb-8 uppercase">Join The House</h4>
            <p className="text-white/50 text-xs mb-6 max-w-[250px] font-light leading-relaxed">
              Subscribe for exclusive bespoke collections and editorial updates.
            </p>
            <form className="flex border-b border-white/20 pb-3 group focus-within:border-white transition-colors w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30 w-full lg:w-64 font-light text-center lg:text-left"
              />
              <button type="button" className="text-white/40 group-focus-within:text-white transition-colors ml-4">
                <ArrowRight size={18} strokeWidth={1} />
              </button>
            </form>
          </div>

        </div>

        {/* Giant Watermark Text */}
        <div className="w-full overflow-hidden flex justify-center items-center py-4 opacity-[0.03] select-none pointer-events-none mb-8">
          <span className="text-[13vw] font-display font-black leading-none tracking-tighter whitespace-nowrap text-white">
            KINGJOEBRIDD
          </span>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 pt-8 border-t border-white/10 tracking-wider uppercase text-center md:text-left">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} KINGJOEBRIDD FASHION. ALL RIGHTS RESERVED.</p>
          <p className="tracking-[0.3em]">Crafted in Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}
