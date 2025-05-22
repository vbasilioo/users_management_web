'use client';

import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { LoginFormValues } from '@/schemas/auth.schemas';
import { Spinner } from '@/components/ui/Spinner';

interface LoginFormUIProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  authCheckComplete: boolean;
}

export function LoginFormUI({
  form,
  onSubmit,
  isLoading,
  showPassword,
  togglePasswordVisibility,
  authCheckComplete
}: LoginFormUIProps) {
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const rootError = formState.errors.root?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {rootError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {rootError}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your email"
          disabled={isLoading}
          {...register('email')}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your password"
            disabled={isLoading}
            {...register('password')}
          />
          <button 
            type="button" 
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <div className="text-right">
          <Link href="/auth/forgot-password" className="text-sm text-red-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size="sm" color="white" className="mr-2" />
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
} 