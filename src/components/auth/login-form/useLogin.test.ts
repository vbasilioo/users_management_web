import { renderHook, act } from '@testing-library/react';
import { useLogin } from './useLogin';
import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';

jest.mock('../useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

describe('useLogin', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      authCheckComplete: true,
    });
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    (useAppSelector as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
  });

  test('retorna as propriedades e funções esperadas', () => {
    const { result } = renderHook(() => useLogin());
    
    expect(result.current.form).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.showPassword).toBe(false);
    expect(typeof result.current.togglePasswordVisibility).toBe('function');
    expect(result.current.authCheckComplete).toBe(true);
  });

  test('togglePasswordVisibility alterna a visibilidade da senha', () => {
    const { result } = renderHook(() => useLogin());
    
    expect(result.current.showPassword).toBe(false);
    
    act(() => {
      result.current.togglePasswordVisibility();
    });
    
    expect(result.current.showPassword).toBe(true);
  });

  test('redireciona para o dashboard quando o usuário está autenticado', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    
    renderHook(() => useLogin());
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  test('onSubmit chama a função login e redireciona em caso de sucesso', async () => {
    mockLogin.mockResolvedValue(true);
    
    const { result } = renderHook(() => useLogin());
    
    await act(async () => {
      await result.current.form.onSubmit({
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
}); 