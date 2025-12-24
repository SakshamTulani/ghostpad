"use client";

import { usePage, useWorkspace } from "@/hooks/use-ghostpad";
import { useParams } from "next/navigation";
import { IconName } from "@/components/ui/icon-picker";
import Editor from "@/components/editor";
import { NoteHeader } from "@/components/workspace/note-header";
import { PageSkeleton } from "@/components/ui/skeletons";
import { NotFoundState } from "@/components/workspace/not-found-state";

export default function PageView() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const pageId = params.pageId as string;
  const { workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { page, isLoading: pageLoading, updatePage } = usePage(pageId);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageId, { title: e.target.value });
  };

  const handleIconChange = (icon: IconName) => {
    updatePage(pageId, { icon });
  };

  // Show skeleton during loading
  if (workspaceLoading || pageLoading) {
    return <PageSkeleton />;
  }

  // Workspace doesn't exist
  if (!workspace) {
    return (
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
        <NotFoundState type="workspace" />
      </div>
    );
  }

  // Page doesn't exist (but workspace does)
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
        <Editor pageId={pageId} />
      </div>
    </div>
  );
}
