"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/hooks/use-ghostpad";
import { CreateWorkspaceDialog } from "@/components/dashboard/create-workspace-dialog";
import { Icon, IconName } from "@/components/ui/icon-picker";

export function WorkspaceSwitcher({
  activeWorkspaceId,
}: {
  activeWorkspaceId: string;
}) {
  const { isMobile } = useSidebar();
  const { workspaces, createWorkspace } = useWorkspaces();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  // State for CreateWorkspaceDialog if we want to trigger it from here
  // Note: CreateWorkspaceDialog has its own trigger, so we might need to wrap or adapt it.
  // For now, let's assume we can navigate.

  const activeWorkspace = workspaces?.find((w) => w.id === activeWorkspaceId);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {activeWorkspace?.icon ? (
                  <Icon
                    name={activeWorkspace.icon as IconName}
                    className="size-4"
                  />
                ) : (
                  activeWorkspace?.name?.charAt(0) ?? "W"
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name || "Select Workspace"}
                </span>
                <span className="truncate text-xs">
                  {/* Could show role or something else here */}
                  Workspace
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => router.push(`/${workspace.id}`)}
                className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {workspace.icon ? (
                    <Icon
                      name={workspace.icon as IconName}
                      className="size-4"
                    />
                  ) : (
                    workspace.name.charAt(0)
                  )}
                </div>
                {workspace.name}
                {workspace.id === activeWorkspaceId && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {/* 
                TODO: Create Workspace trigger. 
                The CreateWorkspaceDialog usually renders a button. 
                We might need to refactor it to accept 'open' state or use a different trigger.
                For now, linking back to dashboard creates a flow to add workspace.
             */}
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push("/")}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
