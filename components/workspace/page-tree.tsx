"use client";

import {
  ChevronRight,
  MoreHorizontal,
  Plus,
  Smile,
  Trash2,
} from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Emoji } from "@/components/ui/icon-picker";
import { useRootPages, useChildPages, usePage } from "@/hooks/use-ghostpad";
import { useRouter, useSearchParams } from "next/navigation";
import { Page } from "@/lib/dexie/db";
import React from "react";
import { PAGE_DEFAULTS } from "@/lib/defaults";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageTreeSkeleton } from "@/components/ui/skeletons";

export function PageTree({ workspaceId }: { workspaceId: string }) {
  const { pages, isLoading, createPage } = useRootPages(workspaceId);
  const router = useRouter();

  const handleCreatePage = async () => {
    try {
      const newPageId = await createPage({
        workspaceId,
        title: PAGE_DEFAULTS.title,
        parentId: workspaceId,
      });
      router.push(`/app?workspace=${workspaceId}&page=${newPageId}`);
    } catch (e) {
      console.error("Failed to create root page", e);
    }
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <PageTreeSkeleton />
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group/label flex justify-between">
        Pages
        <button
          onClick={handleCreatePage}
          className="block md:hidden md:group-hover/label:block text-muted-foreground hover:text-foreground"
          title="Create new page">
          <Plus className="h-4 w-4" />
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        {pages?.map((page) => (
          <PageItem
            key={page.id}
            page={page}
            workspaceId={workspaceId}
            depth={0}
          />
        ))}
        {(!pages || pages.length === 0) && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground/50 italic">
              No pages yet
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function PageItem({
  page,
  workspaceId,
  depth = 0,
}: {
  page: Page;
  workspaceId: string;
  depth?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pages: childPages, createPage: createChild } = useChildPages(page.id);
  const { softDeletePage } = usePage(page.id);

  // Basic isExpanded simply based on if it has children for now
  // Real notion-like tree needs state persistence
  // We can use Collapsible 'open' state
  const [isOpen, setIsOpen] = React.useState(false);

  const currentPageId = searchParams.get("page");
  const isActive = currentPageId === page.id;
  const hasChildren = childPages && childPages.length > 0;

  const handleCreateChild = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newPageId = await createChild({
        workspaceId,
        title: PAGE_DEFAULTS.title,
        parentId: page.id,
      });
      setIsOpen(true); // Auto expand
      router.push(`/app?workspace=${workspaceId}&page=${newPageId}`);
    } catch (err) {
      console.error("Failed to create child page", err);
    }
  };

  const handleDelete = async () => {
    await softDeletePage(page.id);
    if (isActive) {
      router.push(`/app?workspace=${workspaceId}`);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} className="group/item">
          <div
            onClick={() =>
              router.push(`/app?workspace=${workspaceId}&page=${page.id}`)
            }
            className="flex w-full items-center gap-2 cursor-pointer"
            style={{ paddingLeft: `${12 * depth}px` }}>
            {/* Show chevron if there are children usually, but Notion shows it always or on hover used for nesting */}
            {/* Using standard sidebar approach: Chevron triggers collapse, Text triggers nav */}
            <div
              className="flex items-center justify-center h-4 w-4 rounded hover:bg-sidebar-accent/50 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}>
              {hasChildren ? (
                <ChevronRight
                  className={`h-3 w-3 transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              ) : (
                <span className="w-3" /> // spacer
              )}
            </div>

            <div className="flex items-center justify-center h-5 w-5">
              {page.icon ? (
                <Emoji emoji={page.icon} className="h-4 w-4" />
              ) : (
                <Smile className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </div>
            <span className="grow truncate">{page.title || "Untitled"}</span>

            {/* Actions - inline to avoid overlap with nested content */}
            <div className="flex items-center gap-0.5 shrink-0 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
              <button
                className="flex items-center justify-center h-6 w-6 rounded hover:bg-sidebar-accent text-muted-foreground hover:text-foreground"
                onClick={handleCreateChild}
                title="Add sub-page">
                <Plus className="h-4 w-4" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center h-6 w-6 rounded hover:bg-sidebar-accent text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side="right"
                  align="start">
                  <DropdownMenuItem onClick={handleCreateChild}>
                    <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Add sub-page</span>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete page?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;
                          {page.title || "Untitled"}&rdquo;? This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {hasChildren && (
        <CollapsibleContent>
          {childPages.map((child) => (
            <PageItem
              key={child.id}
              page={child}
              workspaceId={workspaceId}
              depth={depth + 1}
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
