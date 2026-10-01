# Verbatim

Read BRIEF.md and docs/PROGRESS.md before changing the app. Use only invented Vesper Media Group data. Preserve exact statement wording when copying. Eligibility belongs in src/domain and must be checked again in the copy action. Use the fixed demo date, not real time. Keep requests browser-local and label them honestly. Run unit tests, browser tests, and production build before delivery. Record decisions and publication blockers in docs/. Do not commit secrets, dependencies, or generated test artifacts.

## Shared presentation boundary

Share only parent branding and presentation through the vendored Vesper UI package. No sibling application code, data or domain behavior may be copied. Keep independent installation, Ionic routing/page caching/view-entry focus, eligibility, copy and storage rules. Earlier migration and merge history is recorded in docs/PROGRESS.md; its old branch restrictions are historical. Preserve the old branch deployment exclusion.

## Current Vesper migration — 2026-09-30

Use vendored `@vesper/ui` 2.0.0 for presentation. Work and commit on main only, preserve prior commits and unrelated untracked files, and push after tests, build, browser tests and formatting pass. Keep `ready-to-say-v1` readable. Keep the existing production domain `ready-to-say.vercel.app`; routing changes require explicit user approval. Previous branch-only restrictions are historical.
