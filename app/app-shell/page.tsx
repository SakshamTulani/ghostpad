"use client";

import { usePathname } from "next/navigation";
import { DashboardView } from "@/components/views/dashboard-view";
import { WorkspaceView } from "@/components/views/workspace-view";
import { PageView } from "@/components/views/page-view";

/**
 * Universal App Shell for PWA offline support.
 *
 * This page is served by the service worker for ALL navigation requests
 * when offline. It reads the actual URL path and renders the appropriate
 * view (dashboard, workspace, or page) with content from Dexie.
 */
export default function AppShell() {
  const pathname = usePathname();

  // Parse URL to determine which view to render
  // Filter out empty segments and "app-shell" itself
  const segments = pathname.split("/").filter((s) => s && s !== "app-shell");

  // No segments = dashboard
  if (segments.length === 0) {
    return <DashboardView />;
  }

  const [workspaceId, pageId] = segments;

  // Two segments = page view
  if (pageId) {
    return <PageView workspaceId={workspaceId} pageId={pageId} />;
  }

  // One segment = workspace view
  return <WorkspaceView workspaceId={workspaceId} />;
}
