<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';
import { audiences, regions, families, versions, DEMO_DATE, eligibility, selectVersion } from './domain/eligibility';
import { state, persist, reset } from './state';
const route = useRoute(); const router = useRouter();
const search = computed({ get: () => String(route.query.q || ''), set: q => router.replace({ path: '/', query: q ? { q } : {} }) });
const topic = computed({ get: () => String(route.query.topic || ''), set: topic => router.replace({ path: '/', query: { ...route.query, topic: topic || undefined } }) });
const detail = computed(() => route.path.startsWith('/statements/'));
const current = computed(() => versions.find(v => v.id === route.params.id));
const family = computed(() => families.find(f => f.id === current.value?.familyId));
const verdict = computed(() => current.value ? eligibility(current.value, state.scope) : undefined);
const siblings = computed(() => versions.filter(v => v.familyId === current.value?.familyId).sort((a,b) => b.version-a.version));
const results = computed(() => families.filter(f => (!topic.value || f.topic === topic.value) && `${f.title} ${f.topic} ${versions.filter(v => v.familyId === f.id).map(v => v.text).join(' ')}`.toLowerCase().includes(search.value.toLowerCase())).map(f => ({ family: f, version: selectVersion(f.id, state.scope) })).filter(item => item.version));
const readyCount = computed(() => results.value.filter(item => item.version && eligibility(item.version,state.scope).eligible).length);
const notice = ref(''); const manual = ref(false); const manualText = ref<HTMLTextAreaElement>(); const form = ref(false); const reason = ref(''); const requestTopic = ref(''); const error = ref(''); const confirmingReset = ref(false);
watch(() => [route.fullPath, state.scope.audience, state.scope.region], () => { notice.value='';manual.value=false;form.value=false;error.value=''; });
const link = (id: string) => ({ path: `/statements/${id}`, query: route.query });
function status(id: string) { const v=versions.find(v=>v.id===id)!; return eligibility(v,state.scope).eligible ? 'Ready to use' : v.status === 'draft' ? 'Draft · not approved' : v.status === 'withdrawn' ? 'Withdrawn' : v.expiresAt < DEMO_DATE ? 'Expired' : eligibility(v,state.scope).replacement ? 'Replaced' : 'Not for this use'; }
async function copy() {
  const version=current.value;
  if (!version || !eligibility(version,state.scope).eligible) { notice.value='Copy unavailable for this wording and selected use.';return; }
  try { await navigator.clipboard.writeText(version.text); notice.value='Exact approved wording copied.'; }
  catch { manual.value=true;notice.value='Clipboard access failed. Select the wording below and use your device’s Copy command.';await nextTick();manualText.value?.focus();manualText.value?.select(); }
}
function openRequest() { requestTopic.value=family.value?.topic || topic.value || families[0]!.topic;reason.value='';form.value=true; }
function saveRequest() {
  if (!reason.value.trim()) { error.value='Enter a reason for your request.';return; }
  state.requests.unshift({ id: crypto.randomUUID(), topic: requestTopic.value, scope: { ...state.scope }, reason: reason.value.trim(), createdAt: new Date().toISOString() });
  const saved=persist();form.value=false;notice.value=saved ? 'Demo request saved in this browser. No one was notified.' : 'Demo request added for this session only. No one was notified.';
}
function doReset() { reset();confirmingReset.value=false;notice.value='Demo reset. Preferences and local requests restored to their starting state.'; }
</script>
<template>
<IonPage><IonContent><div class="shell">
  <a href="#main" class="skip">Skip to content</a>
  <header class="header"><RouterLink to="/" class="brand"><span class="brand-icon" aria-hidden="true">“</span><span>Ready to Say<small>MERIDIAN SIGNAL GROUP</small></span></RouterLink><span class="demo-tag">FICTIONAL DEMO</span></header>
  <nav class="nav" aria-label="Main"><RouterLink to="/" :aria-current="route.path==='/'?'page':undefined">Statement library</RouterLink><RouterLink to="/requests" :aria-current="route.path==='/requests'?'page':undefined">Local requests <span v-if="state.requests.length">{{ state.requests.length }}</span></RouterLink><RouterLink to="/demo" :aria-current="route.path==='/demo'?'page':undefined">Demo info</RouterLink></nav>
  <main id="main" tabindex="-1">
    <div v-if="state.storageError" class="alert" role="alert">{{ state.storageError }}</div>
    <section v-if="route.path==='/' || detail" class="scope" aria-label="Intended use"><div class="scope-intro"><span class="eyebrow">YOUR INTENDED USE</span><span>Check wording for</span></div><label>Audience<select v-model="state.scope.audience"><option v-for="a in audiences" :key="a" :value="a">{{ a }}</option></select></label><label>Region<select v-model="state.scope.region"><option v-for="r in regions" :key="r" :value="r">{{ r === 'global' ? 'Global / all regions' : r.toUpperCase() }}</option></select></label></section>
    <template v-if="route.path==='/'">
      <section class="intro"><span class="eyebrow">THE STATEMENT LIBRARY</span><h1>The right words.<br><em>Ready when you are.</em></h1><p>Find a statement. Check its permitted use.<br>Copy with confidence.</p></section>
      <div class="search-wrap"><span aria-hidden="true">⌕</span><input v-model="search" aria-label="Search statements" type="search" placeholder="Search a topic, title or phrase…"><kbd aria-hidden="true">SEARCH</kbd></div>
      <div class="filter-row"><label>Topic<select v-model="topic"><option value="">All topics</option><option v-for="f in families" :key="f.id" :value="f.topic">{{ f.topic }}</option></select></label><span>{{ results.length }} statements <span aria-hidden="true">·</span> {{ readyCount }} ready for your use</span></div>
      <div v-if="!results.length" class="empty"><span class="empty-icon" aria-hidden="true">⌕</span><h2>No matching statements</h2><p>Try a broader phrase or clear your search and topic filter.</p><button class="secondary" @click="router.replace('/')">Clear filters</button><button class="text-button" @click="openRequest">Request wording</button></div>
      <div class="cards"><RouterLink v-for="item in results" :key="item.family.id" :to="link(item.version!.id)" class="card"><div class="card-top"><span class="eyebrow">{{ item.family.topic }}</span><span class="badge" :class="{ready: eligibility(item.version!,state.scope).eligible}"><span aria-hidden="true">{{ eligibility(item.version!,state.scope).eligible ? '✓' : '!' }}</span> {{ status(item.version!.id) }}</span></div><h2>{{ item.family.title }}</h2><p>{{ item.family.description }}</p><div class="card-bottom"><span>Version {{ item.version!.version }} <span aria-hidden="true">·</span> {{ item.version!.regions.join(', ') }}</span><span class="arrow" aria-hidden="true">↗</span></div></RouterLink></div>
      <aside class="footnote"><span aria-hidden="true">◈</span> Approval is specific to your audience and region. Always check the details before sharing.</aside>
    </template>
    <template v-else-if="detail && current && family">
      <RouterLink class="back" :to="{path:'/',query:route.query}">← Back to library</RouterLink>
      <div class="detail-heading"><span class="eyebrow">{{ family.topic }}</span><h1>{{ family.title }}</h1><p>{{ family.description }}</p></div>
      <div class="detail-grid"><section class="wording-panel"><div class="card-top"><span class="eyebrow">EXACT STATEMENT · V{{ current.version }}</span><span class="badge" :class="{ready:verdict?.eligible}">{{ verdict?.eligible?'✓ ': '! ' }}{{ status(current.id) }}</span></div><blockquote>{{ current.text }}</blockquote><div class="conditions"><strong>Permitted use</strong><p>Audience: {{ current.audiences.join(', ') }}<br>Regions: {{ current.regions.join(', ') }}</p><p v-if="current.regions.includes('global')">Global wording can be used in each listed audience across all regions.</p></div>
      <div v-if="!verdict?.eligible" class="alert"><strong>Copy unavailable</strong><ul><li v-for="r in verdict?.reasons" :key="r">{{ r }}</li></ul><RouterLink v-if="verdict?.replacement" :to="link(verdict.replacement.id)">Open approved replacement →</RouterLink><button class="text-button" @click="openRequest">Request updated wording</button></div>
      <div v-if="manual && verdict?.eligible" class="manual"><label for="manual-text">Select and copy exact wording</label><textarea id="manual-text" ref="manualText" readonly :value="current.text" @focus="($event.target as HTMLTextAreaElement).select()" /></div>
      <div class="copy-bar"><button class="primary" :disabled="!verdict?.eligible" @click="copy">{{ verdict?.eligible ? 'Copy exact wording' : 'Copy unavailable' }} <span aria-hidden="true">▣</span></button><small>Approval checked against the fixed demo date.</small></div></section>
      <aside class="metadata"><h2>Approval record</h2><dl><dt>Status</dt><dd>{{ current.status }}</dd><dt>Owner</dt><dd>{{ current.owner }}</dd><dt>Approved by</dt><dd>{{ current.approver || 'Not approved' }}</dd><dt>Approval date</dt><dd>{{ current.approvedAt || 'Not approved' }}</dd><dt>Effective from</dt><dd>{{ current.effectiveAt }}</dd><dt>Valid through</dt><dd>{{ current.expiresAt }}</dd></dl><label>View version<select :value="current.id" @change="router.push(link(($event.target as HTMLSelectElement).value))"><option v-for="v in siblings" :key="v.id" :value="v.id">Version {{ v.version }} · {{ status(v.id) }}</option></select></label><p class="muted">A draft does not replace usable approved wording.</p></aside></div>
    </template>
    <template v-else-if="route.path==='/requests'"><section class="intro"><span class="eyebrow">BROWSER-LOCAL DEMONSTRATION</span><h1>Your requests</h1><p>Saved here, on this device. No messages are sent and no one is notified.</p><button class="primary" @click="openRequest">Request wording</button></section><div v-if="!state.requests.length" class="empty"><h2>No local requests yet</h2><p>When approved wording is unavailable, save a request to keep track of what you need.</p></div><article v-for="r in state.requests" :key="r.id" class="request-card"><span class="badge">Saved locally · demo</span><h2>{{ r.topic }}</h2><p>{{ r.reason }}</p><small>{{ r.scope.audience }} · {{ r.scope.region }} · {{ new Date(r.createdAt).toLocaleDateString() }}</small></article></template>
    <template v-else-if="route.path==='/demo'"><section class="intro"><span class="eyebrow">A FICTIONAL WORKING PROTOTYPE</span><h1>About this demo</h1><p>Clear wording. Deliberate boundaries.</p></section><section class="info-panel"><h2>Fixed demonstration date</h2><p><strong>{{ DEMO_DATE }}</strong> · Validity is evaluated on this date, including the final day. Your real device date does not expire the sample statements.</p><h2>Entirely fictional</h2><p>Meridian Signal Group, its people, statements and approval records are invented. These rules demonstrate a workflow; they are not authentication or access control.</p><h2>Only in this browser</h2><p>Preferences and update requests use browser storage. They do not synchronize across people or devices. Requests never notify an owner. Clearing browser data removes them.</p><h2>Start fresh</h2><p>Reset removes this demo’s local requests and restores Press / Global. The statement library always uses the original seed data.</p><button class="secondary" @click="confirmingReset=true">Reset demo</button><div v-if="confirmingReset" class="alert"><p>Remove all local demo requests and restore preferences?</p><button class="primary" @click="doReset">Yes, reset demo</button><button class="text-button" @click="confirmingReset=false">Cancel</button></div></section></template>
    <section v-else class="empty"><h1>Statement unavailable</h1><p>This link does not match a statement in the demo library.</p><RouterLink class="primary" to="/">Return to library</RouterLink></section>
    <section v-if="form" class="request-form" aria-labelledby="request-heading"><h2 id="request-heading">Request updated wording</h2><p>Local demo only. No one will be notified.</p><form @submit.prevent="saveRequest" novalidate><label>Topic<select v-model="requestTopic"><option v-for="f in families" :key="f.id">{{ f.topic }}</option></select></label><p>Requested use: <strong>{{ state.scope.audience }} · {{ state.scope.region }}</strong></p><label for="reason">Reason <span>(required)</span></label><textarea id="reason" v-model="reason" maxlength="1000" :aria-invalid="!!error" :aria-describedby="error?'request-error':undefined" placeholder="What wording do you need, and why?"/><p v-if="error" id="request-error" role="alert">{{ error }}</p><button type="submit" class="primary">Save local request</button><button type="button" class="text-button" @click="form=false">Cancel</button></form></section>
    <div class="notice" role="status" aria-live="polite" :class="{visible:notice}">{{ notice }}</div>
  </main><footer>MERIDIAN SIGNAL GROUP <span>Fictional content. Real clarity.</span></footer>
</div></IonContent></IonPage>
</template>
