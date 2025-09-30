'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Temps de cache par défaut (5 minutes)
            staleTime: 5 * 60 * 1000,
            // Temps de cache en mémoire (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Retry automatique en cas d'échec
            retry: (failureCount, error: any) => {
              // Ne pas retry pour les erreurs 4xx (erreurs client)
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // Retry jusqu'à 3 fois pour les autres erreurs
              return failureCount < 3;
            },
            // Délai entre les retries (1 seconde)
            retryDelay: 1000,
            // Refetch automatique quand la fenêtre reprend le focus
            refetchOnWindowFocus: true,
            // Refetch automatique lors de la reconnexion réseau
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry pour les mutations en cas d'échec
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools pour le développement - seulement en mode dev */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
