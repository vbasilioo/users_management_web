'use client';

import { useCallback, useMemo, useState } from 'react';
import { useUsers, User } from './useUsers';
import { 
  formatUserDate, 
  getUserRoleColor, 
  getUserInitials,
  processUserCreatedAt
} from './utils/userFormatters';
import { useAppSelector } from '@/lib/redux/hooks';

export interface UserWithDates extends Omit<User, 'role'> {
  role?: 'admin' | 'manager' | 'user';
  avatar?: string;
  processedCreatedAt: Date;
}

export interface UseUserTableReturn {
  users: UserWithDates[];
  filteredUsers: UserWithDates[];
  isLoading: boolean;
  isError: boolean;
  
  searchQuery: string;
  roleFilter: 'all' | 'admin' | 'manager' | 'user';
  dateFilter: 'all' | 'week' | 'month' | 'year';

  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedUser: UserWithDates | null;
  
  formatDate: (date: Date) => string;
  getRoleColor: (role?: string) => string;
  getInitials: (name?: string) => string;

  setSearchQuery: (query: string) => void;
  setRoleFilter: (role: 'all' | 'admin' | 'manager' | 'user') => void;
  setDateFilter: (filter: 'all' | 'week' | 'month' | 'year') => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (user: UserWithDates) => void;
  closeEditModal: () => void;
  openDeleteModal: (user: UserWithDates) => void;
  closeDeleteModal: () => void;
  refreshUsers: () => void;

  pageIndex: number;
  totalCount: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPageIndex: (index: number) => void;
  currentUser: { id: string; role: string } | null;
}

export function useUserTable(): UseUserTableReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'manager' | 'user'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDates | null>(null);

  const currentUser = useAppSelector(state => state.auth.user);

  const usersHook = useUsers();
  const { pagination } = usersHook;
  
  const users = useMemo<UserWithDates[]>(() => {
    if (Array.isArray(usersHook.users)) {
      return usersHook.users.map(user => ({
        ...user,
        processedCreatedAt: processUserCreatedAt(user.createdAt, user.id)
      }));
    }
    return [];
  }, [usersHook.users]);
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchQuery || 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const createdDate = user.processedCreatedAt;
        const now = new Date();
        
        switch (dateFilter) {
          case 'week':
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);
            matchesDate = createdDate >= oneWeekAgo;
            break;
          case 'month':
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setDate(now.getDate() - 30);
            matchesDate = createdDate >= oneMonthAgo;
            break;
          case 'year':
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            matchesDate = createdDate >= oneYearAgo;
            break;
        }
      }
      
      return matchesSearch && matchesRole && matchesDate;
    });
  }, [users, searchQuery, roleFilter, dateFilter]);
  
  const openCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);
  
  const closeCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);
  
  const openEditModal = useCallback((user: UserWithDates) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  }, []);
  
  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedUser(null);
  }, []);
  
  const openDeleteModal = useCallback((user: UserWithDates) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  }, []);
  
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSetPageIndex = useCallback((newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    usersHook.refreshUsers(newPage);
  }, [usersHook]);
  
  return {
    users,
    filteredUsers,
    isLoading: usersHook.isLoading,
    isError: usersHook.isError,
    
    searchQuery,
    roleFilter,
    dateFilter,
    
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUser,
    
    formatDate: formatUserDate,
    getRoleColor: getUserRoleColor,
    getInitials: getUserInitials,
    
    setSearchQuery,
    setRoleFilter,
    setDateFilter,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    refreshUsers: usersHook.refreshUsers,

    pageIndex: pagination.currentPage,
    totalCount: pagination.total,
    perPage: pagination.perPage,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
    setPageIndex: handleSetPageIndex,
    currentUser: currentUser ? { id: currentUser.id || '', role: currentUser.role || 'user' } : null,
  };
} 