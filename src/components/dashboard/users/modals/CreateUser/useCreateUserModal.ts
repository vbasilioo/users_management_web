'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useUsers } from '@/components/dashboard/users/useUsers';
import { useAppSelector } from '@/lib/redux/hooks';
import { CreateUserValues } from '@/schemas/user.schemas';

interface UseCreateUserModalReturn {
  isSubmitting: boolean;
  permissionError: string | null;
  isAdmin: boolean;
  handleSubmit: (data: CreateUserValues) => Promise<boolean>;
}

export function useCreateUserModal(onSuccess?: () => void, onClose?: () => void): UseCreateUserModalReturn {
  const { createUser } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useAppSelector(state => state.auth.user);
  const isAdmin = currentUser?.role === 'admin';
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserValues): Promise<boolean> => {
    if (!isAdmin) {
      setPermissionError("Only administrators can create new users");
      return false;
    }

    try {
      setIsSubmitting(true);
      setPermissionError(null);
      const success = await createUser(data);
      
      if (success) {
        toast.success('User created successfully');
        onSuccess?.();
        onClose?.();
        return true;
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