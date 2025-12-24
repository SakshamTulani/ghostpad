"use client";

import { EmptyState } from "@/components/workspace/empty-state";
import { useRootPages } from "@/hooks/use-ghostpad";
import { useParams } from "next/navigation";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { pages, isLoading } = useRootPages(workspaceId);

  const hasPages = !isLoading && pages && pages.length > 0;

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
      <EmptyState workspaceId={workspaceId} hasPages={hasPages} />
    </div>
  );
}
