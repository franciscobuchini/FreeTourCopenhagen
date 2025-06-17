// src/components/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import {
  SERVICE_ID,
  PUBLIC_KEY,
  TEMPLATE_ID_REVIEW
} from '../config/email';

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0BGSsWf09JTisfIPOGPniK2BSkR__17oZM_RuJa4mtbcWsHQeCMTS7vIjrfJjjpZG0TLroojotkg/pub?gid=0&single=true&output=csv';

emailjs.init(PUBLIC_KEY);

export default function Reviews() {
  const { t } = useTranslation();
  const location = useLocation();
  const match = location.pathname.match(/\/(Tour\d+)/i);
  const tourCode = match ? match[1] : 'Tour00';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    group: 'Single',
    comment: '',
    rating: 5,
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => res.ok ? res.text() : Promise.reject('Network error'))
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim().toLowerCase(),
          complete: ({ data }) => {
            const filtered = data
              .filter((item) => item.tour === tourCode)
              .map((item, idx) => ({
                ...item,
                id: item.id || `${tourCode}-${idx}-${item.date}-${item.name}`,
              }));
            setReviews(filtered);
            setLoading(false);
          },
        });
      })
      .catch((err) => {
        console.error('Error fetching reviews:', err);
        setError(t('reviews.loading_error'));
        setLoading(false);
      });
  }, [t, tourCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, country, group, comment, rating } = formData;
    if (!name.trim() || !country.trim() || !comment.trim()) return;

    const today = new Date().toISOString().slice(0, 10);
    const newReview = { id: `${Date.now()}`, name: name.trim(), country: country.trim(), group, date: today, rating, text: comment.trim(), tour: tourCode };
    setSending(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID_REVIEW, {
        reviewer_name: newReview.name,
        reviewer_country: newReview.country,
        reviewer_group: newReview.group,
        review_date: newReview.date,
        review_rating: newReview.rating,
        review_text: newReview.text,
        tour: newReview.tour,
      }, PUBLIC_KEY);
      setReviews((prev) => [newReview, ...prev]);
      setFormData({ name: '', country: '', group: 'Single', comment: '', rating: 5 });
      alert(t('reviews.sent_success'));
    } catch (err) {
      console.error('Error al enviar reseña:', err);
      alert(t('reviews.sent_error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow p-6 space-y-6 hover:shadow-lg flex flex-col gap-1">
      <h3 className="text-xl font-semibold text-red-800">{t('reviews.title')}</h3>

      {loading ? (
        <p>{t('reviews.loading')}</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reviews.length === 0 ? (
        <p>{t('reviews.no_reviews')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="review-card p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex justify-between mb-1">
                <div>
                  <strong>{r.name}</strong>, {r.country}
                </div>
                <div
                  className="text-sm text-gray-500"
                  aria-label={`Fecha: ${new Date(r.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`}
                >
                  {r.date}
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {r.group === 'Single'
                  ? t('reviews.single')
                  : r.group === 'Couple'
                  ? t('reviews.couple')
                  : t('reviews.group')}
              </div>
              <div className="mb-2" aria-label={`Calificación: ${r.rating} de 5`}>
                {Array.from({ length: Number(r.rating) }).map((_, j) => (
                  <span key={`full-${j}`} aria-hidden="true">★</span>
                ))}
                {Array.from({ length: 5 - Number(r.rating) }).map((_, j) => (
                  <span key={`empty-${j}`} aria-hidden="true">☆</span>
                ))}
              </div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-medium text-red-800">{t('reviews.form_title')}</h4>
        <div className="flex items-center space-x-2" role="radiogroup" aria-label={t('reviews.rating')}>
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={t('reviews.set_rating', { count: i + 1 })}
              aria-pressed={formData.rating === i + 1}
              onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={formData.rating >= i + 1 ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>
                ★
              </span>
            </button>
          ))}
        </div>

        <label className="block">
          <span className="text-gray-700">{t('reviews.name_label')}</span>
          <input
            type="text"
            name="name"
            placeholder={t('reviews.name_placeholder')}
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-2xl p-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">{t('reviews.country_label')}</span>
          <input
            type="text"
            name="country"
            placeholder={t('reviews.country_placeholder')}
            value={formData.country}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-2xl p-2"
            required
          />
        </label>

        <fieldset>
          <legend className="text-gray-700 font-medium">{t('reviews.tour_group')}</legend>
          <div className="flex gap-6 mt-1">
            {['Single', 'Couple', 'Group'].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="group"
                  value={opt}
                  checked={formData.group === opt}
                  onChange={handleInputChange}
                />
                <span>{t(`reviews.${opt.toLowerCase()}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-gray-700">{t('reviews.comment_label')}</span>
          <textarea
            name="comment"
            rows="3"
            placeholder={t('reviews.comment_placeholder')}
            value={formData.comment}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-2xl p-2"
            required
          />
        </label>

        <button
          type="submit"
          disabled={!formData.comment.trim() || !formData.country.trim() || !formData.name.trim() || sending}
          className="w-full bg-blue-700 text-white py-2 rounded-2xl transition disabled:opacity-50"
        >
          {sending ? t('reviews.sending') : t('reviews.send_button')}
        </button>
      </form>
    </div>
  );
}
