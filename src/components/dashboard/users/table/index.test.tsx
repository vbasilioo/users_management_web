import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserTable } from './index';
import { useUserTable } from '../useUserTable';

jest.mock('../modals/create-user', () => ({
  CreateUserModal: () => <div data-testid="create-user-modal" />
}));

jest.mock('../modals/edit-user', () => ({
  EditUserModal: () => <div data-testid="edit-user-modal" />
}));

jest.mock('../modals/delete-user', () => ({
  DeleteUserModal: () => <div data-testid="delete-user-modal" />
}));

jest.mock('../useUserTable', () => ({
  useUserTable: jest.fn()
}));

jest.mock('./UserTableUI', () => ({
  UserTableUI: () => <div data-testid="user-table-ui" />
}));

describe('UserTable', () => {
  const mockFilteredUsers = [
    {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      processedCreatedAt: new Date('2023-01-01')
    }
  ];
  
  const mockFunctions = {
    setSearchQuery: jest.fn(),
    setRoleFilter: jest.fn(),
    setDateFilter: jest.fn(),
    openCreateModal: jest.fn(),
    closeCreateModal: jest.fn(),
    openEditModal: jest.fn(),
    closeEditModal: jest.fn(),
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
    refreshUsers: jest.fn(),
    formatDate: jest.fn(date => date.toLocaleDateString()),
    getInitials: jest.fn(() => 'TU'),
    getRoleColor: jest.fn(() => 'bg-blue-100')
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useUserTable as jest.Mock).mockReturnValue({
      filteredUsers: mockFilteredUsers,
      isLoading: false,
      isError: false,
      searchQuery: '',
      roleFilter: 'all',
      dateFilter: 'all',
      createModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      selectedUser: null,
      ...mockFunctions
    });
  });
  
  test('renderiza o componente UserTableUI e modais', () => {
    render(<UserTable />);
    
    expect(screen.getByTestId('user-table-ui')).toBeInTheDocument();
    expect(screen.getByTestId('create-user-modal')).toBeInTheDocument();
    expect(screen.getByTestId('edit-user-modal')).toBeInTheDocument();
    expect(screen.getByTestId('delete-user-modal')).toBeInTheDocument();
  });
  
  test('passa as props corretas para o componente UserTableUI', () => {
    render(<UserTable />);
    
    expect(useUserTable).toHaveBeenCalled();
    expect(screen.getByTestId('user-table-ui')).toBeInTheDocument();
  });
  
  test('abre o modal de criação de usuário corretamente', () => {
    (useUserTable as jest.Mock).mockReturnValue({
      filteredUsers: mockFilteredUsers,
      isLoading: false,
      isError: false,
      searchQuery: '',
      roleFilter: 'all',
      dateFilter: 'all',
      createModalOpen: true,
      editModalOpen: false,
      deleteModalOpen: false,
      selectedUser: null,
      ...mockFunctions
    });
    
    render(<UserTable />);
    
    expect(screen.getByTestId('create-user-modal')).toBeInTheDocument();
  });
  
  test('abre o modal de edição de usuário corretamente', () => {
    (useUserTable as jest.Mock).mockReturnValue({
      filteredUsers: mockFilteredUsers,
      isLoading: false,
      isError: false,
      searchQuery: '',
      roleFilter: 'all',
      dateFilter: 'all',
      createModalOpen: false,
      editModalOpen: true,
      deleteModalOpen: false,
      selectedUser: mockFilteredUsers[0],
      ...mockFunctions
    });
    
    render(<UserTable />);
    
    expect(screen.getByTestId('edit-user-modal')).toBeInTheDocument();
  });
  
  test('abre o modal de exclusão de usuário corretamente', () => {
    (useUserTable as jest.Mock).mockReturnValue({
      filteredUsers: mockFilteredUsers,
      isLoading: false,
      isError: false,
      searchQuery: '',
      roleFilter: 'all',
      dateFilter: 'all',
      createModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: true,
      selectedUser: mockFilteredUsers[0],
      ...mockFunctions
    });
    
    render(<UserTable />);
    
    expect(screen.getByTestId('delete-user-modal')).toBeInTheDocument();
  });
}); 