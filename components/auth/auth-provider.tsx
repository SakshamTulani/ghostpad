"use client";

import { LoginDialog } from "@/components/auth/login-dialog";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginDialog />
    </>
  );
}
