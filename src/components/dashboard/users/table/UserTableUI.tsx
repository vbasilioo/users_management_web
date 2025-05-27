'use client';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Edit2, 
  Plus,
  Search,
  Trash2,
  Filter,
  Loader2
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Can } from '@/lib/casl/AbilityContext';
import { Badge } from '@/components/ui/badge';
import { UserWithDates } from '../useUserTable';
import { PaginationFull } from '@/components/pagination';

interface UserTableUIProps {
  users: UserWithDates[];
  isLoading: boolean;
  isError: boolean;
  
  searchQuery: string;
  roleFilter: 'all' | 'admin' | 'manager' | 'user';
  dateFilter: 'all' | 'week' | 'month' | 'year';
  
  formatDate: (date: Date) => string;
  getRoleColor: (role?: string) => string;
  getInitials: (name?: string) => string;
  
  setSearchQuery: (query: string) => void;
  setRoleFilter: (role: 'all' | 'admin' | 'manager' | 'user') => void;
  setDateFilter: (filter: 'all' | 'week' | 'month' | 'year') => void;
  openCreateModal: () => void;
  openEditModal: (user: UserWithDates) => void;
  openDeleteModal: (user: UserWithDates) => void;

  pageIndex: number;
  totalCount: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPageIndex: (index: number) => void;
  currentUser: { id: string; role: string } | null;
}

export function UserTableUI({
  users,
  isLoading,
  isError,
  
  searchQuery,
  roleFilter,
  dateFilter,
  
  formatDate,
  getRoleColor,
  getInitials,
  
  setSearchQuery,
  setRoleFilter,
  setDateFilter,
  openCreateModal,
  openEditModal,
  openDeleteModal,

  pageIndex,
  totalCount,
  perPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  setPageIndex,
  currentUser,
}: UserTableUIProps) {
  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 text-red-500 rounded-md">
        <p>Error loading users. Please try again.</p>
      </div>
    );
  }

  const canEditUser = (user: UserWithDates) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return user.id !== currentUser.id;
    if (currentUser.role === 'manager') return user.id !== currentUser.id;
    return false;
  };

  const canDeleteUser = (user: UserWithDates) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return user.id !== currentUser.id;
    return false;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={openCreateModal}
          size="sm"
          className="h-8 bg-green-600 hover:bg-green-700 ml-auto"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>
      
      <div className="rounded-lg border bg-background p-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={roleFilter}
                onValueChange={(value: string) => 
                  setRoleFilter(value as 'all' | 'admin' | 'manager' | 'user')}
              >
                <SelectTrigger className="w-[140px] justify-between">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={dateFilter}
                onValueChange={(value: string) => 
                  setDateFilter(value as 'all' | 'week' | 'month' | 'year')}
              >
                <SelectTrigger className="w-[140px] justify-between">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="week">Last week</SelectItem>
                  <SelectItem value="month">Last month</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => {
                  return (
                    <TableRow key={user.id || index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
                              alt={user.name || 'User'} 
                            />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || 'No email'}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === 'admin' 
                            ? 'Administrator' 
                            : user.role === 'manager' 
                            ? 'Manager' 
                            : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(user.processedCreatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {canEditUser(user) && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 cursor-pointer"
                              onClick={() => openEditModal(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                          {canDeleteUser(user) && (
                            <Can do="delete" on="User">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={() => openDeleteModal(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </Can>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <PaginationFull
        pageIndex={pageIndex}
        totalCount={totalCount}
        perPage={perPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setPageIndex}
      />
    </div>
  );
} 