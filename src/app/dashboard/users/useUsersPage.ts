'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchUsers } from '@/lib/redux/features/users/usersSlice';
import { useUsersControllerFindAll } from '@/app/api/generated/users/users';
import { usersListResponseSchema } from '@/schemas/api.schemas';
import { toast } from 'sonner';
import { useAbility } from '@/lib/casl/AbilityContext';
import { useRouter } from 'next/navigation';
import { isAdminOrManager } from '@/constants/roles';

export function useUsersPage() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector(state => state.users);
  const { user } = useAppSelector(state => state.auth);
  const ability = useAbility();
  const router = useRouter();

  const usersQuery = useUsersControllerFindAll(undefined, {
    query: {
      enabled: ability.can('read', 'User'),
      select: (data) => {
        const result = usersListResponseSchema.safeParse(data);
        
        if (result.success && result.data.data && !result.data.error) {
          return result.data.data.users;
        } else {
          const message = result.success ? result.data.message : 'Invalid response format';
          toast.error(message);
          return [];
        }
      }
    }
  });

  const hasPermission = ability.can('read', 'User') && user && isAdminOrManager(user.role);

  useEffect(() => {
    if (!hasPermission) {
      toast.error('You do not have permission to view this page');
      router.push('/dashboard');
      return;
    }

    if (!isLoading && users.length === 0) {
      dispatch(fetchUsers())
        .unwrap()
        .catch((error) => {
          toast.error(error || 'Failed to fetch users');
        });
    }
  }, [ability, dispatch, hasPermission, isLoading, router, users.length]);

  useEffect(() => {
    if (usersQuery.error) {
      toast.error('Failed to fetch users');
    }
  }, [usersQuery.error]);

  const navigateToNewUser = () => router.push('/dashboard/users/new');
  const navigateToEditUser = (userId: string) => router.push(`/dashboard/users/${userId}`);

  return {
    users,
    user,
    isLoading,
    error,
    ability,
    navigateToNewUser,
    navigateToEditUser,
    hasPermission
  };
} 