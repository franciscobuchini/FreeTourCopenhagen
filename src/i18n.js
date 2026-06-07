// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar tus archivos de traducción
import es from './translations/es.json';
import en from './translations/en.json';
import it from './translations/it.json';

const urlParams = new URLSearchParams(window.location.search);
const langFromUrl = urlParams.get('lang');
const defaultLanguage = ['es', 'en', 'it'].includes(langFromUrl) ? langFromUrl : 'es';

i18n
  .use(initReactI18next) // integra react-i18next
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      it: { translation: it }
    },
    fallbackLng: 'es',       // si no se encuentra la clave en el idioma activo, usa “es”
    lng: defaultLanguage,    // idioma por defecto detectado desde la URL
    interpolation: {
      escapeValue: false     // react ya escapa por defecto
    }
  });

export default i18n;