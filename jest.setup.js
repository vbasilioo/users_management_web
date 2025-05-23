require('@testing-library/jest-dom/extend-expect');

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '',
  useParams: () => ({}),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('@/lib/redux/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    promise: jest.fn(),
  },
})); 