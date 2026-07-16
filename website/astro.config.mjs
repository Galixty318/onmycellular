// @ts-check

import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkOverviewCitations from './src/utils/remark-overview-citations.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://galixty318.github.io',
	base: '/onmycellular',
	build: {
		// Keep cached pages self-contained across GitHub Pages deployments.
		inlineStylesheets: 'always',
	},
	integrations: [mdx(), sitemap()],
	markdown: {
		processor: unified({ remarkPlugins: [remarkOverviewCitations] }),
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
