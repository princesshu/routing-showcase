import { mkdirSync, writeFileSync } from 'node:fs';
import type { AstroIntegration, IntegrationResolvedRoute } from 'astro';

export type RouteMapEntry = {
  pattern: string;
  entrypoint: string;
  type: IntegrationResolvedRoute['type'];
  origin: IntegrationResolvedRoute['origin'];
  prerendered: boolean;
  // Destination and status of a redirect route.
  redirect: string | null;
  redirectStatus: number | null;
  // Number of files the build wrote for this route.
  outputs: number;
};

// Collects Astro's resolved route list during `astro build` and saves it in
// the cache directory, where scripts/route-map.ts turns it into the README
// table. Unlike reading build manifests, this uses a public, typed hook.
export default function routeMap(): AstroIntegration {
  let routes: IntegrationResolvedRoute[] = [];
  let cacheDir: URL | undefined;

  return {
    name: 'route-map',
    hooks: {
      'astro:config:done': ({ config }) => {
        cacheDir = config.cacheDir;
      },
      'astro:routes:resolved': ({ routes: resolved }) => {
        routes = resolved;
      },
      'astro:build:done': ({ assets }) => {
        if (!cacheDir) return;
        const entries: RouteMapEntry[] = routes.map((route) => ({
          pattern: route.pattern,
          entrypoint: route.entrypoint,
          type: route.type,
          origin: route.origin,
          prerendered: route.isPrerendered,
          redirect: redirectTarget(route),
          redirectStatus: redirectStatus(route),
          outputs: assets.get(route.pattern)?.length ?? 0,
        }));
        mkdirSync(cacheDir, { recursive: true });
        writeFileSync(
          new URL('route-map.json', cacheDir),
          `${JSON.stringify(entries, null, 2)}\n`
        );
      },
    },
  };
}

function redirectTarget({ redirect }: IntegrationResolvedRoute) {
  if (redirect === undefined) return null;
  return typeof redirect === 'string' ? redirect : redirect.destination;
}

// A redirect given as a plain string uses Astro's default, 301.
function redirectStatus({ redirect }: IntegrationResolvedRoute) {
  if (redirect === undefined) return null;
  return typeof redirect === 'string' ? 301 : redirect.status;
}
