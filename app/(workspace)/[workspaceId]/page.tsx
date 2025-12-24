"use client";

import { EmptyState } from "@/components/workspace/empty-state";
import { useParams } from "next/navigation";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
      <EmptyState workspaceId={workspaceId} />
    </div>
  );
}
