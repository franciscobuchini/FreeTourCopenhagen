import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to inject dynamic SEO metadata per page.
 * @param {Object} options
 * @param {string} options.title - The page title
 * @param {string} options.description - The page meta description
 */
export default function useSEO({ title, description }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update HTML lang attribute based on current language
    if (i18n.language) {
      document.documentElement.lang = i18n.language;
    }

    if (title) {
      document.title = title;
    }
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
      }
    }
  }, [title, description, i18n.language]);
}
