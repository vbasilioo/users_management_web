'use client';

import { useEffect } from 'react';
import { useAuthControllerLogin, useAuthControllerGetProfile } from '@/app/api/generated/authentication/authentication';
import { LoginFormValues } from '@/schemas/auth.schemas';
import { toast } from 'sonner';
import { authResponseSchema, userResponseSchema } from '@/schemas/api.schemas';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  loginStart, 
  loginSuccess, 
  loginFailed, 
  logout, 
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailed,
  completeAuthCheck
} from '@/lib/redux/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated, token, authCheckComplete } = useAppSelector(state => state.auth);

  const loginMutation = useAuthControllerLogin({
    mutation: {
      onSuccess: (response) => {
        const result = authResponseSchema.safeParse(response);
        
        if (result.success && result.data.data && !result.data.error) {
          const { accessToken } = result.data.data;
          dispatch(loginSuccess({ 
            token: accessToken, 
            user: result.data.data.user || { 
              id: '', 
              email: '',
              name: 'Loading...',
              role: 'user'
            } 
          }));
        } else {
          dispatch(loginFailed('Invalid server response'));
          toast.error('Error processing server response');
        }
      },
      onError: () => {
        dispatch(loginFailed('Authentication failed'));
        toast.error('Invalid credentials');
      }
    }
  });

  const meQuery = useAuthControllerGetProfile({
    query: {
      enabled: !!token && !user && !authCheckComplete,
      select: (data) => {
        const result = userResponseSchema.safeParse(data);
        if (result.success && result.data.data && !result.data.error) {
          return result.data.data.user;
        }
        return null;
      }
    }
  });

  useEffect(() => {
    if (token && !user && !isLoading && !authCheckComplete) {
      dispatch(fetchUserStart());
      meQuery.refetch();
    } else if (!token && !authCheckComplete) {
      dispatch(completeAuthCheck());
    }
  }, [token, user, isLoading, authCheckComplete, dispatch, meQuery]);

  useEffect(() => {
    if (meQuery.data && !user) {
      dispatch(fetchUserSuccess(meQuery.data));
    }
    
    if (meQuery.error) {
      dispatch(fetchUserFailed('Failed to fetch user profile'));
      dispatch(logout());
      toast.error('Session expired. Please login again.');
    }
  }, [dispatch, meQuery.data, meQuery.error, user]);

  const login = async (credentials: LoginFormValues) => {
    dispatch(loginStart());
    try {
      await loginMutation.mutateAsync({ data: credentials });
      return !loginMutation.isError;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  return {
    user,
    login,
    logout: handleLogout,
    isLoading: isLoading || loginMutation.isPending,
    isAuthenticated,
    authCheckComplete
  };
} 