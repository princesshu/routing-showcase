import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16 — no flag required.
  // Type-checks <Link href> and router.push() against the real route tree.
  typedRoutes: true,
  experimental: {
    // Enables forbidden() / unauthorized() and the forbidden.tsx /
    // unauthorized.tsx special files used by app/account/page.tsx.
    authInterrupts: true,
  },
};

export default nextConfig;
