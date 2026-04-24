import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogPosts } from '../data/blogData';
import useSEO from '../hooks/useSEO';

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'es';

  const post = blogPosts.find((p) => p.slug === slug);
  const postData = post ? (post.translations[currentLang] || post.translations['es']) : null;

  useSEO({
    title: postData ? `${postData.title} | Free Tour CPH` : t('seo.blog.title'),
    description: postData ? postData.excerpt : t('seo.blog.description')
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('blog.not_found')}</h1>
        <Link to="/blog" className="px-6 py-2 bg-red-800 text-white rounded-full">
          {t('blog.back_to_blog')}
        </Link>
      </div>
    );
  }

  // Article Schema Markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": postData.title,
    "image": post.image,  
    "author": {
      "@type": "Organization",
      "name": "Free Tour CPH"
    },  
    "publisher": {
      "@type": "Organization",
      "name": "Free Tour CPH",
      "logo": {
        "@type": "ImageObject",
        "url": "https://freetourcph.com/logo.png"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date
  };

  return (
    <article className="flex-1 my-10 px-4 max-w-4xl mx-auto">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <div className="mb-6">
        <Link to="/blog" className="text-blue-700 hover:text-blue-900 flex items-center gap-2 font-medium">
          &larr; {t('blog.back_to_blog')}
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
        <img 
          src={post.image} 
          alt={postData.title}
          fetchpriority="high"
          className="w-full h-64 md:h-96 object-cover" 
        />
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
        <header className="mb-8">
          <div className="text-gray-400 mb-3">
            {new Date(post.date).toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {postData.title}
          </h1>
        </header>

        {/* Prose handles the markdown/HTML styles beautifully */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 
                     prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-semibold prose-h3:text-red-800 prose-h3:mt-8 prose-h3:mb-4
                     prose-p:mb-6 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: postData.content }} 
        />
      </div>
    </article>
  );
}
