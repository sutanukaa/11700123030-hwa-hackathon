# CANOPY Build Log

## Project Objective
Build a premium, playful dog comfort and enrichment lifestyle brand website (CANOPY) with the tagline "A little space to be a dog." Milestone 1 establishes the technical and visual foundation only.

## Confirmed Technology Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animation)
- Zustand (state management)
- React Hook Form (forms)
- Zod (validation)
- Lucide React (icons)
- localStorage (demo persistence)
- Google Fonts: Fredoka (display), DM Sans (body)

## Design System Decisions
### Colour Tokens
- Warm Canvas: #FFF8EF (background)
- Soft White: #FFFEFA
- Cocoa Ink: #51443E (primary text)
- Muted Text: #897C72
- Petal Pink: #F2C5D2
- Garden Sage: #B8CBB0
- Butter Yellow: #F5D98E
- Powder Blue: #C5D9E8
- Terracotta: #C9795C
- Lilac: #D8C9E8
- Olive: #777D54
- Border: #E8DED2

### Typography
- Display: Fredoka
- Body: DM Sans

### Spacing, Radii, Shadows, Animations
Defined in `lib/design-system.ts` and extended in `tailwind.config.js`.

## Existing Asset Inventory
All 17 PNG files in `public/` catalogued in `lib/assets.ts`:
- butterfly-1.png, butterfly-magical.png, butterfly-resting.png
- cherry-blossom-tree.png
- dandelion.png
- flower-1.png, flower-2.png, flower-3.png, flower-petal.png
- foreground-bushes.png
- image.png (identity not determined - inspect before use)
- master-environment.png
- meadow-ground.png
- mountain-range.png
- rolling-hills.png
- sky-atmosphere.png
- unwind-environment.png

Assets with likely non-transparent backgrounds: cherry-blossom-tree.png, foreground-bushes.png, image.png, master-environment.png, meadow-ground.png, mountain-range.png, rolling-hills.png, sky-atmosphere.png, unwind-environment.png.

## Current Architecture
```
app/
  layout.tsx      - Root layout with next/font (Fredoka, DM Sans)
  page.tsx        - Home page (placeholder)
  globals.css     - Tailwind import + CSS design tokens
components/
  ui/             - Reusable UI components (empty, ready for Milestone 2)
  layout/         - Layout components (empty, ready for Milestone 2)
lib/
  design-system.ts - Design tokens (colors, typography, spacing, radii, shadows, animations)
  assets.ts       - Central asset manifest with typed entries
types/
  index.ts        - Shared type re-exports
state/            - Zustand stores (empty, ready for Milestone 2)
docs/
  CANOPY_BUILD_LOG.md
```

## Completed Work (Milestone 1)
- Converted project from JavaScript to TypeScript (tsconfig.json, layout.tsx, page.tsx)
- Installed dependencies: framer-motion, zustand, react-hook-form, zod, lucide-react, typescript, @types/react, @types/node, @types/react-dom
- Established design system tokens in `lib/design-system.ts`
- Extended Tailwind v4 config with CANOPY colors, fonts, spacing, radii, shadows, animations
- Configured Google Fonts (Fredoka display, DM Sans body) via next/font in layout.tsx
- Created CSS custom properties for design tokens in globals.css
- Created central asset manifest in `lib/assets.ts` with all 17 public/ images catalogued
- Created project architecture folders (components/ui, components/layout, lib, types, state, docs)
- Created docs/CANOPY_BUILD_LOG.md

## Known Limitations
- Asset transparency not programmatically verified; entries marked with notes where backgrounds may be non-transparent
- `image.png` asset identity not determined
- No UI components built yet (Milestone 2 will begin component development)
- No Zustand stores defined yet (Milestone 2)
- No form schemas with Zod yet (Milestone 2)

## Next Milestone (Milestone 2)
- Build reusable UI components (buttons, cards, text elements)
- Create layout components (header, footer, page shells)
- Define Zustand state stores
- Create Zod validation schemas
- Begin homepage hero section using design system tokens and assets

## Important Implementation Decisions
- Tailwind v4 used with CSS-first configuration; tailwind.config.js extended for theme tokens
- Google Fonts loaded via next/font/google with `display: 'swap'` and CSS variables
- All design tokens exist both as TypeScript constants (lib/design-system.ts) and Tailwind theme extensions (tailwind.config.js) and CSS custom properties (globals.css)
- Asset manifest uses typed entries with category, transparency flag, and notes
- No backend, authentication, database, payment, or AI integration (per scope restrictions)
- .hwa/, opencode.json, init.py, submit.py, hwa-start.* preserved per hackathon rules
