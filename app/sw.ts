import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StaleWhileRevalidate } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    // SPA Navigation: serve cached "/app" for navigation requests
    // The /app page reads query params and renders the appropriate view
    navigateFallback: "/app",
    // Don't use fallback for these patterns
    navigateFallbackDenylist: [
      /^\/api\//, // API routes
      /^\/serwist\//, // Service worker routes
      /\.[a-zA-Z0-9]+$/, // Files with extensions (assets)
    ],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Stale-while-revalidate for /app route
    // Serves cached version immediately, but fetches from network to update cache
    // This ensures users get fast loads AND receive updates after deployment
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.mode === "navigate",
      handler: new StaleWhileRevalidate({
        cacheName: "app-pages",
      }),
    },
    // Include default caching rules for other assets
    ...defaultCache,
  ],
});

serwist.addEventListeners();
