# Editing The Overview Project in Obsidian

The website reads this folder directly. Changes made here in Obsidian appear on the site after the website is rebuilt.

## One file per main step

Everything for a main step lives in its single Markdown file under `steps/`. There is no separate methods folder.

- Frontmatter controls the main step's `title`, stable `slug`, timeline `order`, card `description`, and `icon`.
- Markdown before the first `##` heading is the main step overview.
- Each `## Sub-step name {#stable-slug}` starts a sub-step. Its first paragraph is the sub-step description.
- Each `### Method name {#stable-slug}` starts a method. Its first paragraph is the method-card description.
- Keep `{#stable-slug}` lowercase with hyphens. It preserves the existing URL even if you rename a heading.

## Inside each method

Use these level-four headings in this order:

- `#### Method overview` contains the method-page introduction.
- `#### Label — Title` creates a research frame. For example, `#### Process — Steps`.
- A numbered list in a research frame becomes the large numbered items.
- `##### Potential advantages` and `##### Limitations and tradeoffs` create the two assessment lists.
- `#### Sources` contains a numbered source list. A source can be plain text or `[Citation text](https://example.com)`.

Write citations as `[1]`, `[2]`, and so on in method content. The website links them to the matching numbered source.
