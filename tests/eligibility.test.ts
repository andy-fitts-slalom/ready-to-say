import { describe, expect, it } from 'vitest';
import { audiences, DEMO_DATE, eligibility, families, regions, selectVersion, versions } from '../src/domain/eligibility';
import type { Scope, StatementVersion } from '../src/domain/types';

const scope: Scope = { audience: 'press', region: 'global' };
const current = versions.find(version => version.id === 'company-v2')!;
const makeVersion = (changes: Partial<StatementVersion> = {}): StatementVersion => ({ ...current, ...changes });

describe('approval and calendar boundaries', () => {
  it('uses a stable demo date and inclusive effective/expiry dates', () => {
    expect(DEMO_DATE).toBe('2025-10-21');
    expect(eligibility(current, scope, [], current.effectiveAt).eligible).toBe(true);
    expect(eligibility(current, scope, [], current.expiresAt).eligible).toBe(true);
    expect(eligibility(current, scope, [], '2025-08-31').eligible).toBe(false);
    expect(eligibility(current, scope, [], '2026-04-01').eligible).toBe(false);
  });
  it.each(['draft', 'withdrawn'] as const)('blocks %s even with otherwise valid conditions', status => {
    expect(eligibility(makeVersion({ status }), scope).eligible).toBe(false);
  });
  it.each(['bad-date', '2025-02-30'])('fails closed on invalid date %s', expiresAt => {
    expect(eligibility(makeVersion({ expiresAt }), scope).eligible).toBe(false);
  });
  it('blocks reversed validity intervals', () => {
    expect(eligibility(makeVersion({ effectiveAt: '2026-01-01', expiresAt: '2025-01-01' }), scope).eligible).toBe(false);
  });
});

describe('audience and region restrictions', () => {
  it('never broadens a restricted audience', () => {
    const restricted = makeVersion({ audiences: ['employees'] });
    expect(eligibility(restricted, scope).eligible).toBe(false);
    expect(eligibility(restricted, { ...scope, audience: 'employees' }).eligible).toBe(true);
  });
  it('allows global wording in a specific region', () => {
    for (const region of regions) expect(eligibility(current, { ...scope, region }).eligible).toBe(true);
  });
  it('never treats a regional approval as worldwide approval', () => {
    const restricted = makeVersion({ regions: ['emea'] });
    expect(eligibility(restricted, { ...scope, region: 'emea' }).eligible).toBe(true);
    expect(eligibility(restricted, scope).eligible).toBe(false);
    expect(eligibility(restricted, { ...scope, region: 'apac' }).eligible).toBe(false);
  });
});

describe('replacement and version selection', () => {
  it('keeps approved wording visible alongside a newer draft', () => {
    expect(selectVersion('company', scope)?.id).toBe('company-v2');
  });
  it('keeps approved wording visible before a future version takes effect', () => {
    expect(selectVersion('podcasts', scope)?.id).toBe('podcasts-v2');
  });
  it('blocks superseded wording and returns the usable replacement', () => {
    const old = versions.find(version => version.id === 'company-v1')!;
    expect(eligibility(old, scope)).toMatchObject({ eligible: false, replacement: { id: 'company-v2' } });
  });
  it('only supersedes when the replacement is valid for the selected context', () => {
    const old = makeVersion({ id: 'old', replacementId: 'new' });
    const next = makeVersion({ id: 'new', version: 3, audiences: ['employees'] });
    expect(eligibility(old, scope, [old, next]).eligible).toBe(true);
    expect(eligibility(old, { ...scope, audience: 'employees' }, [old, next]).eligible).toBe(false);
  });
  it('finds a usable replacement beyond an expired intermediate version', () => {
    const first = makeVersion({ id: 'first', replacementId: 'second' });
    const second = makeVersion({ id: 'second', expiresAt: '2025-01-01', replacementId: 'third' });
    const third = makeVersion({ id: 'third', version: 4 });
    expect(eligibility(first, scope, [first, second, third]).replacement?.id).toBe('third');
  });
  it('fails closed safely on cyclic replacement links', () => {
    const first = makeVersion({ id: 'first', replacementId: 'second' });
    const second = makeVersion({ id: 'second', replacementId: 'first' });
    expect(eligibility(first, scope, [first, second])).toMatchObject({ eligible: false, reasons: ['The replacement chain cannot be verified.'] });
  });
  it('does not follow replacement links into unrelated families', () => {
    const first = makeVersion({ id: 'first', replacementId: 'second' });
    const second = makeVersion({ id: 'second', familyId: 'unrelated' });
    expect(eligibility(first, scope, [first, second]).replacement).toBeUndefined();
  });
  it('returns unavailable approved wording for recovery when no version is usable', () => {
    const selected = selectVersion('streaming', scope)!;
    expect(selected.id).toBe('streaming-v2');
    expect(eligibility(selected, scope).eligible).toBe(false);
    expect(selectVersion('missing', scope)).toBeUndefined();
  });
});

describe('fictional seed integrity', () => {
  it('provides eight families and 24 distinct version records with valid references', () => {
    expect(families).toHaveLength(8);
    expect(versions).toHaveLength(24);
    expect(new Set(versions.map(version => version.id)).size).toBe(24);
    for (const version of versions) {
      expect(families.some(family => family.id === version.familyId)).toBe(true);
      expect(version.text.trim()).toBe(version.text);
      expect(version.audiences.every(audience => audiences.includes(audience))).toBe(true);
      expect(version.regions.every(region => regions.includes(region))).toBe(true);
      if (version.replacementId) expect(versions.some(next => next.id === version.replacementId && next.familyId === version.familyId)).toBe(true);
    }
  });
});
