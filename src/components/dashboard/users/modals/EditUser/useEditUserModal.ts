'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUsers } from '@/components/dashboard/users/useUsers';
import { useAppSelector } from '@/lib/redux/hooks';
import { UpdateUserValues } from '@/schemas/user.schemas';
import { UserWithDates } from '@/components/dashboard/users/useUserTable';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from '@/schemas/user.schemas';

interface UseEditUserModalReturn {
  form: ReturnType<typeof useForm<UpdateUserValues>>;
  isSubmitting: boolean;
  permissionError: string | null;
  isAdmin: boolean;
  handleSubmit: (data: UpdateUserValues) => Promise<void>;
}

export function useEditUserModal(
  user: UserWithDates | null,
  onSuccess?: () => void,
  onClose?: () => void
): UseEditUserModalReturn {
  const { updateUser } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useAppSelector(state => state.auth.user);
  const isAdmin = currentUser?.role === 'admin';
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'user',
    },
  });

  // Reset form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role || 'user',
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: UpdateUserValues): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsSubmitting(true);
      setPermissionError(null);
      
      if (!isAdmin && data.role !== user.role) {
        setPermissionError("Only administrators can change user roles");
        setIsSubmitting(false);
        return;
      }

      let success = false;
      if (!data.password) {
        const { ...restData } = data;
        success = await updateUser(user.id, restData);
      } else {
        success = await updateUser(user.id, data);
      }
      
      if (success) {
        toast.success('User updated successfully');
        onSuccess?.();
        onClose?.();
      }
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      toast.error('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    permissionError,
    isAdmin,
    handleSubmit
  };
} 