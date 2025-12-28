"use client";

import { usePage, useWorkspace } from "@/hooks/use-ghostpad";
import Editor from "@/components/editor";
import { NoteHeader } from "@/components/workspace/note-header";
import { PageSkeleton } from "@/components/ui/skeletons";
import { NotFoundState } from "@/components/workspace/not-found-state";

interface PageContentProps {
  workspaceId: string;
  pageId: string;
}

/**
 * Page content component - renders just the content, no layout wrapper.
 * Use inside workspace layout routes or compose with WorkspaceLayoutWrapper.
 */
export function PageContent({ workspaceId, pageId }: PageContentProps) {
  const { workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { page, isLoading: pageLoading, updatePage } = usePage(pageId);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageId, { title: e.target.value });
  };

  const handleIconChange = (icon: string) => {
    updatePage(pageId, { icon });
  };

  if (workspaceLoading || pageLoading) {
    return <PageSkeleton />;
  }

  if (!workspace) {
    return (
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        <NotFoundState type="workspace" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        <NotFoundState type="page" workspaceId={workspaceId} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col max-w-5xl mx-auto w-full py-6 px-4 md:py-12 md:px-8 min-h-screen bg-background">
      <NoteHeader
        page={page}
        onIconChange={handleIconChange}
        onTitleChange={handleTitleChange}
      />
      <div className="pl-4">
        <Editor key={pageId} pageId={pageId} />
      </div>
    </div>
  );
}
