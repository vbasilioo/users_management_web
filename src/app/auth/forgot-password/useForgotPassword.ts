'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Password reset instructions sent to your email');
      router.push('/auth/login');
    } catch {
      toast.error('Failed to send password reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    isLoading,
    handleEmailChange,
    handleSubmit
  };
} 