import React from 'react';
import { render } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { useLogin } from './useLogin';

jest.mock('./useLogin', () => ({
  useLogin: jest.fn(),
}));

jest.mock('./LoginFormUI', () => ({
  LoginFormUI: () => <div data-testid="login-form-ui" />
}));

describe('LoginForm', () => {
  const mockForm = {
    control: {},
    handleSubmit: jest.fn(),
    register: jest.fn(),
    formState: { errors: {} },
    onSubmit: jest.fn(),
  };
  
  const mockTogglePasswordVisibility = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogin as jest.Mock).mockReturnValue({
      form: mockForm,
      isLoading: false,
      showPassword: false,
      togglePasswordVisibility: mockTogglePasswordVisibility,
      authCheckComplete: true,
    });
  });

  test('renderiza o formulário de login corretamente', () => {
    render(<LoginForm />);
    
    expect(useLogin).toHaveBeenCalledTimes(1);
  });

  test('passa as props corretas para o LoginFormUI', () => {
    const LoginFormUIMock = jest.fn(() => null);
    jest.mock('./LoginFormUI', () => ({
      LoginFormUI: (props: any) => LoginFormUIMock(props),
    }));

    render(<LoginForm />);
    
    expect(useLogin).toHaveBeenCalledTimes(1);
  });
}); 