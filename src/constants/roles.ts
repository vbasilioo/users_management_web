export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export const isAdminOrManager = (role?: string): boolean => {
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};

export const isAdmin = (role?: string): boolean => {
  return role === UserRole.ADMIN;
};

export const isUser = (role?: string): boolean => {
  return role === UserRole.USER;
}; 