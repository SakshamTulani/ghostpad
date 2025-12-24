"use client";

import { EmptyState } from "@/components/workspace/empty-state";
import { useRootPages, useWorkspace } from "@/hooks/use-ghostpad";
import { useParams } from "next/navigation";
import { WorkspaceSkeleton } from "@/components/ui/skeletons";
import { NotFoundState } from "@/components/workspace/not-found-state";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { pages, isLoading: pagesLoading } = useRootPages(workspaceId);

  const isLoading = workspaceLoading || pagesLoading;

  // Show skeleton during loading
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        <WorkspaceSkeleton />
      </div>
    );
  }

  // Workspace doesn't exist
  if (!workspace) {
    return (
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        <NotFoundState type="workspace" />
      </div>
    );
  }

  const hasPages = pages && pages.length > 0;

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
      <EmptyState workspaceId={workspaceId} hasPages={hasPages} />
    </div>
  );
}
