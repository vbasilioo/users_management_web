'use client';

import { DeleteUserModalUI } from './DeleteUserModalUI';
import { useDeleteUserModal } from './useDeleteUserModal';
import { UserWithDates } from '@/components/dashboard/users/useUserTable';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithDates | null;
  onSuccess?: () => void;
}

export function DeleteUserModal({ isOpen, onClose, user, onSuccess }: DeleteUserModalProps) {
  const { isDeleting, handleDelete } = 
    useDeleteUserModal(user, onSuccess, onClose);

  return (
    <DeleteUserModalUI
      isOpen={isOpen}
      onClose={onClose}
      user={user}
      isDeleting={isDeleting}
      handleDelete={handleDelete}
    />
  );
} 