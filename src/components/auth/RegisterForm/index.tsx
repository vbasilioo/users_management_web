'use client';

import { useRegisterForm } from './useRegisterForm';

export function RegisterForm() {
  const { isLoading, success, form, onSubmit, navigateToLogin } = useRegisterForm();
  const { register, handleSubmit: hookFormSubmit, formState: { errors } } = form;

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <h3 className="text-lg font-medium text-green-800">Registration successful!</h3>
        <p className="mt-2 text-green-700">Your account has been created. You can now log in.</p>
        <button
          onClick={navigateToLogin}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          disabled={isLoading}
          {...register('name')}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          disabled={isLoading}
          {...register('email')}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full px-3 py-2 border rounded-md"
          disabled={isLoading}
          {...register('password')}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="w-full px-3 py-2 border rounded-md"
          disabled={isLoading}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>
      
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
} 