export default function CustomDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Custom Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium">Total Users</div>
          </div>
          <div className="text-2xl font-bold">1,235</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium">Active Users</div>
          </div>
          <div className="text-2xl font-bold">427</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium">New Members</div>
          </div>
          <div className="text-2xl font-bold">43</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium">Total Revenue</div>
          </div>
          <div className="text-2xl font-bold">$12,234</div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium">User Activity</h3>
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              Chart will be displayed here
            </div>
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium">Recent Signups</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">2 mins ago</div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">jane@example.com</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">15 mins ago</div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Bob Johnson</p>
                  <p className="text-sm text-muted-foreground">bob@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 