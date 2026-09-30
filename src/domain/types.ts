export type Audience = 'press' | 'partners' | 'employees';
export type Region = 'global' | 'americas' | 'emea' | 'apac';
export interface Scope {
  audience: Audience;
  region: Region;
}
export interface StatementFamily {
  id: string;
  topic: string;
  title: string;
  description: string;
}
export interface StatementVersion {
  id: string;
  familyId: string;
  version: number;
  text: string;
  status: 'approved' | 'draft' | 'withdrawn';
  audiences: Audience[];
  regions: Region[];
  owner: string;
  approver: string | null;
  approvedAt: string | null;
  effectiveAt: string;
  expiresAt: string;
  replacementId?: string;
}
export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  replacement?: StatementVersion;
}
