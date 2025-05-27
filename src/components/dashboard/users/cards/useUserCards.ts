'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsers } from '../useUsers';
import { useAppSelector } from '@/lib/redux/hooks';
import { UserWithDates } from '../useUserTable';
import { 
  getUserRoleColor, 
  processUserCreatedAt 
} from '../utils/userFormatters';
import { useSearchParams } from 'next/navigation';

const filterSchema = z.object({
  role: z.enum(['all', 'admin', 'manager', 'user']).optional(),
});

export type FilterValues = z.infer<typeof filterSchema>;

export function useUserCards() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('search') || ''
  );
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDates | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    role: 'all',
  });
  
  const currentUser = useAppSelector(state => state.auth.user);
  const isAdmin = currentUser?.role === 'admin';
  
  const { 
    users: rawUsers, 
    isLoading, 
    isError,
    pagination,
    refreshUsers
  } = useUsers();
  
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      role: 'all',
    }
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFilters(value as FilterValues);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  const handleOpenCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);
  
  const handleCloseCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);
  
  const handleEdit = useCallback((user: UserWithDates) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  }, []);
  
  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedUser(null);
  }, []);
  
  const handleDelete = useCallback((user: UserWithDates) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  }, []);
  
  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleRefresh = useCallback(() => {
    refreshUsers();
  }, [refreshUsers]);

  const getRoleColor = useCallback((role?: string) => {
    return getUserRoleColor(role);
  }, []);

  const usersWithProcessedDates = useMemo(() => rawUsers.map(user => ({
    ...user,
    processedCreatedAt: processUserCreatedAt(user.createdAt, user.id)
  })), [rawUsers]);

  const filteredUsers = useMemo(() => {
    const { role } = filters;
    
    return usersWithProcessedDates.filter(user => {
      const matchesRole = !role || role === 'all' || user.role === role;
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [filters, usersWithProcessedDates, searchTerm]);

  return {
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUser,
    isAdmin,
    form,
    users: filteredUsers,
    isLoading,
    isError,
    page: pagination.currentPage,
    perPage: pagination.perPage,
    totalCount: pagination.total,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
    setDebouncedSearchTerm: setSearchTerm,
    
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    handleCloseDeleteModal,
    handleRefresh,
    getRoleColor,
  };
} 