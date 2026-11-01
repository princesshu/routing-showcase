// Generates the "Route map" table in README.md from the route list that
// integrations/route-map.ts saves during `astro build`, so the documented
// routes can't drift from src/pages/. Run it after a build:
//
//   pnpm route-map           rewrite the table in README.md
//   pnpm route-map --check   exit 1 if README.md is out of date (CI)

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import * as prettier from 'prettier';
import type { RouteMapEntry } from '../integrations/route-map.ts';

const README = 'README.md';
// Astro's default cacheDir, where the integration writes its file.
const DATA = 'node_modules/.astro/route-map.json';
const START = '<!-- route-map:start -->';
const END = '<!-- route-map:end -->';
const METHODS =
  /export\s+(?:const|(?:async\s+)?function)\s+(GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS|ALL)\b/g;
const BUILT_IN: Record<string, string> = {
  '/_server-islands/[name]': 'server islands',
  '/_actions/[...path]': 'actions',
  '/_image': 'image endpoint',
};

type Row = { url: string; file: string; kind: string; rendering: string };

const isString = (value: unknown) => typeof value === 'string';

function isEntry(value: unknown): value is RouteMapEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry: Partial<Record<keyof RouteMapEntry, unknown>> = value;
  return (
    isString(entry.pattern) &&
    isString(entry.entrypoint) &&
    isString(entry.type) &&
    isString(entry.origin) &&
    typeof entry.prerendered === 'boolean' &&
    (entry.redirect === null || isString(entry.redirect)) &&
    (entry.redirectStatus === null ||
      typeof entry.redirectStatus === 'number') &&
    typeof entry.outputs === 'number'
  );
}

function readEntries(): RouteMapEntry[] {
  if (!existsSync(DATA)) {
    throw new Error(`${DATA} not found. Run \`pnpm build\` first.`);
  }
  const data: unknown = JSON.parse(readFileSync(DATA, 'utf8'));
  if (!Array.isArray(data) || !data.every(isEntry)) {
    throw new Error(`Unexpected ${DATA} shape. Rebuild to regenerate it.`);
  }
  return data;
}

function kind(entry: RouteMapEntry): string {
  if (entry.origin !== 'project') return BUILT_IN[entry.pattern] ?? 'built in';
  if (entry.type === 'redirect') {
    return `redirect to \`${entry.redirect}\` (${entry.redirectStatus})`;
  }
  if (entry.type === 'endpoint') {
    const source = readFileSync(entry.entrypoint, 'utf8');
    const methods = [...source.matchAll(METHODS)].map((match) => match[1]);
    return `endpoint (${methods.join(', ')})`;
  }
  if (entry.pattern === '/404' || entry.pattern === '/500') {
    return `${entry.pattern.slice(1)} page`;
  }
  return 'page';
}

function rendering(entry: RouteMapEntry): string {
  if (!entry.prerendered || entry.type === 'redirect') return 'on demand';
  return entry.pattern.includes('[')
    ? `prerendered (${entry.outputs} paths)`
    : 'prerendered';
}

const toRow = (entry: RouteMapEntry): Row => ({
  url: entry.pattern,
  file:
    entry.origin !== 'project'
      ? '(built in)'
      : entry.type === 'redirect'
        ? 'astro.config.ts'
        : entry.entrypoint,
  kind: kind(entry),
  rendering: rendering(entry),
});

const rows = readEntries()
  .map(toRow)
  .sort((a, b) => a.url.localeCompare(b.url));

const code = (text: string) => (text.startsWith('(') ? text : `\`${text}\``);
const table = [
  '| URL | File | Kind | Rendering |',
  '| --- | --- | --- | --- |',
  ...rows.map(
    (row) =>
      `| \`${row.url}\` | ${code(row.file)} | ${row.kind} | ${row.rendering} |`
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
      `${README} route map is out of date. Run \`pnpm route-map\` after \`astro build\`.`
    );
    process.exitCode = 1;
  } else {
    console.log(`${README} route map is up to date (${rows.length} routes).`);
  }
} else {
  writeFileSync(README, formatted);
  console.log(`Wrote ${rows.length} routes to ${README}.`);
}
