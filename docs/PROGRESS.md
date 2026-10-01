# Meridian UI 1.0.0 migration — 2026-09-30

## Current instructions and baseline

- Working checkout relocated to `Protogen/p-case-studies/p303-mobile`; shared release found at sibling `meridian-design-system`.
- Starting commit: `21c16f7`, `main` tracking `origin/main`. Existing unrelated untracked files `.DS_Store` and `src/.DS_Store` are preserved and excluded from commits.
- Baseline: 18 unit tests passed, production build passed (existing Ionic chunk-size warning), 32 browser tests passed in 21.9s, formatting passed.
- User authorized shared parent branding/UI only. Domain code, records, local persistence and framework remain local and independent.
- Later user instruction authorizes discrete GitHub commits. Work is on `refactor/meridian-ui-1.0.0`; never push `main` or deploy this refactor. `vercel.json` disables Git deployment for this branch only using Vercel's documented `git.deploymentEnabled` map.
- Versioned release is copied into `vendor/meridian-ui-1.0.0.tgz` and installed from that portable file, not a sibling dependency.
- Baseline phone screenshots are in `docs/screenshots/meridian-1.0.0/`.

## Planned reviewable milestones

1. Baseline, portable release and non-deploying branch setup.
2. Parent identity, shared foundations, controls/statuses and all application states.
3. Interaction/layout regression checks, visual evidence and final continuation notes.

The publication instructions below describe the original delivery only. They do not authorize deployment of this migration.

---

# Progress — 2026-09-30

## Planning

- Workspace contained only BRIEF.md; it matched the supplied source byte for byte. Copied the requested source into the root.
- Build Vue 3 / TypeScript / Vite / Ionic Vue with history routing, deterministic local data and centralized eligibility rules.
- Milestones: planning; data and eligibility; navigation and core flows; verification and publication.
- Intended repository: private andy-fitts-slalom/ready-to-say. Intended Vercel project: ready-to-say. Account identity and existing resources must be verified before linking.

## Decisions

- Fixed demonstration date: 2025-10-21. Effective and expiry dates are inclusive calendar dates.
- A replacement blocks an older version only if the replacement is currently usable in the selected context.
- Local storage is convenience persistence, not authentication or shared workflow state.

## Implemented milestones

- Planning committed and pushed as `3094d0b`.
- Deterministic 24-version/eight-topic dataset, domain rules and 18 passing unit tests committed as `41335ec`.
- Vue/Ionic mobile library, detail/version views, guarded copy, local requests/reset and production routing committed as `bbfa301`.
- Independent code review fixed topic-filter preservation, focused request recovery, stale validation and links to usable approved sibling versions.
- Fonts are self-hosted; dependency and font notices preserved. Dependency audit reports zero vulnerabilities after upgrading Vitest.
- Production build passes. The expected Ionic bundle-size warning remains informational.
- Local production-preview browser suite: **32/32 passed**, phone 390×844, desktop 1440×1000, plus 320px checks. Covers byte-exact copy, ineligible action guard even after removing disabled, drafts, replacements, requests/reset, persistence, direct routes, empty/storage/clipboard states, axe, keyboard/reduced-motion and no JavaScript errors.

## Publication status

- GitHub authentication verified as `andy-fitts-slalom`; repository is now public per the user's follow-up: https://github.com/andy-fitts-slalom/ready-to-say.
- Vercel authentication verified as `andyfitts-4966`, sole available team `Andy-Protogen` (`andy-protogen`). Created separate project `ready-to-say`; no naming adjustment or unrelated overwrite.
- First production deployment: https://ready-to-say.vercel.app. Opened the home page and direct company statement route in Chrome, inspected mobile and desktop screenshots.
- Vercel GitHub connection succeeded. API verification confirms repository `andy-fitts-slalom/ready-to-say`, production branch `main`, Vite, Node 22, install `npm ci`, build `npm run build`, output `dist`.
- Verification milestone `add74ef` pushed and automatically deployed from `main`. Production deployment `ready-to-6ewie48p3-andy-protogen.vercel.app` is Ready and serves the public alias.
- Full public-production browser suite: **32/32 passed**. Real browser clipboard independently matched the exact 213-character company statement. Direct loads and refreshes checked.
- GitHub CI run `36780645900` passed formatting, unit tests, production build and all browser tests on Linux Chromium. See [VERIFICATION.md](VERIFICATION.md) and [screenshots/](screenshots/) for evidence.
- Final documentation-only handoff records these results; no publication or account-connection blocker remains.

## Remaining limitations

- Entirely fictional public prototype; no authentication, backend, real notifications, shared requests, native packaging or offline synchronization.
- Browser-local state can be cleared by the browser. Storage failures remain usable only within the current session.
- Emulated Chromium phone/desktop and automated accessibility checks are not a physical iOS/Android or screen-reader audit.
- No credentials are committed or required at runtime. Project-local `.env.local` created by Vercel is ignored.

## Continue in a later session

1. Read BRIEF.md, AGENTS.md, this file and VERIFICATION.md.
2. Run `git status` before changing anything. The intended remote is the public dedicated repository, branch `main`.
3. Use `npm ci`, `npm test`, `npm run build`, then `npm run test:e2e`. Node 22 and Chrome are used locally; CI uses installed Playwright Chromium.
4. Push tested changes to `main` to trigger Vercel automatically. Verify the actual public alias after deployment; do not infer browser success from a Ready status alone.
5. Preserve the fixed demo clock, fictional-only data, exact-text copy guard and honest browser-local request language. No follow-up setup is currently required.
