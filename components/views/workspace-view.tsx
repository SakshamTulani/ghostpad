"use client";

import { WorkspaceLayoutWrapper } from "./workspace-layout-wrapper";
import { WorkspaceContent } from "./workspace-content";

interface WorkspaceViewProps {
  workspaceId: string;
}

/**
 * Full workspace view with layout wrapper.
 * Used by app-shell for offline navigation.
 */
export function WorkspaceView({ workspaceId }: WorkspaceViewProps) {
  return (
    <WorkspaceLayoutWrapper>
      <WorkspaceContent workspaceId={workspaceId} />
    </WorkspaceLayoutWrapper>
  );
}
