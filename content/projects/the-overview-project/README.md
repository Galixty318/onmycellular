# Editing The Overview Project in Obsidian

The website reads this folder directly. Changes made here in Obsidian appear on the site after the website is rebuilt.

## Steps

The six files in `steps/` control the main timeline and the six exploration pages.

- `title`, `description`, and the Markdown paragraph control the step title and overview.
- `order` controls timeline order.
- `icon` selects the matching timeline icon.
- `substeps` controls the numbered horizontal sections on the exploration page.

## Methods

Every card and in-depth method page has its own Markdown file under `methods/<step>/<sub-step>/`.

- `title` and `description` control the method card.
- The Markdown paragraph below the frontmatter is the Method overview.
- `sections` creates the large Process, Assessment, and Technical notes frames.
- `sources` creates the Sources list at the bottom.
- Write a citation as `[1]`, `[2]`, and so on anywhere in a method note. The website turns it into a superscript link to the matching source.

Keep `step`, `substep`, and `slug` lowercase with hyphens so links remain stable.
