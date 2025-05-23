'use client';

import { useRegisterForm } from './useRegisterForm';

export function RegisterForm() {
  const { isLoading, success, form, onSubmit, navigateToLogin } = useRegisterForm();
  const { register, handleSubmit: hookFormSubmit, formState: { errors } } = form;

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-green-800">Registration successful!</h3>
        <p className="mt-2 text-green-700">Your account has been created. You can now log in.</p>
        <button
          onClick={navigateToLogin}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your full name"
          disabled={isLoading}
          {...register('name')}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your email address"
          disabled={isLoading}
          {...register('email')}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Create a strong password"
          disabled={isLoading}
          {...register('password')}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Confirm your password"
          disabled={isLoading}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      
      <button
        type="submit"
        className="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
} 