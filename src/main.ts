import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import App from './App.vue';
import Workspace from './Workspace.vue';
import '@ionic/vue/css/core.css';
import '@meridian/ui/fonts.css';
import '@meridian/ui/styles.css';
import '@meridian/ui/ionic.css';
import './style.css';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Workspace },
    { path: '/statements/:id', component: Workspace },
    { path: '/requests', component: Workspace },
    { path: '/demo', component: Workspace },
    { path: '/:pathMatch(.*)*', component: Workspace },
  ],
});
createApp(App).use(IonicVue).use(router).mount('#app');
