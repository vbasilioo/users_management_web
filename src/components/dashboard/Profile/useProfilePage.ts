'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUser } from '@/lib/redux/slices/authSlice';
import { useAuth } from '@/components/auth/useAuth';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema, User } from '@/schemas/user.schemas';
import { z } from 'zod';
import api from '@/app/api/client';
import { useAbility } from '@/lib/casl/AbilityContext';

interface ApiResponse {
  id?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'manager' | 'user';
  error?: boolean;
  message?: string;
  [key: string]: unknown;
}

const profileSchema = updateUserSchema;

type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfilePage() {
  const { user, profileUpdateSuccess } = useAppSelector((state) => state.auth);
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, logout } = useAuth();
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const ability = useAbility();

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isSameUser = currentUser?.id === user?.id;

  useEffect(() => {
    if (user && !isAdmin && !isManager && !isSameUser) {
      setPermissionError("You don't have permission to view this profile.");
    } else {
      setPermissionError(null);
    }
  }, [user, isAdmin, isManager, isSameUser]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'user',
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
      }, { keepValues: true });
    }
  }, [form, user]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !user.id) return;

    if (!ability.can('changeRole', 'User') && data.role !== user.role) {
      setPermissionError("You don't have permission to change role.");
      return;
    }

    try {
      setIsSubmitting(true);
      setPermissionError(null);
      
      const formData = { ...data };
      
      if (!formData.password || formData.password.trim() === '') {
        delete formData.password;
      }
      
      const response = await api.patch<ApiResponse>(`/users/${user.id}`, formData);
      
      if (response && response.error === false) {
        const updatedUserData: User = {
          id: response.id || user.id,
          name: response.name || user.name,
          email: response.email || user.email,
          role: response.role || user.role,
        };
        
        dispatch(updateUser(updatedUserData));
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
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
    isManager,
    profileUpdateSuccess,
    onLogout: logout
  };
} 