'use client';

import { 
  useUsersControllerFindAll, 
  useUsersControllerCreate,
  useUsersControllerUpdate,
  useUsersControllerRemove
} from '@/app/api/generated/users/users';
import { 
  createUserSchema, 
  updateUserSchema,
  type CreateUserValues,
  type UpdateUserValues
} from '@/schemas/user.schemas';
import { toast } from 'sonner';
import { useState, useCallback, useMemo } from 'react';
import { CreateUserDto, UpdateUserDto } from '@/app/@types/api';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse {
  error: boolean;
  message: string;
  data: {
    data: User[];
    meta: PaginationMeta;
  };
}

export function useUsers() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1');
  const perPage = z.coerce.number().parse(searchParams.get('perPage') ?? '10');
  const search = searchParams.get('search') || '';

  const handleError = useCallback((message: string, context: string) => {
    setError(message);
    console.error(`Error in ${context}:`, message);
    toast.error(message, {
      description: 'Please try again or contact support if the problem persists',
      duration: 3000,
    });
  }, []);

  const selectUsers = useCallback((data: unknown) => {
    try {
      if (
        data && 
        typeof data === 'object' && 
        'error' in data && 
        !data.error && 
        'data' in data &&
        typeof data.data === 'object' &&
        data.data &&
        'data' in data.data &&
        Array.isArray(data.data.data)
      ) {
        const response = data as ApiResponse;
        return {
          users: response.data.data,
          pagination: response.data.meta
        };
      } else {
        const message = typeof data === 'object' && data && 'message' in data ? String(data.message) : 'Invalid response format';
        handleError(message, 'users-list');
        return {
          users: [] as User[],
          pagination: {
            total: 0,
            currentPage: 1,
            perPage: 10,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false
          }
        };
      }
    } catch {
      handleError('Failed to fetch users', 'users-list-error');
      return {
        users: [] as User[],
        pagination: {
          total: 0,
          currentPage: 1,
          perPage: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
  }, [handleError]);

  const usersQuery = useUsersControllerFindAll(
    { search, page, perPage },
    {
      query: {
        select: selectUsers,
        staleTime: 30000,
        refetchOnWindowFocus: false
      }
    }
  );

  const createMutationOptions = useMemo(() => ({
    mutation: {
      onSuccess: (data: unknown) => {
        if (data && typeof data === 'object' && 'error' in data && !data.error) {
          toast.success('User created successfully!', {
            description: 'The user can now log in to the system',
            duration: 2000,
          });
          queryClient.invalidateQueries({ queryKey: ['users'] });
        } else {
          const message = typeof data === 'object' && data && 'message' in data ? String(data.message) : 'Error creating user';
          handleError(message, 'create-user');
        }
      },
      onError: (error: unknown) => {
        const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Error creating user';
        handleError(message, 'create-user-error');
      }
    }
  }), [handleError, queryClient]);

  const updateMutationOptions = useMemo(() => ({
    mutation: {
      onSuccess: (data: unknown) => {
        if (data && typeof data === 'object' && 'error' in data && !data.error) {
          toast.success('User updated successfully!', {
            description: 'The changes have been saved',
            duration: 2000,
          });
          queryClient.invalidateQueries({ queryKey: ['users'] });
        } else {
          const message = typeof data === 'object' && data && 'message' in data ? String(data.message) : 'Error updating user';
          handleError(message, 'update-user');
        }
      },
      onError: (error: unknown) => {
        const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Error updating user';
        handleError(message, 'update-user-error');
      }
    }
  }), [handleError, queryClient]);

  const removeMutationOptions = useMemo(() => ({
    mutation: {
      onSuccess: (data: unknown) => {
        if (data && typeof data === 'object' && 'error' in data && !data.error) {
          toast.success('User removed successfully!', {
            description: 'The user has been deleted from the system',
            duration: 2000,
          });
          queryClient.invalidateQueries({ queryKey: ['users'] });
        } else {
          const message = typeof data === 'object' && data && 'message' in data ? String(data.message) : 'Error removing user';
          handleError(message, 'remove-user');
        }
      },
      onError: (error: unknown) => {
        const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Error removing user';
        handleError(message, 'remove-user-error');
      }
    }
  }), [handleError, queryClient]);

  const createUserMutation = useUsersControllerCreate(createMutationOptions);
  const updateUserMutation = useUsersControllerUpdate(updateMutationOptions);
  const removeUserMutation = useUsersControllerRemove(removeMutationOptions);

  const createUser = useCallback(async (userData: CreateUserValues) => {
    const result = createUserSchema.safeParse(userData);
    if (!result.success) {
      handleError('Invalid user data', 'create-validation');
      console.error('Validation error:', result.error);
      return false;
    }
    
    try {
      const createUserData: CreateUserDto = {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
        role: result.data.role
      };

      await createUserMutation.mutateAsync({ data: createUserData });
      return !createUserMutation.isError;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }, [createUserMutation, handleError]);

  const updateUser = useCallback(async (id: string, userData: UpdateUserValues) => {
    const result = updateUserSchema.safeParse(userData);
    if (!result.success) {
      handleError('Invalid user data', 'update-validation');
      console.error('Validation error:', result.error);
      return false;
    }
    
    try {
      const updateUserData: UpdateUserDto = {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password
      };
      
      if (result.data.role) {
        updateUserData.role = result.data.role;
      }

      await updateUserMutation.mutateAsync({ 
        id, 
        data: updateUserData 
      });
      return !updateUserMutation.isError;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }, [updateUserMutation, handleError]);

  const removeUser = useCallback(async (id: string) => {
    try {
      await removeUserMutation.mutateAsync({ id });
      return !removeUserMutation.isError;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  }, [removeUserMutation]);

  return useMemo(() => ({
    users: usersQuery.data?.users || [],
    pagination: usersQuery.data?.pagination || {
      total: 0,
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    },
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error,
    
    createUser,
    updateUser,
    removeUser,
    
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isRemoving: removeUserMutation.isPending,
    
    refreshUsers: (newPage?: number) => {
      if (newPage) {
        queryClient.invalidateQueries({ 
          queryKey: ['users', { page: newPage, perPage, search }]
        });
      } else {
        queryClient.invalidateQueries({ 
          queryKey: ['users']
        });
      }
    }
  }), [
    usersQuery.data,
    usersQuery.isLoading,
    usersQuery.isError,
    error,
    createUser,
    updateUser,
    removeUser,
    queryClient,
    createUserMutation.isPending,
    updateUserMutation.isPending,
    removeUserMutation.isPending,
    queryClient,
    perPage,
    search
  ]);
} 