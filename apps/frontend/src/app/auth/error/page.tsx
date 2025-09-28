'use client';

import { AuthError } from '@/components/AuthError';
import { useRouter } from 'next/navigation';

export default function AuthErrorPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  return <AuthError onRetry={handleRetry} />;
}
