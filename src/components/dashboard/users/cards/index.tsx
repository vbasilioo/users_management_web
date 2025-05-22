'use client';

import { UserCardsUI } from './UserCardsUI';
import { useUserCards } from './useUserCards';
import { CreateUserModal } from '../modals/CreateUser';
import { EditUserModal } from '../modals/EditUser';
import { DeleteUserModal } from '../modals/DeleteUser';

export function UserCards() {
  const {
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUser,
    isAdmin,
    form,
    users,
    isLoading,
    isError,
    
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    handleCloseDeleteModal,
    handleRefresh,
    getRoleColor,
  } = useUserCards();

  return (
    <>
      <UserCardsUI
        createModalOpen={createModalOpen}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
        selectedUser={selectedUser}
        isAdmin={isAdmin}
        form={form}
        users={users}
        isLoading={isLoading}
        isError={isError}
        handleOpenCreateModal={handleOpenCreateModal}
        handleCloseCreateModal={handleCloseCreateModal}
        handleEdit={handleEdit}
        handleCloseEditModal={handleCloseEditModal}
        handleDelete={handleDelete}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleRefresh={handleRefresh}
        getRoleColor={getRoleColor}
      />
      
      <CreateUserModal 
        isOpen={createModalOpen} 
        onClose={handleCloseCreateModal} 
        onSuccess={handleRefresh}
      />
      
      <EditUserModal 
        isOpen={editModalOpen} 
        onClose={handleCloseEditModal} 
        user={selectedUser}
        onSuccess={handleRefresh}
      />
      
      <DeleteUserModal 
        isOpen={deleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        user={selectedUser}
        onSuccess={handleRefresh}
      />
    </>
  );
} 