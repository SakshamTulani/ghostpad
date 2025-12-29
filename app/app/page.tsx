"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { WorkspaceHeader } from "@/components/workspace/header";
import { WorkspaceContent } from "@/components/views/workspace-content";
import { PageContent } from "@/components/views/page-content";
import { DashboardView } from "@/components/views/dashboard-view";

/**
 * Main app page using query params for routing.
 * Added all in one to make it easier to cache the whole app and to avoid making dynamic routes.
 *
 * URL patterns:
 * - /app → redirects to dashboard (/)
 * - /app?workspace=xxx → workspace view
 * - /app?workspace=xxx&page=yyy → page view
 */
function AppContent() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace");
  const pageId = searchParams.get("page");

  // No workspace = show dashboard
  if (!workspaceId) {
    return <DashboardView />;
  }

  // Has workspace = show workspace layout with sidebar
  return (
    <SidebarProvider>
      <AppSidebar workspaceId={workspaceId} />
      <SidebarInset>
        <WorkspaceHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {pageId ? (
            <PageContent workspaceId={workspaceId} pageId={pageId} />
          ) : (
            <WorkspaceContent workspaceId={workspaceId} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }>
      <AppContent />
    </Suspense>
  );
}
