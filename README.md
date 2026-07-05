# Atomic Explorer

A premium, interactive educational web app for exploring the periodic table and
inspecting the atomic structure of every element — protons, neutrons, electrons,
shells, and the science behind them.

> **Status:** Core experience complete — periodic table, all 118 element
> detail pages, the 3D atom viewer, and the Learn and Compare modes all ship.
> Ongoing work is polish, content depth, and visual refinement.

## Tech stack

- **Next.js** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** v4
- **React Three Fiber / Three.js** for the 3D atom visualization
- No backend — element, isotope, and lesson data live in local TS modules

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
| `npm run lint`      | Lint with ESLint (flat config)       |

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
    atom/              # 3D atom viewer (R3F) + info panels
    elements/          # Periodic table grid, tiles, search, filters
    compare/           # Element comparison views
    learn/             # Learning hub, lessons, progress
  data/                # Element, isotope, and lesson data (local TS)
  lib/                 # Constants, category + filter helpers, progress
  types/               # Domain types (Element, Isotope, Lesson)
```

## Roadmap

- [x] App shell, navigation, and landing page
- [x] Interactive periodic table (all 118 elements)
- [x] Element detail pages with scientific facts
- [x] 3D atomic visualization (React Three Fiber)
- [x] Learn and Compare experiences
- [x] Physical, chemical & historical properties for all 118 elements
- [ ] Additional lessons and guided content
- [ ] Automated tests (unit + interaction)
