# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server on 0.0.0.0:3000 (network-accessible, not just localhost)
npm run build    # production build
npm run start    # serve production build
npm run lint     # next lint (eslint-config-next: core-web-vitals + typescript)
```

There is no test suite configured in this project.

## Architecture

This is a Next.js 16 App Router marketing site for "BeyondLab" — a Thai C++ competitive-programming (Olympiad) tutoring brand run by two tutors (พี่โม, พี่มิก). It's a hybrid site: a single-scroll landing page at `/` plus a couple of dedicated content routes.

- [src/app/layout.tsx](src/app/layout.tsx) is the shared shell for every route: it renders the fixed background grid, `Navbar`, and `Footer` around `{children}`, so new routes automatically get consistent nav/footer without re-importing them.
- [src/app/page.tsx](src/app/page.tsx) composes the homepage as a fixed sequence of section components (Hero, AboutTutors, BuildGrid, Roadmap, ProjectShowcase, InteractiveTerminal, Community, FinalCta). Adding a new homepage section means creating a component and inserting it into this list in the right scroll order.
- [src/app/portfolio/page.tsx](src/app/portfolio/page.tsx) and [src/app/services/page.tsx](src/app/services/page.tsx) are standalone routes (not homepage sections) for the portfolio gallery and service/openings listing — content-heavy areas that don't fit a scroll section. Follow this pattern (a route under `src/app/<name>/page.tsx`) for future content-heavy areas; keep quick, low-content additions (e.g. more contact channels) as homepage sections instead.
- All section components live flat in [src/app/components/beyondlab/](src/app/components/beyondlab/) — there is no nesting by feature or type. New sections should follow this same flat placement.
- [src/app/components/beyondlab/data.ts](src/app/components/beyondlab/data.ts) centralizes copy/content as exported arrays/objects (e.g. `navItems`, `tutors`, `buildCards`, `roadmapItems`, `services`, `contactChannels`, `portfolioCategories`). Components/pages import from here rather than hardcoding content inline — follow this pattern for any new static content, keeping components focused on markup/layout. Portfolio and services content is currently placeholder/real-but-minimal — update `data.ts` in place as real results, pricing, or copy come in rather than restructuring the components.
- [src/app/components/beyondlab/icons.tsx](src/app/components/beyondlab/icons.tsx) holds shared inline SVG icon components (e.g. `ArrowIcon`); `Logo.tsx` is a separate standalone component.
- Site copy is in Thai (`lang="th"` in the root layout). `Navbar`/`Footer` use `next/link` so links work from any route: in-page anchors are written as `/#section-id` (e.g. `/#courses`, `/#community`) so they resolve correctly even when clicked from `/portfolio` or `/services`; homepage section components still carry the matching `id` attribute.
- Contact/community channels (Instagram, LINE, Discord) live in `data.ts` as `contactChannels` and render on the homepage `Community` section and in the `Footer`; entries with `href: null` render as "เร็วๆ นี้" (coming soon) — fill in the real URL once available instead of adding new fields.
- Styling is Tailwind-only, applied via utility classes directly in JSX (no CSS modules, no styled-components). [src/app/globals.css](src/app/globals.css) holds only global concerns: font imports (Inter for Latin, Sarabun for Thai via `html:lang(th) body`), a few reusable utility classes (`.aurora-text`, `.animate-float`), and keyframe animations. Prefer Tailwind utilities in components; add to `globals.css` only for things Tailwind can't express (custom gradients/animations/font-family switching).
- Path alias `@/*` maps to `./src/*` (see [tsconfig.json](tsconfig.json)).
- No client-side state management, routing library, or data-fetching layer is present — components are static/presentational.
