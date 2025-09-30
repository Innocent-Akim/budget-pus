'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { JotaiProvider } from './JotaiProvider';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <JotaiProvider>
      <QueryProvider>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              {children}
          </ThemeProvider>
        </SessionProvider>
      </QueryProvider>
    </JotaiProvider>
  );
}
