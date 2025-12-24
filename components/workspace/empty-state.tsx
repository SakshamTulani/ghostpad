"use client";

import { useRootPages } from "@/hooks/use-ghostpad";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function EmptyState({ workspaceId }: { workspaceId: string }) {
  const { createPage } = useRootPages(workspaceId);
  const router = useRouter();

  const handleCreateFirstPage = async () => {
    try {
      const newPageId = await createPage({
        workspaceId,
        title: "Getting Started",
        parentId: workspaceId,
      });
      router.push(`/${workspaceId}/${newPageId}`);
    } catch (e) {
      console.error("Failed to create page", e);
    }
  };

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
