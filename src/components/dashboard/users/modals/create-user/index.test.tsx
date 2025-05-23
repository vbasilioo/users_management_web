import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateUserModal } from './index';
import { useCreateUserModal } from './useCreateUserModal';

jest.mock('./useCreateUserModal', () => ({
  useCreateUserModal: jest.fn(),
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode, open: boolean }) => 
    open ? <div data-testid="dialog-root">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="modal-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogClose: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormField: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormControl: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormMessage: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('CreateUserModal', () => {
  const mockCreateUser = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  
  const mockForm = {
    control: {},
    handleSubmit: jest.fn(() => jest.fn()),
    reset: jest.fn(),
    formState: { errors: {}, isSubmitting: false },
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateUserModal as jest.Mock).mockReturnValue({
      form: mockForm,
      isLoading: false,
      createUser: mockCreateUser,
    });
  });
  
  test('não renderiza quando isOpen é false', () => {
    render(
      <CreateUserModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    expect(screen.queryByTestId('dialog-root')).not.toBeInTheDocument();
  });
  
  test('renderiza quando isOpen é true', () => {
    render(
      <CreateUserModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });
}); 