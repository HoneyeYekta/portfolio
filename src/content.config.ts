import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per project in src/content/projects/.
// Files starting with "_" (like _template.md) are ignored.
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tools: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    article: z.string().url().optional(),
    articleLabel: z.string().default('Read the full article'),
    link: z.string().url().optional(),
    linkLabel: z.string().default('LinkedIn post'),
    status: z.enum(['published', 'upcoming']).default('published'),
  }),
});

export const collections = { projects };
