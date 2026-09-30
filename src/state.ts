import { reactive, watch } from 'vue';
import type { Scope } from './domain/types';
import { audiences, regions } from './domain/eligibility';
export interface LocalRequest {
  id: string;
  topic: string;
  scope: Scope;
  reason: string;
  createdAt: string;
}
const key = 'ready-to-say-v1';
export const state = reactive({
  scope: { audience: 'press', region: 'global' } as Scope,
  requests: [] as LocalRequest[],
  storageError: '',
});
try {
  const raw = localStorage.getItem(key);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (
      !audiences.includes(parsed.scope?.audience) ||
      !regions.includes(parsed.scope?.region) ||
      !Array.isArray(parsed.requests) ||
      !parsed.requests.every(
        (r: LocalRequest) =>
          typeof r.id === 'string' &&
          typeof r.topic === 'string' &&
          typeof r.reason === 'string' &&
          typeof r.createdAt === 'string' &&
          audiences.includes(r.scope?.audience) &&
          regions.includes(r.scope?.region),
      )
    )
      throw new Error('Invalid data');
    state.scope = parsed.scope;
    state.requests = parsed.requests;
  }
} catch {
  state.storageError =
    'Saved data could not be loaded. This session still works; use Reset in Demo info to restore local data.';
}
export function persist() {
  try {
    localStorage.setItem(key, JSON.stringify({ scope: state.scope, requests: state.requests }));
    state.storageError = '';
    return true;
  } catch {
    state.storageError =
      'Browser storage is unavailable. Changes remain in this session only and may be lost on reload.';
    return false;
  }
}
watch(() => state.scope, persist, { deep: true });
export function reset() {
  state.scope = { audience: 'press', region: 'global' };
  state.requests = [];
  persist();
}
