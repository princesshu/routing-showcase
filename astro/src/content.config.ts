import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every Markdown file under src/content/guides becomes an entry whose id is
// its path without the extension, e.g. "advanced/route-priority".
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({ title: z.string() }),
});

export const collections = { guides };
