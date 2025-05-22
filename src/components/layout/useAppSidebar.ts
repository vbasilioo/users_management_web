'use client';

import { getSidebarData } from "@/data/sidebarData";
import { type ComponentProps } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/redux/hooks";

export function useAppSidebar(props: ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector(state => state.auth);
  const data = getSidebarData(user);

  return {
    data,
    props
  };
} 