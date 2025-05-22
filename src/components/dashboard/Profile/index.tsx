'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfilePage } from './useProfilePage';
import { ArrowRightIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function ProfileComponent() {
  const { user, currentUser, isLoading, isSubmitting, form, onSubmit, permissionError } = useProfilePage();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  const isAdmin = currentUser?.role === 'admin';
  
  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part?.[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full mx-auto bg-white p-6">
      {permissionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {permissionError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-gray-600 text-xl font-medium">My Profile</h1>
          <span className="text-gray-400">›</span>
          <span className="text-xl font-medium">Edit Profile</span>
        </div>
        <Button 
          type="submit" 
          form="profile-form"
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" color="white" />
              <span>SAVING</span>
            </>
          ) : (
            <>
              <span>SAVE</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4 md:p-8">
        <Form {...form}>
          <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
                <div>
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-gray-200 mx-auto">
                    <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                    <AvatarFallback className="text-2xl bg-green-100 text-green-600">
                      {getInitials(user?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 flex-1 w-full">
                <div>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="border-gray-300 rounded-md" 
                            placeholder="Enter first name" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="border-gray-300 rounded-md" 
                            placeholder="Enter last name" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {isAdmin && (
                  <div>
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-gray-500">Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 rounded-md">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {!isAdmin && (
                  <div>
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-gray-500">Role</FormLabel>
                          <FormControl>
                            <Input 
                              value={field.value === 'admin' ? 'Administrator' : field.value === 'manager' ? 'Manager' : 'User'}
                              disabled
                              className="border-gray-300 rounded-md bg-gray-50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">Email</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input 
                              {...field}
                              className="border-gray-300 rounded-md" 
                              type="email"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">Password</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input 
                              {...field}
                              className="border-gray-300 rounded-md" 
                              type="password"
                              value={field.value || '••••••••••••••••'}
                              disabled={!showPasswordChange}
                            />
                          </FormControl>
                          <Button 
                            type="button" 
                            className="ml-2 bg-transparent text-green-600 hover:bg-green-50 hover:text-green-700 text-xs px-2"
                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                          >
                            {showPasswordChange ? 'CANCEL' : 'CHANGE'}
                          </Button>
                        </div>
                        {showPasswordChange && (
                          <p className="text-xs text-gray-500 mt-1">
                            Enter a new password (min. 8 characters)
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 