'use client';

import { UserTableUI } from './UserTableUI';
import { useUserTable } from '../useUserTable';
import { CreateUserModal } from '../modals/create-user';
import { EditUserModal } from '../modals/edit-user';
import { DeleteUserModal } from '../modals/delete-user';

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
    refreshUsers,

    pageIndex,
    totalCount,
    perPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPageIndex,
    currentUser,
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

        pageIndex={pageIndex}
        totalCount={totalCount}
        perPage={perPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        setPageIndex={setPageIndex}
        currentUser={currentUser}
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