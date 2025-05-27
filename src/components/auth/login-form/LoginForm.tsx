'use client';

import { useLogin } from './useLogin';
import { LoginFormUI } from './LoginFormUI';

export function LoginForm() {
  const { 
    form,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    authCheckComplete
  } = useLogin();

  return (
    <LoginFormUI
      form={form}
      onSubmit={form.onSubmit}
      isLoading={isLoading}
      showPassword={showPassword}
      togglePasswordVisibility={togglePasswordVisibility}
      authCheckComplete={authCheckComplete}
    />
  );
} 