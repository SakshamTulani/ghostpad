"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAuthNav } from "@/components/user-auth-nav";
import { Logo } from "../logo";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={40} />
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
