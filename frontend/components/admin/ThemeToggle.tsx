'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 text-[var(--color-black)] hover:bg-[var(--color-light-ash)]/50 transition-colors rounded-full relative group"
      title="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
