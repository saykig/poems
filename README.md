# Selected Poems · Sara Kim

An illustrated, draggable poetry book with ten poems imported from [Sara's poetry page](https://sarakim23.vercel.app/writing/poetry). Built with Vite, vanilla JavaScript, and the MIT-licensed [StPageFlip](https://github.com/Nodlik/StPageFlip). Cover: Times New Roman. Interior: locally bundled IM Fell English (SIL Open Font License).

## Run on your Mac

```sh
cd "/Users/kimchee/Documents/ChatGPT/for me _3/sara-poet"
npm install
npm run dev
```

Open the Local URL printed by Vite. This only runs while the process and Mac are running. Ctrl+C stops it. `npm run build` creates `dist/`; `npm run preview` serves the production build locally.

## Permanent hosting

GitHub Pages publishes `dist/` using `.github/workflows/pages.yml` whenever `main` is pushed. The static site runs independently of Sara's Mac and does not require Vercel or a server database. The relative Vite base supports both a repository subpath and a custom domain.

## Poems

`content/poems.json` contains the complete source text, original line breaks, stanza boundaries, italic flags, indentation, and source URLs. Imported 2026-10-19: 10 poems, 248 lines. The importer does not rewrite or correct text. To deliberately refresh from the published source:

```sh
python3 scripts/import-poems.py
```

Review the content diff before committing. Pagination measures the actual typeset content for each viewport, preserves whole stanzas when possible, and splits an oversized stanza only between its original lines. Contents page numbers update when pagination changes. Reading view uses the same data.

Drag corners using mouse/touch; Left/Right arrow keys also turn pages. Home returns to the cover. Contents jumps to each poem. There are no opening slogans, page-turn buttons, or site footer.

## Artwork provenance

`stars.png`, `polaroids.png`, and `sea.png` are original concept illustrations generated with the built-in image-generation tool on 2026-10-19. Their subjects follow the poems: cosmic alignment, memories in photographs, and a tiny boat in moonlit seas. They are interpretations, not claims about actual places or people. Final prompt briefs:

- **Stars:** Fine ink, colored pencil and dry gouache on ivory; a solitary figure beneath three bright stars above a dark lake, reflecting cosmic alignment and the stars' indifference.
- **Polaroids:** Fine ink, textured colored pencil and dry gouache; white-bordered photographs of home, friends and sunset on twine above a desk, lavender and late afternoon light, no writing.
- **Sea:** Continuous 3:2 illustrated spread; tiny sailboat in blue-grey waves, crescent moon, silver wave crests and the last sunset at the horizon, pencil hatching and dry gouache.

`i-miss.jpeg` and `the-space-between-us-moon.png` are copied from the images already associated with those poems on Sara's source site. Their original descriptions are preserved. `garden.png` and `woodland.png` remain unused explorations from the first draft.

Initial draft checkpoint: `b8db0fb` (committed and pushed before these revisions).
