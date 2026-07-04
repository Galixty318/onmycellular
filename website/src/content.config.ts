import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load posts from the repository's shared content directory.
	loader: glob({ base: '../content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
		    heroImage: z.optional(image()),
		}),
});

const pages = defineCollection({
	loader: glob({ base: '../content', pattern: '*.md' }),
});

export const collections = { blog, pages };
