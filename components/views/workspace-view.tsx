"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { WorkspaceHeader } from "@/components/workspace/header";
import { EmptyState } from "@/components/workspace/empty-state";
import { useRootPages, useWorkspace } from "@/hooks/use-ghostpad";
import { WorkspaceSkeleton } from "@/components/ui/skeletons";
import { NotFoundState } from "@/components/workspace/not-found-state";

interface WorkspaceViewProps {
  workspaceId: string;
}

export function WorkspaceView({ workspaceId }: WorkspaceViewProps) {
  const { workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { pages, isLoading: pagesLoading } = useRootPages(workspaceId);

  const isLoading = workspaceLoading || pagesLoading;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <WorkspaceHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading ? (
            <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
              <WorkspaceSkeleton />
            </div>
          ) : !workspace ? (
            <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
              <NotFoundState type="workspace" />
            </div>
          ) : (
            <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
              <EmptyState
                workspaceId={workspaceId}
                hasPages={pages && pages.length > 0}
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
