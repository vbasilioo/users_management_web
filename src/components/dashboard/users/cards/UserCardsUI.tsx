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
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
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
import InputSearch from '@/components/ui/InputSearch';
import { PaginationFull } from '@/components/pagination';
import { Dispatch, SetStateAction } from 'react';

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
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setDebouncedSearchTerm: Dispatch<SetStateAction<string>>;
  
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
  page,
  perPage,
  totalCount,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  setDebouncedSearchTerm,
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
              <InputSearch
                handleSetSearch={setDebouncedSearchTerm}
                placeholder="Pesquisar por nome"
                showLabel={false}
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
            </div>

            {isAdmin && (
              <Can do="create" on="User">
                <Button 
                  onClick={handleOpenCreateModal}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white ml-auto"
                >
                  <Plus size={16} className="mr-2" />
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
                <CardContent className="flex flex-col items-center p-6 pt-0">
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

      <PaginationFull
        pageIndex={page}
        totalCount={totalCount}
        perPage={perPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={(newPage) => {
          const params = new URLSearchParams(window.location.search);
          params.set('page', newPage.toString());
          window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
          window.location.reload(); // Force reload to fetch new page
        }}
      />
    </div>
  );
} 