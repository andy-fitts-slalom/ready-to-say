# Architecture and decisions — 2026-09-30

## Boundaries

This repository builds and deploys independently. The September 30 Meridian UI migration intentionally shares parent branding and presentation through a vendored versioned package; no application data or domain code is shared. All company context, people, statement wording and approval records were invented from BRIEF.md. No source vault, other case study, real client content or proprietary code was consulted.

## Components and routing

Vue 3 / TypeScript / Vite with Ionic Vue, IonApp, IonRouterOutlet, IonPage, IonContent and @ionic/vue-router. Routes: `/`, `/statements/:id`, `/requests`, `/demo`, and a recoverable unknown-route view. A single small view component shares the consistent scope and navigation controls. Ionic caches pages; browser tests target the visible page and wait for transitions.

Search and topic are query parameters. Scope and requests are shared reactive state, persisted under one versioned local-storage key. Unreadable data and storage write failures are surfaced; requests still function within the current session. Reset affects this app's key only. User-entered request text uses Vue interpolation, not HTML injection.

## Copy authority

`eligibility` is the single authority both for presentation and the action itself. Disabling a DOM button is not the security boundary. The copy handler revalidates synchronously before calling the clipboard, and tests remove the disabled attribute to ensure this guard works. This remains a public fictional demo, not authorization for confidential data.

Replacement resolution walks explicit same-family links, can find a current replacement through an expired intermediate, and rejects cycles. A draft does not supersede an approval. A scoped replacement supersedes only where it can be used. The global selector means a globally valid statement, not arbitrary regional permission.

An explicitly opened historical version remains visible on a context change. When another version becomes usable, a prominent recovery link leads to it instead of silently substituting different wording.

## Persistence and honesty

Requests capture topic, selected scope, required trimmed reason, generated local ID and real creation time. Approval evaluation uses 2025-10-21 regardless of real time. No real contact details, notifications, account system or remote request database exist.

## Presentation

Vesper UI 2.0.0 light/mobile tokens, the shipped V-and-star lockup, semantic status primitives, spacious cards, Georgia statement typography, audience/region context and safe-area copy action. Fonts are served from the same origin. Local licenses preserve their SIL notices and all installed runtime dependency notices. Reduced motion, focus handling and local form feedback support accessible use.

## Publication

Git history records actual milestones, beginning after finding only the matching BRIEF.md. GitHub identity was verified with network-enabled access; sandbox-only auth checks had misleading failures. The repository was initially created private as requested, then made public after explicit user authorization. Vercel identity is andyfitts-4966; the sole available team was Andy-Protogen. No existing project or repository was overwritten.

## Portable shared UI dependency

`vendor/vesper-ui-2.0.0.tgz` is a byte-identical copy of the shared release (SHA-256 `09608c3a9a83ef41aef49059a83054688f3faa92e8f1a7d8592d2eb363594d6f`). npm records the local tarball and integrity; no sibling path or symlink is used. `src/env.d.ts` provides Vite asset types for the release's SVG import. The public favicon is copied unmodified from the release's `assets/brand/vesper-mark.svg`. Font notices retain the release's original OFL terms.

`Workspace.vue` owns all composition and state. The shared package supplies brand, native buttons, badges, fields, notices and empty-state presentation; eligibility remains in `src/domain`. The local presentation map uses the domain result for every current scope. One persistent status live region announces action results; corresponding visible notices have no duplicate announcement. Copy confirmation takes normal space below its button. Manual-copy and request editing disable sticky positioning to keep focused content clear.

## Vesper upgrade — 2026-09-30

Verbatim now uses Vesper Media Group naming and the portable 2.0.0 release. The earlier Meridian integration established the same presentation boundary. Ionic core → shared fonts → shared styles → Ionic adapter → local composition remains the import order. No domain or persistence implementation changed; canonical data changes only the fictional parent name. The legacy storage key is intentional compatibility, not obsolete branding.
