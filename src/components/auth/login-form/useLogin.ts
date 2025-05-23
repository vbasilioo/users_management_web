'use client';

import { loginFormSchema, type LoginFormValues } from '@/schemas/auth.schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useAuth } from '../useAuth';
import { isUser } from '@/constants/roles';

export function useLogin() {
  const { login, authCheckComplete } = useAuth();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && user && !isRedirecting) {
      setIsRedirecting(true);
      if (isUser(user.role)) {
        router.replace('/dashboard/profile');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, router, isRedirecting]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { setError } = form;

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const success = await login(data);
      if (success) {
        toast.success('Login successful!');
        setIsRedirecting(true);
      } else {
        setError('root', { 
          message: 'Invalid credentials. Please check your email and password.' 
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Login failed');
      console.error('Login error:', error);
      setIsSubmitting(false);
    }
  }, [login, setError]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const isLoading = isSubmitting;

  return {
    form: {
      ...form,
      onSubmit
    },
    isLoading,
    showPassword,
    togglePasswordVisibility,
    authCheckComplete
  };
} 