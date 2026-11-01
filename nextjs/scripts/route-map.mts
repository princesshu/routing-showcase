// Generates the "Route map" table in README.md from the build output, so the
// documented routes can't drift from app/. Run it after `next build`:
//
//   pnpm route-map           rewrite the table in README.md
//   pnpm route-map --check   exit 1 if README.md is out of date (CI)
//
// It reads two manifests from .next/. They are build artifacts, not a public
// API: if a Next.js upgrade changes their shape, this script throws instead of
// writing a wrong table.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as prettier from 'prettier';

const README = 'README.md';
const START = '<!-- route-map:start -->';
const END = '<!-- route-map:end -->';
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const METHODS =
  /export\s+(?:async\s+)?function\s+(GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS)\b/g;

type PrerenderManifest = {
  routes: Record<string, { srcRoute: string | null }>;
  dynamicRoutes: Record<string, unknown>;
};

type Row = { url: string; file: string; kind: string; rendering: string };

function readManifest<T>(name: string): T {
  const path = join('.next', name);
  if (!existsSync(path)) {
    throw new Error(`${path} not found. Run \`next build\` first.`);
  }
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

// "/(auth)/login/page" → app/(auth)/login/page.tsx. Metadata routes differ:
// "/sitemap.xml/route" comes from app/sitemap.ts, "/icon.svg/route" is the
// static file app/icon.svg itself.
function sourceFile(entry: string): string {
  const base = join('app', entry);
  for (const ext of EXTENSIONS) if (existsSync(base + ext)) return base + ext;

  const asset = join('app', entry.replace(/\/route$/, ''));
  if (existsSync(asset)) return asset;
  const stem = asset.replace(/\.[^./]+$/, '');
  for (const ext of EXTENSIONS) if (existsSync(stem + ext)) return stem + ext;

  throw new Error(`No source file found for manifest entry ${entry}`);
}

// "/feed/(..)photo/[id]" → "/photo/[id]": (.) same level, (..) one level up,
// (..)(..) two levels up, (...) from the app root.
function interceptedUrl(route: string): string {
  const segments = route.split('/').filter(Boolean);
  const index = segments.findIndex((segment) => segment.startsWith('(.'));
  const marker = segments[index].match(
    /^(?:\(\.\.\.\)|(?:\(\.\.\))+|\(\.\))/
  )![0];
  const rest = [
    segments[index].slice(marker.length),
    ...segments.slice(index + 1),
  ];
  const parent = segments.slice(0, index);
  const levelsUp =
    marker === '(.)'
      ? 0
      : marker === '(...)'
        ? parent.length
        : marker.length / 4;
  return (
    '/' + [...parent.slice(0, parent.length - levelsUp), ...rest].join('/')
  );
}

function rendering(route: string, prerender: PrerenderManifest): string {
  if (route in prerender.dynamicRoutes) {
    const paths = Object.values(prerender.routes).filter(
      (entry) => entry.srcRoute === route
    ).length;
    return `SSG (${paths} paths)`;
  }
  return route in prerender.routes ? 'static' : 'dynamic';
}

function toRow(
  entry: string,
  route: string,
  prerender: PrerenderManifest
): Row {
  const file = sourceFile(entry);
  const row = { url: route, file, rendering: rendering(route, prerender) };

  if (entry.endsWith('/route')) {
    if (/\.[^/]+\/route$/.test(entry))
      return { ...row, kind: 'metadata route' };
    const methods = [...readFileSync(file, 'utf8').matchAll(METHODS)].map(
      (match) => match[1]
    );
    return { ...row, kind: `route handler (${methods.join(', ')})` };
  }

  const parent = '/' + route.split('/').filter(Boolean)[0];
  if (/\/\(\./.test(entry)) {
    return {
      ...row,
      url: interceptedUrl(route),
      kind: `intercepting route (client navigation from \`${parent}\`)`,
    };
  }

  const slot = entry.match(/\/@([^/]+)\//)?.[1];
  return { ...row, kind: slot ? `parallel slot \`@${slot}\`` : 'page' };
}

const appPaths = readManifest<Record<string, string>>(
  'app-path-routes-manifest.json'
);
const prerender = readManifest<PrerenderManifest>('prerender-manifest.json');
if (!prerender.routes || !prerender.dynamicRoutes) {
  throw new Error('Unexpected .next/prerender-manifest.json shape.');
}

// Within one URL, list the page first, then its slots and interceptions.
const rank = (row: Row) =>
  row.kind.startsWith('parallel slot')
    ? 1
    : row.kind.startsWith('intercepting')
      ? 2
      : 0;

const rows = Object.entries(appPaths)
  .filter(([, route]) => !route.startsWith('/_'))
  .map(([entry, route]) => toRow(entry, route, prerender))
  .sort((a, b) => a.url.localeCompare(b.url) || rank(a) - rank(b));

const table = [
  '| URL | File | Kind | Rendering |',
  '| --- | --- | --- | --- |',
  ...rows.map(
    (row) =>
      `| \`${row.url}\` | \`${row.file}\` | ${row.kind} | ${row.rendering} |`
  ),
].join('\n');

const readme = readFileSync(README, 'utf8');
const start = readme.indexOf(START);
const end = readme.indexOf(END);
if (start === -1 || end === -1) {
  throw new Error(`${README} is missing the ${START} / ${END} markers.`);
}

const updated =
  readme.slice(0, start + START.length) +
  '\n\n' +
  table +
  '\n\n' +
  readme.slice(end);
const options = await prettier.resolveConfig(README);
const formatted = await prettier.format(updated, {
  ...options,
  filepath: README,
});

if (process.argv.includes('--check')) {
  if (formatted !== readme) {
    console.error(
      `${README} route map is out of date. Run \`pnpm route-map\` after \`next build\`.`
    );
    process.exitCode = 1;
  } else {
    console.log(`${README} route map is up to date (${rows.length} routes).`);
  }
} else {
  writeFileSync(README, formatted);
  console.log(`Wrote ${rows.length} routes to ${README}.`);
}
