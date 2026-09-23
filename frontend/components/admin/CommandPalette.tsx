'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, X, LayoutDashboard, Inbox, MessageSquare, 
  Ruler, Users, FileText, ShoppingBag, Scissors, 
  Layers, Package, Bell, User
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard, keywords: ['home', 'main', 'stats'] },
    { name: 'Pending Requests', href: '/admin/requests', icon: Inbox, keywords: ['inbox', 'new'] },
    { name: 'Conversations', href: '/admin/conversations', icon: MessageSquare, keywords: ['chat', 'messages'] },
    { name: 'Measurements', href: '/admin/measurements', icon: Ruler, keywords: ['sizes', 'dimensions'] },
    { name: 'Customers', href: '/admin/customers', icon: Users, keywords: ['clients', 'people', 'users'] },
    { name: 'Quotes', href: '/admin/quotes', icon: FileText, keywords: ['pricing', 'estimates'] },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, keywords: ['sales', 'purchases'] },
    { name: 'Styles', href: '/admin/styles', icon: Scissors, keywords: ['designs', 'catalog'] },
    { name: 'Collections', href: '/admin/collections', icon: Layers, keywords: ['groups', 'catalog'] },
    { name: 'Materials', href: '/admin/materials', icon: Package, keywords: ['fabrics', 'inventory'] },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, keywords: ['alerts', 'updates'] },
    { name: 'My Profile', href: '/admin/profile', icon: User, keywords: ['account', 'settings', 'password'] },
  ];

  const filteredActions = actions.filter(action => {
    const searchStr = `${action.name} ${action.keywords.join(' ')}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery(''); // Reset query on close
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Cmd+K / Ctrl+K to open, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[var(--color-black)]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[var(--color-white)] rounded-2xl shadow-2xl border border-[var(--color-light-ash)]/60 overflow-hidden flex flex-col max-h-[60vh]">
        
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-[var(--color-light-ash)]/40">
          <Search className="w-5 h-5 text-[var(--color-ash)]" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 w-full bg-transparent p-4 text-sm font-medium text-[var(--color-black)] focus:outline-none placeholder:text-[var(--color-ash)]/70"
            placeholder="Type a command or search for a page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[var(--color-ash)] hover:bg-[var(--color-light-ash)]/30 hover:text-[var(--color-black)] transition-colors text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)]/40"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {filteredActions.length > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-2 text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
                Quick Navigation
              </div>
              {filteredActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => handleSelect(action.href)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[var(--color-background-subtle)] group transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-background-subtle)] flex items-center justify-center group-hover:bg-[var(--color-white)] group-hover:shadow-sm transition-all">
                      <Icon className="w-4 h-4 text-[var(--color-black)]" />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-black)]">
                      {action.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-12 text-center flex flex-col items-center">
              <Search className="w-8 h-8 text-[var(--color-light-ash)] mb-3" />
              <p className="text-sm text-[var(--color-ash)] font-medium">No results found.</p>
              <p className="text-xs text-[var(--color-light-ash)] mt-1">Try a different search term.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-[var(--color-light-ash)]/40 bg-[var(--color-background-subtle)] px-4 py-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-[0.1em] text-[var(--color-ash)] uppercase flex items-center gap-1">
            <span className="bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded px-1.5 py-0.5">↑</span>
            <span className="bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded px-1.5 py-0.5">↓</span>
            to navigate
          </p>
          <p className="text-[10px] font-bold tracking-[0.1em] text-[var(--color-ash)] uppercase flex items-center gap-1">
            <span className="bg-[var(--color-white)] border border-[var(--color-light-ash)] rounded px-1.5 py-0.5">Enter</span>
            to select
          </p>
        </div>

      </div>
    </div>
  );
}
