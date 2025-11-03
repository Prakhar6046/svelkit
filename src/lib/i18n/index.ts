import { init, register, locale, isLoading } from 'svelte-i18n';
const browser = typeof window !== 'undefined';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
register('en', () => Promise.resolve(en));
// register('es', () => Promise.resolve(es));
register('fr', () => Promise.resolve(fr));

function detectBrowserLanguage(): string {
  if (!browser) return 'en';

  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const langCode = browserLang.split('-')[0];

  const supportedLanguages = ['en', 'fr'];
  return supportedLanguages.includes(langCode) ? langCode : 'en';
}

const initialLocale = detectBrowserLanguage();

init({
  fallbackLocale: 'en',
  initialLocale: initialLocale,
  loadingDelay: 0,
  warnOnMissingMessages: false,
  handleMissingMessage: ({ locale, id, defaultValue }) => {
    return defaultValue || id;
  },
});

locale.set(initialLocale);

export function isI18nReady(): boolean {
  return !isLoading;
}

export { detectBrowserLanguage, isLoading };
