import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

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
    // App Shell Pattern: serve cached "/" for ALL navigation requests
    // This enables offline access to dynamic routes like /workspaceId/pageId
    navigateFallback: "/",
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
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
