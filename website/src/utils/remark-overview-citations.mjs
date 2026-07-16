const citationPattern = /\[(\d+)\]/g;
const skippedNodeTypes = new Set(['code', 'html', 'inlineCode', 'link', 'linkReference']);

function citationNodes(value) {
	const nodes = [];
	let cursor = 0;
	let match;
	citationPattern.lastIndex = 0;

	while ((match = citationPattern.exec(value))) {
		if (match.index > cursor) nodes.push({ type: 'text', value: value.slice(cursor, match.index) });
		const number = match[1];
		nodes.push({
			type: 'html',
			value: `<sup class="citation"><a href="#source-${number}" aria-label="Source ${number}">[${number}]</a></sup>`,
		});
		cursor = match.index + match[0].length;
	}

	if (cursor < value.length) nodes.push({ type: 'text', value: value.slice(cursor) });
	return nodes.length ? nodes : [{ type: 'text', value }];
}

function transformChildren(parent) {
	if (!Array.isArray(parent.children) || skippedNodeTypes.has(parent.type)) return;
	parent.children = parent.children.flatMap((child) => {
		if (child.type === 'text' && /\[\d+\]/.test(child.value)) return citationNodes(child.value);
		transformChildren(child);
		return child;
	});
}

export default function remarkOverviewCitations() {
	return (tree, file) => {
		const path = String(file.path ?? '');
		if (!path.includes('content/projects/the-overview-project/methods/')) return;
		transformChildren(tree);
	};
}
