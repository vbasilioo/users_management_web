'use client';

import Link from 'next/link';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { LoginFormValues } from '@/schemas/auth.schemas';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface LoginFormUIProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  authCheckComplete?: boolean;
}

export function LoginFormUI({
  form,
  onSubmit,
  isLoading,
  showPassword,
  togglePasswordVisibility,
}: LoginFormUIProps) {
  const { formState } = form;
  const rootError = formState.errors.root?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {rootError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {rootError}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: FieldValues }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }: { field: FieldValues }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-auto pr-3 text-gray-400 hover:text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <FormMessage className="text-red-500 text-sm" />
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm text-red-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </FormItem>
          )}
        />
        
        <Button
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
        </Button>
      </form>
    </Form>
  );
} 