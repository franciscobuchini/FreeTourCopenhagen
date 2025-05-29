import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Papa from 'papaparse';

const STORAGE_KEY = 'freeWalkingTour_reviews';
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRN0BGSsWf09JTisfIPOGPniK2BSkR__17oZM_RuJa4mtbcWsHQeCMTS7vIjrfJjjpZG0TLroojotkg/pub?gid=0&single=true&output=csv';

export default function Reviews() {
  const location = useLocation();
  const path = location.pathname;
  let tourCode = '00';
  if (path.includes('/Tour01')) tourCode = '01';
  else if (path.includes('/Tour02')) tourCode = '02';

  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [group, setGroup] = useState('Solo');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => setReviews(data),
        });
      })
      .catch(err => console.error('Error fetching reviews:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !comment.trim()) return;

    const today = new Date().toISOString().slice(0, 10);
    const newReview = { name: name.trim(), country: country.trim(), group, date: today, rating, text: comment.trim() };

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
        tour: tourCode,
      },
      'pahGhN_NUndIlVHnB'
    )
    .then(() => {
      setReviews([newReview, ...reviews]);
      setName(''); setCountry(''); setGroup('Solo'); setComment(''); setRating(5);
      alert('Reseña enviada correctamente. ¡Gracias!');
    })
    .catch(err => {
      console.error('Error al enviar reseña:', err);
      alert('Error al enviar tu reseña. Intenta de nuevo.');
    })
    .finally(() => setSending(false));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 hover:shadow-lg flex flex-col gap-1">
      <h3 className="text-xl font-semibold text-red-800">Opiniones de Clientes</h3>
      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div key={i} className="review-card p-4 mb-4 bg-white rounded-2xl border border-gray-200">
            <div className="flex justify-between mb-1">
              <div><strong>{r.name}</strong>, {r.country}</div>
              <div className="text-sm text-gray-500">{r.date}</div>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              {r.group === 'Solo' ? 'Hizo el tour solo' : r.group === 'Pareja' ? 'Hizo el tour en pareja' : 'Hizo el tour en grupo'}
            </div>
            <div className="mb-2">
              {Array.from({ length: Number(r.rating) }).map((_, j) => <span key={`full-${j}`} className="text-yellow-500">★</span>)}
              {Array.from({ length: 5 - Number(r.rating) }).map((_, j) => <span key={`empty-${j}`} className="text-gray-300">★</span>)}
            </div>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-medium text-red-800">Deja tu reseña del tour</h4>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => setRating(i+1)}>
              <span className={rating>=i+1?'text-yellow-500 text-2xl':'text-gray-300 text-2xl'}>★</span>
            </button>
          ))}
        </div>
        <input type="text" placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-300 rounded-2xl p-2" required />
        <input type="text" placeholder="País" value={country} onChange={e=>setCountry(e.target.value)} className="w-full border border-gray-300 rounded-2xl p-2" required />
        <div>
          <span className="text-gray-700 font-medium">Hice el tour:</span>
          <div className="flex gap-6 mt-1">
            {['Solo','Pareja','Grupo'].map(opt=>(
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" value={opt} checked={group===opt} onChange={()=>setGroup(opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
        <textarea rows="3" placeholder="Tu comentario" value={comment} onChange={e=>setComment(e.target.value)} className="w-full border border-gray-300 rounded-2xl p-2" required />
        <button type="submit" disabled={!comment||!country||!name||sending} className="w-full bg-blue-700 text-white py-2 rounded-2xl transition disabled:opacity-50">
          {sending?'Enviando...':'Enviar Reseña'}
        </button>
      </form>
    </div>
  );
}
