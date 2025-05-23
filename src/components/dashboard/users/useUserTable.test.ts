import { renderHook, act } from '@testing-library/react';
import { useUserTable } from './useUserTable';
import { useUsers } from './useUsers';

jest.mock('./useUsers', () => ({
  useUsers: jest.fn(),
}));

describe('useUserTable', () => {
  const mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      processedCreatedAt: new Date('2023-01-01T00:00:00Z')
    },
    {
      id: '2',
      name: 'Manager User',
      email: 'manager@example.com',
      role: 'manager',
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
      processedCreatedAt: new Date('2023-02-01T00:00:00Z')
    },
    {
      id: '3',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2023-03-01T00:00:00Z',
      processedCreatedAt: new Date('2023-03-01T00:00:00Z')
    }
  ];
  
  const mockRefreshUsers = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useUsers as jest.Mock).mockReturnValue({
      users: mockUsers,
      isLoading: false,
      isError: false,
      refreshUsers: mockRefreshUsers
    });
  });
  
  test('inicializa com valores padrão', () => {
    const { result } = renderHook(() => useUserTable());
    
    expect(result.current.filteredUsers).toEqual(mockUsers);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.roleFilter).toBe('all');
    expect(result.current.dateFilter).toBe('all');
    expect(result.current.createModalOpen).toBe(false);
    expect(result.current.editModalOpen).toBe(false);
    expect(result.current.deleteModalOpen).toBe(false);
    expect(result.current.selectedUser).toBeNull();
  });
  
  test('filtra usuários por termo de busca', () => {
    const { result } = renderHook(() => useUserTable());
    
    act(() => {
      result.current.setSearchQuery('admin');
    });
    
    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].name).toBe('Admin User');
  });
  
  test('filtra usuários por papel (role)', () => {
    const { result } = renderHook(() => useUserTable());
    
    act(() => {
      result.current.setRoleFilter('manager');
    });
    
    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].role).toBe('manager');
  });
  
  test('abre e fecha o modal de criação', () => {
    const { result } = renderHook(() => useUserTable());
    
    expect(result.current.createModalOpen).toBe(false);
    
    act(() => {
      result.current.openCreateModal();
    });
    
    expect(result.current.createModalOpen).toBe(true);
    
    act(() => {
      result.current.closeCreateModal();
    });
    
    expect(result.current.createModalOpen).toBe(false);
  });
  
  test('abre o modal de edição e define o usuário selecionado', () => {
    const { result } = renderHook(() => useUserTable());
    
    expect(result.current.editModalOpen).toBe(false);
    expect(result.current.selectedUser).toBeNull();
    
    act(() => {
      result.current.openEditModal(mockUsers[0]);
    });
    
    expect(result.current.editModalOpen).toBe(true);
    expect(result.current.selectedUser).toEqual(mockUsers[0]);
  });
  
  test('abre o modal de exclusão e define o usuário selecionado', () => {
    const { result } = renderHook(() => useUserTable());
    
    expect(result.current.deleteModalOpen).toBe(false);
    expect(result.current.selectedUser).toBeNull();
    
    act(() => {
      result.current.openDeleteModal(mockUsers[0]);
    });
    
    expect(result.current.deleteModalOpen).toBe(true);
    expect(result.current.selectedUser).toEqual(mockUsers[0]);
  });
  
  test('chama refreshUsers quando solicitado', () => {
    const { result } = renderHook(() => useUserTable());
    
    act(() => {
      result.current.refreshUsers();
    });
    
    expect(mockRefreshUsers).toHaveBeenCalledTimes(1);
  });
  
  test('getRoleColor retorna a classe correta para cada papel', () => {
    const { result } = renderHook(() => useUserTable());
    
    expect(result.current.getRoleColor('admin')).toContain('bg-purple');
    expect(result.current.getRoleColor('manager')).toContain('bg-blue');
    expect(result.current.getRoleColor('user')).toContain('bg-green');
  });
}); 