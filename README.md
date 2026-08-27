# GameHub

Mobile-first static catalog for GameHub. It routes visitors to approved external web games; it does **not** embed or host a game.

## Local development

```bash
npm install
npm run dev
```

Open the Vite URL printed by the command. The production base path is intentionally `/gamehub/` (see `vite.config.ts`).

## Quality commands

```bash
npm test       # verifies the public inventory contract
npm run build  # type-checks and produces dist/
npm run preview # serves the built dist/ locally
```

## Deployment handoff (not performed by this repository)

This is ready for a GitHub Pages **project site** at `/gamehub/`:

1. Run `npm ci && npm run build`.
2. Publish the contents of `dist/` to the configured Pages workflow/branch for the repository.
3. Do not change `base: '/gamehub/'` unless the final hosting path changes.
4. Smoke-test the published catalog on mobile and desktop: three cards, status text, CTA labels, and every outbound URL.

No remote, GitHub repository, or deployment is created by this artifact.

## Public inventory and update workflow

All public catalog metadata is in **one source file**: [`src/games.ts`](src/games.ts). It is the only place to add, amend, reorder, or remove a game.

Before setting a record to `published: true`, the PM/content owner must confirm:

1. Canonical `https` `playUrl` and whether it is public.
2. Exact `status` (`Live` or `Pilot`), name, Vietnamese short description, tags, and CTA.
3. CSS art/cover description (`coverAlt`) that is approved and rights-safe.
4. Owner, `lastVerifiedAt`, and `sortOrder` (Live before Pilot).
5. The external URL opens the intended game without sign-in or an error page.

Then update `src/games.ts`, run `npm test && npm run build`, and repeat mobile + desktop smoke tests. Never infer an URL from a game name. A not-ready game must not be in `games.ts` at all: the current PM brief explicitly prohibits publishing or even showing **Tàu Vũ Trụ Cộng Số** until QC, production deploy, owner-confirmed URL, approved content, and `published = true` are all complete.

## Accessibility and design notes

- Vietnamese semantic heading structure, meaningful CSS-art `role="img"` labels, skip link, and visible keyboard focus.
- Image/title and CTA each use the same direct external destination and open it in a new tab safely (`noopener noreferrer`).
- Interactive targets are at least 44px tall. The catalog is one column from 320px and expands responsively.
- Tokens: background `#F7F7F3`, ink `#13211F`, white cards / border `#DDE3DE`, evergreen `#126B57`; Manrope for UI and IBM Plex Mono for metadata. No copied art assets, gradients, glass, or neon.

Filters are deliberately omitted: the PM MVP brief lists filtering out of scope.
