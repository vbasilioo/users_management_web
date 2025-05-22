'use client';

import { UserTable } from "@/components/dashboard/users"

export default function Page() {
  return (
    <section>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6">Users</h1>
                <UserTable />
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
