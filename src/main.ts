import { createApp } from 'vue';

import i18n from './locales/i18n'; // Import the i18n configuration
import './style.css';
import App from './App.vue';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Create Vue Application
const app = createApp(App);

// Register Application State with Persistence
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Configure and Run Vue Application
app.use(pinia);
app.use(i18n);
app.mount('#app');

