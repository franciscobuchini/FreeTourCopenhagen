// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar tus archivos de traducción
import es from './translations/es.json';
import en from './translations/en.json';

i18n
  .use(initReactI18next) // integra react-i18next
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en }
    },
    fallbackLng: 'es',       // si no se encuentra la clave en el idioma activo, usa “es”
    lng: 'es',               // idioma por defecto al iniciar
    interpolation: {
      escapeValue: false     // react ya escapa por defecto
    }
  });

export default i18n;