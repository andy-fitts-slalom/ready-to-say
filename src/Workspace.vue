<script setup lang="ts">
import { computed, ref, watch, nextTick, useId } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonContent, IonIcon, onIonViewDidEnter } from '@ionic/vue';
import {
  audiences,
  regions,
  families,
  versions,
  DEMO_DATE,
  eligibility,
  selectVersion,
} from './domain/eligibility';
import {
  MeridianBrand,
  MeridianButton,
  MeridianBadge,
  MeridianNotice,
  MeridianField,
  MeridianEmpty,
} from '@meridian/ui/vue';
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  timeOutline,
  arrowForwardOutline,
  arrowBackOutline,
  copyOutline,
  searchOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import type { StatementVersion } from './domain/types';
import { state, persist, reset } from './state';
const route = useRoute();
const router = useRouter();
const pageId = useId();
const mainContent = ref<HTMLElement>();
onIonViewDidEnter(() => {
  document.title = `${family.value?.title || (route.path === '/requests' ? 'Local requests' : route.path === '/demo' ? 'Demo info' : 'Statement library')} · Ready to Say`;
  mainContent.value?.focus({ preventScroll: true });
});
const search = computed({
  get: () => String(route.query.q || ''),
  set: (q) => router.replace({ path: '/', query: { ...route.query, q: q || undefined } }),
});
const topic = computed({
  get: () => String(route.query.topic || ''),
  set: (topic) =>
    router.replace({ path: '/', query: { ...route.query, topic: topic || undefined } }),
});
const detail = computed(() => route.path.startsWith('/statements/'));
const current = computed(() => versions.find((v) => v.id === route.params.id));
const family = computed(() => families.find((f) => f.id === current.value?.familyId));
const verdict = computed(() =>
  current.value ? eligibility(current.value, state.scope) : undefined,
);
const alternative = computed(() => {
  if (!current.value || verdict.value?.eligible || verdict.value?.replacement) return undefined;
  const candidate = selectVersion(current.value.familyId, state.scope);
  return candidate && eligibility(candidate, state.scope).eligible ? candidate : undefined;
});
const siblings = computed(() =>
  versions
    .filter((v) => v.familyId === current.value?.familyId)
    .sort((a, b) => b.version - a.version),
);
const results = computed(() =>
  families
    .filter(
      (f) =>
        (!topic.value || f.topic === topic.value) &&
        `${f.title} ${f.topic} ${versions
          .filter((v) => v.familyId === f.id)
          .map((v) => v.text)
          .join(' ')}`
          .toLowerCase()
          .includes(search.value.toLowerCase()),
    )
    .map((f) => ({ family: f, version: selectVersion(f.id, state.scope) }))
    .filter((item) => item.version),
);
const readyCount = computed(
  () =>
    results.value.filter((item) => item.version && eligibility(item.version, state.scope).eligible)
      .length,
);
const requestHeading = ref<HTMLElement>();
const notice = ref('');
const feedbackKind = ref<'copy' | 'request' | 'reset' | ''>('');
const manual = ref(false);
const manualText = ref<HTMLTextAreaElement>();
const form = ref(false);
const reason = ref('');
const requestTopic = ref('');
const error = ref('');
const confirmingReset = ref(false);
watch(
  () => [route.fullPath, state.scope.audience, state.scope.region],
  () => {
    notice.value = '';
    manual.value = false;
    form.value = false;
    error.value = '';
  },
);
const link = (id: string) => ({ path: `/statements/${id}`, query: route.query });
// Presentation only; eligibility remains the domain authority for every selected scope.
function presentation(v: StatementVersion) {
  const result = eligibility(v, state.scope);
  if (result.eligible)
    return { label: 'Ready to use', tone: 'success' as const, icon: checkmarkCircleOutline };
  if (v.status === 'draft')
    return { label: 'Draft · not approved', tone: 'warning' as const, icon: alertCircleOutline };
  if (v.status === 'withdrawn')
    return { label: 'Withdrawn', tone: 'danger' as const, icon: alertCircleOutline };
  if (v.expiresAt < DEMO_DATE)
    return { label: 'Expired', tone: 'danger' as const, icon: timeOutline };
  if (result.replacement)
    return { label: 'Replaced', tone: 'neutral' as const, icon: arrowForwardOutline };
  if (v.effectiveAt > DEMO_DATE)
    return { label: 'Not yet effective', tone: 'warning' as const, icon: timeOutline };
  return { label: 'Not for this use', tone: 'warning' as const, icon: alertCircleOutline };
}
async function copy() {
  feedbackKind.value = 'copy';
  const version = current.value;
  if (!version || !eligibility(version, state.scope).eligible) {
    notice.value = 'Copy unavailable for this wording and selected use.';
    return;
  }
  try {
    await navigator.clipboard.writeText(version.text);
    notice.value = 'Exact approved wording copied.';
  } catch {
    manual.value = true;
    notice.value =
      'Clipboard access failed. Select the wording below and use your device’s Copy command.';
    await nextTick();
    manualText.value?.focus();
    manualText.value?.select();
  }
}
async function openRequest() {
  requestTopic.value = family.value?.topic || topic.value || families[0]!.topic;
  reason.value = '';
  error.value = '';
  form.value = true;
  await nextTick();
  requestHeading.value?.focus();
  requestHeading.value?.scrollIntoView({ block: 'start' });
}
function saveRequest() {
  feedbackKind.value = 'request';
  if (!reason.value.trim()) {
    error.value = 'Enter a reason for your request.';
    return;
  }
  state.requests.unshift({
    id: crypto.randomUUID(),
    topic: requestTopic.value,
    scope: { ...state.scope },
    reason: reason.value.trim(),
    createdAt: new Date().toISOString(),
  });
  const saved = persist();
  form.value = false;
  notice.value = saved
    ? 'Demo request saved in this browser. No one was notified.'
    : 'Demo request added for this session only. No one was notified.';
}
function doReset() {
  feedbackKind.value = 'reset';
  reset();
  confirmingReset.value = false;
  notice.value = 'Demo reset. Preferences and local requests restored to their starting state.';
}
</script>
<template>
  <IonPage>
    <IonContent role="presentation">
      <div class="shell ms-shell">
        <a :href="`#main-${pageId}`" class="skip ms-skip">Skip to content</a>
        <header class="header">
          <RouterLink to="/" class="brand-link"
            ><MeridianBrand product="Ready to Say"
          /></RouterLink>
          <MeridianBadge tone="neutral" class="demo-tag">Fictional demo</MeridianBadge>
        </header>
        <nav class="nav ms-tabs" aria-label="Main">
          <RouterLink to="/" :aria-current="route.path === '/' ? 'page' : undefined"
            >Statement library</RouterLink
          >
          <RouterLink to="/requests" :aria-current="route.path === '/requests' ? 'page' : undefined"
            >Local requests
            <MeridianBadge v-if="state.requests.length">{{
              state.requests.length
            }}</MeridianBadge></RouterLink
          >
          <RouterLink to="/demo" :aria-current="route.path === '/demo' ? 'page' : undefined"
            >Demo info</RouterLink
          >
        </nav>
        <main :id="`main-${pageId}`" ref="mainContent" tabindex="-1">
          <MeridianNotice
            v-if="state.storageError"
            title="Local storage"
            tone="warning"
            announcement="assertive"
            class="storage-notice"
            >{{ state.storageError }}</MeridianNotice
          >
          <section
            v-if="route.path === '/' || detail || route.path === '/requests'"
            class="scope ms-surface"
            aria-label="Intended use"
          >
            <div class="scope-intro">
              <span class="ms-eyebrow">Your intended use</span><span>Check wording for</span>
            </div>
            <MeridianField label="Audience" v-slot="field">
              <select
                v-model="state.scope.audience"
                class="ms-input"
                :id="field.id"
                :aria-describedby="field.describedby"
                :aria-invalid="field.invalid"
                :required="field.required"
              >
                <option v-for="a in audiences" :key="a" :value="a">{{ a }}</option>
              </select>
            </MeridianField>
            <MeridianField
              label="Region"
              :hint="state.scope.region === 'global' ? 'Global covers all regions.' : undefined"
              v-slot="field"
            >
              <select
                v-model="state.scope.region"
                class="ms-input"
                :id="field.id"
                :aria-describedby="field.describedby"
                :aria-invalid="field.invalid"
                :required="field.required"
              >
                <option v-for="r in regions" :key="r" :value="r">
                  {{ r === 'global' ? 'Global' : r.toUpperCase() }}
                </option>
              </select>
            </MeridianField>
          </section>
          <template v-if="route.path === '/'">
            <section class="intro">
              <span class="ms-eyebrow">The statement library</span>
              <h1 class="ms-display">The right words.<br /><em>Ready when you are.</em></h1>
              <p class="ms-muted">
                Find a statement. Check its permitted use.<br />Copy with confidence.
              </p>
            </section>
            <MeridianField label="Search statements" :id="`search-${pageId}`" v-slot="field">
              <div class="search-wrap">
                <IonIcon :icon="searchOutline" aria-hidden="true" /><input
                  v-model="search"
                  type="search"
                  class="ms-input"
                  :id="field.id"
                  :aria-describedby="field.describedby"
                  :aria-invalid="field.invalid"
                  :required="field.required"
                  placeholder="Search a topic, title or phrase…"
                />
              </div>
            </MeridianField>
            <div class="filter-row">
              <MeridianField label="Topic" v-slot="field"
                ><select
                  v-model="topic"
                  class="ms-input"
                  :id="field.id"
                  :aria-describedby="field.describedby"
                  :aria-invalid="field.invalid"
                  :required="field.required"
                >
                  <option value="">All topics</option>
                  <option v-for="f in families" :key="f.id" :value="f.topic">{{ f.topic }}</option>
                </select></MeridianField
              >
              <p class="result-count ms-muted">
                <strong>{{ readyCount }} ready for your use</strong
                ><span
                  >{{ results.length }} statements · {{ state.scope.audience }} ·
                  {{ state.scope.region }}</span
                >
              </p>
            </div>
            <MeridianEmpty
              v-if="!results.length"
              title="No matching statements"
              description="Try a broader phrase or clear your search and topic filter."
              ><MeridianButton variant="secondary" @click="router.replace('/')"
                >Clear filters</MeridianButton
              ><MeridianButton variant="quiet" @click="openRequest"
                >Request wording</MeridianButton
              ></MeridianEmpty
            >
            <div class="cards">
              <RouterLink
                v-for="item in results"
                :key="item.family.id"
                :to="link(item.version!.id)"
                class="card ms-surface"
              >
                <div class="card-top">
                  <span class="ms-eyebrow">{{ item.family.topic }}</span
                  ><MeridianBadge :tone="presentation(item.version!).tone"
                    ><IonIcon :icon="presentation(item.version!).icon" aria-hidden="true" />{{
                      presentation(item.version!).label
                    }}</MeridianBadge
                  >
                </div>
                <h2>{{ item.family.title }}</h2>
                <p class="ms-muted">{{ item.family.description }}</p>
                <div class="card-bottom">
                  <span
                    >Version {{ item.version!.version }} · {{ item.version!.regions.join(', ') }} ·
                    {{ item.version!.audiences.join(', ') }}</span
                  ><IonIcon :icon="arrowForwardOutline" aria-hidden="true" />
                </div>
              </RouterLink>
            </div>
            <aside class="footnote ms-muted">
              <IonIcon :icon="shieldCheckmarkOutline" aria-hidden="true" />Approval is specific to
              your audience and region. Always check the details before sharing.
            </aside>
          </template>
          <template v-else-if="detail && current && family">
            <RouterLink
              class="back ms-button ms-button--quiet"
              :to="{ path: '/', query: route.query }"
              ><IonIcon :icon="arrowBackOutline" aria-hidden="true" />Back to library</RouterLink
            >
            <div class="detail-heading">
              <span class="ms-eyebrow">{{ family.topic }}</span>
              <h1 class="ms-display">{{ family.title }}</h1>
              <p class="ms-muted">{{ family.description }}</p>
            </div>
            <div class="detail-grid">
              <section class="wording-panel ms-surface" aria-label="Statement wording">
                <div class="card-top">
                  <span class="ms-eyebrow">Exact statement · V{{ current.version }}</span
                  ><MeridianBadge :tone="presentation(current).tone"
                    ><IonIcon :icon="presentation(current).icon" aria-hidden="true" />{{
                      presentation(current).label
                    }}</MeridianBadge
                  >
                </div>
                <blockquote class="ms-quote">{{ current.text }}</blockquote>
                <div class="conditions">
                  <strong>Permitted use</strong>
                  <p>
                    Audience: {{ current.audiences.join(', ') }}<br />Regions:
                    {{ current.regions.join(', ') }}
                  </p>
                  <p v-if="current.regions.includes('global')">
                    Global wording can be used in each listed audience across all regions.
                  </p>
                </div>
                <MeridianNotice
                  v-if="!verdict?.eligible"
                  title="Copy unavailable"
                  :tone="presentation(current).tone"
                  class="alert"
                >
                  <ul>
                    <li v-for="r in verdict?.reasons" :key="r">{{ r }}</li>
                  </ul>
                  <template #actions>
                    <RouterLink
                      v-if="verdict?.replacement"
                      class="ms-button ms-button--secondary"
                      :to="link(verdict.replacement.id)"
                      >Open approved replacement<IonIcon
                        :icon="arrowForwardOutline"
                        aria-hidden="true"
                    /></RouterLink>
                    <RouterLink
                      v-else-if="alternative"
                      class="ms-button ms-button--secondary"
                      :to="link(alternative.id)"
                      >Open current approved wording<IonIcon
                        :icon="arrowForwardOutline"
                        aria-hidden="true"
                    /></RouterLink>
                    <MeridianButton variant="quiet" @click="openRequest"
                      >Request updated wording</MeridianButton
                    >
                  </template>
                </MeridianNotice>
                <MeridianField
                  v-if="manual && verdict?.eligible"
                  label="Select and copy exact wording"
                  :id="`manual-${pageId}`"
                  hint="The text is unchanged. Use your device’s Copy command."
                  class="manual"
                  v-slot="field"
                >
                  <textarea
                    ref="manualText"
                    readonly
                    :value="current.text"
                    class="ms-input"
                    :id="field.id"
                    :aria-describedby="field.describedby"
                    :aria-invalid="field.invalid"
                    :required="field.required"
                    @focus="($event.target as HTMLTextAreaElement).select()"
                  />
                </MeridianField>
                <div class="copy-bar ms-action-bar" :class="{ 'is-static': manual || form }">
                  <MeridianButton :disabled="!verdict?.eligible" @click="copy"
                    >{{ verdict?.eligible ? 'Copy exact wording' : 'Copy unavailable'
                    }}<IonIcon :icon="copyOutline" aria-hidden="true"
                  /></MeridianButton>
                  <small class="ms-muted">Approval checked against the fixed demo date.</small>
                  <MeridianNotice
                    v-if="notice && feedbackKind === 'copy'"
                    :title="notice"
                    tone="info"
                    aria-hidden="true"
                    class="notice"
                  />
                </div>
              </section>
              <aside class="metadata ms-surface">
                <h2>Approval record</h2>
                <dl>
                  <dt>Status</dt>
                  <dd>{{ current.status }}</dd>
                  <dt>Owner</dt>
                  <dd>{{ current.owner }}</dd>
                  <dt>Approved by</dt>
                  <dd>{{ current.approver || 'Not approved' }}</dd>
                  <dt>Approval date</dt>
                  <dd>{{ current.approvedAt || 'Not approved' }}</dd>
                  <dt>Effective from</dt>
                  <dd>{{ current.effectiveAt }}</dd>
                  <dt>Valid through</dt>
                  <dd>{{ current.expiresAt }}</dd>
                </dl>
                <MeridianField label="View version" v-slot="field"
                  ><select
                    :value="current.id"
                    class="ms-input"
                    :id="field.id"
                    :aria-describedby="field.describedby"
                    :aria-invalid="field.invalid"
                    :required="field.required"
                    @change="router.push(link(($event.target as HTMLSelectElement).value))"
                  >
                    <option v-for="v in siblings" :key="v.id" :value="v.id">
                      Version {{ v.version }} · {{ presentation(v).label }}
                    </option>
                  </select></MeridianField
                >
                <p class="version-help ms-muted">
                  A draft does not replace usable approved wording.
                </p>
              </aside>
            </div>
          </template>
          <template v-else-if="route.path === '/requests'">
            <section class="intro">
              <span class="ms-eyebrow">Browser-local demonstration</span>
              <h1 class="ms-display">Your requests</h1>
              <p class="ms-muted">
                Saved here, on this device. No messages are sent and no one is notified.
              </p>
              <MeridianButton @click="openRequest">Request wording</MeridianButton>
            </section>
            <MeridianEmpty
              v-if="!state.requests.length"
              title="No local requests yet"
              description="When approved wording is unavailable, save a request to keep track of what you need."
            />
            <article v-for="r in state.requests" :key="r.id" class="request-card ms-surface">
              <MeridianBadge tone="info">Saved locally · demo</MeridianBadge>
              <h2>{{ r.topic }}</h2>
              <p>{{ r.reason }}</p>
              <small class="ms-muted"
                >{{ r.scope.audience }} · {{ r.scope.region }} ·
                {{ new Date(r.createdAt).toLocaleDateString() }}</small
              >
            </article>
          </template>
          <template v-else-if="route.path === '/demo'">
            <section class="intro">
              <span class="ms-eyebrow">A fictional working prototype</span>
              <h1 class="ms-display">About this demo</h1>
              <p class="ms-muted">Clear wording. Deliberate boundaries.</p>
            </section>
            <section class="info-panel ms-surface">
              <h2>Fixed demonstration date</h2>
              <p>
                <strong>{{ DEMO_DATE }}</strong> · Validity is evaluated on this date, including the
                final day. Your real device date does not expire the sample statements.
              </p>
              <h2>Entirely fictional</h2>
              <p>
                Meridian Signal Group, its people, statements and approval records are invented.
                These rules demonstrate a workflow; they are not authentication or access control.
              </p>
              <h2>Only in this browser</h2>
              <p>
                Preferences and update requests use browser storage. They do not synchronize across
                people or devices. Requests never notify an owner. Clearing browser data removes
                them.
              </p>
              <h2>Start fresh</h2>
              <p>
                Reset removes this demo’s local requests and restores Press / Global. The statement
                library always uses the original seed data.
              </p>
              <MeridianButton variant="secondary" @click="confirmingReset = true"
                >Reset demo</MeridianButton
              >
              <MeridianNotice
                v-if="confirmingReset"
                title="Reset local demo data?"
                tone="warning"
                class="reset-confirmation"
                ><p>Remove all local demo requests and restore preferences?</p>
                <template #actions
                  ><MeridianButton variant="danger" @click="doReset">Yes, reset demo</MeridianButton
                  ><MeridianButton variant="quiet" @click="confirmingReset = false"
                    >Cancel</MeridianButton
                  ></template
                ></MeridianNotice
              >
            </section>
          </template>
          <section v-else class="invalid-route">
            <h1 class="ms-title">Statement unavailable</h1>
            <MeridianEmpty
              title="This link has no matching statement"
              description="This link does not match a statement in the demo library."
              ><RouterLink class="ms-button ms-button--primary" to="/"
                >Return to library</RouterLink
              ></MeridianEmpty
            >
          </section>
          <section
            v-if="form"
            class="request-form ms-surface"
            :aria-labelledby="`request-heading-${pageId}`"
          >
            <h2 :id="`request-heading-${pageId}`" ref="requestHeading" tabindex="-1">
              Request updated wording
            </h2>
            <p>Local demo only. No one will be notified.</p>
            <form @submit.prevent="saveRequest" novalidate>
              <MeridianField label="Topic" v-slot="field"
                ><select
                  v-model="requestTopic"
                  class="ms-input"
                  :id="field.id"
                  :aria-describedby="field.describedby"
                  :aria-invalid="field.invalid"
                  :required="field.required"
                >
                  <option v-for="f in families" :key="f.id">{{ f.topic }}</option>
                </select></MeridianField
              >
              <p>
                Requested use:
                <strong>{{ state.scope.audience }} · {{ state.scope.region }}</strong>
              </p>
              <MeridianField
                label="Reason"
                :id="`reason-${pageId}`"
                :error="error"
                required
                :role="error ? 'alert' : undefined"
                v-slot="field"
              >
                <textarea
                  v-model="reason"
                  maxlength="1000"
                  class="ms-input"
                  :id="field.id"
                  :aria-describedby="field.describedby"
                  :aria-invalid="field.invalid"
                  :required="field.required"
                  placeholder="What wording do you need, and why?"
                />
              </MeridianField>
              <div class="form-actions">
                <MeridianButton type="submit">Save local request</MeridianButton
                ><MeridianButton variant="quiet" @click="form = false">Cancel</MeridianButton>
              </div>
            </form>
          </section>
          <div role="status" aria-live="polite" class="ms-sr-only">{{ notice }}</div>
          <MeridianNotice
            v-if="notice && feedbackKind !== 'copy'"
            :title="notice"
            tone="info"
            aria-hidden="true"
            class="notice result-notice"
          />
        </main>
        <footer>
          <span>Meridian Signal Group</span><span>Fictional content. Real clarity.</span>
        </footer>
      </div>
    </IonContent>
  </IonPage>
</template>
