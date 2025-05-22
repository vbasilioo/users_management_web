'use client';

import { useDashboard } from './useDashboard';

export function Dashboard() {
  const { user, logout, isLoading } = useDashboard();

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-medium mb-2">User Information</h2>
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
              View Profile
            </button>
            <button className="p-4 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors">
              User Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 