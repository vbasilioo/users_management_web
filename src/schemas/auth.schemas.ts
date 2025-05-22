import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Invalid email format.')
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8, 'Password must have at least 8 characters.'),
});

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must have at least 3 characters.')
      .transform((name) => {
        return name.trim().split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      }),
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Invalid email format.')
      .transform((email) => email.toLowerCase()),
    password: z.string().min(8, 'Password must have at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Invalid email format.')
    .transform((email) => email.toLowerCase()),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must have at least 8 characters.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>; 