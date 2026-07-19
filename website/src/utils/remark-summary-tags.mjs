const tagPattern = /^#[a-z0-9][a-z0-9_-]*$/i;
const summaryPathPattern = /[\\/]content[\\/]summaries-notes[\\/]/;

function renderTagLine(node) {
	if (node.type !== 'paragraph' || !Array.isArray(node.children)) return;
	if (!node.children.every((child) => child.type === 'text')) return;

	const value = node.children.map((child) => child.value).join('').trim();
	const tags = value.split(/\s+/);
	if (!tags.length || !tags.every((tag) => tagPattern.test(tag))) return;

	return {
		type: 'html',
		value: `<div class="note-tags" aria-label="Tags">${tags
			.map((tag) => `<span class="note-tag">${tag}</span>`)
			.join('')}</div>`,
	};
}

function transformChildren(parent) {
	if (!Array.isArray(parent.children)) return;
	parent.children = parent.children.map((child) => {
		const tagLine = renderTagLine(child);
		if (tagLine) return tagLine;
		transformChildren(child);
		return child;
	});
}

export default function remarkSummaryTags() {
	return (tree, file) => {
		if (!summaryPathPattern.test(String(file.path ?? ''))) return;
		transformChildren(tree);
	};
}
