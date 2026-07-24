import { createI18n } from 'vue-i18n';

// 1. Define the interface for our nested locale messages structure
interface LocaleMessages {
  [locale: string]: {
    [fileName: string]: Record<string, any>;
  };
}

// 2. Automatically import all JSON files under the src/locales/ directory
// Use Record<string, any> to type the Vite glob import payload
const modules = import.meta.glob<Record<string, any>>('./**/*.json', { eager: true });

// 3. Initialize messages with the explicit interface type
const messages: LocaleMessages = {};

// 4. Dynamically build the messages object structure
Object.keys(modules).forEach((path) => {
  // Matches './{locale}/{filename}.json' -> e.g., './en/common.json'
  const matched = path.match(/\.\/([\w-]+)\/([\w-]+)\.json$/);
  
  if (matched && matched.length === 3) {
    const locale = matched[1];
    const fileName = matched[2];
    
    // Initialize the locale object if it doesn't exist
    if (!messages[locale]) {
      messages[locale] = {};
    }
    
    // Assign the JSON content under the filename namespace
    messages[locale][fileName] = modules[path].default || modules[path];
  }
});

// 5. Create and export the i18n instance
const i18n = createI18n({
  legacy: false,          // Set to false to use Composition API
  locale: 'en',           // Set default locale
  fallbackLocale: 'en',   // Set fallback locale
  messages,
});

export default i18n;
