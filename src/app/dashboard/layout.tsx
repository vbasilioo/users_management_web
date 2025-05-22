'use client';

import { AppSidebar, SiteHeader } from '@/components';
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
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (shouldHideContent) {
    return null;
  }
  
  if (shouldRenderSimpleLayout) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex w-full flex-col overflow-hidden container mt-6">
          {children}
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <AppSidebar className="hidden md:block" />
        <main className="flex w-full flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 