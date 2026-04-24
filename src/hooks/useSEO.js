import { useEffect } from 'react';

/**
 * Custom hook to inject dynamic SEO metadata per page.
 * @param {Object} options
 * @param {string} options.title - The page title
 * @param {string} options.description - The page meta description
 */
export default function useSEO({ title, description }) {
  useEffect(() => {
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
  }, [title, description]);
}
