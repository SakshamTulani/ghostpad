"use client";

import { useParams } from "next/navigation";
import { WorkspaceContent } from "@/components/views/workspace-content";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return <WorkspaceContent workspaceId={workspaceId} />;
}
