'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useUsers } from '@/components/dashboard/users/useUsers';
import { UserWithDates } from '@/components/dashboard/users/useUserTable';

interface UseDeleteUserModalReturn {
  isDeleting: boolean;
  handleDelete: () => Promise<void>;
}

export function useDeleteUserModal(
  user: UserWithDates | null,
  onSuccess?: () => void,
  onClose?: () => void
): UseDeleteUserModalReturn {
  const { removeUser } = useUsers();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (): Promise<void> => {
    if (!user?.id) {
      toast.error('No user selected');
      onClose?.();
      return;
    }

    try {
      setIsDeleting(true);
      const success = await removeUser(user.id);
      
      if (success) {
        onSuccess?.();
        onClose?.();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDelete
  };
} 