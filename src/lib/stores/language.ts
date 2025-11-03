import { writable } from 'svelte/store';
import { locale } from 'svelte-i18n';
import { detectBrowserLanguage } from '../i18n/index.js';

// Language store
export const languageStore = writable({
  current: detectBrowserLanguage(),
  available: [
    { code: 'en', name: 'En', flag: '🇺🇸' },
    // { code: 'es', name: 'Es', flag: '🇪🇸' },
    { code: 'fr', name: 'Fr', flag: '🇫🇷' },
  ],
});

// Language actions
export const languageActions = {
  setLanguage: (langCode: string) => {
    locale.set(langCode);
    languageStore.update(store => ({
      ...store,
      current: langCode,
    }));

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', langCode);
    }
  },

  getStoredLanguage: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('preferred-language');
    }
    return null;
  },

  initializeLanguage: () => {
    const stored = languageActions.getStoredLanguage();
    const detected = detectBrowserLanguage();
    const initialLang = stored || detected;

    languageActions.setLanguage(initialLang);
  },
};
