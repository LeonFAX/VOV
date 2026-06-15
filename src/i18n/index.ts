import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Russian
import ruCommon from './locales/ru/common.json';
import ruPages from './locales/ru/pages.json';

// English
import enCommon from './locales/en/common.json';
import enPages from './locales/en/pages.json';
import enData from './locales/en/data.json';

// Belarusian
import beCommon from './locales/be/common.json';
import bePages from './locales/be/pages.json';
import beData from './locales/be/data.json';

const resources = {
  ru: {
    common: ruCommon,
    pages: ruPages,
  },
  en: {
    common: enCommon,
    pages: enPages,
    data: enData,
  },
  be: {
    common: beCommon,
    pages: bePages,
    data: beData,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en', 'be'],
    defaultNS: 'pages',
    ns: ['pages', 'common', 'data'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18n_language',
    },
  });

export default i18n;
