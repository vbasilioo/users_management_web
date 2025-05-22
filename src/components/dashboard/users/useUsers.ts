'use client';

import { 
  useUsersControllerFindAll, 
  useUsersControllerFindOne, 
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
import { 
  usersListResponseSchema,
  userResponseSchema
} from '@/schemas/api.schemas';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { CreateUserDto, UpdateUserDto } from '@/app/@types/api';

export function useUsers() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((message: string) => {
    setError(message);
    toast.error(message);
  }, []);

  const usersQuery = useUsersControllerFindAll({
    query: {
      select: (data) => {
        const result = usersListResponseSchema.safeParse(data);
        
        if (result.success && result.data.data && !result.data.error) {
          return result.data.data.users;
        } else {
          handleError(result.success ? result.data.message : 'Invalid response format');
          return [];
        }
      }
    }
  });

  const useUserById = (id: string) => {
    return useUsersControllerFindOne(id, {
      query: {
        select: (data) => {
          const result = userResponseSchema.safeParse(data);
          
          if (result.success && result.data.data && !result.data.error) {
            return result.data.data.user;
          } else {
            handleError(result.success ? result.data.message : 'Invalid response format');
            return null;
          }
        }
      }
    });
  };

  const createUserMutation = useUsersControllerCreate({
    mutation: {
      onSuccess: (data) => {
        const result = userResponseSchema.safeParse(data);
        
        if (result.success && !result.data.error) {
          toast.success('User created successfully!');
        } else {
          handleError(result.success ? result.data.message : 'Error creating user');
        }
      },
      onError: () => {
        handleError('Error creating user');
      }
    }
  });

  const updateUserMutation = useUsersControllerUpdate({
    mutation: {
      onSuccess: (data) => {
        const result = userResponseSchema.safeParse(data);
        
        if (result.success && !result.data.error) {
          toast.success('User updated successfully!');
        } else {
          handleError(result.success ? result.data.message : 'Error updating user');
        }
      },
      onError: () => {
        handleError('Error updating user');
      }
    }
  });

  const removeUserMutation = useUsersControllerRemove({
    mutation: {
      onSuccess: (data) => {
        if (!data.error) {
          toast.success('User removed successfully!');
        } else {
          handleError(data.message);
        }
      },
      onError: () => {
        handleError('Error removing user');
      }
    }
  });

  const createUser = async (userData: CreateUserValues) => {
    const result = createUserSchema.safeParse(userData);
    if (!result.success) {
      handleError('Invalid user data');
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
  };

  const updateUser = async (id: string, userData: UpdateUserValues) => {
    const result = updateUserSchema.safeParse(userData);
    if (!result.success) {
      handleError('Invalid user data');
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
  };

  const removeUser = async (id: string) => {
    try {
      await removeUserMutation.mutateAsync({ id });
      return !removeUserMutation.isError;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  };

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error,
    
    useUserById,
    createUser,
    updateUser,
    removeUser,
    
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isRemoving: removeUserMutation.isPending,
    
    refreshUsers: usersQuery.refetch
  };
} 