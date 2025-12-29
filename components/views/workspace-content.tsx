"use client";

import { EmptyState } from "@/components/workspace/empty-state";
import { useRootPages, useWorkspace } from "@/hooks/use-ghostpad";
import { WorkspaceSkeleton } from "@/components/ui/skeletons";
import { NotFoundState } from "@/components/workspace/not-found-state";

interface WorkspaceContentProps {
  workspaceId: string;
}

/**
 * Workspace content component - renders just the content, no layout wrapper.
 * Use inside workspace layout routes or compose with WorkspaceLayoutWrapper.
 */
export function WorkspaceContent({ workspaceId }: WorkspaceContentProps) {
  const { workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { pages, isLoading: pagesLoading } = useRootPages(workspaceId);

  const isLoading = workspaceLoading || pagesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        <WorkspaceSkeleton />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        <NotFoundState type="workspace" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
      <EmptyState
        workspaceId={workspaceId}
        hasPages={pages && pages.length > 0}
      />
    </div>
  );
}
