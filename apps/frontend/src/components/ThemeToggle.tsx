'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Éviter l'hydratation mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-lg border-gray-200 dark:border-gray-700 
                   bg-white/90 dark:bg-gray-800/90 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20
                   hover:border-blue-300 dark:hover:border-blue-700
                   text-gray-600 dark:text-gray-400
                   hover:text-blue-600 dark:hover:text-blue-400
                   transition-all duration-200"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="h-10 w-10 rounded-lg border-gray-200 dark:border-gray-700 
                 bg-white/90 dark:bg-gray-800/90 
                 hover:bg-blue-50 dark:hover:bg-blue-900/20
                 hover:border-blue-300 dark:hover:border-blue-700
                 text-gray-600 dark:text-gray-400
                 hover:text-blue-600 dark:hover:text-blue-400
                 transition-all duration-200"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
