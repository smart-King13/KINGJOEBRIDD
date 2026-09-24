'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { CustomerCommandPalette } from '@/components/customer/CustomerCommandPalette';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '@/components/admin/ThemeToggle';
import { 
  Menu, X, LogOut, ArrowLeft, 
  LayoutDashboard, Inbox, MessageSquare, Ruler, 
  FileText, ShoppingBag, Scissors, Bell, Search, User
} from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcut for Command Palette (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigationGroups = [
    {
      title: 'Workspace',
      items: [
        { name: 'Overview', href: '/account', icon: LayoutDashboard }
      ]
    },
    {
      title: 'My Wardrobe',
      items: [
        { name: 'My Styles', href: '/account/styles', icon: Scissors },
        { name: 'Style Requests', href: '/account/requests', icon: Inbox },
        { name: 'Measurements', href: '/account/measurements', icon: Ruler },
      ]
    },
    {
      title: 'Orders & Communication',
      items: [
        { name: 'Conversations', href: '/account/conversations', icon: MessageSquare },
        { name: 'Quotes', href: '/account/quotes', icon: FileText },
        { name: 'Orders', href: '/account/orders', icon: ShoppingBag },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', href: '/account/profile', icon: User },
        { name: 'Notifications', href: '/account/notifications', icon: Bell },
      ]
    }
  ];

  // Flatten for mobile title logic
  const allNavigationItems = navigationGroups.flatMap(g => g.items);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex min-h-screen w-full bg-[var(--color-white)] text-[var(--color-black)]">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-[var(--color-light-ash)] bg-[var(--color-white)] h-screen fixed left-0 top-0 z-40 motion-safe-transition">
        <div className="p-8 h-24 flex items-center">
          <Link href="/account" className="hover:opacity-80 transition-opacity flex items-center">
            <img src="/images/KJLOGO.png" alt="KINGJOEBRIDD Logo" className="object-contain h-12 w-auto -mr-3" />
            <span className="font-display text-lg tracking-widest text-[var(--color-black)] font-bold">KINGJOEBRIDD</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-8 py-4 hide-scrollbar">
            {navigationGroups.map((group, gIdx) => (
              <div key={group.title} className={gIdx > 0 ? "mt-8" : ""}>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-4 px-2">
                  {group.title}
                </div>
                <nav className="flex flex-col space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account');
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-sm group flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'font-medium text-[var(--color-black)] bg-[var(--color-light-ash)]/40 shadow-sm' 
                            : 'text-[var(--color-ash)] hover:text-[var(--color-black)] hover:bg-[var(--color-light-ash)]/20'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-black)]' : 'text-[var(--color-ash)] group-hover:text-[var(--color-black)]'} transition-colors`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
        </div>

        <div className="p-8 mt-auto flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-white)] text-[var(--color-black)] transition-colors w-fit">
            <ArrowLeft className="w-3 h-3" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-[var(--color-black)]/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-[var(--color-white)] text-[var(--color-black)] shadow-2xl h-full animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-light-ash)]">
              <span className="font-display text-lg tracking-widest">KJ CUSTOMER</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-[var(--color-black)] hover:opacity-70">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <nav className="flex flex-col space-y-8">
                {navigationGroups.map((group) => (
                  <div key={group.title}>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-4">
                      {group.title}
                    </div>
                    <div className="flex flex-col space-y-2">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account');
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 text-[15px] py-2.5 px-4 rounded-xl transition-all duration-300 ${
                              isActive ? 'font-medium text-[var(--color-black)] bg-[var(--color-light-ash)]/40 shadow-sm' : 'text-[var(--color-ash)] hover:text-[var(--color-black)] hover:bg-[var(--color-light-ash)]/20'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-black)]' : 'text-[var(--color-ash)] group-hover:text-[var(--color-black)]'} transition-colors`} />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-12 pt-6 border-t border-[var(--color-light-ash)]">
                <Link href="/" className="flex items-center gap-2 text-sm text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen bg-[var(--color-background-subtle)]">
        {/* Top Header */}
        <header className="h-24 sticky top-0 z-30 px-6 sm:px-12 flex items-center justify-between bg-[var(--color-background-subtle)]/80 backdrop-blur-xl border-b border-[var(--color-light-ash)]/40">
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 mr-4 text-[var(--color-black)]">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display text-lg tracking-widest truncate">
              {allNavigationItems.find(n => pathname.startsWith(n.href) && n.href !== '/account')?.name || 'Overview'}
            </span>
          </div>
          
          <div className="hidden md:flex flex-col justify-center h-full">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash)] mb-1">
              {navigationGroups.find(g => g.items.some(i => pathname.startsWith(i.href) && i.href !== '/account'))?.title || 'Workspace'} / 
            </span>
            <h1 className="font-display text-2xl tracking-wide text-[var(--color-black)]">
              {allNavigationItems.find(n => pathname.startsWith(n.href) && n.href !== '/account')?.name || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 h-full">
            {/* Utility Icons */}
            <div className="flex items-center gap-1 sm:gap-4 md:border-r border-[var(--color-light-ash)]/40 md:pr-6">
              <ThemeToggle />
              <button 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden md:block p-2 text-[var(--color-black)] hover:bg-[var(--color-light-ash)]/50 transition-colors rounded-full relative group"
                title="Search (Cmd+K)"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <Link href="/account/notifications" className="hidden md:block p-2 text-[var(--color-black)] hover:bg-[var(--color-light-ash)]/50 transition-colors rounded-full relative group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[var(--color-white)]"></span>
              </Link>
            </div>

            {/* Profile */}
            <Link href="/account/profile" className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-[var(--color-black)] group-hover:opacity-70 transition-opacity">{user?.name}</div>
                <div className="text-[10px] text-[var(--color-ash)] uppercase tracking-[0.1em]">Customer</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-[var(--color-black)] flex items-center justify-center text-[var(--color-white)] font-medium text-sm ring-2 ring-[var(--color-light-ash)] ring-offset-2 ring-offset-[var(--color-background-subtle)] group-hover:ring-[var(--color-black)] transition-all duration-300 shadow-sm overflow-hidden">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${user.avatar_url}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span>{user?.name?.charAt(0) || 'C'}</span>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full pb-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-12 pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
      <CustomerCommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
