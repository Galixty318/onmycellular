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

const projects = defineCollection({
	loader: glob({ base: '../content/projects', pattern: '*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const overviewSteps = defineCollection({
	loader: glob({ base: '../content/projects/the-overview-project/steps', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		order: z.number(),
		description: z.string(),
		icon: z.enum(['source', 'proliferation', 'differentiation', 'formation', 'harvest', 'processing']),
		substeps: z.array(
			z.object({
				title: z.string(),
				slug: z.string(),
				order: z.number(),
				description: z.string(),
			}),
		),
	}),
});

const overviewMethods = defineCollection({
	loader: glob({
		base: '../content/projects/the-overview-project/methods',
		pattern: '**/*.{md,mdx}',
		generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		step: z.string(),
		substep: z.string(),
		order: z.number(),
		description: z.string(),
		sections: z.array(
			z.object({
				label: z.string(),
				title: z.string(),
				description: z.string(),
				items: z.array(z.string()).optional(),
				pros: z.array(z.string()).optional(),
				cons: z.array(z.string()).optional(),
			}),
		),
		sources: z.array(
			z.object({
				citation: z.string(),
				url: z.string().url().optional(),
			}),
		),
	}),
});

const reviews = defineCollection({
	loader: glob({ base: '../content/reviews', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const writing = defineCollection({
	loader: glob({ base: '../content/food writing', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const summaries = defineCollection({
	loader: glob({ base: '../content/summary papers', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const pages = defineCollection({
	loader: glob({ base: '../content', pattern: '*.md' }),
});

export const collections = {
	blog,
	overviewMethods,
	overviewSteps,
	pages,
	projects,
	reviews,
	summaries,
	writing,
};
