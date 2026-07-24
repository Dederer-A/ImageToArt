import { createApp } from 'vue'

import i18n from './locales/i18n'; // Import the i18n configuration
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(i18n)
app.mount('#app')
