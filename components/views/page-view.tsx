"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { WorkspaceHeader } from "@/components/workspace/header";
import { usePage, useWorkspace } from "@/hooks/use-ghostpad";
import Editor from "@/components/editor";
import { NoteHeader } from "@/components/workspace/note-header";
import { PageSkeleton } from "@/components/ui/skeletons";
import { NotFoundState } from "@/components/workspace/not-found-state";

interface PageViewProps {
  workspaceId: string;
  pageId: string;
}

export function PageView({ workspaceId, pageId }: PageViewProps) {
  const { workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { page, isLoading: pageLoading, updatePage } = usePage(pageId);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageId, { title: e.target.value });
  };

  const handleIconChange = (icon: string) => {
    updatePage(pageId, { icon });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <WorkspaceHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {workspaceLoading || pageLoading ? (
            <PageSkeleton />
          ) : !workspace ? (
            <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
              <NotFoundState type="workspace" />
            </div>
          ) : !page ? (
            <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
              <NotFoundState type="page" workspaceId={workspaceId} />
            </div>
          ) : (
            <div className="flex flex-1 flex-col max-w-5xl mx-auto w-full py-6 px-4 md:py-12 md:px-8 min-h-screen bg-background">
              <NoteHeader
                page={page}
                onIconChange={handleIconChange}
                onTitleChange={handleTitleChange}
              />
              <div className="pl-4">
                <Editor pageId={pageId} />
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
