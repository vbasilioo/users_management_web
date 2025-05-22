'use client';

import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Edit2, 
  Plus,
  Search,
  Trash2,
  Loader2
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Can } from '@/lib/casl/AbilityContext';
import { format } from 'date-fns';
import { UserWithDates } from '../useUserTable';
import { UseFormReturn } from 'react-hook-form';
import { FilterValues } from './useUserCards';

interface UserCardsUIProps {
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedUser: UserWithDates | null;
  isAdmin: boolean;
  form: UseFormReturn<FilterValues>;
  users: UserWithDates[];
  isLoading: boolean;
  isError: boolean;
  
  handleOpenCreateModal: () => void;
  handleCloseCreateModal: () => void;
  handleEdit: (user: UserWithDates) => void;
  handleCloseEditModal: () => void;
  handleDelete: (user: UserWithDates) => void;
  handleCloseDeleteModal: () => void;
  handleRefresh: () => void;
  getRoleColor: (role?: string) => string;
}

export function UserCardsUI({
  isAdmin,
  form,
  users,
  isLoading,
  isError,
  handleOpenCreateModal,
  handleEdit,
  handleDelete,
  getRoleColor,
}: UserCardsUIProps) {
  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 text-red-500 rounded-md">
        <p>Error loading users. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="rounded-lg border bg-background p-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Search users..."
                          className="pl-8 w-full sm:w-[300px]"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'all' ? 'all' : value)}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All roles</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateFilter"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'all' ? 'all' : value)}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Date of registration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="week">Last week</SelectItem>
                          <SelectItem value="month">Last month</SelectItem>
                          <SelectItem value="year">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {isAdmin && (
              <Can do="create" on="User">
                <Button 
                  onClick={handleOpenCreateModal}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus size={16} />
                  Add user
                </Button>
              </Can>
            )}
          </div>
        </div>
      </Form>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No users found with these filters.</p>
            </div>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="p-6">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-medium">{user.name}</span>
                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role === 'admin' 
                        ? 'Administrator' 
                        : user.role === 'manager' 
                        ? 'Manager' 
                        : 'User'}
                    </div>
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage 
                      src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
                      alt={user.name} 
                    />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-muted-foreground mb-4">
                    Member since {format(user.processedCreatedAt, 'MMM d, yyyy')}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-6 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 mr-2"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Can do="delete" on="User">
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </Can>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
} 