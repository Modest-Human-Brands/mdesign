# MDesign

> A client-only design studio for brochures, visiting cards, standees, flyers and 2D social cards. Pick a template, apply your brand, edit the content and export PNG, WebP, JPEG or SVG, all in the browser. No backend, no uploads.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## How it works

MDesign is a static Vue 3 SPA (Vite, Pinia, Tailwind CSS v4, notform + Zod). The wizard has four steps: **Template → Brand → Content → Export**.

- **Templates are Vue SFCs.** Each folder in `templates/` (project root) holds a `Component.vue` (the design, plain Vue + Tailwind) and an `index.ts` (metadata, resolution, Zod schema, sample placeholders, `transformPayload`). `registry.ts` discovers them with `import.meta.glob`, so adding a folder adds a template.
- **Forms come from the schema.** `parseSchemaToJsonSchema()` converts a template's Zod schema to JSON Schema with layout hints; `SchemaFields` renders it and the same schema validates it.
- **Token previews.** Until a field is filled, the design shows its own label as `{{Field Label}}` (built from the schema by `src/domain/tokens.ts`; brand fields show `{{Business Name}}`, `{{Phone}}`, ...), so it is clear what is dynamic and what it will contain.
- **Multi-page designs.** A template can set `pages: 2` (or more); its component receives a zero-based `page` prop. The stage shows the pages stacked and scrollable like a PDF, and export produces one tall image with spacing between pages for printing.
- **Instant preview.** The active template component is rendered at its design resolution inside `StageViewport` and scaled with CSS. Typing updates it synchronously.
- **Auto-branded gradients.** `generateProceduralGradient(primary, accent)` derives a balanced HSL mesh from the brand colours (`src/domain/proceduralGradient.ts`).
- **Export in the browser.** `exportElementToBlob()` serialises the design into an SVG `<foreignObject>` with the page CSS and used fonts embedded as data URIs, then draws it on a canvas for PNG / WebP / JPEG, or returns the SVG directly (`src/domain/imageExport.ts`).
- **Local storage only.** The brand profile and the draft live in `localStorage`; Google Fonts are fetched on demand and inlined.

## Templates

| Template ID           | Category   | Resolution (px) | Purpose                                  |
| :-------------------- | :--------- | :-------------- | :--------------------------------------- |
| `trifold-brochure-v1` | Collateral | 2480 × 1748     | Three-panel landscape company brochure   |
| `business-card-v1`    | Stationery | 1050 × 600      | Visiting card (3.5 × 2 in at 300 DPI)    |
| `event-standee-v1`    | Display    | 800 × 2000      | Vertical roll-up banner                  |
| `marketing-flyer-v1`  | Display    | 1200 × 1800     | Marketing flyer / pamphlet               |
| `terminal-card-v1`    | Social     | 1600 × 900      | Developer quiz card styled as a terminal |
| `director-hud-v1`     | Social     | 1920 × 1080     | Camera viewfinder / production HUD       |
| `slate-clapper-v1`    | Social     | 1600 × 900      | Production slate (clapperboard) card     |

Export scale is `1x`, `2x` or `300 DPI` (4.17x of the design grid); SVG ignores scale.

### Business card recipes

`business-card-v1` is a two-page card (front, back). The Brand step supplies the logo, colours, font, business name and website; the Content step switches layout and artwork:

| Setting                       | Dark gradient card (viewfinder QR back) | Plain card (artwork back)     |
| :---------------------------- | :-------------------------------------- | :---------------------------- |
| Design → Background           | gradient                                | plain                         |
| Design → Emphasis / Name size | regular / large                         | bold / standard               |
| Design → Content start        | edge                                    | inset (room for left art)     |
| Design → Logo                 | top-right, small                        | middle-right, large           |
| Design → Contacts             | bottom                                  | under-title                   |
| Artwork → Front               | line art, placement cover, subtle       | pattern, placement left, full |
| Artwork → Back                | (none)                                  | illustration, center-bottom   |
| Back → Layout                 | qr (URL defaults to the website)        | artwork (shows the website)   |
| Back → QR style / Frame       | rounded / viewfinder                    | (not used)                    |

Upload the artwork (PNG, JPG, WebP or SVG) with the image pickers.

## Adding a template

```
templates/my-card-v1/
├── Component.vue   # props = transformPayload() output, root fills the design size
└── index.ts        # export default { id, label, shortLabel, category, description,
                    #   resolution, component, schema, placeholders, transformPayload }
```

Rules that keep exports faithful:

- The root element fills its box (`size-full`) and sets its own text colour and `leading-normal`.
- Use arbitrary colour values (`text-[#334155]`) because the app theme resets the Tailwind palette.
- Images must be data URIs (the logo and uploads already are; `resolveDecor()` handles built-in decor).
- Brand props (`organizationName`, `organizationLogo`, `colorPrimary`, `gradient`, ...) come from `brandProps(org)` in `templates/brand.ts`.

## Getting started

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # static output in dist/
bun run test:unit
bun run lint
```

Deploy `dist/` to any static host (Vercel, Cloudflare, Netlify) or use the Docker image (`bun run docker:build`, nginx on port 8080).

## Notes

- Exports use the browser's own renderer. Chrome and Edge are the reference; Safari has known `foreignObject` limitations.
- A brand font outside the curated list in `src/domain/fonts.ts` is not offered in the picker.

## License

Published under the [MIT License](https://github.com/Modest-Human-Brands/mdesign/blob/main/LICENSE).
<br><br>
<a href="https://github.com/Modest-Human-Brands/mdesign/graphs/contributors">
<img src="https://contrib.rocks/image?repo=Modest-Human-Brands/mdesign" />
</a>