import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to inject dynamic SEO metadata per page.
 * @param {Object} options
 * @param {string} options.title - The page title
 * @param {string} options.description - The page meta description
 */
export default function useSEO({ title, description }) {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // 1. Enforce ?lang= parameter in the URL on route changes
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.get('lang') !== i18n.language) {
      currentParams.set('lang', i18n.language);
      const newUrl = `${window.location.pathname}?${currentParams.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }

    // 2. Update HTML lang attribute based on current language
    if (i18n.language) {
      document.documentElement.lang = i18n.language;
    }

    // 3. Update Title
    if (title) {
      document.title = title;
    }

    // 4. Update Meta Description
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

    // 5. Inject Canonical and Hreflang Tags
    const baseUrl = 'https://www.freetourcph.com';
    const path = window.location.pathname;
    
    const updateOrCreateTag = (selector, attributes) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('link');
        document.head.appendChild(tag);
      }
      Object.keys(attributes).forEach(key => tag.setAttribute(key, attributes[key]));
    };

    // Canonical points to the current active URL with its language
    updateOrCreateTag('link[rel="canonical"]', {
      rel: 'canonical',
      href: `${baseUrl}${path}?lang=${i18n.language}`
    });

    // Hreflang tags (x-default is Spanish)
    updateOrCreateTag('link[hreflang="x-default"]', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${baseUrl}${path}?lang=es`
    });
    
    updateOrCreateTag('link[hreflang="es"]', {
      rel: 'alternate',
      hreflang: 'es',
      href: `${baseUrl}${path}?lang=es`
    });

    updateOrCreateTag('link[hreflang="en"]', {
      rel: 'alternate',
      hreflang: 'en',
      href: `${baseUrl}${path}?lang=en`
    });

    updateOrCreateTag('link[hreflang="it"]', {
      rel: 'alternate',
      hreflang: 'it',
      href: `${baseUrl}${path}?lang=it`
    });

  }, [title, description, i18n.language, location.pathname]);
}
