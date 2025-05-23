'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/auth/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { isUser } from '@/constants/roles';

export function useDashboardLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
      return;
    }
    
    if (!isLoading && user && isUser(user.role)) {
      if (pathname === '/dashboard') {
        router.replace('/dashboard/profile');
      }
    }
  }, [user, isLoading, router, pathname]);
  
  const shouldRenderFullLayout = !isLoading && user && !isUser(user.role);
  const shouldRenderSimpleLayout = !isLoading && user && isUser(user.role);
  const shouldShowLoading = isLoading;
  const shouldHideContent = !user;
  
  return {
    user,
    isLoading,
    shouldRenderFullLayout,
    shouldRenderSimpleLayout,
    shouldShowLoading,
    shouldHideContent
  };
} 