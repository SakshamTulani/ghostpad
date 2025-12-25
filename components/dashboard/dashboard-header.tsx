"use client";

import { Ghost } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAuthNav } from "@/components/user-auth-nav";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ghost className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Ghostpad</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserAuthNav />
        </div>
      </div>
    </header>
  );
}
