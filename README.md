# Selected Poems · Sara Kim

A draggable poetry book at [sarapoems.vercel.app](https://sarapoems.vercel.app/) with six poems selected from Sara's former personal-site poetry page. Built with Vite, vanilla JavaScript, and the MIT-licensed [StPageFlip](https://github.com/Nodlik/StPageFlip). Cover: Times New Roman. Interior: locally bundled Old Standard TT and IM Fell English (SIL Open Font License).

## Run on your Mac

```sh
cd "/Users/kimchee/Documents/ChatGPT/for me _3/sara-poet"
npm install
npm run dev
```

Open the Local URL printed by Vite. This only runs while the process and Mac are running. Ctrl+C stops it. `npm run build` creates `dist/`; `npm run preview` serves the production build locally.

## Permanent hosting

Vercel builds and publishes `main` at [sarapoems.vercel.app](https://sarapoems.vercel.app/). The former Vercel address `sarakim23.vercel.app` and GitHub Pages path `saykig.github.io/sara-poet/` redirect readers here. This poetry source repository remains private. The book runs independently of Sara's Mac.

## Poems

`content/poems.json` contains the six selected poems with their original line breaks, stanza boundaries, italic flags, indentation, and historical source URLs (141 lines). The original import on 2026-10-19 contained 10 poems; See-through, Passage of Time, and There is Grace in the Unknown were removed from this public collection in November 2026 and remain recoverable from Git history. The importer does not rewrite or correct text. The original poetry route is now retired; edit this file directly when adding or revising poems. `scripts/import-poems.py` is retained for provenance but its old source URL is no longer live.

Review the content diff before committing. Pagination measures the actual typeset content for each viewport, preserves whole stanzas when possible, and splits an oversized stanza only between its original lines. Contents page numbers update when pagination changes. Reading view uses the same data.

Drag corners using mouse/touch; Left/Right arrow keys also turn pages. Home returns to the cover. Contents jumps to each poem. There are no opening slogans, page-turn buttons, or site footer.

## Archived artwork

The book no longer displays illustrations. Earlier image assets and the illustrated-spread pilot instructions are stored under `design/archive-art/`, outside the published site. The original artwork provenance is retained below for reference.

`stars.png`, `polaroids.png`, and `sea.png` are original concept illustrations generated with the built-in image-generation tool on 2026-10-19. Their subjects follow the poems: cosmic alignment, memories in photographs, and a tiny boat in moonlit seas. They are interpretations, not claims about actual places or people. Final prompt briefs:

- **Stars:** Fine ink, colored pencil and dry gouache on ivory; a solitary figure beneath three bright stars above a dark lake, reflecting cosmic alignment and the stars' indifference.
- **Polaroids:** Fine ink, textured colored pencil and dry gouache; white-bordered photographs of home, friends and sunset on twine above a desk, lavender and late afternoon light, no writing.
- **Sea:** Continuous 3:2 illustrated spread; tiny sailboat in blue-grey waves, crescent moon, silver wave crests and the last sunset at the horizon, pencil hatching and dry gouache.

`i-miss.jpeg` and `the-space-between-us-moon.png` are copied from the images already associated with those poems on Sara's source site. `garden.png` and `woodland.png` were unused explorations from the first draft.

Initial draft checkpoint: `b8db0fb` (committed and pushed before these revisions).

How Will I Know was removed from the published collection on 2026-11-12. A workspace copy is kept in the Git-ignored `local-archive/how-will-i-know.json`. Earlier versions remain in Git history.
