'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { NotificationBell } from './NotificationBell';
import { Drawer } from '@/components/layout/Drawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { Search, User, Home, Info, Briefcase, Scissors, HelpCircle, Phone, LogOut, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHiddenPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/account') || pathname?.startsWith('/admin') || pathname?.startsWith('/style-requests');

  if (isHiddenPage) {
    return null;
  }

  const publicLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/services', label: 'Services', icon: Briefcase },
    { href: '/styles', label: 'Styles', icon: Scissors },
    { href: '/how-it-works', label: 'How It Works', icon: HelpCircle },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  const authLinks = user?.role === 'admin' 
    ? [
        { href: '/admin', label: 'Admin Dashboard' },
        { href: '/admin/orders', label: 'Manage Orders' },
        { href: '/admin/quotes', label: 'Manage Quotes' },
        { href: '/admin/requests', label: 'Manage Requests' },
      ]
    : [
        { href: '/account/styles', label: 'My Styles' },
        { href: '/account/measurements', label: 'My Measurements' },
        { href: '/account/requests', label: 'My Requests' },
        { href: '/account/quotes', label: 'My Quotes' },
        { href: '/account/orders', label: 'My Orders' },
        { href: '/account/conversations', label: 'Messages' },
        { href: '/account/notifications', label: 'Notifications' },
        { href: '/account/profile', label: 'Profile' },
      ];

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/account';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-ash)]/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-20 items-center justify-between">
        {/* Left Side: Logo */}
        <div className="flex z-10">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/images/KJLOGO.png" 
              alt="KINGJOEBRIDD Logo" 
              className="object-contain h-16 sm:h-16 w-auto -mr-2 sm:-mr-3 scale-[1.35] origin-center" 
            />
            <span className="hidden sm:inline-block font-display text-lg sm:text-xl font-extrabold tracking-[0.2em] text-[var(--color-black)] ml-1 sm:ml-3">
              KINGJOEBRIDD
            </span>
          </Link>
        </div>
        
        {/* Center: Navigation (Desktop) */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 gap-8 items-center z-0">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[var(--color-black)]/80 hover:text-[var(--color-black)] transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Right Side: Actions */}
        <div className="flex items-center gap-1 md:gap-4 z-10">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-black)]/80 hover:text-[var(--color-black)] transition-colors p-2 md:p-0 rounded-full"
            aria-label="Open search"
          >
            <Search className="w-5 h-5 md:w-4 md:h-4" />
            <span className="hidden md:inline">Search</span>
          </button>
          
          <div className="h-4 w-px bg-[var(--color-ash)]/30 hidden md:block" />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-1 md:gap-4">
              <Link href={dashboardHref} className="flex items-center gap-2 text-sm font-medium text-[var(--color-black)]/80 hover:text-[var(--color-black)] hidden sm:flex transition-colors">
                <User className="w-4 h-4" />
                {user?.name || (user?.role === 'admin' ? 'Admin' : 'Account')}
              </Link>
              <NotificationBell />
            </div>
          ) : (
            <div className="flex items-center gap-4 hidden md:flex">
              <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-[var(--color-black)]/80 hover:text-[var(--color-black)] transition-colors">
                <User className="w-4 h-4" />
                Sign In
              </Link>
            </div>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-[var(--color-black)] hover:opacity-70 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>


    </header>
    
    {/* Mobile Drawer */}
    <Drawer
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
      side="right"
      title="MENU"
    >
      <div className="flex flex-col h-full">
        <nav className="flex flex-col gap-2 py-2">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex items-center gap-4 text-[17px] font-medium text-[var(--color-black)] hover:bg-[var(--color-light-ash)]/30 rounded-xl p-3 transition-all"
              >
                <Icon className="w-5 h-5 text-[var(--color-ash)]" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        {isAuthenticated ? (
          <>
            <div className="my-6 h-px bg-[var(--color-ash)]/20" />
            <div className="mb-4 text-xs font-bold tracking-widest text-[var(--color-ash)] uppercase">
              {user?.role === 'admin' ? 'Administration' : 'My KINGJOEBRIDD'}
            </div>
            <nav className="flex flex-col gap-2">
              <Link 
                href={dashboardHref} 
                className="flex items-center gap-4 text-[17px] font-medium text-[var(--color-black)] hover:bg-[var(--color-light-ash)]/30 rounded-xl p-3 transition-all"
              >
                <LayoutDashboard className="w-5 h-5 text-[var(--color-ash)]" />
                {user?.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
              </Link>
            </nav>
            <div className="mt-auto pt-6 pb-12">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-4 text-[17px] font-medium text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-xl p-3 transition-all w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div className="mt-auto pt-6 pb-2 flex flex-col gap-4">
            <Link 
              href="/login" 
              className="w-full h-12 flex items-center justify-center bg-[var(--color-black)] text-[var(--color-white)] font-medium tracking-widest text-sm hover:bg-[var(--color-off-black)] transition-colors"
            >
              SIGN IN
            </Link>
          </div>
        )}
      </div>
    </Drawer>

    {/* Search Overlay */}
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
