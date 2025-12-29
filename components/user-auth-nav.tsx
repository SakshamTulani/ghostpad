"use client";

import { db } from "@/lib/dexie/db";
import { useObservable } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserAuthNav() {
  const currentUser = useObservable(db.cloud.currentUser);
  const syncState = useObservable(db.cloud.syncState);
  const isOnline = useOnlineStatus();

  const handleLogin = () => {
    if (!isOnline) {
      toast.error("You are currently offline", {
        description: "Please connect to the internet to sign in.",
      });
      return;
    }
    db.cloud.login();
  };

  const handleLogout = () => {
    db.cloud.logout();
  };

  // Not logged in - show login button
  if (!currentUser?.isLoggedIn) {
    return (
      <Button variant="ghost" size="sm" onClick={handleLogin}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    );
  }

  // Logged in - show user dropdown
  return (
    <div className="flex items-center gap-2">
      {(syncState?.phase === "pulling" || syncState?.phase === "pushing") && (
        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser.email || currentUser.userId}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
