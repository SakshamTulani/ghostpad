"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NotFoundStateProps {
  type: "workspace" | "page";
  workspaceId?: string;
}

export function NotFoundState({ type, workspaceId }: NotFoundStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 shadow-sm">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">
        {type === "workspace" ? "Workspace not found" : "Page not found"}
      </h2>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        {type === "workspace"
          ? "This workspace doesn't exist or has been deleted."
          : "This page doesn't exist or has been deleted."}
      </p>
      <div className="flex gap-3 mt-8">
        {type === "page" && workspaceId && (
          <Button variant="outline" asChild>
            <Link href={`/${workspaceId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to workspace
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
