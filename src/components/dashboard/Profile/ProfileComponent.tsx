'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useProfilePage } from './useProfilePage';
import { useAppDispatch } from '@/lib/redux/hooks';
import { resetProfileUpdateStatus } from '@/lib/redux/slices/authSlice';
import { ProfileUI } from './ProfileUI';

export function ProfileComponent() {
  const { 
    user, 
    currentUser, 
    isLoading, 
    isSubmitting, 
    form, 
    onSubmit, 
    permissionError, 
    profileUpdateSuccess,
    onLogout
  } = useProfilePage();
  
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const dispatch = useAppDispatch();
  
  const isAdmin = currentUser?.role === 'admin';
  
  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    if (profileUpdateSuccess) {
      dispatch(resetProfileUpdateStatus());
    }
    
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };
  
  const handlePasswordToggle = () => {
    setShowPasswordChange(!showPasswordChange);
    if (!showPasswordChange) {
      form.setValue('password', '', { shouldValidate: false });
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part?.[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ProfileUI
      user={user}
      form={form}
      isAdmin={isAdmin}
      isSubmitting={isSubmitting}
      showPasswordChange={showPasswordChange}
      permissionError={permissionError}
      profileUpdateSuccess={profileUpdateSuccess}
      onPasswordToggle={handlePasswordToggle}
      onSubmit={handleFormSubmit}
      getInitials={getInitials}
      onLogout={onLogout}
    />
  );
} 