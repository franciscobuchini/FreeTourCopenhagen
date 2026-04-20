// src/components/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import {
  SERVICE_ID,
  PUBLIC_KEY,
  TEMPLATE_ID_REVIEW,
} from '../config/email';

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0BGSsWf09JTisfIPOGPniK2BSkR__17oZM_RuJa4mtbcWsHQeCMTS7vIjrfJjjpZG0TLroojotkg/pub?gid=0&single=true&output=csv';

emailjs.init(PUBLIC_KEY);

// Stable random date between Mar 1 – Apr 17 2026 (for legacy Google Sheet reviews)
const LEGACY_START = new Date('2026-03-01').getTime();
const LEGACY_END   = new Date('2026-04-17').getTime();
const legacyDate = (seed) => {
  const range = LEGACY_END - LEGACY_START;
  const ms = LEGACY_START + ((seed * 2654435761) % range);
  return new Date(ms).toISOString().slice(0, 10);
};

export default function Reviews() {
  const { t } = useTranslation();
  const location = useLocation();
  const match = location.pathname.match(/\/(Tour\d+)/i);
  const tourCode = match ? match[1] : 'Tour00';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '', country: '', group: 'Single', comment: '', rating: 5,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const mergeAndSort = (sheet, db) => {
    const all = [...sheet, ...db];
    return all.sort((a, b) => {
      // Most recent first
      const da = new Date(a.date).getTime() || 0;
      const db_ = new Date(b.date).getTime() || 0;
      return db_ - da;
    });
  };

  const loadReviews = async () => {
    setLoading(true);
    let sheetReviews = [];
    let dbReviews = [];

    // 1. Load legacy reviews from Google Sheet
    try {
      const res = await fetch(SHEET_CSV_URL);
      if (res.ok) {
        const csvText = await res.text();
        await new Promise((resolve) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim().toLowerCase(),
            complete: ({ data }) => {
              sheetReviews = data
                .filter((item) => item.tour === tourCode)
                .map((item, idx) => ({
                  ...item,
                  source: 'sheet',
                  date: legacyDate(idx + 1),
                  id: `sheet-${tourCode}-${idx}`,
                }));
              resolve();
            },
          });
        });
      }
    } catch (e) {
      console.warn('Sheet fetch failed:', e);
    }

    // 2. Load new reviews from Supabase
    try {
      const { data, error: dbErr } = await supabase
        .from('reviews')
        .select('*')
        .eq('tour', tourCode)
        .order('created_at', { ascending: false });

      if (!dbErr && data) {
        dbReviews = data.map((r) => ({
          id: r.id,
          name: r.name,
          country: r.country,
          group: r.group_type,
          date: r.date,
          rating: r.rating,
          text: r.review_text,
          tour: r.tour,
          source: 'db',
        }));
      }
    } catch (e) {
      console.warn('Supabase reviews fetch failed:', e);
    }

    setReviews(mergeAndSort(sheetReviews, dbReviews));
    setLoading(false);
  };

  useEffect(() => { loadReviews(); }, [tourCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, country, group, comment, rating } = formData;
    if (!name.trim() || !country.trim() || !comment.trim()) return;

    const today = new Date().toISOString().slice(0, 10);
    setSending(true);

    try {
      // 1. Save to Supabase (persists for future visitors)
      const { error: insertErr } = await supabase.from('reviews').insert({
        name: name.trim(),
        country: country.trim(),
        group_type: group,
        date: today,
        rating: Number(rating),
        review_text: comment.trim(),
        tour: tourCode,
      });

      if (insertErr) {
        console.error('Supabase insert error:', insertErr);
        // Still try to send email even if DB fails
      }

      // 2. Send email notification to admin
      await emailjs.send(SERVICE_ID, TEMPLATE_ID_REVIEW, {
        reviewer_name: name.trim(),
        reviewer_country: country.trim(),
        reviewer_group: group,
        review_date: today,
        review_rating: rating,
        review_text: comment.trim(),
        tour: tourCode,
      }, PUBLIC_KEY);

      // 3. Reload reviews from DB so the new one appears
      await loadReviews();

      setFormData({ name: '', country: '', group: 'Single', comment: '', rating: 5 });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(t('reviews.sent_error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 space-y-6 hover:shadow-lg flex flex-col gap-1">
      <h3 className="text-xl font-semibold text-red-800">{t('reviews.title')}</h3>

      {loading ? (
        <p className="text-gray-400 flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          {t('reviews.loading')}
        </p>
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
                <div className="text-sm text-gray-400">
                  {new Date(r.date).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {r.group === 'Single'
                  ? t('reviews.single')
                  : r.group === 'Couple'
                  ? t('reviews.couple')
                  : t('reviews.group')}
              </div>
              <div className="mb-2 text-yellow-400" aria-label={`Rating: ${r.rating} of 5`}>
                {'★'.repeat(Number(r.rating))}
                <span className="text-gray-200">{'★'.repeat(5 - Number(r.rating))}</span>
              </div>
              <p className="text-gray-700 text-sm">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-medium text-red-800">{t('reviews.form_title')}</h4>

        {/* Star rating */}
        <div className="flex items-center space-x-2" role="radiogroup" aria-label={t('reviews.rating')}>
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
              className="focus:outline-none"
            >
              <span className={`text-2xl ${formData.rating >= i + 1 ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            </button>
          ))}
        </div>

        <label className="block">
          <span className="text-gray-700">{t('reviews.name_label')}</span>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange}
            placeholder={t('reviews.name_placeholder')}
            className="w-full border border-gray-300 rounded-2xl p-2 mt-1" required />
        </label>

        <label className="block">
          <span className="text-gray-700">{t('reviews.country_label')}</span>
          <input type="text" name="country" value={formData.country} onChange={handleInputChange}
            placeholder={t('reviews.country_placeholder')}
            className="w-full border border-gray-300 rounded-2xl p-2 mt-1" required />
        </label>

        <fieldset>
          <legend className="text-gray-700 font-medium">{t('reviews.tour_group')}</legend>
          <div className="flex gap-6 mt-1">
            {['Single', 'Couple', 'Group'].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="group" value={opt}
                  checked={formData.group === opt} onChange={handleInputChange} />
                <span>{t(`reviews.${opt.toLowerCase()}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-gray-700">{t('reviews.comment_label')}</span>
          <textarea name="comment" rows="3" value={formData.comment} onChange={handleInputChange}
            placeholder={t('reviews.comment_placeholder')}
            className="w-full border border-gray-300 rounded-2xl p-2 mt-1" required />
        </label>

        {sent && (
          <div className="bg-green-50 border border-green-300 rounded-xl p-3 text-green-700 text-sm font-medium">
            ✅ {t('reviews.sent_success')}
          </div>
        )}

        <button
          type="submit"
          disabled={!formData.comment.trim() || !formData.country.trim() || !formData.name.trim() || sending}
          className="w-full bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-2xl transition disabled:opacity-50 font-semibold"
        >
          {sending ? t('reviews.sending') : t('reviews.send_button')}
        </button>
      </form>
    </div>
  );
}
