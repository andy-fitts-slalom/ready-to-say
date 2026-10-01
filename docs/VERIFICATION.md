# Meridian UI 1.0.0 verification — 2026-09-30

This section applies to the **local refactor branch**, not the production site. The earlier production evidence is retained below as historical context.

## Final required checks

| Check                             | Actual result                                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                        | 18/18 passed; original tests unchanged                                                                                                 |
| `npm run build`                   | Passed TypeScript and Vite production build                                                                                            |
| `npm run test:e2e`                | 52/52 passed in 25.2 seconds against local production preview on port 4287                                                             |
| `npm run format:check`            | Passed                                                                                                                                 |
| Original browser suite            | All 32 original cases retained byte-for-byte and passing                                                                               |
| Migration regressions             | 20 additional passing phone/desktop cases in `tests/meridian.spec.ts`                                                                  |
| Portable install/build            | Fresh `git archive` of UI checkpoint `9d1192c` outside the sibling folder: `npm ci --offline` and build passed                         |
| Domain/data/persistence integrity | `git diff 21c16f7 -- src/data src/domain src/state.ts tests/browser.spec.ts tests/eligibility.test.ts` is empty                        |
| Runtime dependency notices        | Regenerated with existing license script; 34 runtime packages, font OFL notices retained                                               |
| Publication protection            | Dedicated refactor branch only, branch deployment disabled; main remains `21c16f7`, no GitHub deployments recorded for refactor branch |

The original baseline before migration also passed: 18 unit tests, build, 32 browser tests (21.9 seconds), and formatting. Only `.DS_Store` and `src/.DS_Store` were untracked; both were preserved and excluded from commits.

## Automated interaction and accessibility coverage

- Original exact-copy payload, forced-click guard, expired/withdrawn/future/superseded/scope restrictions, draft-versus-approval selection, replacement navigation and direct refresh/back behavior remain covered.
- Audience and region changes immediately switch badges and copy availability, including eligible → blocked → eligible transitions. A manual-copy fallback disappears when scope becomes ineligible and does not reappear without another eligible failure.
- Shared field errors are explicitly connected by IDs; the reason remains required, focus-visible and reachable. Form opening moves focus to its heading. Requests, persistence/reset and blocked storage remain covered by the unchanged original suite.
- Copy feedback is below the primary button in normal layout, with a separate single status announcement. Hit-testing confirms the action remains unobscured. The copy bar is static while manual text or the request form is open.
- At 320, 390, 768 and 1440px, both the document and active **Ionic shadow scroller** fit the viewport. Tested buttons, inputs and navigation have at least 48px heights.
- 200% root text resizing checked on phone and desktop: control-label bounds, selected scope option fit, internal overflow, actual copy action and request fill/save reachability. A separate 720×500 CSS viewport models reflow for 1440×1000 at 200% zoom. These are explicitly text-size/reflow tests, not native browser zoom claims.
- Axe checks include library, eligible/blocked details, requests/demo plus empty search, unknown routes, validation, clipboard failure and blocked storage. No violations in the tested WCAG A/AA rules. Keyboard and reduced-motion checks retained. No browser JavaScript errors in the existing checked journeys.

## Rendered-screen review and evidence

Local production preview only: `http://127.0.0.1:4288`, Chrome via Playwright. [Exact viewport/state manifest](screenshots/meridian-1.0.0/states.json). The screenshots are observations of rendered screens, not screenshot-based assertions or physical-device testing.

| Viewport / state                                  | Evidence                                                                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 390×844 library masthead and scope                | [Phone library](screenshots/meridian-1.0.0/phone-library.png)                                                                                                             |
| 390×844 cards, counts and statuses                | [Phone results](screenshots/meridian-1.0.0/phone-results.png)                                                                                                             |
| 390×844 eligible statement                        | [Exact wording](screenshots/meridian-1.0.0/phone-eligible.png)                                                                                                            |
| 390×844 copied confirmation                       | [Copy feedback](screenshots/meridian-1.0.0/phone-copy-confirmation.png)                                                                                                   |
| 390×844 clipboard failure, selected exact text    | [Manual fallback](screenshots/meridian-1.0.0/phone-manual-copy.png)                                                                                                       |
| 390×844 expired restriction and recovery          | [Blocked wording](screenshots/meridian-1.0.0/phone-expired.png)                                                                                                           |
| 390×844 linked invalid request                    | [Validation](screenshots/meridian-1.0.0/phone-request-invalid.png)                                                                                                        |
| 390×844 session-only storage failure              | [Storage notice](screenshots/meridian-1.0.0/phone-storage-failure.png)                                                                                                    |
| 320×844 unavailable route                         | [Invalid route](screenshots/meridian-1.0.0/phone-invalid-route.png)                                                                                                       |
| 1440×1000 library, detail and empty search        | [Library](screenshots/meridian-1.0.0/desktop-library.png), [detail](screenshots/meridian-1.0.0/desktop-detail.png), [empty](screenshots/meridian-1.0.0/desktop-empty.png) |
| 768×1024 demo/reset confirmation                  | [Tablet reset](screenshots/meridian-1.0.0/tablet-reset-confirmation.png)                                                                                                  |
| 720×500 CSS / 2× raster zoom-reflow approximation | [Reflow](screenshots/meridian-1.0.0/zoom-200-reflow.png)                                                                                                                  |
| 1440×1000 / 200% root text                        | [Enlarged text](screenshots/meridian-1.0.0/desktop-text-200.png)                                                                                                          |

Visual review prompted two fixes beyond passing baseline checks: enlarge the read-only fallback field to show the selected wording, and prevent selected scope labels from truncating at enlarged text size. The Global selector now says “Global” with a linked “Global covers all regions” hint; permission rules did not change. Fields flex and wrap with available space.

Baseline phone library/detail screenshots in the same folder retain the pre-migration appearance. All new imagery comes from this application; only the authorized parent mark/fonts/UI package were shared.

## Limits

No refactor deployment was performed. Tests use installed Chrome with viewport emulation. Physical iOS/Android keyboards, hardware safe-area behavior, native browser-menu zoom, VoiceOver and NVDA were not directly tested. Safe-area CSS is retained; focused fields and action visibility were tested in desktop emulation. Clipboard writes/denial in these regression tests and screenshots use browser mocks, with byte-exact payload assertions.

The existing Ionic bundle-size warning remains: approximately 924 KB uncompressed / 217 KB gzip main JavaScript after migration. No build failures, unaddressed migration test failures or missing-release blockers remain.

---

## Historical original-release verification

# Verification — 2026-09-30

Application revision: `add74ef5d15b8ab6de743a5ccabc165a7a28174b`. Later documentation-only commits do not change the tested application.

## Results

| Check                                             | Result                                                          |
| ------------------------------------------------- | --------------------------------------------------------------- |
| TypeScript + Vite production build                | Pass                                                            |
| Vitest eligibility and seed integrity             | 18/18 passed                                                    |
| Playwright against local production preview       | 32/32 passed, 16.0 seconds                                      |
| Playwright against public production alias        | 32/32 passed, 21.9 seconds                                      |
| Automated axe core-page checks                    | No WCAG 2 A/AA or 2.1 AA violations in tested pages             |
| Keyboard, skip link, reduced motion               | Pass                                                            |
| 320px, 390×844 and 1440×1000 layouts              | No horizontal overflow; primary action reachable                |
| Browser JavaScript errors during covered journeys | None                                                            |
| Real Chrome clipboard on production               | Exact 213-character company-v2 text matched displayed statement |
| npm dependency audit                              | Zero vulnerabilities                                            |
| Prettier and git whitespace checks                | Pass                                                            |
| GitHub CI                                         | Pass                                                            |
| Vercel production deployment from main            | Ready; automatic Git push deployment confirmed                  |

CI evidence: https://github.com/andy-fitts-slalom/ready-to-say/actions/runs/36780645900

Production app: https://ready-to-say.vercel.app

Tested deployment: https://ready-to-6ewie48p3-andy-protogen.vercel.app (public production alias used for all browser verification).

## Covered scenarios

- Search → inspect current approved version despite a newer draft → verify scope and approval → copy exact text → browser back retains search.
- Expired, withdrawn, superseded, audience-incompatible, region-incompatible and future-effective versions block copying.
- Removing the disabled button attribute and invoking its handler still produces no clipboard write for ineligible text.
- Approved replacement and current approved sibling recovery are offered when applicable.
- Region changes and reload persistence; global permissions do not broaden an audience.
- Required request reason validation, correct topic/scope capture, saved local state across reload, accurate no-notification confirmation, reset cancellation and confirmed reset.
- Search topic retained while typing; empty search, unavailable version and unknown route recovery.
- Clipboard denial produces exact selected wording in a read-only manual-copy field. Storage write failure produces an honest session-only warning and retains the request in memory.
- Direct statement links, request links, query search links, missing routes and refreshes work against the real Vercel deployment.

Automated copy tests mock the browser clipboard to inspect the exact payload and permission-denial path. The separate real-browser clipboard check was performed on production with permission granted.

## Visual evidence

- [Phone library](screenshots/phone-library.png)
- [Phone statement and copy confirmation](screenshots/phone-statement.png)
- [Desktop library](screenshots/desktop-library.png)

Screenshots were opened and visually inspected after capture from the public production alias.

## Practical limits

Tests use desktop Chrome/Chromium with mobile viewport emulation. Physical iOS Safari, Android Chrome, onscreen keyboards, VoiceOver and NVDA were not separately tested. Automated axe is a useful baseline rather than a complete accessibility audit. Safe-area CSS and reduced-motion support are implemented.

The app intentionally has no real authentication, notifications, shared backend or offline synchronization. Seed dates use a fixed demonstration clock. Vite warns about the approximately 893 KB uncompressed / 206 KB gzip Ionic application JavaScript chunk; build and browser checks pass, but further bundle reduction remains a potential improvement.
