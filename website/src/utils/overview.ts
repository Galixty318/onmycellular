export function withCitationLinks(value: string) {
	const escaped = value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');

	return escaped.replace(
		/\[(\d+)\]/g,
		'<sup class="citation"><a href="#source-$1" aria-label="Source $1">[$1]</a></sup>',
	);
}
