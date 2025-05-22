'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/auth/useAuth';
import { useRouter } from 'next/navigation';
import { isUser } from '@/constants/roles';

export function useDashboardLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (!isLoading && user && isUser(user.role)) {
      router.push('/dashboard/profile');
    }
  }, [user, isLoading, router]);
  
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