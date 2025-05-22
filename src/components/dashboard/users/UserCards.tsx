'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
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
import { UserRole } from '@/schemas/user.schemas';
import { 
  FileText, 
  Edit2, 
  Plus,
  Search,
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
import { useRouter } from 'next/navigation';
import { Can } from '@/lib/casl/AbilityContext';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const getRoleColor = (role?: UserRole) => {
  switch(role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    case 'manager':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const filterSchema = z.object({
  searchTerm: z.string().optional(),
  roleFilter: z.string().nullable().optional(),
  dateFilter: z.string().nullable().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export function UserCards() {
  const isLoading = false;
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as UserRole,
      avatar: ''
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'manager' as UserRole,
      avatar: ''
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'user' as UserRole,
      avatar: ''
    },
    {
      id: '4',
      name: 'Emily Williams',
      email: 'emily.williams@example.com',
      role: 'user' as UserRole,
      avatar: ''
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      role: 'manager' as UserRole,
      avatar: ''
    }
  ];
  
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      searchTerm: '',
      roleFilter: null,
      dateFilter: null,
    }
  });

  const [userRegistrationDates] = useState<Map<string, Date>>(() => {
    const dates = new Map<string, Date>();
    const now = new Date();
    
    dates.set('1', subDays(now, 2));
    dates.set('2', subDays(now, 10));
    dates.set('3', subMonths(now, 1));
    dates.set('4', subMonths(now, 3));
    dates.set('5', subMonths(now, 8));
    
    return dates;
  });
  
  const router = useRouter();
  
  const { searchTerm = '', roleFilter, dateFilter } = form.watch();
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    let matchesDate = true;
    if (dateFilter && user.id && userRegistrationDates.has(user.id)) {
      const regDate = userRegistrationDates.get(user.id)!;
      const now = new Date();
      
      switch (dateFilter) {
        case 'week':
          matchesDate = regDate >= subDays(now, 7);
          break;
        case 'month':
          matchesDate = regDate >= subMonths(now, 1);
          break;
        case 'year':
          matchesDate = regDate >= subYears(now, 1);
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesRole && matchesDate;
  });

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const formatRegistrationDate = (userId: string | undefined) => {
    if (!userId || !userRegistrationDates.has(userId)) {
      return 'N/A';
    }
    return format(userRegistrationDates.get(userId)!, 'yyyy-MM-dd');
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }: { field: FieldValues }) => (
              <FormItem className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormControl>
                  <Input
                    placeholder="Search by title"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="roleFilter"
                render={({ field }: { field: FieldValues }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'all' ? null : value)}
                        value={field.value || 'all'}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="User role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
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
                render={({ field }: { field: FieldValues }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'all' ? null : value)}
                        value={field.value || 'all'}
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

            <Can do="create" on="User">
              <Button 
                onClick={() => router.push('/dashboard/users/new')}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus size={16} />
                Add user
              </Button>
            </Can>
          </div>
        </div>
      </Form>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            {filteredUsers.length} users found
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-0.5">
                      <CardTitle className="text-sm font-semibold">{user.name}</CardTitle>
                      <CardDescription className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-3">
                  <div className="flex justify-between text-xs">
                    <div>
                      <div className="text-muted-foreground mb-1">Role:</div>
                      <div className="font-medium">
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role || 'User'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Registration:</div>
                      <div className="font-medium text-xs">
                        {formatRegistrationDate(user.id)}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground">1 hour ago</div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="outline" className="h-7 w-7">
                      <FileText className="h-3 w-3" />
                    </Button>
                    <Can do="update" on="User">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-7 w-7"
                        onClick={() => user.id && handleEditUser(user.id)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </Can>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 