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

export function useUsers() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
      if (data && typeof data === 'object' && 'error' in data && !data.error && 'data' in data && Array.isArray(data.data)) {
        return data.data;
      } else {
        const message = typeof data === 'object' && data && 'message' in data ? String(data.message) : 'Invalid response format';
        handleError(message, 'users-list');
        return [];
      }
    } catch {
      handleError('Failed to fetch users', 'users-list-error');
      return [];
    }
  }, [handleError]);

  const queryOptions = useMemo(() => ({
    query: {
      select: selectUsers,
      staleTime: 30000,
      refetchOnWindowFocus: false
    }
  }), [selectUsers]);

  const usersQuery = useUsersControllerFindAll(queryOptions);
  
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
      usersQuery.refetch();
      return !createUserMutation.isError;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }, [createUserMutation, handleError, usersQuery]);

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
      usersQuery.refetch();
      return !updateUserMutation.isError;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }, [updateUserMutation, handleError, usersQuery]);

  const removeUser = useCallback(async (id: string) => {
    try {
      await removeUserMutation.mutateAsync({ id });
      usersQuery.refetch();
      return !removeUserMutation.isError;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  }, [removeUserMutation, usersQuery]);

  return useMemo(() => ({
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error,
    
    createUser,
    updateUser,
    removeUser,
    
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isRemoving: removeUserMutation.isPending,
    
    refreshUsers: usersQuery.refetch
  }), [
    usersQuery.data,
    usersQuery.isLoading,
    usersQuery.isError,
    usersQuery.refetch,
    error,
    createUser,
    updateUser,
    removeUser,
    createUserMutation.isPending,
    updateUserMutation.isPending,
    removeUserMutation.isPending
  ]);
} 