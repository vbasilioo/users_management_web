'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import { Spinner } from '@/components/ui/Spinner';
import { isUser } from '@/constants/roles';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      if (isUser(user.role)) {
        router.replace('/dashboard/profile');
      } else {
        router.replace('/dashboard');
      }
    } else {
      router.replace('/auth/login');
    }
  }, [router, isAuthenticated, user]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="lg" />
    </div>
  );
}
