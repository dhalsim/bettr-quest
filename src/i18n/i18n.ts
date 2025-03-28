import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import trTranslations from './locales/tr.json';

// Define available languages
export const languages = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸' },
  tr: { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
};

// Get stored language or default to English
const getStoredLanguage = () => {
  const stored = localStorage.getItem('i18nextLng');
  console.log('Stored language:', stored);
  return stored && Object.keys(languages).includes(stored) ? stored : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      tr: { translation: trTranslations }
    },
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    debug: true // Enable debug mode to see what's happening
  });

console.log('i18n initialized with language:', i18n.language);

export default i18n; 