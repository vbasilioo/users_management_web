import { z } from 'zod';
import { CreateUserDtoRole, UpdateUserDtoRole } from '@/app/@types/api';

export const loginDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export const apiResponseDtoDataSchema = z.record(z.unknown()).nullable();

export const apiResponseDtoSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  data: apiResponseDtoDataSchema,
});

export const userRoleSchema = z.enum(['admin', 'manager', 'user']);

export const createUserDtoSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'manager', 'user'] as [CreateUserDtoRole, ...CreateUserDtoRole[]]).optional(),
});

export const updateUserDtoSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional(),
  role: z.enum(['admin', 'manager', 'user'] as [UpdateUserDtoRole, ...UpdateUserDtoRole[]]).optional(),
});

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  avatar: z.string().url('URL de avatar inválida').optional(),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;
export type ApiResponseDtoData = z.infer<typeof apiResponseDtoDataSchema>;
export type ApiResponseDto = z.infer<typeof apiResponseDtoSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type CreateUserDto = z.infer<typeof createUserDtoSchema>;
export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;
export type User = z.infer<typeof userSchema>; 