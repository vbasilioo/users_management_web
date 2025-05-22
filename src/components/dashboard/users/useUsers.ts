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
import { useState, useCallback, useRef, useMemo } from 'react';
import { CreateUserDto, UpdateUserDto } from '@/app/@types/api';

export function useUsers() {
  // Armazenar erro em estado
  const [error, setError] = useState<string | null>(null);
  const errorShown = useRef<Record<string, boolean>>({});

  // Memoizar a função de tratamento de erro para evitar recriação
  const handleError = useCallback((message: string, key?: string) => {
    setError(message);
    
    const errorKey = key || message;
    if (!errorShown.current[errorKey]) {
      errorShown.current[errorKey] = true;
      toast.error(message);
      
      setTimeout(() => {
        errorShown.current[errorKey] = false;
      }, 5000);
    }
  }, []);

  // Memoizar a função de seleção para evitar recriação
  const selectUsers = useCallback((data: unknown) => {
    try {
      // A estrutura da resposta é { error: false, message: "Users retrieved successfully", data: [...] }
      // Acessa diretamente data.data que é o array de usuários
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

  // Usar opções de query memoizadas
  const queryOptions = useMemo(() => ({
    query: {
      select: selectUsers,
      staleTime: 30000, // Reduzir refetches
      refetchOnWindowFocus: false // Evitar refetch ao focar a janela
    }
  }), [selectUsers]);

  const usersQuery = useUsersControllerFindAll(queryOptions);
  
  // Memoizar as operações de mutação
  const createMutationOptions = useMemo(() => ({
    mutation: {
      onSuccess: (data: unknown) => {
        if (data && typeof data === 'object' && 'error' in data && !data.error) {
          toast.success('User created successfully!');
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
  }), [handleError]);

  const updateMutationOptions = useMemo(() => ({
    mutation: {
      onSuccess: (data: unknown) => {
        if (data && typeof data === 'object' && 'error' in data && !data.error) {
          toast.success('User updated successfully!');
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
  }), [handleError]);

  const removeMutationOptions = useMemo(() => ({
    mutation: {
      onSuccess: (data: unknown) => {
        if (data && typeof data === 'object' && 'error' in data && !data.error) {
          toast.success('User removed successfully!');
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
  }), [handleError]);

  const createUserMutation = useUsersControllerCreate(createMutationOptions);
  const updateUserMutation = useUsersControllerUpdate(updateMutationOptions);
  const removeUserMutation = useUsersControllerRemove(removeMutationOptions);

  // Memoizar funções de CRUD
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
      // Atualizar a lista de usuários após criar um novo
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
      // Atualizar a lista de usuários após editar
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
      // Atualizar a lista de usuários após remover
      usersQuery.refetch();
      return !removeUserMutation.isError;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  }, [removeUserMutation, usersQuery]);

  // Memoizar o objeto de retorno para evitar recriação
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