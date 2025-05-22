import { z } from 'zod';
import { userSchema } from './user.schemas';

export const apiResponseDataSchema = z.record(z.unknown()).nullable();

export const apiResponseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  data: apiResponseDataSchema,
});

export const authResponseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    user: userSchema.optional(),
  }).nullable(),
});

export const usersListResponseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  data: z.object({
    users: z.array(userSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }).nullable(),
});

export const userResponseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  data: z.object({
    user: userSchema,
  }).nullable(),
});

export type ApiResponseData = z.infer<typeof apiResponseDataSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UsersListResponse = z.infer<typeof usersListResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>; 