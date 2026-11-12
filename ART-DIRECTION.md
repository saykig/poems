# Storybook sourcing and composition

Sara's former reference direction, 19 October 2026. Archived research; the current book contains no illustrations.

## Fixed requirements

- Source existing artwork and typography before generating new assets.
- Upright printed book serif inspired by the Ugly Duckling reference; exact reference font is unidentified.
- Each poem has one upright heading. No repeated heading or “continued” label.
- Illustrations share pages with poems, bleeding from edges and continuing across a spread. No dedicated illustration-only leaves.
- Preserve poem wording, line breaks, intentional spaces and source italics. Vary typesetting size only where useful for reading/composition.
- Cover remains SELECTED POEMS / fleuron / SARA KIM, with Times New Roman.

## Reusable sources and tools

### Typeface: Old Standard TT

Existing open font by Alexey Kryukov. Its official description identifies late nineteenth/early twentieth century classicist book typography. A candidate for the reference, not an exact identification. Test regular weight for poem text and upright headings before replacing IM Fell throughout.

- https://fonts.google.com/specimen/Old+Standard+TT
- https://github.com/google/fonts/blob/main/ofl/oldstandardtt/DESCRIPTION.en_us.html
- https://github.com/google/fonts/tree/main/ofl/oldstandardtt

### Artwork: historic illustration collections

Rawpixel has a public-domain catalog and a verified Andersen/Gaskin illustration item explicitly marked public domain, CC0, and free for personal/business use. Choose actual images against each poem's motifs; do not assume all stock items or reference screenshots share that license.

- https://www.rawpixel.com/public-domain
- https://www.rawpixel.com/image/8648625/image-art-vintage-public-domain
- https://digitalcollections.nypl.org/collections/a0108230-c5b9-012f-ed50-58d385a7bc34 (children's book illustrations; check individual rights records)
- https://www.biodiversitylibrary.org/item/48575 (public-domain natural-history illustration volume)

Keep an asset manifest with creator, item URL, license and relevant poem for every adopted illustration. These are source collections, not layout components.

### Visual composition: Scribus

Existing desktop publishing editor with text flow around contour lines. Useful for composing deliberate illustrated spreads without building a custom visual authoring interface. Fixed authored pages need an accessible/mobile reading alternative and an export integration; this is not a drop-in responsive website component.

- https://forums.scribus.net/index.php?topic=5241.0
- https://wiki.scribus.net/canvas/Working_with_image_frames

Canva's ebook templates are an alternative for arranging pages, but do not establish automatic contour wrapping or a responsive, draggable web book:
https://www.canva.com/create/ebooks/

### Website reading mechanics

Retain installed MIT StPageFlip for dragging pages:
https://nodlik.github.io/StPageFlip/

For live HTML text, CSS Shapes provides established browser text wrapping around image alpha/polygons. It is a browser feature, not a premade storybook UI kit. Poetry line breaks must remain intact rather than being forced into prose-shaped wrapping:
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/shape-outside

Paged.js and Vivliostyle are existing pagination systems, not automatic illustration composers. Adding either solely for decorative placement would not solve the requested art direction:
https://github.com/pagedjs/pagedjs
https://vivliostyle.org/

## Recommended route

Keep the working book interaction. Select cohesive licensed existing illustrations by poem motif and test Old Standard TT. Establish a small set of reusable illustrated spread compositions, with text and art sharing the pages. Use visual publishing tools where they reduce manual layout work, and maintain live accessible poem text. Do not promise that a single UI library can choose meaningful art and automatically reproduce all reference compositions.
