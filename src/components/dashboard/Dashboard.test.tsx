import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { useDashboard } from './useDashboard';

type MockedUseDashboard = {
  isLoading: boolean;
  user: { id: string; name: string; email: string; role?: string } | null;
  logout: () => void;
};

jest.mock('./useDashboard', () => ({
  useDashboard: jest.fn(),
}));

describe('Dashboard', () => {
  const mockLogout = jest.fn();
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('exibe mensagem de carregamento quando isLoading é true', () => {
    (useDashboard as jest.Mock<MockedUseDashboard>).mockReturnValue({
      isLoading: true,
      user: null,
      logout: mockLogout
    });
    
    render(<Dashboard />);
    
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
  
  test('não renderiza nada quando o usuário é null', () => {
    (useDashboard as jest.Mock<MockedUseDashboard>).mockReturnValue({
      isLoading: false,
      user: null,
      logout: mockLogout
    });
    
    const { container } = render(<Dashboard />);
    
    expect(container.firstChild).toBeNull();
  });
  
  test('renderiza as informações do usuário corretamente', () => {
    (useDashboard as jest.Mock<MockedUseDashboard>).mockReturnValue({
      isLoading: false,
      user: mockUser,
      logout: mockLogout
    });
    
    render(<Dashboard />);
    
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/User Information/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });
  
  test('chama a função de logout quando o botão é clicado', () => {
    (useDashboard as jest.Mock<MockedUseDashboard>).mockReturnValue({
      isLoading: false,
      user: mockUser,
      logout: mockLogout
    });
    
    render(<Dashboard />);
    
    fireEvent.click(screen.getByText(/Logout/i));
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  
  test('exibe as opções de ações rápidas', () => {
    (useDashboard as jest.Mock<MockedUseDashboard>).mockReturnValue({
      isLoading: false,
      user: mockUser,
      logout: mockLogout
    });
    
    render(<Dashboard />);
    
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/View Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/User Settings/i)).toBeInTheDocument();
  });
}); 