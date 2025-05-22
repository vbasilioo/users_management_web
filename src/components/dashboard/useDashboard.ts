'use client';

import { useAuth } from '@/components/auth/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  return {
    user,
    logout,
    isLoading
  };
} 