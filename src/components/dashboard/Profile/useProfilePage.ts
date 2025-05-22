'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUser } from '@/lib/redux/slices/authSlice';
import { useAuth } from '@/components/auth/useAuth';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from '@/schemas/user.schemas';
import { z } from 'zod';

const profileSchema = updateUserSchema.extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading } = useAuth();
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const nameParts = user?.name ? user.name.split(' ') : ['', ''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isSameUser = currentUser?.id === user?.id;

  if (user && !isAdmin && !isManager && !isSameUser) {
    setPermissionError("You don't have permission to view this profile.");
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'user',
      
      firstName: firstName,
      lastName: lastName,
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    if (!isAdmin && data.role !== user.role) {
      setPermissionError("You don't have permission to change role.");
      return;
    }

    if (!data.password) {
      delete data.password;
    }
    
    if (data.firstName || data.lastName) {
      data.name = [data.firstName, data.lastName].filter(Boolean).join(' ');
    }

    try {
      setIsSubmitting(true);
      setPermissionError(null);
      
      setTimeout(() => {
        const updatedUser = {
          ...user,
          ...data
        };
        dispatch(updateUser(updatedUser));
        toast.success('Profile updated successfully!');
        setIsSubmitting(false);
      }, 1000);
    } catch {
      toast.error('Failed to update profile');
      setIsSubmitting(false);
    }
  };

  return {
    user,
    currentUser,
    isLoading,
    isSubmitting,
    form,
    onSubmit,
    permissionError,
    isAdmin,
    isManager
  };
} 