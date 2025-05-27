import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightIcon, AlertCircle, LogOut, Menu } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from '@/schemas/user.schemas';
import { UseFormReturn } from 'react-hook-form';
import { updateUserSchema } from '@/schemas/user.schemas';
import { z } from 'zod';
import { SidebarTrigger } from '@/components/ui/sidebar';

type ProfileFormValues = z.infer<typeof updateUserSchema>;

export interface ProfileUIProps {
  user: User;
  form: UseFormReturn<ProfileFormValues>;
  isAdmin: boolean;
  isSubmitting: boolean;
  showPasswordChange: boolean;
  permissionError: string | null;
  profileUpdateSuccess: boolean;
  onPasswordToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getInitials: (name: string) => string;
  onLogout: () => void;
}

export function ProfileUI({
  user,
  form,
  isAdmin,
  isSubmitting,
  showPasswordChange,
  permissionError,
  onPasswordToggle,
  onSubmit,
  getInitials,
  onLogout
}: ProfileUIProps) {
  return (
    <div className="w-full mx-auto bg-white p-6">
      <div className="flex justify-between items-center md:hidden mb-4">
        <h1 className="text-gray-600 text-xl font-medium">My Profile</h1>
        <SidebarTrigger className="text-gray-600">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>
      
      {permissionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {permissionError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="hidden md:flex items-center gap-2">
          <h1 className="text-gray-600 text-xl font-medium">My Profile</h1>
          <span className="text-gray-400">›</span>
          <span className="text-xl font-medium">Edit Profile</span>
        </div>
        <div className="flex gap-3">
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
          <Button 
            type="button"
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>LOGOUT</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4 md:p-8">
        <Form {...form}>
          <form 
            id="profile-form" 
            onSubmit={onSubmit}
            className="relative"
          >
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
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-500">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="border-gray-300 rounded-md" 
                            placeholder="Enter your full name" 
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
                              placeholder="Leave empty to keep current password"
                              disabled={!showPasswordChange}
                              value={showPasswordChange ? field.value : ''}
                            />
                          </FormControl>
                          <Button 
                            type="button" 
                            className="ml-2 bg-transparent text-green-600 hover:bg-green-50 hover:text-green-700 text-xs px-2"
                            onClick={onPasswordToggle}
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