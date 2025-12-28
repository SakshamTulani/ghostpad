"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2, Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Workspace } from "@/lib/dexie/db";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WorkspaceDialog } from "./workspace-dialog";
import { useWorkspace, usePageCount } from "@/hooks/use-ghostpad";
import { Emoji } from "@/components/ui/icon-picker";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { softDeleteWorkspace } = useWorkspace(workspace.id);
  const { count: pageCount } = usePageCount(workspace.id);

  const handleDelete = () => {
    softDeleteWorkspace(workspace.id);
    setShowDeleteAlert(false);
  };

  return (
    <>
      <Link
        href={`/app?workspace=${workspace.id}`}
        className="block group relative focus-visible:outline-none rounded-2xl">
        <Card className="h-full border ring-0 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-primary/20 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
                  {workspace.icon ? (
                    <Emoji emoji={workspace.icon} />
                  ) : (
                    workspace.name?.charAt(0) ?? "W"
                  )}
                </div>
                <div>
                  <CardTitle className="line-clamp-1 text-base font-semibold">
                    {workspace.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Updated{" "}
                    {formatDistanceToNow(workspace.updatedAt, {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </div>
              </div>
              <div onClick={(e) => e.preventDefault()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setShowDeleteAlert(true)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>
                  {pageCount ?? 0} page{pageCount === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Created{" "}
                  {new Date(workspace.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="secondary"
              className="w-full justify-start text-xs pointer-events-none">
              Open Workspace
            </Button>
          </CardFooter>
        </Card>
      </Link>

      <WorkspaceDialog
        workspace={workspace}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will move &quot;<strong>{workspace.name}</strong>
              &quot; to the trash. You can restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
