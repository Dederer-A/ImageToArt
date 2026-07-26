import { createApp } from 'vue';

import i18n from './locales/i18n'; // Import the i18n configuration
import './style.css';
import App from './App.vue';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { LayerRegistry } from './layer/LayerRegistry.ts';
import { BlackWhiteLayer } from './layer/impl/BlackWhiteLayer.ts';
import { PosterizeLayer } from './layer/impl/Posterize.ts';
import { BlurLayer } from './layer/impl/Blur.ts';

// Create Vue Application
const app = createApp(App);

// Register Application State with Persistence
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Register all Layer Implementation
const layerRegistry = LayerRegistry.getInstance();
layerRegistry.register(new BlackWhiteLayer());
layerRegistry.register(new PosterizeLayer());
layerRegistry.register(new BlurLayer());

// Configure and Run Vue Application
app.use(pinia);
app.use(i18n);
app.mount('#app');
