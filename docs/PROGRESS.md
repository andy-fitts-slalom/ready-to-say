# Verbatim / Vesper UI 2.0.0 — 2026-09-30

## Production confirmation — 2026-10-01

Commit `16233f3` was pushed to `main`, following the already-local metadata commit `dcc5a61`. [GitHub verification](https://github.com/andy-fitts-slalom/verbatim/actions/runs/36832941843) passed, and Vercel reported deployment complete. Opened [production Verbatim](https://ready-to-say.vercel.app/) in Chrome and confirmed the cool salt-flat background, Barlow Condensed wordmark/headline, audience and region selectors, and statement-library content. The existing domain and routing remain in place.

## Vesper UI 3.0 selected direction — 2026-10-01

- Installed the independent `@vesper/ui` 3.0.0 tarball. Verbatim now uses the cool salt-flat reading canvas and Barlow Condensed display headings; the product-first wordmark and Vesper footer identity remain in place.
- Increased wordmark line height after the 200% root-text browser check found clipping. Audience, region, search, eligibility, exact copy, local requests, routing and stored data remain unchanged.
- Local checks: 18/18 unit tests, production build, 60/60 browser tests and Prettier format check passed. The first browser run exposed the wordmark clipping; the complete rerun passed after repair. Local server binding required sandbox escalation.
- No new publication blocker. Existing production domain and branch deployment exclusion remain unchanged. Production verification is recorded after push. Earlier 2.0.0 sections below are historical.

## Wordmark cleanup — 2026-10-01

- Removed the short rule under the Verbatim wordmark after visual feedback that it looked accidental. The product still leads the header, with the shared Vesper parent lockup in the footer.
- No statement, eligibility, copy, storage, routing or deployment configuration changed. No new publication blocker.

## Product-first identity — 2026-10-01

- Following visual feedback, the header now leads with a Verbatim display wordmark. The vendored Vesper mark and parent name appear in the footer attribution instead of competing in the header. The fictional-demo label remains visible.
- No statement, eligibility, copy, storage or routing behavior changed.
- No new publication blocker. The existing production domain and historical branch deployment exclusion remain in place.

## Product lockup refinement — 2026-10-01

- Kept the vendored Vesper parent mark and wordmark, but moved Verbatim out of the component's small third line. A separate Caslon product name now sits beside the parent identity, divided by a subtle rule; mobile spacing and type scale down for narrow widths.
- The home link has an explicit accessible name. Statement data, eligibility, copy, storage, routing, demo date and deployment configuration are unchanged.
- No new publication blocker. The existing production domain and historical branch deployment exclusion remain in place.

## Documentation sweep — 2026-09-30

Refreshed README onboarding, workflows, setup, project structure and dated verification context. Corrected current branding guidance and explicitly marked superseded planning/migration records as historical. Vesper UI 2.0.0 remains the vendored dependency; runtime source and package manifests contain no Meridian references. Historical screenshots, branch deployment exclusions and compatibility storage keys are preserved.

Validation: 18 unit tests, production build and 60 local browser tests passed; README local links resolve. Browser preview startup initially hit sandbox EPERM, then passed with approved local-server access. No application behavior or dataset changed. Existing production evidence remains dated; this documentation sweep does not claim a new live-site verification.

Current instructions supersede the historical branch restrictions below. Work is on main, starting at `60e0302`, with the user's authorization to commit increments and push main after checks. Existing history and unrelated `.DS_Store` files are preserved.

- Upgraded the existing shared integration to vendored `@vesper/ui` 2.0.0, with matching lockfile, exports, `vs-` classes/tokens/attributes, supplied favicon and VesperBrand lockup. The HTML theme color now matches petrol. Removed the old tarball/mark and all obsolete runtime Meridian references.
- Verbatim is the mobile-first approved-wording library for Vesper Media Group. Exactly 14 canonical records replace only the parent name; a complete structured comparison against baseline confirmed all other data unchanged. Original domain, persistence, Ionic shell/routing and copy guard remain unchanged. The legacy storage key is retained deliberately.
- Root README, agent guidance, architecture, license attribution and dated BRIEF addendum reflect the current product. Prior planning and earlier verification evidence are retained. Third-party notices regenerated for 34 runtime packages; font notices preserved.
- Baseline: 18 unit tests, production build, 52 browser tests (34.3s) and formatting passed. Initial sandbox server denial was resolved using approved local-server access. The first upgraded 52-test browser run passed (31.1s).
- Added explicit legacy reload/reset, blocked read/write/reset and literal exact-copy coverage. Initial new tests mistakenly looked for scope controls on Demo info; corrected navigation to the library, without changing app behavior.
- Captured and inspected the actual phone library, eligible detail, manual selection fallback, expiry restriction, invalid request, narrow invalid route and desktop library/detail. See current VERIFICATION.md for final checks and limitations.
- Publication target: https://github.com/andy-fitts-slalom/verbatim, Vercel project `verbatim`, existing https://ready-to-say.vercel.app. Main automatic deployment remains enabled; old refactor branch stays excluded. The prior parent-task automatic approval rejection for new production domain/routing changes remains a blocker; no routing change is attempted here.

- Final local checks: 18/18 unit tests, build, 60/60 browser tests (40.9s), formatting and whitespace checks passed. Clean archived migration commit `0eae6e6` installed offline and built independently.

- Published `0eae6e6` and `e881f2f` on main. Automatic Vercel production deployment is Ready on the retained alias; live browser suite 60/60 passed (50.2s), GitHub CI run 36824870142 passed, and real clipboard readback matched all 210 canonical characters. See VERIFICATION.md for deployment IDs and live screenshot.

---

# Main merge authorization — 2026-09-30

The user explicitly requested merging the branch commits into main so the complete history is visible there. Main was fast-forwarded to include `5362801`, `9d1192c` and `74ec84e` without squashing or rewriting them. This supersedes the earlier main-push restriction below. No application code changed during this merge; the recorded 18 unit and 52 browser tests apply to the same code. Existing unrelated `.DS_Store` files remain untouched.

Main retains its connected Vercel automatic deployment; the refactor branch exclusion does not disable main. Deployment verification from the original release must not be mistaken for verification of this newly triggered deployment.

---

# Meridian UI 1.0.0 migration — 2026-09-30 (historical)

This section records a superseded release. Package paths, test filenames, branch instructions and deployment status below apply to that revision only; current Vesper evidence appears above.

## Current instructions and baseline

- Working checkout relocated to `Protogen/p-case-studies/p303-mobile`; shared release found at sibling `meridian-design-system`.
- Starting commit: `21c16f7`, `main` tracking `origin/main`. Existing unrelated untracked files `.DS_Store` and `src/.DS_Store` are preserved and excluded from commits.
- Baseline: 18 unit tests passed, production build passed (existing Ionic chunk-size warning), 32 browser tests passed in 21.9s, formatting passed.
- User authorized shared parent branding/UI only. Domain code, records, local persistence and framework remain local and independent.
- Later user instruction authorizes discrete GitHub commits. Work is on `refactor/meridian-ui-1.0.0`; never push `main` or deploy this refactor. `vercel.json` disables Git deployment for this branch only using Vercel's documented `git.deploymentEnabled` map.
- Versioned release is copied into `vendor/meridian-ui-1.0.0.tgz` and installed from that portable file, not a sibling dependency.
- Baseline phone screenshots are in `docs/screenshots/meridian-1.0.0/`.

## UI migration checkpoint

- Foundation checkpoint `5362801` pushed to the dedicated refactor branch. Vercel branch deployment is disabled; main is untouched.
- Imported Ionic core first, shared fonts/styles and Ionic adapter next, application composition last. HTML uses light/mobile and body has `ms-root`.
- Replaced the quotation-mark identity with shipped `MeridianBrand` and favicon. Fontsource dependencies removed; release fonts and preserved OFL notices are served locally.
- Migrated fields, buttons, badges, notices and empty states to shared primitives. Replaced Unicode action/status symbols with Ionicons. Retained real native select/input semantics, per-page IDs, Ionic routing/caching and view-entry focus.
- Replaced the legacy stylesheet rather than layering color overrides. Local CSS now owns composition using semantic tokens, readable labels, 48px controls and responsive layout.
- Copy feedback flows inside the action bar, rather than obscuring it. The action bar becomes static while a request/manual-copy field is open or the viewport is short. One persistent live region announces action results.
- Dataset, domain eligibility and storage implementation are unchanged. Presentation maps the full context-dependent eligibility result to shared status tones.
- UI checkpoint: 18 unit tests, build, unchanged 32 browser tests (16.9s) passed. Phone and desktop rendered library inspected. Additional migration-specific regressions and final visual evidence are complete; see final results below.

## Final migration results and continuation

- UI milestone `9d1192c` pushed to `refactor/meridian-ui-1.0.0`. Final verification milestone adds 20 regressions, final screenshots and the two visual-review fixes.
- Required final checks passed: 18 unit tests; TypeScript/Vite build; **52/52 browser tests (25.2s)**; formatting. Original domain tests and 32 browser checks remain unchanged.
- Clean archived UI checkout installed the tarball and built outside the shared sibling folder. No registry publication, symlink or parent-path dependency is required.
- Full current evidence, limitations and 15 migrated-state screenshots with viewport/state metadata are in [VERIFICATION.md](VERIFICATION.md) and `docs/screenshots/meridian-1.0.0/` (plus two baseline captures).
- Visual review fixed manual-copy field height and selected-scope readability at 200% text size. Domain logic, immutable text, fixed date, local storage key and original browser behavior are preserved.
- No migration deployment. No push to main. Vercel branch auto-deployment disabled using [documented Git configuration](https://vercel.com/docs/project-configuration/git-configuration). GitHub deployment list for the refactor branch is empty; remote main still equals `21c16f76de221ba4a422981c89ed87a85f59eb81`.
- Continue from the current refactor branch, read this section and current VERIFICATION.md first. Run `npm ci`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run format:check`. Preview port 4287 is reserved by tests; manual review used 4288.
- Keep `.DS_Store` files untouched and out of commits. Do not merge or deploy without a separate user request. The older main/deployment directions below are historical, superseded for this refactor.

## File summary

- `vendor/`, package manifest/lock: pinned portable Meridian UI 1.0.0 release; duplicate Fontsource dependencies removed.
- `src/main.ts`, `index.html`, `src/env.d.ts`, `public/meridian-mark.svg`: stylesheet ordering, light/mobile/body foundation, shared mark/favicon and Vite asset typing.
- `src/Workspace.vue`, `src/style.css`: shared brand/primitives, semantic state mapping, Ionicons, responsive token-based compositions, linked errors, focus-safe feedback/manual-copy presentation.
- `public/licenses/`: regenerated third-party notices and retained font notices.
- `tests/meridian.spec.ts`, `playwright.config.ts`: additional layout, scope, focus, fallback, text-resize and accessibility regressions; original tests retained.
- `vercel.json`: deployment exclusion for this branch only.
- `AGENTS.md`, `README.md`, `docs/`: migration constraints, integration notes, baseline/final evidence and continuation instructions.

## Reviewable milestones

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
