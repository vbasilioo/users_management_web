'use client';

import { Spinner } from '@/components/ui/Spinner';
import { useUsersPage } from './useUsersPage';
import { UserCards } from '@/components/dashboard/users';

export default function UsersPage() {
  const {
    user,
    hasPermission
  } = useUsersPage();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <div className="container mx-auto py-4">
      <UserCards />
    </div>
  );
} 