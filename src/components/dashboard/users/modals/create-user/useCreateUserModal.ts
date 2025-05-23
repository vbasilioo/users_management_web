'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createUser } from '@/lib/redux/features/users/usersSlice';
import { CreateUserValues } from '@/schemas/user.schemas';
import { useAbility } from '@/lib/casl/AbilityContext';

interface UseCreateUserModalReturn {
  isSubmitting: boolean;
  permissionError: string | null;
  isAdmin: boolean;
  handleSubmit: (data: CreateUserValues) => Promise<boolean>;
}

export function useCreateUserModal(onSuccess?: () => void, onClose?: () => void): UseCreateUserModalReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  const ability = useAbility();
  const isAdmin = currentUser?.role === 'admin';
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserValues): Promise<boolean> => {
    if (!ability.can('create', 'User')) {
      setPermissionError("Only administrators can create new users");
      return false;
    }

    try {
      setIsSubmitting(true);
      setPermissionError(null);
      
      const resultAction = await dispatch(createUser(data));
      
      if (createUser.fulfilled.match(resultAction)) {
        toast.success('User created successfully');
        onSuccess?.();
        onClose?.();
        return true;
      } else if (createUser.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload as string || 'Failed to create user';
        toast.error(errorMessage);
        return false;
      }
      
      return false;
    } catch (error: unknown) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    permissionError,
    isAdmin,
    handleSubmit
  };
} 