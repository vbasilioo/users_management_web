'use client';

import { Spinner } from '@/components/ui/Spinner';
import { Can } from '@/lib/casl/AbilityContext';
import { useUsersPage } from './useUsersPage';

export default function UsersPage() {
  const {
    users,
    user,
    isLoading,
    error,
    navigateToNewUser,
    navigateToEditUser,
    hasPermission
  } = useUsersPage();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      
      <Can do="create" on="User">
        <div className="mb-4">
          <button
            onClick={navigateToNewUser}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New User
          </button>
        </div>
      </Can>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spinner size="md" />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatar && (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-10 w-10 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Can do="update" on="User">
                      <button 
                        onClick={() => navigateToEditUser(user.id as string)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                    </Can>
                    <Can do="delete" on="User">
                      <button 
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 