"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAuthNav } from "@/components/user-auth-nav";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4 justify-between bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 my-auto" />
        <Button variant="ghost" size="icon-sm" asChild title="Go to Dashboard">
          <Link href="/">
            <Home className="h-4 w-4" />
            <span className="sr-only">Go to Dashboard</span>
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserAuthNav />
      </div>
    </header>
  );
}
