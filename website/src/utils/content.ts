export function titleFromId(id: string) {
	const name = id.split('/').at(-1) ?? id;
	return name
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (character) => character.toUpperCase());
}
