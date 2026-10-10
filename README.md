# MDesign

> A declarative, server-side visual design engine. Vue templates are painted with `@napi-rs/canvas` and encoded with Sharp to PNG, WebP, JPEG, GIF or SVG, for brochures, flyers, standees, visiting cards and 2D social cards.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Engine: Bun](https://img.shields.io/badge/Runtime-Bun%20%7C%20Node%2022+-fbf0df?logo=bun)](https://bun.sh)
[![Nitro](https://img.shields.io/badge/Framework-Nitro%20v3-ea580c?logo=nuxt)](https://nitro.unjs.io)

---

## Overview

MDesign turns structured data (a template id, variables and an organisation's branding) into a finished image. There is no headless browser: templates are ordinary Vue SFCs that render into a node tree through a custom Vue renderer, and a canvas walker paints that tree.

```
POST /api/render ─► validate (Zod) ─► merge organisation branding ─► mount Vue template (custom renderer)
                 ─► paint with @napi-rs/canvas ─► encode with Sharp ─► image bytes
```

### Core capabilities

- **Declarative canvas runtime**: `<CanvasRoot>`, `<View>`, `<Text>`, `<ImageNode>` and `<MeshGradient>` (`server/canvas/elements.ts`) with a box model (padding, rounded corners, borders, shadows, clipping), word wrapping, letter spacing and `maxLines` truncation.
- **Auto-branded mesh gradients**: `generateProceduralGradient(primary, accent)` derives a balanced HSL mesh from the brand colours.
- **Schema-driven templates**: every template exposes a Zod schema, reflected as JSON Schema (with `x-*` form hints) by `GET /api/template/:id`.
- **Token previews**: draft previews show unfilled fields as `{{Field Label}}` and report invalid input as warnings instead of failing.
- **On-demand fonts**: Google Fonts resolved with `unifont`, cached in storage and registered with Skia.
- **Pluggable storage**: uploads and the font cache go through `unstorage` (`fs` in development; swap the driver for KV, S3 or R2 in production).
- **Agent-ready**: MCP support via `nitro-mcp-toolkit`.

---

## Templates

| Template ID          | Category   | Resolution (px) | Aspect  | Purpose                                  |
| :------------------- | :--------- | :-------------- | :------ | :--------------------------------------- |
| `brochure-v1`        | Collateral | 2480 × 1748     | ~1.42:1 | Three-panel landscape company brochure   |
| `terminal-card-v1`   | Social     | 1600 × 900      | 16:9    | Developer quiz card styled as a terminal |
| `director-hud-v1`    | Social     | 1920 × 1080     | 16:9    | Camera viewfinder / production HUD       |
| `slate-clapper-v1`   | Social     | 1600 × 900      | 16:9    | Production slate (clapperboard) card     |
| `business-card-v1`   | Stationery | 1050 × 600      | 1.75:1  | Visiting card (3.5 × 2 in at 300 DPI)    |
| `event-standee-v1`   | Display    | 800 × 2000      | 1:2.5   | Vertical roll-up banner / standee        |
| `marketing-flyer-v1` | Display    | 1200 × 1800     | 2:3     | Marketing flyer / product pamphlet       |

Output pixels are `resolution × dpi`. `dpi` defaults to `2` for `/api/render` and `1` for previews (range 0.5 to 3).

---

## API

| Method | Path                             | Description                                                                                                    |
| :----- | :------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/health`                    | Status, version, build time, node.                                                                             |
| `GET`  | `/api/template[?category=]`      | Template catalogue (`id`, `label`, `category`, `resolution`, `sampleUrl`).                                     |
| `GET`  | `/api/template/:id`              | Metadata and the variables JSON Schema.                                                                        |
| `GET`  | `/api/template/:id/sample.png`   | Neutral sample (unbranded, `{{Field Label}}` tokens) for pickers.                                              |
| `POST` | `/api/template/preview[?draft=]` | `{ imageBase64, resolution, variant[, warnings] }`. `variant`: `sample`, `branded`, `filled` (default).        |
| `POST` | `/api/render[?format=&dpi=]`     | Stateless production render; returns the image bytes. `format`: `png` (default), `webp`, `jpeg`, `gif`, `svg`. |
| `GET`  | `/api/decor[?slot=]`             | Built-in decor catalogue.                                                                                      |
| `POST` | `/api/asset/upload`              | `multipart/form-data` with `file` (PNG, JPG, WebP, SVG up to 2 MB). Returns `{ id: "upload:<hash>", url }`.    |
| `GET`  | `/api/fonts[?q=&limit=]`         | Font families available for branding.                                                                          |

### Render

```bash
curl -X POST "http://localhost:3000/api/render?format=webp" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "business-card-v1",
    "organizationId": "modest-human-brands",
    "variables": { "person": { "name": "Aarav Sharma", "title": "Creative Director" } }
  }' --output card.webp
```

Missing variables fall back to the template placeholders; invalid ones return `400` with `data.errors[{ field, message, code }]`. `svg` wraps the pixel-perfect raster in an SVG container.

### Branding

An organisation is a preset id (`organizationId`) or an inline `variables.organization` object. Templates read `branding.color.primary`, `branding.color.accent`, `branding.font` and `branding.logo`. A logo (or any image field) may be a `builtin:<id>`, `upload:<hash>` or `https://` reference; images are resolved server-side to PNG and a failure simply omits the image.

### Fonts

A template declares families and weights, e.g. `{ name: 'Exo2', family: 'Exo 2', weights: [400, 700], path: './asset/Exo2-Regular.ttf' }`. On first render the family is resolved with `unifont`, a full TTF/WOFF is cached in the `data` storage (`.data/fonts/`) and registered with Skia. `branding.font` is resolved the same way and falls back to `Exo2`. `npx nitro task run fonts:warm` pre-downloads every template font.

---

## Writing a template

Create `server/templates/<id>/index.ts` (schema, placeholders, registration) and `component.vue`, then import it from `server/templates/index.ts`.

```vue
<script setup lang="ts">
import { CanvasRoot, View, Text, MeshGradient } from '../../canvas/elements'

defineProps<{ width: number; height: number; title: string; colorPrimary: string; colorAccent: string }>()
</script>

<template>
  <CanvasRoot :width="width" :height="height">
    <MeshGradient :primary="colorPrimary" :accent="colorAccent" :width="width" :height="height" />
    <Text :style="{ x: 64, y: 64, fontSize: 72, fontWeight: 'bold', color: '#FFFFFF', maxWidth: width - 128 }">{{ title }}</Text>
  </CanvasRoot>
</template>
```

Notes:

- Coordinates are design pixels relative to the parent box (shifted by its `padding`). `y` is the top of the text line box.
- `textAlign` with `maxWidth` aligns inside that column, so `x` is the column's left edge; without `maxWidth`, `x` is the anchor.
- In `.vue` files import with relative paths (the `~` alias is not resolved inside SFCs).
- Images must be data URIs or Buffers. Resolve references in `transformPayload` with `resolveDecor()` (`server/utils/decor.ts`).

---

## Getting started

```bash
bun install
bun run dev      # http://localhost:3000
```

Other scripts: `bun run build`, `bun run lint`, `bun run docker:build`. A [Postman collection](./postman) covers every route with response tests.

## License

Published under the [MIT License](./LICENSE).
