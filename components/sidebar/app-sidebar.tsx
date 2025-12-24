"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/components/sidebar/workspace-switcher";
import { useParams } from "next/navigation";
import { PageTree } from "../workspace/page-tree";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher activeWorkspaceId={workspaceId} />
      </SidebarHeader>
      <SidebarContent>
        {/* We will implement PageTree next */}
        <PageTree workspaceId={workspaceId} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
