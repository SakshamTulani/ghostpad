"use client";

import { useWorkspaces } from "@/hooks/use-ghostpad";
import { CreateWorkspaceDialog } from "@/components/dashboard/create-workspace-dialog";
import { WorkspaceCard } from "@/components/dashboard/workspace-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Ghost } from "lucide-react";

export default function DashboardPage() {
  const { workspaces, isLoading } = useWorkspaces();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Ghost className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Ghostpad</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Workspaces</h2>
              <p className="text-muted-foreground">
                Manage your knowledge bases and notes.
              </p>
            </div>
            <CreateWorkspaceDialog />
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl border bg-card shadow-sm"
                />
              ))}
            </div>
          ) : workspaces && workspaces.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          ) : (
            <div className="flex h-100 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 p-8 text-center animate-in fade-in-50 zoom-in-95 duration-500">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
                <Ghost className="h-10 w-10 text-primary/50" />
              </div>
              <div className="max-w-105 space-y-1">
                <h3 className="text-xl font-semibold">No workspaces yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first workspace to start organizing your notes and
                  documents.
                </p>
              </div>
              <CreateWorkspaceDialog />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
