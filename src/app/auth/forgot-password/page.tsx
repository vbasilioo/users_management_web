'use client';

import Link from 'next/link';
import { KeyIllustration } from '@/components';
import { useForgotPassword } from './useForgotPassword';

export default function ForgotPasswordPage() {
  const { email, isLoading, handleEmailChange, handleSubmit } = useForgotPassword();

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-8 sm:px-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold">Forgot Password?</h1>
            <p className="mt-3 text-gray-600">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm">
              Remember your password?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="hidden bg-blue-50 lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center p-12">
          <KeyIllustration />
        </div>
      </div>
    </div>
  );
} 