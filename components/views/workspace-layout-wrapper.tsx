"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { WorkspaceHeader } from "@/components/workspace/header";

interface WorkspaceLayoutWrapperProps {
  children: React.ReactNode;
  workspaceId?: string;
}

/**
 * Shared layout wrapper for workspace views.
 * Provides sidebar, header, and content area.
 */
export function WorkspaceLayoutWrapper({
  children,
  workspaceId,
}: WorkspaceLayoutWrapperProps) {
  return (
    <SidebarProvider>
      <AppSidebar workspaceId={workspaceId} />
      <SidebarInset>
        <WorkspaceHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
