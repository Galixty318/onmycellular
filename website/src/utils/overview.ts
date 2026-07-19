import { createMarkdownProcessor } from '@astrojs/markdown-remark';

export interface OverviewSource {
	citation: string;
	url?: string;
}

export interface OverviewSection {
	label: string;
	title: string;
	description: string;
	items?: string[];
	pros?: string[];
	cons?: string[];
}

export interface OverviewMethod {
	title: string;
	slug: string;
	order: number;
	description: string;
	overview: string;
	sections: OverviewSection[];
	sources: OverviewSource[];
}

export interface OverviewSubstep {
	title: string;
	slug: string;
	order: number;
	description: string;
	methods: OverviewMethod[];
}

export interface ParsedOverviewStep {
	overview: string;
	substeps: OverviewSubstep[];
}

interface Heading {
	index: number;
	level: number;
	title: string;
	slug?: string;
}

const headingPattern = /^(#{2,5})\s+(.+?)(?:\s+\{#([a-z0-9-]+)\})?\s*$/;
const markdownProcessor = createMarkdownProcessor({ syntaxHighlight: false });

function slugify(value: string) {
	return value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function scanHeadings(lines: string[]) {
	const headings: Heading[] = [];
	let fence: string | undefined;

	lines.forEach((line, index) => {
		const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
		if (fenceMatch) {
			if (!fence) fence = fenceMatch[1][0];
			else if (fence === fenceMatch[1][0]) fence = undefined;
			return;
		}
		if (fence) return;

		const match = line.match(headingPattern);
		if (!match) return;
		headings.push({
			index,
			level: match[1].length,
			title: match[2].trim(),
			slug: match[3],
		});
	});

	return headings;
}

function bodyBetween(lines: string[], start: number, end: number) {
	return lines.slice(start, end).join('\n').trim();
}

function listItems(value: string, ordered: boolean) {
	const pattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/;
	return value
		.split('\n')
		.map((line) => line.match(pattern)?.[1]?.trim())
		.filter((item): item is string => Boolean(item));
}

function descriptionBeforeList(value: string) {
	const lines = value.split('\n');
	const firstListItem = lines.findIndex((line) => /^\s*(?:\d+\.|[-*+])\s+/.test(line));
	return (firstListItem === -1 ? value : lines.slice(0, firstListItem).join('\n')).trim();
}

function parseSources(value: string) {
	return listItems(value, true).map((item) => {
		const link = item.match(/^\[(.+)\]\((https?:\/\/[^\s]+)\)$/);
		return link ? { citation: link[1], url: link[2] } : { citation: item };
	});
}

function requireUniqueSlugs(items: Array<{ slug: string }>, label: string) {
	const seen = new Set<string>();
	for (const item of items) {
		if (seen.has(item.slug)) throw new Error(`Duplicate ${label} slug: ${item.slug}`);
		seen.add(item.slug);
	}
}

function parseMethod(lines: string[], headings: Heading[], methodHeading: Heading, end: number, order: number, context: string): OverviewMethod {
	const fourthLevel = headings.filter((heading) => heading.level === 4 && heading.index > methodHeading.index && heading.index < end);
	const descriptionEnd = fourthLevel[0]?.index ?? end;
	const description = bodyBetween(lines, methodHeading.index + 1, descriptionEnd);
	const slug = methodHeading.slug ?? slugify(methodHeading.title);
	let overview = '';
	let sources: OverviewSource[] = [];
	const sections: OverviewSection[] = [];

	fourthLevel.forEach((heading, index) => {
		const headingEnd = fourthLevel[index + 1]?.index ?? end;
		const fifthLevel = headings.filter((candidate) => candidate.level === 5 && candidate.index > heading.index && candidate.index < headingEnd);
		const bodyEnd = fifthLevel[0]?.index ?? headingEnd;
		const value = bodyBetween(lines, heading.index + 1, bodyEnd);
		const normalizedTitle = heading.title.toLowerCase();

		if (normalizedTitle === 'method overview') {
			overview = value;
			return;
		}
		if (normalizedTitle === 'sources') {
			sources = parseSources(value);
			return;
		}

		const titleParts = heading.title.split(/\s+—\s+/, 2);
		if (titleParts.length !== 2) throw new Error(`${context}: use “#### Label — Title” for ${heading.title}`);
		const section: OverviewSection = {
			label: titleParts[0],
			title: titleParts[1],
			description: descriptionBeforeList(value),
		};
		const items = listItems(value, true);
		if (items.length) section.items = items;

		for (let fifthIndex = 0; fifthIndex < fifthLevel.length; fifthIndex += 1) {
			const subheading = fifthLevel[fifthIndex];
			const subheadingEnd = fifthLevel[fifthIndex + 1]?.index ?? headingEnd;
			const subheadingItems = listItems(bodyBetween(lines, subheading.index + 1, subheadingEnd), false);
			if (subheading.title.toLowerCase() === 'potential advantages') section.pros = subheadingItems;
			else if (subheading.title.toLowerCase() === 'limitations and tradeoffs') section.cons = subheadingItems;
			else throw new Error(`${context}: unsupported level-five heading “${subheading.title}”`);
		}

		sections.push(section);
	});

	if (!description) throw new Error(`${context}: method ${methodHeading.title} needs a card description`);
	if (!overview) throw new Error(`${context}: method ${methodHeading.title} needs a “#### Method overview” section`);
	if (!sources.length) throw new Error(`${context}: method ${methodHeading.title} needs a numbered Sources list`);

	return { title: methodHeading.title, slug, order, description, overview, sections, sources };
}

export function parseOverviewStep(body: string, context = 'Overview step'): ParsedOverviewStep {
	const lines = body.replace(/\r\n?/g, '\n').split('\n');
	const headings = scanHeadings(lines);
	const secondLevel = headings.filter((heading) => heading.level === 2);
	const overviewEnd = secondLevel[0]?.index ?? lines.length;
	const overview = bodyBetween(lines, 0, overviewEnd);

	if (!overview) throw new Error(`${context}: add a step overview before the first level-two heading`);
	if (!secondLevel.length) throw new Error(`${context}: add at least one sub-step with a level-two heading`);

	const substeps = secondLevel.map((substepHeading, index) => {
		const end = secondLevel[index + 1]?.index ?? lines.length;
		const thirdLevel = headings.filter((heading) => heading.level === 3 && heading.index > substepHeading.index && heading.index < end);
		const descriptionEnd = thirdLevel[0]?.index ?? end;
		const description = bodyBetween(lines, substepHeading.index + 1, descriptionEnd);
		const substepContext = `${context} / ${substepHeading.title}`;
		const methods = thirdLevel.map((methodHeading, methodIndex) => {
			const methodEnd = thirdLevel[methodIndex + 1]?.index ?? end;
			return parseMethod(lines, headings, methodHeading, methodEnd, methodIndex + 1, substepContext);
		});

		if (!description) throw new Error(`${substepContext}: add a description before the first method`);
		if (!methods.length) throw new Error(`${substepContext}: add at least one method with a level-three heading`);
		requireUniqueSlugs(methods, `${substepContext} method`);

		return {
			title: substepHeading.title,
			slug: substepHeading.slug ?? slugify(substepHeading.title),
			order: index + 1,
			description,
			methods,
		};
	});

	requireUniqueSlugs(substeps, `${context} sub-step`);
	return { overview, substeps };
}

export async function renderOverviewMarkdown(value: string, options: { citations?: boolean; inline?: boolean } = {}) {
	const processor = await markdownProcessor;
	const rendered = await processor.render(value);
	let html = rendered.code;
	if (options.inline) html = html.replace(/^<p>([\s\S]*)<\/p>\s*$/, '$1');
	if (options.citations) {
		html = html.replace(
			/\[(\d+)\]/g,
			'<sup class="citation"><a href="#source-$1" aria-label="Source $1">[$1]</a></sup>',
		);
	}
	return html;
}
