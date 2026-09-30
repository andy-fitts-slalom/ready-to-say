# Ready to Say — Project Brief

## What is this?

A mobile-first web experience for a press officer at Meridian Signal Group, a fictional company spanning digital publications, streaming entertainment, podcasts, and live events. Central communications maintains approved messages; regional teams need to find appropriate wording while supporting events or moving between meetings.

The P303 task is deliberately narrow: find a relevant statement → verify it is current and approved for the intended use → copy the exact approved wording. If the wording is unavailable or expired, the user should understand the next step.

Build a responsive web app, not a native mobile application. All companies, people, topics, statements, dates, and approval records are fictional. Use this brief as the full organizational context; do not import source-vault content or internal product details.

## Data

Create a deterministic local JSON dataset under `src/data/`, with TypeScript types and a short data dictionary. Seed approximately 24 statement-version records across eight topics, three usage audiences (`press`, `partners`, `employees`), and a small set of regions including `global`.

- Each statement family has a stable ID, topic, title, and short description.
- Each version has its own ID, family ID, version number, exact statement text, status, allowed audiences, allowed regions, owner, approver, approval date, effective date, review/expiry date, and optional replacement-version ID.
- Statuses include `approved`, `draft`, and `withdrawn`. Derive expiration from the validity dates and the demonstration clock; do not maintain contradictory stored and calculated expiration states.
- Distinguish the latest draft from the latest usable approved version. A draft does not silently replace current approved wording. A superseded approved version should point to its usable replacement and not offer copying.
- Use a fixed demonstration date, such as October 21, 2025, and show that date in a compact demo information view. Do not make the seed examples expire unpredictably as real time passes.

Include a current statement, expired wording, a withdrawn version, a draft revision alongside a still-valid approved version, a replacement, and a topic with no usable statement for the chosen audience/region. Include fictional owners with no real contact information.

## Eligibility rules

A statement can be copied only when it is approved, within its effective period, valid for the selected audience and region, and not superseded by a current approved replacement. A global statement may serve a selected region if its usage conditions permit it. An audience-restricted statement must not silently broaden to another audience.

Show the current usable version for the selected context. Make scope, approval, and validity visible beside the wording. If no version qualifies, explain why and offer an appropriate recovery action. These are demonstration rules, not a real access-control or authentication system.

## Layout

- Home: product name, a compact audience/region selector, search, and a short list of topics or recent statements.
- Results: readable cards showing topic, title, version, usability status, and region/audience context. Avoid dense dashboard tables.
- Detail: exact wording, visible approval and validity information, usage conditions, owner, and a prominent copy action positioned for one-handed use.
- Recovery: a current replacement when available, or a short request-for-update form. Show saved requests in a simple local request-status view.
- Settings/demo information: reset action, fictional-data explanation, and persistence limitations.

## Interactions and behavior

- Search titles, topics, and statement text. Filter by audience and region with clear selected scope. Avoid showing incompatible wording as if it were ready to use.
- Open a result and copy the exact eligible statement text without altering its wording or appending metadata. Confirm success accessibly.
- If browser clipboard access fails, provide a practical manual-selection/copy fallback and an accurate message.
- For expired, withdrawn, incompatible, or superseded wording, disable copying and explain the reason. Link to a valid replacement where one exists.
- A request for updated wording collects the topic, selected scope, and a required reason. Validate it, save a local request, and show confirmation labeled as a demonstration. Do not claim that an actual person was notified.
- Preserve local requests and preferences across reloads. Reset restores the seed state after confirmation. Explain that the demo is browser-local and does not synchronize across users or devices.
- Support browser back navigation without losing search context. Include no-results, unavailable-statement, clipboard-failure, and storage-failure states.

## Style and design intent

Create a quiet, trustworthy mobile interface with readable type, clear status language, generous touch targets, and minimal navigation. The approved text and its usage conditions should command attention. Use color, icons, and text together to distinguish usable wording from material requiring review.

Design first at a narrow phone viewport, then adapt to larger screens. Ensure primary actions remain usable with the onscreen keyboard and on devices with bottom safe areas. Support keyboard access, visible focus, screen readers, and reduced motion. Do not add native packaging, push notifications, offline synchronization, or a chatbot to the core scope.

## Tech

- Vue 3, TypeScript, and Vite.
- Ionic Vue and its compatible router integration for mobile web navigation and controls. Use web deployment only; native platform packaging is out of scope.
- Local JSON, browser storage, and the browser clipboard API with fallback.
- Unit tests for statement eligibility, date boundaries, audience/region matching, and version selection; browser tests for search → verify → copy, expired-statement recovery, local requests, and reset.

## Acceptance criteria

A reviewer on a phone-sized viewport can find a statement, verify its status and permitted use, and copy the exact wording. Expired or incompatible wording cannot be copied through the application's copy action. A draft does not hide a usable approved version. Replacement and update-request paths work, local state persists, and reset restores the seed data. The production build passes and the deployed app supports direct page loads and refreshes.

## Repository and delivery

Use a dedicated private GitHub repository named `ready-to-say` under `andy-fitts-slalom`, plus a separate Vercel project named `ready-to-say` if available. Record any necessary Vercel naming adjustment.

Keep `BRIEF.md`, `README.md`, and `LICENSE` in the root. Use an MIT license for original prototype code and preserve dependency notices. The README explains setup, commands, the fictional organization, eligibility rules, local persistence/reset, accessibility considerations, limitations, and live URL. Keep agent instructions and dated decisions/progress in an organized `docs/` structure and an appropriate root `AGENTS.md`.

Make and push descriptive commits as planning, data, navigation, core flows, and verification are completed. Do not fabricate development history. Verify the deployed mobile experience and report any remaining limitations honestly.
