'use client';

import { CreateUserModalUI } from './CreateUserModalUI';
import { useCreateUserModal } from './useCreateUserModal';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const { isSubmitting, permissionError, handleSubmit } = 
    useCreateUserModal(onSuccess, onClose);

  return (
    <CreateUserModalUI
      isOpen={isOpen}
      onClose={onClose}
      isSubmitting={isSubmitting}
      permissionError={permissionError}
      handleSubmit={handleSubmit}
    />
  );
} 