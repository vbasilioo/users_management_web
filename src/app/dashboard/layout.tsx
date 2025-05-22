'use client';

import { AppSidebar } from '@/components';
import { Spinner } from '@/components/ui/Spinner';
import { useDashboardLayout } from './layout/useDashboardLayout';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    shouldRenderSimpleLayout,
    shouldShowLoading,
    shouldHideContent
  } = useDashboardLayout();
  
  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (shouldHideContent) {
    return null;
  }
  
  if (shouldRenderSimpleLayout) {
    return (
      <div className="flex min-h-screen flex-col w-full">
        <main className="flex flex-1 w-full flex-col overflow-auto p-6">
          {children}
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar className="hidden md:block flex-shrink-0" />
      <main className="flex flex-1 flex-col overflow-auto p-3 md:p-4">
        {children}
      </main>
    </div>
  );
} 