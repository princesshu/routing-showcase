// Generates the "Route map" table in README.md, so the documented routes
// can't drift from src/routes/. Run it after a build:
//
//   pnpm route-map           rewrite the table in README.md
//   pnpm route-map --check   exit 1 if README.md is out of date (CI)
//
// The routes come from src/routeTree.gen.ts, which the router plugin writes
// on every build; the ssr option and handler methods from each route file,
// the root route and src/start.ts; the prerendered paths from dist/client.
// The route tree is generated code,
// not a public API: if a TanStack Router upgrade changes its shape, this
// script throws instead of writing a wrong table.

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as prettier from 'prettier';

const README = 'README.md';
const ROUTE_TREE = 'src/routeTree.gen.ts';
const ROOT = 'src/routes/__root.tsx';
const START_FILE = 'src/start.ts';
const CLIENT = 'dist/client';
const START = '<!-- route-map:start -->';
const END = '<!-- route-map:end -->';
const EXTENSIONS = ['.tsx', '.ts'];

// Options are matched at the start of a line, so comments that mention
// them ("// ssr: false keeps…") don't count.
const SSR_OPTION = /^\s+ssr:\s*(.+?),?\s*$/m;
const DEFAULT_SSR_OPTION = /^\s+defaultSsr:\s*(.+?),?\s*$/m;
const SERVER_OPTION = /^\s+server:\s*\{/m;
const COMPONENT_OPTION = /^\s+component:/m;
const METHODS = /^\s+(GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS):/gm;

type Entry = {
  id: string;
  fullPath: string;
  file: string;
  variable: string;
  parent: string;
  source: string;
};

type Row = {
  sortKey: string;
  url: string;
  file: string;
  kind: string;
  rendering: string;
};

// Least to most restrictive. A child route can only make its parent's
// setting more restrictive, never less.
const SSR_MODES = ['SSR', 'data-only', 'client only'] as const;
type SsrMode = (typeof SSR_MODES)[number] | 'per request';

function resolveFile(base: string): string {
  for (const ext of EXTENSIONS) if (existsSync(base + ext)) return base + ext;
  throw new Error(`No source file found for ${base}`);
}

function readEntries(): Entry[] {
  if (!existsSync(ROUTE_TREE)) {
    throw new Error(`${ROUTE_TREE} not found. Run \`pnpm build\` first.`);
  }
  const tree = readFileSync(ROUTE_TREE, 'utf8');

  const files = new Map<string, string>();
  for (const [, variable, path] of tree.matchAll(
    /^import \{ Route as (\w+) \} from '\.\/(routes\/[^']+)'$/gm
  )) {
    files.set(variable, resolveFile(join('src', path)));
  }

  const block = tree.match(/interface FileRoutesByPath \{([\s\S]*?)\n {2}\}/);
  const entries: Entry[] = [];
  for (const [, id, fullPath, variable, parent] of (block?.[1] ?? '').matchAll(
    /id: '([^']+)'\s+path: '[^']*'\s+fullPath: '([^']+)'\s+preLoaderRoute: typeof (\w+)\s+parentRoute: typeof (\w+)/g
  )) {
    const file = files.get(variable);
    if (!file) throw new Error(`No import for ${variable} in ${ROUTE_TREE}.`);
    entries.push({
      id,
      fullPath,
      file,
      // preLoaderRoute names the import (AuthRouteRouteImport), parentRoute
      // the updated route (AuthRouteRoute); compare them without the suffix.
      variable: variable.replace(/Import$/, ''),
      parent: parent.replace(/Import$/, ''),
      source: readFileSync(file, 'utf8'),
    });
  }
  // Every key must have parsed, or a changed entry shape would drop routes
  // from the table without a word.
  const keys = (block?.[1] ?? '').match(/^ {4}'[^']+': \{$/gm)?.length ?? 0;
  if (keys === 0 || keys !== entries.length) {
    throw new Error(
      `Unexpected ${ROUTE_TREE} shape: ${keys} FileRoutesByPath keys, ${entries.length} parsed.`
    );
  }
  return entries;
}

function ssrMode(value: string | undefined): SsrMode | undefined {
  if (value === undefined) return undefined;
  if (value === 'true') return 'SSR';
  if (value === 'false') return 'client only';
  if (value === "'data-only'" || value === '"data-only"') return 'data-only';
  return 'per request';
}

// defaultSsr in src/start.ts applies to every route without its own ssr,
// the root route included.
const defaultSsr =
  ssrMode(
    existsSync(START_FILE)
      ? readFileSync(START_FILE, 'utf8').match(DEFAULT_SSR_OPTION)?.[1]
      : undefined
  ) ?? 'SSR';

function effectiveSsr(entry: Entry, byVariable: Map<string, Entry>): SsrMode {
  const chain: string[] = [];
  for (let e: Entry | undefined = entry; e; e = byVariable.get(e.parent)) {
    chain.push(e.source);
  }
  chain.push(readFileSync(ROOT, 'utf8'));

  let mode: (typeof SSR_MODES)[number] = 'SSR';
  for (const source of chain) {
    const value = ssrMode(source.match(SSR_OPTION)?.[1]) ?? defaultSsr;
    if (value === 'per request') return value;
    if (SSR_MODES.indexOf(value) > SSR_MODES.indexOf(mode)) mode = value;
  }
  return mode;
}

// "/products/" (an index route) → "/products"
const toUrl = (fullPath: string) =>
  fullPath.length > 1 ? fullPath.replace(/\/$/, '') : fullPath;

// "/products/$id" → /^\/products\/[^/]+\/?$/, "{-$x}" optional, "$" splat.
function pattern(url: string): RegExp {
  const parts = url
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      if (segment === '$') return '(?:/.*)?';
      if (/^\{-\$\w+\}$/.test(segment)) return '(?:/[^/]+)?';
      if (segment.startsWith('$')) return '/[^/]+';
      return '/' + segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
  return new RegExp(`^${parts.join('')}/?$`);
}

function prerenderedPaths(): string[] {
  if (!existsSync(CLIENT)) {
    throw new Error(`${CLIENT} not found. Run \`pnpm build\` first.`);
  }
  return readdirSync(CLIENT, { recursive: true, encoding: 'utf8' })
    .filter((file) => file === 'index.html' || file.endsWith('/index.html'))
    .map((file) => '/' + dirname(file).replace(/^\.$/, ''));
}

const entries = readEntries();
const byVariable = new Map(entries.map((e) => [e.variable, e]));
const parents = new Set(entries.map((e) => e.parent));
const prerendered = prerenderedPaths();

const rows: Row[] = entries.map((entry) => {
  const url = toUrl(entry.fullPath);
  const isPathless = entry.id.split('/').at(-1)!.startsWith('_');
  const children = entries.filter((e) => e.parent === entry.variable);
  const methods = SERVER_OPTION.test(entry.source)
    ? [...entry.source.matchAll(METHODS)].map((match) => match[1])
    : [];
  const hasComponent = COMPONENT_OPTION.test(entry.source);
  const ssr = effectiveSsr(entry, byVariable);
  // Sorted as if optional segments were left out: /{-$locale}/greeting
  // next to /greeting.
  const base = { file: entry.file, sortKey: url.replace(/\/\{-\$\w+\}/g, '') };

  if (isPathless) {
    const urls = children.map((child) => `\`${toUrl(child.fullPath)}\``);
    return {
      ...base,
      sortKey: children.length > 0 ? toUrl(children[0].fullPath) : url,
      url: `wraps ${urls.join(', ')}`,
      kind: 'pathless layout',
      rendering: ssr,
    };
  }
  if (methods.length > 0 && !hasComponent) {
    return {
      ...base,
      url: `\`${url}\``,
      kind: `server route (${methods.join(', ')})`,
      rendering: 'on request',
    };
  }

  const paths = prerendered.filter((path) => pattern(url).test(path));
  const rendering =
    paths.length === 0
      ? ssr
      : paths.length === 1 && paths[0] === url
        ? 'prerendered'
        : `prerendered (${paths.length} paths)`;
  return {
    ...base,
    url: `\`${url}\``,
    kind: parents.has(entry.variable) ? 'layout' : 'page',
    rendering,
  };
});

// Within one URL, the layout first, then the page below it.
const rank = (row: Row) => (row.kind.includes('layout') ? 0 : 1);
rows.sort((a, b) => a.sortKey.localeCompare(b.sortKey) || rank(a) - rank(b));

const table = [
  '| URL | File | Kind | Rendering |',
  '| --- | --- | --- | --- |',
  ...rows.map(
    (row) => `| ${row.url} | \`${row.file}\` | ${row.kind} | ${row.rendering} |`
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
      `${README} route map is out of date. Run \`pnpm route-map\` after \`pnpm build\`.`
    );
    process.exitCode = 1;
  } else {
    console.log(`${README} route map is up to date (${rows.length} routes).`);
  }
} else {
  writeFileSync(README, formatted);
  console.log(`Wrote ${rows.length} routes to ${README}.`);
}
