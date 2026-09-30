import data from '../data/statements.json';
import type { Audience, EligibilityResult, Region, Scope, StatementFamily, StatementVersion } from './types';

export const DEMO_DATE = '2025-10-21';
export const audiences: Audience[] = ['press', 'partners', 'employees'];
export const regions: Region[] = ['global', 'americas', 'emea', 'apac'];
export const families = data.families as StatementFamily[];
export const versions = data.versions as StatementVersion[];

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

function baseReasons(version: StatementVersion, scope: Scope, date: string): string[] {
  const reasons: string[] = [];
  if (version.status !== 'approved') reasons.push(version.status === 'draft' ? 'Draft wording has not been approved.' : 'This wording has been withdrawn.');
  if (!validDate(date) || !validDate(version.effectiveAt) || !validDate(version.expiresAt) || version.effectiveAt > version.expiresAt) {
    reasons.push('The validity dates cannot be verified.');
  } else {
    if (date < version.effectiveAt) reasons.push(`Not effective until ${version.effectiveAt}.`);
    if (date > version.expiresAt) reasons.push(`Expired on ${version.expiresAt}.`);
  }
  if (!version.audiences.includes(scope.audience)) reasons.push(`Not approved for the ${scope.audience} audience.`);
  if (!version.regions.includes('global') && !version.regions.includes(scope.region)) reasons.push(`Not approved for the ${scope.region} region.`);
  return reasons;
}

/** Follow explicit same-family replacement links, including through expired intermediates. */
function usableReplacement(version: StatementVersion, scope: Scope, allVersions: StatementVersion[], date: string): { replacement?: StatementVersion; cycle: boolean } {
  const visited = new Set([version.id]);
  let cursor = version;
  let replacement: StatementVersion | undefined;
  while (cursor.replacementId) {
    if (visited.has(cursor.replacementId)) return { cycle: true };
    visited.add(cursor.replacementId);
    const next = allVersions.find(item => item.id === cursor.replacementId && item.familyId === version.familyId);
    if (!next) break;
    if (baseReasons(next, scope, date).length === 0) replacement = next;
    cursor = next;
  }
  return { replacement, cycle: false };
}

export function eligibility(version: StatementVersion, scope: Scope, allVersions: StatementVersion[] = versions, date = DEMO_DATE): EligibilityResult {
  const reasons = baseReasons(version, scope, date);
  const { replacement, cycle } = usableReplacement(version, scope, allVersions, date);
  if (cycle) reasons.push('The replacement chain cannot be verified.');
  if (replacement) reasons.push(`Superseded by approved version ${replacement.version}.`);
  return { eligible: reasons.length === 0, reasons, ...(replacement ? { replacement } : {}) };
}

export function selectVersion(familyId: string, scope: Scope, allVersions: StatementVersion[] = versions, date = DEMO_DATE): StatementVersion | undefined {
  const candidates = allVersions.filter(item => item.familyId === familyId).sort((a, b) => b.version - a.version);
  return candidates.find(item => eligibility(item, scope, allVersions, date).eligible) ??
    candidates.find(item => item.status === 'approved') ?? candidates[0];
}
