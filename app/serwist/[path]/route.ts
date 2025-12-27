import { createSerwistRoute } from "@serwist/turbopack";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "app/sw.ts",
    // Copy relevant Next.js configuration (assetPrefix,
    // basePath, distDir) over if you've changed them.
    nextConfig: {},
  });
