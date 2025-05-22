'use client';

import { UserTableUI } from './UserTableUI';
import { useUserTable } from '../useUserTable';
import { CreateUserModal } from '../modals/CreateUser';
import { EditUserModal } from '../modals/EditUser';
import { DeleteUserModal } from '../modals/DeleteUser';

export function UserTable() {
  const {
    filteredUsers: users,
    isLoading,
    isError,
    
    searchQuery,
    roleFilter,
    dateFilter,
    
    formatDate,
    getRoleColor,
    getInitials,
    
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUser,
    
    setSearchQuery,
    setRoleFilter,
    setDateFilter,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    refreshUsers
  } = useUserTable();

  return (
    <>
      <UserTableUI
        users={users}
        isLoading={isLoading}
        isError={isError}
        
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        dateFilter={dateFilter}
        
        formatDate={formatDate}
        getRoleColor={getRoleColor}
        getInitials={getInitials}
        
        setSearchQuery={setSearchQuery}
        setRoleFilter={setRoleFilter}
        setDateFilter={setDateFilter}
        openCreateModal={openCreateModal}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />

      <CreateUserModal 
        isOpen={createModalOpen} 
        onClose={closeCreateModal} 
        onSuccess={refreshUsers}
      />
      
      <EditUserModal 
        isOpen={editModalOpen} 
        onClose={closeEditModal} 
        user={selectedUser} 
        onSuccess={refreshUsers}
      />
      
      <DeleteUserModal 
        isOpen={deleteModalOpen} 
        onClose={closeDeleteModal} 
        user={selectedUser} 
        onSuccess={refreshUsers}
      />
    </>
  );
} 