# Verbatim / Vesper UI 2.0.0 verification — 2026-09-30

## Wordmark cleanup — 2026-10-01

The short petrol rule beneath the Verbatim wordmark was removed following visual feedback. The previous section documents the superseded treatment. Local production-preview screenshots at 320×640, 390×844 and 1440×1000 were visually inspected; the standalone wordmark, demo badge and navigation remain clear without horizontal overflow.

Validation: 18/18 unit tests, production build, 60/60 browser tests, formatting and whitespace checks passed. Live-site verification is recorded after publication.

## Product-first identity — 2026-10-01

Verbatim now leads the header as a display wordmark with a short petrol rule; the shared Vesper parent lockup is in the footer. This supersedes the header arrangement described in the earlier lockup-refinement section below. Local production-preview screenshots at 320×640, 390×844 and 1440×1000 were visually inspected, plus the 390px footer. The identity, badge and navigation fit without horizontal overflow.

Validation: 18/18 unit tests, production build, 60/60 browser tests on the final run, formatting and whitespace checks passed. The first browser run had one intermittent Ionic page-transition timing failure in an unchanged back-navigation test; it passed on the complete rerun. Browser viewports are emulated; physical-device and screen-reader limits below still apply.

## Product lockup refinement — 2026-10-01

The header now gives Verbatim a distinct display treatment beside the unchanged Vesper parent identity. Local production-preview screenshots at 320×640, 390×844 and 1440×1000 were visually inspected: the lockup is legible, the fictional-demo badge wraps below it on narrow screens, and navigation remains clear. The first browser run found display-font clipping at 200% root text size; increasing the name's line height fixed it.

Validation after the fix: 18/18 unit tests, production build, 60/60 browser tests and formatting passed. Browser tests retain layout, 200% text, accessibility and copy-flow coverage. The screenshot review used emulated Chrome viewports; physical-device and screen-reader limits below still apply. The existing domain/routing blocker below is unchanged.

## Documentation sweep — 2026-09-30

Refreshed README onboarding, workflows, setup, project structure and dated verification context. Corrected current branding guidance and explicitly marked superseded planning/migration records as historical. Vesper UI 2.0.0 remains the vendored dependency; runtime source and package manifests contain no Meridian references. Historical screenshots, branch deployment exclusions and compatibility storage keys are preserved.

Validation: 18 unit tests, production build and 60 local browser tests passed; README local links resolve. Browser preview startup initially hit sandbox EPERM, then passed with approved local-server access. No application behavior or dataset changed. Existing production evidence remains dated; this documentation sweep does not claim a new live-site verification.

Application commit: `0eae6e6`. This section supersedes the historical migration/deployment status below; earlier evidence remains intact.

| Check                  | Actual result                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`             | 18/18 unit tests passed                                                                                                                                                          |
| `npm run build`        | TypeScript and Vite passed; existing Ionic chunk-size warning remains (924.05 KB / 217.32 KB gzip main JS)                                                                       |
| `npm run test:e2e`     | 60/60 passed, 40.9s, local production preview                                                                                                                                    |
| `npm run format:check` | Passed                                                                                                                                                                           |
| `git diff --check`     | Passed                                                                                                                                                                           |
| Domain and persistence | Baseline diff is empty for src/domain, src/state.ts, original browser suite, original eligibility tests and vercel.json                                                          |
| Canonical strings      | Full structured dataset comparison against baseline equals only replacing Meridian Signal Group with Vesper Media Group; 14 statement strings and one family description changed |
| Dependency notices     | Existing script regenerated 34 runtime notices; original font notices retained                                                                                                   |
| Brand/runtime audit    | No old package imports, ms- tokens/attributes, old name or obsolete raw colors remain in application source; legacy storage key deliberately retained                            |

Independent install: a clean `git archive` of `0eae6e6` in `/tmp/verbatim-portable-0eae6e6` passed `npm ci --offline` and production build without access to a sibling package path.

## Production verification — 2026-09-30

- Pushed migration `0eae6e6` and verification `e881f2f` to main without rewriting earlier commits. GitHub production deployment `6777732116` identifies full main SHA `e881f2f58217b099c09e5d7a494f8489c69e27c3`.
- Vercel deployment `dpl_HUBrhHn4XN3SFE8yn4LESdUfqDs4`, https://verbatim-2wje4zy2g-andy-protogen.vercel.app, reached **Ready / Production** and retained https://ready-to-say.vercel.app as its alias. The project is `verbatim`; main deployment was triggered automatically by the push. No routing configuration was changed.
- Full production-alias browser suite: **60/60 passed in 50.2s**, including direct-route refresh and the new persistence/reset cases.
- [GitHub CI run 36824870142](https://github.com/andy-fitts-slalom/verbatim/actions/runs/36824870142) completed successfully.
- Separate real Chrome clipboard readback matched the exact 210-character Vesper company-v2 canonical string. [Live phone copy confirmation](screenshots/vesper-2.0.0/live-phone-copy.png), 390×844, was captured and visually inspected on the public alias. This check used the real clipboard; regression denial/success cases use mocks.
- Final publication-evidence commit changes docs/screenshots only; application code remains `0eae6e6`. Unrelated `.DS_Store` and `src/.DS_Store` remain untracked and untouched.

## Behavior and responsive evidence

The original 32 browser cases remain unchanged. The previous 20 presentation regressions now target Vesper exports/classes/names. Eight new phone/desktop cases cover legacy stored requests and preferences without migration, exact retention across reload, cancellation and persisted reset, blocked storage writes retaining old durable data after a session reset, blocked reads/writes and reload recovery, a literal canonical copy expectation and the shipped safe-area CSS rule plus reachable copy action.

Coverage includes eligible byte-exact copy, disabled-button bypass protection, draft/expired/withdrawn/future/superseded/audience/region variants, highest usable version, replacement navigation, scope changes revoking fallback, request validation, local-only language, persistence/reset, invalid routes, filters and counts. Unit checks retain inclusive dates and replacement cycle safety. Ionic view-entry focus, keyboard skip/tab/copy, reduced motion, 48px targets, 320/390/768/1440px Ionic and document overflow, 200% text/reflow and unobscured controls pass. Axe A/AA checks pass in the covered normal, empty and error states.

## Rendered review

Captured from local production preview `http://127.0.0.1:4293` using installed Chrome; each screenshot was opened and visually inspected. No visual regression required a layout override. The warm cream reading surface, petrol action, original Vesper mark, clear state labels and separate approval metadata preserve the intended hierarchy.

| Screenshot                                                            | Viewport / state                                            |
| --------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Baseline](screenshots/vesper-2.0.0/baseline-library.png)             | 390×844, pre-upgrade library                                |
| [Phone library](screenshots/vesper-2.0.0/phone-library.png)           | 390×844, Vesper identity and scope                          |
| [Eligible wording](screenshots/vesper-2.0.0/phone-eligible.png)       | 390×844, exact company-v2 wording and copy action           |
| [Manual fallback](screenshots/vesper-2.0.0/phone-manual-copy.png)     | 390×844, mocked clipboard denial and selected readonly text |
| [Expired](screenshots/vesper-2.0.0/phone-expired.png)                 | 390×844, restriction/recovery and disabled copy             |
| [Invalid request](screenshots/vesper-2.0.0/phone-invalid-request.png) | 390×844, linked required reason error                       |
| [Invalid route](screenshots/vesper-2.0.0/narrow-invalid-route.png)    | 320×640, wrapped navigation and return action               |
| [Desktop library](screenshots/vesper-2.0.0/desktop-library.png)       | 1440×1000, scope, filters, ready/total counts and cards     |
| [Desktop detail](screenshots/vesper-2.0.0/desktop-detail.png)         | 1440×1000, wording and metadata columns                     |

Learner requirements are mapped to concrete repository evidence in [LEARNER-AUDIT.md](LEARNER-AUDIT.md). The dated BRIEF addendum preserves original planning while documenting the delivered names and design.

## Limits and routing blocker

Browser viewport emulation is not a physical iOS/Android keyboard, hardware safe-area or screen-reader audit. Safe-area verification inspects the actual shipped env() rule, computed padding and unobscured action; it does not simulate a hardware inset. Automated clipboard tests use mocks. No authentication, shared backend, native packaging, synchronization or real notifications are introduced.

The Vercel project is `verbatim`; the existing production domain remains https://ready-to-say.vercel.app. A new production domain/routing change was rejected by automatic approval review in the parent task. No routing change is authorized or attempted here. The post-push production results above verify the existing alias; the domain-change blocker remains.

---

# Meridian UI 1.0.0 verification — 2026-09-30 (historical)

This section records a superseded release. Package paths, test filenames, branch instructions and deployment status below apply to that revision only; current Vesper evidence appears above.

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
