# Selected Poems · Sara

An illustrated, draggable storybook prototype. Built with Vite, vanilla JavaScript and the MIT-licensed [StPageFlip](https://github.com/Nodlik/StPageFlip) library. Typography: IM Fell English (SIL Open Font License), bundled locally with Fontsource.

## Run

```sh
npm install
npm run dev
```

`npm run build` produces a static website in `dist/`. `npm run preview` serves that build. No backend, accounts, upload service, or hosting has been configured.

## Book content

Pages are defined in `src/main.js`. The sample poem is clearly identified as a placeholder and is not Sara's writing. Replace it with real poems, preserving stanza and line breaks. Every physical leaf has a front and reverse. Cover is index 0; interior desktop spreads pair indices 1–2, 3–4, and so on. The full illustration uses one image positioned across two neighboring pages.

Drag page corners using a mouse or touch; arrow controls and Left/Right keys are alternatives. Home returns to the front cover. Contents links jump to spreads. Reading view offers a simple accessible alternative. Reduced motion removes transitions and uses immediate turns for navigation controls.

## Artwork

`public/art/garden.png` is original AI-generated concept artwork made with the built-in image-generation tool on 2026-10-16. It illustrates the visual direction only; imagery should be tailored to each actual poem. `public/art/woodland.png` is the earlier watercolor exploration, retained as an unused alternative.

Final garden prompt: “Create a wide 3:2 original vintage children's storybook illustration, flat artwork not a book photograph. Detailed hand-drawn colored pencil and gouache with fine brown ink, richly textured stippled foliage and distinct tiny flowers, opaque greens, sunny yellow, scarlet poppies, cornflower blue, a few foxgloves. Scene: small thatched English cottage at far right, winding garden path across lower middle, meadow flowers lower left, birch tree at far left, a tiny child in ochre clothes holding a red kite in the garden. Upper 40 percent is mostly blank warm cream paper with softly irregular silhouette of treetops meeting the paper; the illustration grows densely from lower corners. Strong drawing definition and charming old printed picture-book character, tactile crayon marks and dry brush, no watery washes, no hazy digital painting. Suitable for a continuous two-page poetry book spread with center uninterrupted. No text, no border, no seam, no typography, no existing copyrighted characters.”
