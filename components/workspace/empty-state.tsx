"use client";

import { useRootPages } from "@/hooks/use-ghostpad";
import { Button } from "@/components/ui/button";
import { FileText, Plus, MousePointerClick } from "lucide-react";
import { useRouter } from "next/navigation";
import { PAGE_DEFAULTS } from "@/lib/defaults";

interface EmptyStateProps {
  workspaceId: string;
  hasPages?: boolean;
}

export function EmptyState({ workspaceId, hasPages = false }: EmptyStateProps) {
  const { createPage } = useRootPages(workspaceId);
  const router = useRouter();

  const handleCreateFirstPage = async () => {
    try {
      const newPageId = await createPage({
        workspaceId,
        ...PAGE_DEFAULTS,
        parentId: workspaceId,
      });
      router.push(`/${workspaceId}/${newPageId}`);
    } catch (e) {
      console.error("Failed to create page", e);
    }
  };

  // Pages exist but none is selected
  if (hasPages) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-sm">
          <MousePointerClick className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">Select a page</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
          Choose a page from the sidebar to start editing, or create a new one.
        </p>
        <Button
          onClick={handleCreateFirstPage}
          className="mt-8"
          variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create new page
        </Button>
      </div>
    );
  }

  // No pages exist - welcome state
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-sm">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">Welcome to your workspace</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        This workspace is clean and ready for your ideas. Create your first page
        to get started.
      </p>
      <Button onClick={handleCreateFirstPage} className="mt-8" size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Create first page
      </Button>
    </div>
  );
}
