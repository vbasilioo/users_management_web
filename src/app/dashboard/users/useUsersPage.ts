'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchUsersStart, fetchUsersSuccess, fetchUsersFailed } from '@/lib/redux/slices/usersSlice';
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

  const usersQuery = useUsersControllerFindAll({
    query: {
      enabled: ability.can('read', 'User'),
      select: (data) => {
        const result = usersListResponseSchema.safeParse(data);
        
        if (result.success && result.data.data && !result.data.error) {
          dispatch(fetchUsersSuccess(result.data.data.users));
          return result.data.data.users;
        } else {
          const message = result.success ? result.data.message : 'Invalid response format';
          dispatch(fetchUsersFailed(message));
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
      dispatch(fetchUsersStart());
      usersQuery.refetch();
    }
  }, [ability, dispatch, hasPermission, isLoading, router, users.length, usersQuery]);

  useEffect(() => {
    if (usersQuery.error) {
      dispatch(fetchUsersFailed('Failed to fetch users'));
      toast.error('Failed to fetch users');
    }
  }, [dispatch, usersQuery.error]);

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