"use client";

import { usePage } from "@/hooks/use-ghostpad";
import { useParams } from "next/navigation";
import { IconName } from "@/components/ui/icon-picker";
import Editor from "@/components/editor";
import { NoteHeader } from "@/components/workspace/note-header";

export default function PageView() {
  const params = useParams();
  const pageId = params.pageId as string;
  const { page, isLoading, updatePage } = usePage(pageId);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(pageId, { title: e.target.value });
  };

  const handleIconChange = (icon: IconName) => {
    updatePage(pageId, { icon });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-muted-foreground animate-pulse">Loading...</div>
    );
  }

  if (!page) {
    return <div className="p-12 text-muted-foreground">Page not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col max-w-5xl mx-auto w-full py-12 px-8 min-h-screen bg-background">
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
