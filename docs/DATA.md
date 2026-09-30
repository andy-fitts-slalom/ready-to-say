# Fictional data dictionary

All 8 families, 24 versions, owners, approver records, and exact statements in `src/data/statements.json` were invented exclusively for Meridian Signal Group. There are no real contact details or external source materials.

## Family fields

| Field | Meaning |
| --- | --- |
| `id` | Stable family identifier used in navigation |
| `topic` | Short search and browsing category |
| `title` | Human-readable statement family title |
| `description` | Short explanation of its purpose |

## Version fields

| Field | Meaning |
| --- | --- |
| `id`, `familyId`, `version` | Distinct version identifier, owning family, monotonically increasing version number |
| `text` | Exact copy payload, including punctuation; never append metadata |
| `status` | `approved`, `draft`, or `withdrawn`; expiry is calculated, not stored as a status |
| `audiences` | Explicit permitted audiences: `press`, `partners`, `employees` |
| `regions` | Permitted regions: `global`, `americas`, `emea`, `apac` |
| `owner` | Invented content owner, with no real contact information |
| `approver`, `approvedAt` | Invented approval record; `null` for drafts |
| `effectiveAt`, `expiresAt` | Inclusive ISO calendar date bounds |
| `replacementId` | Optional explicit same-family successor version |

## Rules and examples

The demonstration clock is fixed at **2025-10-21**. Eligibility requires approved status, inclusive date validity, audience permission, region permission, and no usable replacement. Global approval includes each specific region; a specific region does not include global use. No audience implies permission for another audience. Invalid dates and replacement cycles fail closed. Replacement links are followed through unavailable intermediate versions to find the latest usable successor. A missing or unrelated replacement does not supersede otherwise usable wording.

Selection prefers the highest eligible version, then the highest approved version for recovery, then the latest version if no approval exists. Drafts and future-effective approvals never hide eligible wording.

- Company v2 is usable with a newer draft v3; v1 explicitly links to v2 and is blocked.
- Streaming v2 expired before the demo date; request an update.
- Publishing v1 is withdrawn and points to usable v2.
- Podcasts v2 remains usable while approved v3 is future-effective.
- Events v2 is EMEA-only; v3 is Americas-only; global and APAC have no usable version.
- Partnerships is partners-only; workplace is employees-only.
- Responsibility includes an expired approval, withdrawn revision, and draft; none is usable.

The dataset is static. Browser-local requests do not modify these approval records or notify owners. These are demonstration content rules, not authentication or authorization controls for a real service.
