'use client';

import { EditUserModalUI } from './EditUserModalUI';
import { useEditUserModal } from './useEditUserModal';
import { UserWithDates } from '@/components/dashboard/users/useUserTable';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithDates | null;
  onSuccess?: () => void;
}

export function EditUserModal({ isOpen, onClose, user, onSuccess }: EditUserModalProps) {
  const { form, isSubmitting, permissionError, isAdmin, handleSubmit } = 
    useEditUserModal(user, onSuccess, onClose);

  return (
    <EditUserModalUI
      isOpen={isOpen}
      onClose={onClose}
      form={form}
      isSubmitting={isSubmitting}
      permissionError={permissionError}
      isAdmin={isAdmin}
      handleSubmit={handleSubmit}
    />
  );
} 