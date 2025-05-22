import { z } from 'zod';
import { userRoleSchema } from './user.schemas';

export const resourceSchema = z.enum([
  'User',
  'Profile',
  'Settings',
  'Dashboard',
  'Report',
  'Analytics',
  'Notification',
  'Audit',
  'Role'
]);

export const actionSchema = z.enum([
  'create',
  'read',
  'update',
  'delete',
  'manage',
  'export',
  'import',
  'assign',
  'revoke'
]);

export const permissionSchema = z.object({
  id: z.string().uuid().optional(),
  role: userRoleSchema,
  resource: resourceSchema,
  action: actionSchema,
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const roleWithPermissionsSchema = z.object({
  role: userRoleSchema,
  permissions: z.array(permissionSchema),
  description: z.string().optional(),
});

export const permissionAssignmentSchema = z.object({
  roleId: z.string().uuid(),
  permissions: z.array(z.object({
    resource: resourceSchema,
    actions: z.array(actionSchema),
  })),
});

export const permissionCheckSchema = z.object({
  userId: z.string().uuid(),
  resource: resourceSchema,
  action: actionSchema,
});

export const routeAccessSchema = z.object({
  path: z.string(),
  roles: z.array(userRoleSchema),
  exact: z.boolean().default(true),
});

export type Resource = z.infer<typeof resourceSchema>;
export type Action = z.infer<typeof actionSchema>;
export type Permission = z.infer<typeof permissionSchema>;
export type RoleWithPermissions = z.infer<typeof roleWithPermissionsSchema>;
export type PermissionAssignment = z.infer<typeof permissionAssignmentSchema>;
export type PermissionCheck = z.infer<typeof permissionCheckSchema>;
export type RouteAccess = z.infer<typeof routeAccessSchema>; 