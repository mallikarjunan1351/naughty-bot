'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleProps {
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

export default function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    
    if (!savedTheme) {
      localStorage.setItem('theme', initialTheme);
    }
    
    if (onThemeChange) {
      onThemeChange(initialTheme);
    }
  }, [onThemeChange]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="rounded-full dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-700" />
      )}
    </Button>
  );
} 