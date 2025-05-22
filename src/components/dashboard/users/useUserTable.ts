'use client';

import { useCallback, useMemo, useState } from 'react';
import { useUsers } from './useUsers';
import { 
  formatUserDate, 
  getUserRoleColor, 
  getUserInitials,
  processUserCreatedAt
} from './utils/userFormatters';

export interface UserWithDates {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'manager' | 'user';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  processedCreatedAt: Date;
}

export interface UseUserTableReturn {
  // Dados
  users: UserWithDates[];
  filteredUsers: UserWithDates[];
  isLoading: boolean;
  isError: boolean;
  
  // Estados de filtro
  searchQuery: string;
  roleFilter: 'all' | 'admin' | 'manager' | 'user';
  dateFilter: 'all' | 'week' | 'month' | 'year';
  
  // Modais
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedUser: UserWithDates | null;
  
  // Funções utilitárias
  formatDate: (date: Date) => string;
  getRoleColor: (role?: string) => string;
  getInitials: (name?: string) => string;
  
  // Handlers
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
}

export function useUserTable(): UseUserTableReturn {
  // Hook principal para API
  const usersHook = useUsers();
  
  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'manager' | 'user'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  
  // Estados para modais
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDates | null>(null);
  
  // Memoizar lista de usuários com datas processadas
  const users = useMemo<UserWithDates[]>(() => {
    if (Array.isArray(usersHook.users)) {
      return usersHook.users.map(user => ({
        ...user,
        processedCreatedAt: processUserCreatedAt(user.createdAt, user.id)
      }));
    }
    return [];
  }, [usersHook.users]);
  
  // Filtrar usuários com base nos critérios
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filtro de busca
      const matchesSearch = !searchQuery || 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtro de papel
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      // Filtro de data - agora usamos a data processada
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
  
  // Handlers para modais
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
  
  // Expor interface completa do hook
  return {
    // Dados
    users,
    filteredUsers,
    isLoading: usersHook.isLoading,
    isError: usersHook.isError,
    
    // Estados de filtro
    searchQuery,
    roleFilter,
    dateFilter,
    
    // Modais
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedUser,
    
    // Funções utilitárias
    formatDate: formatUserDate,
    getRoleColor: getUserRoleColor,
    getInitials: getUserInitials,
    
    // Handlers
    setSearchQuery,
    setRoleFilter,
    setDateFilter,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    refreshUsers: usersHook.refreshUsers
  };
} 