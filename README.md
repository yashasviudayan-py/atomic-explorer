# Atomic Explorer

A premium, interactive educational web app for exploring the periodic table and
inspecting the atomic structure of every element — protons, neutrons, electrons,
shells, and the science behind them.

> **Status:** Phase 1 — application shell, navigation, and landing page.
> The interactive periodic table and 3D atom visualization land in later phases.

## Tech stack

- **Next.js** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** v4
- Architecture prepared for **React Three Fiber / Three.js** (not yet added)
- No backend — element data will be local JSON/TS

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build                     |
| `npm run start`     | Serve the production build           |
| `npm run typecheck` | Type-check with `tsc --noEmit`       |
| `npm run lint`      | Lint with Next.js ESLint             |

## Project structure

```
src/
  app/                 # App Router routes
    page.tsx           # Landing page
    layout.tsx         # Root layout (header, backdrop, footer)
    globals.css        # Theme tokens + global styles
    elements/          # Periodic table + element detail ([symbol])
    learn/             # Learning content
    compare/           # Element comparison
  components/
    layout/            # Header, shared page scaffolding
    home/              # Hero, feature cards, atom preview
  lib/                 # App constants
  types/               # Domain types (Element, etc.)
```

## Roadmap

- [x] App shell, navigation, and landing page
- [ ] Interactive periodic table (all 118 elements)
- [ ] Element detail pages with scientific facts
- [ ] 3D atomic visualization (React Three Fiber)
- [ ] Learn and Compare experiences
