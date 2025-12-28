"use client";

import { WorkspaceLayoutWrapper } from "./workspace-layout-wrapper";
import { PageContent } from "./page-content";

interface PageViewProps {
  workspaceId: string;
  pageId: string;
}

/**
 * Full page view with layout wrapper.
 * Used by app-shell for offline navigation.
 */
export function PageView({ workspaceId, pageId }: PageViewProps) {
  return (
    <WorkspaceLayoutWrapper>
      <PageContent workspaceId={workspaceId} pageId={pageId} />
    </WorkspaceLayoutWrapper>
  );
}
