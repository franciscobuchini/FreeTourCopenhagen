import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogData';

export default function BlogList() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'es';

  return (
    <div className="flex-1 my-10 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-800 mb-4">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('blog.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => {
          const postData = post.translations[currentLang] || post.translations['es'];
          
          return (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
              <Link to={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={postData.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-sm text-gray-400 mb-2">
                  {new Date(post.date).toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-red-800 transition-colors">
                  <Link to={`/blog/${post.slug}`}>{postData.title}</Link>
                </h2>
                <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                  {postData.excerpt}
                </p>
                <Link 
                  to={`/blog/${post.slug}`} 
                  className="inline-block text-center px-4 py-2 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors"
                >
                  {t('blog.read_more')}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
