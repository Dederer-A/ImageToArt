import { createApp } from 'vue';

import i18n from './locales/i18n'; // Import the i18n configuration
import './style.css';
import App from './App.vue';

import { LayerRegistry } from './layer/LayerRegistry.ts';
import { BlackWhiteLayer } from './layer/impl/BlackWhiteLayer.ts';

// Register all Layer Implementation
const layerRegistry = LayerRegistry.getInstance();
layerRegistry.register(new BlackWhiteLayer());

// Create Vue Application
const app = createApp(App);
app.use(i18n);
app.mount('#app');
