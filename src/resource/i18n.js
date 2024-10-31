import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import vi from './vi.json';

// Get the device's language
const deviceLanguage = Localization.getLocales()[0].languageTag;

// Configure translations
const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

i18n
  .use(initReactI18next) // Connects i18n with React
  .init({
    resources,
    lng: deviceLanguage.startsWith('vi') ? 'vi' : 'en', // Set default language based on device
    fallbackLng: 'en', // Fallback to English if translation is missing
    keySeparator: false, // Allow nested JSON without using key separators
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
