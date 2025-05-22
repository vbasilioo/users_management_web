'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUser } from '@/lib/redux/slices/authSlice';
import { useAuth } from '@/components/auth/useAuth';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema, UpdateUserValues } from '@/schemas/user.schemas';

export function useProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading } = useAuth();

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data: UpdateUserValues) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
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
    isLoading,
    isSubmitting,
    form,
    onSubmit
  };
} 