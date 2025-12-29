"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-destructive/10 blur-3xl" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-destructive/5 shadow-xl border border-destructive/10 backdrop-blur-sm">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
      </div>

      <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
        Something went wrong!
      </h1>

      <p className="mb-8 max-w-125 text-muted-foreground text-lg">
        Oops! Ghostpad ran into a snag. Let&apos;s try that again.
      </p>

      {/* Show error message in development only, or if safe */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-8 max-w-150 overflow-hidden rounded-md bg-muted p-4 text-left font-mono text-sm text-destructive">
          {error.message || "Unknown error occurred"}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={reset} size="lg" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground/60">
        Digest: {error.digest || "N/A"}
      </div>
    </div>
  );
}
