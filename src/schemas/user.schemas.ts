import { z } from 'zod';
import { CreateUserDtoRole, UpdateUserDtoRole } from '@/app/@types/api';

export const userRoleSchema = z.enum(['admin', 'manager', 'user']);

export const createUserSchema = z.object({
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
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters.'),
  role: z.enum(['admin', 'manager', 'user'] as [CreateUserDtoRole, ...CreateUserDtoRole[]]).default('user'),
});

export const createUserWithDefaultsSchema = createUserSchema.transform((data) => ({
  ...data,
  role: data.role || 'user',
}));

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters.')
    .transform((name) => {
      return name.trim().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    })
    .optional(),
  email: z
    .string()
    .email('Invalid email format.')
    .transform((email) => email.toLowerCase())
    .optional(),
  password: z
    .union([
      z.string().min(8, 'Password must have at least 8 characters.'),
      z.string().length(0)
    ])
    .optional(),
  role: z.enum(['admin', 'manager', 'user'] as [UpdateUserDtoRole, ...UpdateUserDtoRole[]]).optional(),
});

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must have at least 3 characters.'),
  email: z.string().email('Invalid email format.'),
  avatar: z.string().url('Invalid avatar URL.').optional(),
  role: userRoleSchema.optional(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export interface CreateUserValues {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'user';
}

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof userSchema>; 