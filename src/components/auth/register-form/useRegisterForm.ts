'use client';

import { useState } from 'react';
import { registerFormSchema, type RegisterFormValues } from '@/schemas/auth.schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/api/services/auth';

export function useRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      await authService.register(data);
      
      setSuccess(true);
      toast.success('Registration successful');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => router.push('/auth/login');

  return {
    isLoading,
    success,
    form,
    onSubmit,
    navigateToLogin
  };
} 