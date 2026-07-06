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
- **Vitest** + **React Testing Library** for unit and interaction tests
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
| `npm run test`      | Run the test suite once (Vitest)     |
| `npm run test:watch`| Run tests in watch mode              |
| `npm run test:coverage` | Run tests with a coverage report |

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

Tests live next to the code they cover as `*.test.ts(x)` files.

## Testing

[Vitest](https://vitest.dev) drives both unit and interaction tests, with
[React Testing Library](https://testing-library.com/react) for components. Run
them with `npm run test` (single pass) or `npm run test:watch`.

Coverage focuses on the app's pure logic and interactive surfaces:

- **Data integrity** — every one of the 118 elements has contiguous atomic
  numbers, unique symbols, shell counts that sum to the atomic number, a
  parseable mass, and valid grid coordinates; lessons have well-formed
  checkpoints and reference only real elements.
- **Pure logic** — search/category filtering, lesson-progress persistence
  (including SSR and corrupt-storage safety), the atom-model geometry and
  isotope helpers, and the element-comparison math.
- **Interaction** — search input, category filter chips, and the lesson
  checkpoint flow, exercised through simulated user events.

## Roadmap

- [x] App shell, navigation, and landing page
- [x] Interactive periodic table (all 118 elements)
- [x] Element detail pages with scientific facts
- [x] 3D atomic visualization (React Three Fiber)
- [x] Learn and Compare experiences
- [x] Physical, chemical & historical properties for all 118 elements
- [x] Automated tests (unit + interaction)
- [ ] Additional lessons and guided content
