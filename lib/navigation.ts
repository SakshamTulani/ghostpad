"use client";

/**
 * Shallow routing utilities for SPA-like navigation without full page reloads.
 * Uses window.history.pushState which integrates with Next.js Router,
 * allowing useSearchParams to stay synced.
 *
 * @see https://nextjs.org/docs/app/guides/single-page-applications#shallow-routing-on-the-client
 */

/**
 * Shallow push a new URL to the browser history without triggering a page reload.
 * This is ideal for offline mode where we want to avoid network requests.
 *
 * @param url - The URL to push (can be relative or absolute path with query params)
 */
export function shallowPush(url: string) {
  window.history.pushState(null, "", url);
}

/**
 * Shallow replace the current URL in the browser history without triggering a page reload.
 *
 * @param url - The URL to replace with
 */
export function shallowReplace(url: string) {
  window.history.replaceState(null, "", url);
}

/**
 * Build a URL with query parameters for the /app route.
 *
 * @param params - Object containing workspace and optional page IDs
 * @returns The constructed URL string
 */
export function buildAppUrl(params: {
  workspace: string;
  page?: string;
}): string {
  const searchParams = new URLSearchParams();
  searchParams.set("workspace", params.workspace);
  if (params.page) {
    searchParams.set("page", params.page);
  }
  return `/app?${searchParams.toString()}`;
}

/**
 * Perform a shallow navigation to the app with the given workspace and optional page.
 * This combines buildAppUrl and shallowPush for convenience.
 *
 * @param params - Object containing workspace and optional page IDs
 */
export function navigateToApp(params: { workspace: string; page?: string }) {
  shallowPush(buildAppUrl(params));
}
