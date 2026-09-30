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
