"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the page view (title + content area)
 * Designed to feel fast and give sense of what's loading
 */
export function PageSkeleton() {
  return (
    <div className="flex flex-1 flex-col max-w-5xl mx-auto w-full py-6 px-4 md:py-12 md:px-8 min-h-screen bg-background animate-in fade-in-50 duration-300">
      {/* Icon placeholder */}
      <div className="mb-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>

      {/* Title */}
      <Skeleton className="h-10 w-2/3 mb-8" />

      {/* Content lines */}
      <div className="space-y-3 pl-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for the workspace empty state area
 */
export function WorkspaceSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 animate-in fade-in-50 duration-300">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-6 w-48 mt-6" />
      <Skeleton className="h-4 w-64 mt-2" />
      <Skeleton className="h-10 w-40 mt-8 rounded-lg" />
    </div>
  );
}

/**
 * Skeleton loader for sidebar page list items
 */
export function PageTreeSkeleton() {
  return (
    <div className="space-y-1 px-2 py-2 animate-in fade-in-50 duration-300">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
