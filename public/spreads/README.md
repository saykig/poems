# Affinity page exports

Pilot: The stars do not know (nine lines). Author a two-page spread with text and artwork sharing both pages. Preserve all original words, stanza breaks and italics from content/poems.json.

Document: facing pages, each 430 × 580 units; full spread 860 × 580. Use Old Standard TT regular for interior text and a single upright heading. Art may cross the gutter; keep words away from the binding. No repeated title, continued label or art-only page.

Export each page separately as sRGB PNG, at least 1290 × 1740 pixels (3×); no crop marks or external bleed. Include the page paper/background in the export. Use the same scale on both pages so the artwork joins at the gutter. Put final PNGs here, for example stars-left.png and stars-right.png. Save the editable Affinity source alongside the project in a design folder.

Activate only after both final assets exist by adding this entry to content/illustrated-spreads.json:

```json
{
  "the-stars-do-not-know": {
    "pages": [
      {"file": "stars-left.png", "description": "Describe the actual left-page illustration here."},
      {"file": "stars-right.png", "description": "Describe the actual right-page illustration here."}
    ]
  }
}
```

The website replaces that poem's automatically typeset leaves and its old art-only leaves with the exported pair. Contents still links to the poem. Reading view retains the original selectable text. Page numbers must be part of the authored layout if desired; the website suppresses its number overlay for exports.

Before activating: check text against the JSON source, verify both page sizes match, review the gutter at desktop size, turn pages using drag and keyboard, and check Reading view on a narrow screen. Record artwork creator, source URL and license in the design folder.
