'use client';

import { useLogin } from './useLogin';
import { LoginFormUI } from './LoginFormUI';

export function LoginForm() {
  const { 
    form,
    onSubmit, 
    isSubmitting,
    showPassword,
    setShowPassword,
    authCheckComplete
  } = useLogin();

  return (
    <LoginFormUI
      form={form}
      onSubmit={onSubmit}
      isLoading={isSubmitting}
      showPassword={showPassword}
      togglePasswordVisibility={() => setShowPassword(prev => !prev)}
      authCheckComplete={authCheckComplete}
    />
  );
} 