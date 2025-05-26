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

const filterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['all', 'admin', 'manager', 'user']).optional(),
  dateFilter: z.enum(['all', 'week', 'month', 'year']).optional(),
});

export type FilterValues = z.infer<typeof filterSchema>;

export function useUserCards() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDates | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    role: 'all',
    dateFilter: 'all',
  });
  
  const currentUser = useAppSelector(state => state.auth.user);
  const isAdmin = currentUser?.role === 'admin';
  
  const { 
    users: rawUsers, 
    isLoading, 
    isError, 
    refreshUsers
  } = useUsers();
  
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: '',
      role: 'all',
      dateFilter: 'all',
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
    const { search, role, dateFilter } = filters;
    
    return usersWithProcessedDates.filter(user => {
      const matchesSearch = !search || 
        user.name.toLowerCase().includes(search?.toLowerCase() || '') || 
        user.email.toLowerCase().includes(search?.toLowerCase() || '');
      
      const matchesRole = !role || role === 'all' || user.role === role;
      
      let matchesDate = true;
      if (dateFilter && dateFilter !== 'all') {
        const createdDate = user.processedCreatedAt;
        const now = new Date();
        const oneWeekAgo = new Date(now); 
        oneWeekAgo.setDate(now.getDate() - 7);
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setDate(now.getDate() - 30);
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        
        switch (dateFilter) {
          case 'week':
            matchesDate = createdDate >= oneWeekAgo;
            break;
          case 'month':
            matchesDate = createdDate >= oneMonthAgo;
            break;
          case 'year':
            matchesDate = createdDate >= oneYearAgo;
            break;
        }
      }
      
      return matchesSearch && matchesRole && matchesDate;
    });
  }, [filters, usersWithProcessedDates]);

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