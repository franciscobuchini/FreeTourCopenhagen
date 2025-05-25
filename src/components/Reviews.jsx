// 1) Imports al principio
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const STORAGE_KEY = 'freeWalkingTour_reviews';
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0BGSsWf09JTisfIPOGPniK2BSkR__17oZM_RuJa4mtbcWsHQeCMTS7vIjrfJjjpZG0TLroojotkg/pub?gid=0&single=true&output=csv';

// (Opcional) función para parsear CSV
function parseCSV(text) {
  const lines = text.trim().split('\n');
  // Normalizar: pasar a minúsculas y recortar espacios
  const headers = lines.shift()
    .split(',')
    .map(h => h.trim().toLowerCase());

  const rowRegex = /("([^"]|"")*"|[^,]+)(?=,|$)/g;
  return lines.map(line => {
    const cols = [];
    let match;
    while ((match = rowRegex.exec(line))) {
      let cell = match[0];
      if (cell.startsWith('"') && cell.endsWith('"')) {
        cell = cell.slice(1, -1).replace(/""/g, '"');
      }
      cols.push(cell);
    }
    // Construye el objeto usando headers normalizados
    return headers.reduce((obj, h, i) => {
      obj[h] = cols[i] || '';
      return obj;
    }, {});
  });
}

// 2) Componente Reviews
export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [group, setGroup] = useState('Solo');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);

  // Al montar, cargo desde Google Sheets
  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then(res => res.text())
      .then(csvText => setReviews(parseCSV(csvText)))
      .catch(err => console.error('Error fetching reviews:', err));
  }, []);

  // Persistir en localStorage cuando cambian reviews
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !comment.trim()) return;

    const today = new Date().toISOString().slice(0, 10);
    const newReview = { name, country, group, date: today, rating, text: comment };

    setSending(true);
    emailjs.send(
      'service_r9951ua',
      'template_vka4pcv',
      {
        reviewer_name: newReview.name,
        reviewer_country: newReview.country,
        reviewer_group: newReview.group,
        review_date: newReview.date,
        review_rating: newReview.rating,
        review_text: newReview.text,
      },
      'pahGhN_NUndIlVHnB'
    )
    .then(() => {
      setReviews([newReview, ...reviews]);
      setName(''); setCountry(''); setGroup('Solo');
      setComment(''); setRating(5);
      alert('Reseña enviada correctamente. ¡Gracias!');
    })
    .catch(err => {
      console.error('Error al enviar reseña:', err);
      alert('Error al enviar tu reseña. Intenta de nuevo.');
    })
    .finally(() => setSending(false));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 transition-shadow duration-300 hover:shadow-lg flex flex-col gap-1">
      <h3 className="text-xl font-semibold mb-4 text-red-800">Opiniones de Clientes</h3>
      
      {/* Grid de reviews */}
      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div key={i} className="review-card p-4 bg-white rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <div>
                <span className="font-medium text-gray-800">{r.name}</span>
                <span className="text-sm text-gray-500">, {r.country}</span>
              </div>
              <span className="text-sm text-gray-500">{r.date}</span>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              {r.group === 'Solo'
                ? 'Hizo el tour solo'
                : r.group === 'Pareja'
                ? 'Hizo el tour en pareja'
                : 'Hizo el tour en grupo'}
            </div>
            <div className="mb-2">
              {Array.from({ length: r.rating }).map((_, j) => (
                <span key={`full-${j}`} className="text-yellow-500">★</span>
              ))}
              {Array.from({ length: 5 - r.rating }).map((_, j) => (
                <span key={`empty-${j}`} className="text-gray-300">★</span>
              ))}
            </div>
            <p className="text-gray-700">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Form para dejar reseña */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-medium text-red-800">Deja tu reseña</h4>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="focus:outline-none"
              >
                <span className={rating >= value ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>
                  ★
                </span>
              </button>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 p-2"
          required
        />
        <input
          type="text"
          placeholder="País"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 p-2"
          required
        />
        <div className="space-y-2">
          <span className="text-gray-700 font-medium">Hice el tour:</span>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2">
              <input type="radio" value="Solo" checked={group === 'Solo'} onChange={() => setGroup('Solo')} />
              <span className="text-gray-700">Solo</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" value="Pareja" checked={group === 'Pareja'} onChange={() => setGroup('Pareja')} />
              <span className="text-gray-700">Pareja</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" value="Grupo" checked={group === 'Grupo'} onChange={() => setGroup('Grupo')} />
              <span className="text-gray-700">Grupo</span>
            </label>
          </div>
        </div>
        <textarea
          rows="3"
          placeholder="Tu comentario"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 p-2"
          required
        />
        <button
          type="submit"
          disabled={ !comment || !country || !name || sending }
          className="py-2 px-4 bg-blue-700 text-white rounded-2xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 hover:cursor-pointer w-full"
        >
          {sending ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </form>
    </div>
  );
}