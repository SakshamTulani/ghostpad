"use client";

import {
  ChevronRight,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconPicker, Icon, IconName } from "@/components/ui/icon-picker";
import { useRootPages, useChildPages, usePage } from "@/hooks/use-ghostpad";
import { useRouter, usePathname } from "next/navigation";
import { Page } from "@/lib/dexie/db";
import React from "react";

export function PageTree({ workspaceId }: { workspaceId: string }) {
  const { pages, isLoading, createPage } = useRootPages(workspaceId);
  const router = useRouter();

  const handleCreatePage = async () => {
    try {
      const newPageId = await createPage({
        workspaceId,
        title: "Untitled",
        parentId: workspaceId,
      });
      router.push(`/${workspaceId}/${newPageId}`);
    } catch (e) {
      console.error("Failed to create root page", e);
    }
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          Loading...
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group/label flex justify-between">
        Pages
        <button
          onClick={handleCreatePage}
          className="hidden group-hover/label:block text-muted-foreground hover:text-foreground"
          title="Create new page">
          <Plus className="h-4 w-4" />
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        {pages?.map((page) => (
          <PageItem key={page.id} page={page} workspaceId={workspaceId} />
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

function PageItem({ page, workspaceId }: { page: Page; workspaceId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { pages: childPages, createPage: createChild } = useChildPages(page.id);
  const { softDeletePage, updatePage } = usePage(page.id);

  // Basic isExpanded simply based on if it has children for now
  // Real notion-like tree needs state persistence
  // We can use Collapsible 'open' state
  const [isOpen, setIsOpen] = React.useState(false);

  const isActive = pathname === `/${workspaceId}/${page.id}`;
  const hasChildren = childPages && childPages.length > 0;

  const handleCreateChild = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newPageId = await createChild({
        workspaceId,
        title: "Untitled",
        parentId: page.id,
      });
      setIsOpen(true); // Auto expand
      router.push(`/${workspaceId}/${newPageId}`);
    } catch (err) {
      console.error("Failed to create child page", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this page?")) {
      await softDeletePage(page.id);
      if (isActive) {
        router.push(`/${workspaceId}`);
      }
    }
  };
  const handleIconChange = (icon: IconName) => {
    updatePage(page.id, { icon });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} className="group/item">
          <div
            onClick={() => router.push(`/${workspaceId}/${page.id}`)}
            className="flex w-full items-center gap-2 cursor-pointer">
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

            <div onClick={(e) => e.stopPropagation()}>
              <IconPicker
                value={page.icon as IconName}
                onValueChange={handleIconChange}>
                <div className="flex items-center justify-center h-5 w-5 rounded hover:bg-muted/50 transition">
                  {page.icon ? (
                    <Icon name={page.icon as IconName} className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0 opacity-70" />
                  )}
                </div>
              </IconPicker>
            </div>
            <span className="grow truncate">{page.title || "Untitled"}</span>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal />
                  <span className="sr-only">Make changes</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" side="right" align="start">
                <DropdownMenuItem onClick={handleCreateChild}>
                  <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Add sub-page</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <SidebarMenuAction
              className="right-8 hidden group-hover/item:flex"
              onClick={handleCreateChild}>
              <Plus />
            </SidebarMenuAction>
          </div>
        </SidebarMenuButton>

        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub className="ml-0 border-l-0 px-0 pl-4">
              {childPages.map((child) => (
                <PageItem
                  key={child.id}
                  page={child}
                  workspaceId={workspaceId}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
