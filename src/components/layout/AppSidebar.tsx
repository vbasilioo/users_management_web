"use client"

import * as React from "react"

import { NavMain, NavSecondary, NavUser } from "@/components/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAppSidebar } from "./useAppSidebar"
import { cn } from "@/lib/utils"

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useAppSidebar(props);
  
  return (
    <Sidebar 
      collapsible="offcanvas" 
      className={cn("w-64 border-r bg-white", className)}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Users Management</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
} 