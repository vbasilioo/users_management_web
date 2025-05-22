'use client';

import { useSidebar } from "@/components/ui/sidebar";
import { User } from "@/schemas/user.schemas";
import { useAuth } from "@/components/auth/useAuth";

export function useNavUser(user: User) {
  const { isMobile } = useSidebar();
  const { logout: handleLogout } = useAuth();
  
  return {
    user,
    isMobile,
    handleLogout
  };
} 