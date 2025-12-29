"use client";

import { useEffect } from "react";
import "./globals.css"; // Ensure styles are loaded
import { Button } from "@/components/ui/button";

// Since this replaces the root layout, we unfortunately can't rely on all the context providers
// or complex UI components that might depend on them. We should keep this relatively simple/resilient.
// However, standard shadcn components usually work fine if we include the CSS.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center font-sans">
        <div className="relative mb-8">
          {/* Simple icon fallback using pure SVG to avoid dependency issues in catastrophic failure */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600 dark:text-red-500">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          Critical System Error
        </h1>

        <p className="mb-8 max-w-125 text-muted-foreground text-lg">
          A critical error occurred that crashed the application. Please try
          refreshing the page.
        </p>

        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} size="lg">
            Refresh Page
          </Button>
          <Button onClick={reset} variant="outline" size="lg">
            Try to Recover
          </Button>
        </div>
      </body>
    </html>
  );
}
