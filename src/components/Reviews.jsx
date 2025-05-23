// Reviews.jsx
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const STORAGE_KEY = 'freeWalkingTour_reviews';

const initialReviews = [
  { name: 'Laura García', country: 'España', group: 'Solo', date: '2025-04-20', rating: 5, text: '¡Increíble experiencia! El guía era muy conocedor y súper simpático.' },
  { name: 'Mark Johnson', country: 'USA', group: 'Pareja', date: '2025-04-18', rating: 4, text: 'Me encantaron los lugares que visitamos, aunque echamos en falta más tiempo en la catedral.' },
  { name: 'Sophie Müller', country: 'Alemania', group: 'Grupo', date: '2025-04-15', rating: 5, text: 'Un tour perfecto para conocer la ciudad de forma auténtica y divertida.' },
  { name: 'Carlos Fernández', country: 'España', group: 'Solo', date: '2025-04-10', rating: 4, text: 'Muy recomendable, sólo mejorar la señalización del punto de encuentro.' },
  { name: 'Emma Smith', country: 'Reino Unido', group: 'Pareja', date: '2025-04-05', rating: 5, text: 'El mejor free walking tour que he tomado. ¡Gracias por todo!' },
];

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function Reviews() {
  // Cargar reseñas guardadas o usar initialReviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [group, setGroup] = useState('Solo');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);

  // Cada vez que cambian las reseñas, persistir en LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !country.trim()) return;

    const newReview = {
      name: name.trim(),
      country: country.trim(),
      group,
      date: getTodayString(),
      rating,
      text: comment.trim(),
    };

    // Envía reseña por email
    setSending(true);
    const templateParams = {
      reviewer_name: newReview.name,
      reviewer_country: newReview.country,
      reviewer_group: newReview.group,
      review_date: newReview.date,
      review_rating: newReview.rating,
      review_text: newReview.text,
    };
    emailjs.send(
      'YOUR_SERVICE_ID',    // reemplaza con tu service ID
      'YOUR_TEMPLATE_ID',   // reemplaza con tu template ID
      templateParams,
      'YOUR_USER_ID'        // reemplaza con tu user ID (public key)
    )
    .then(() => {
      // Actualizar localStorage y lista
      setReviews([newReview, ...reviews]);
      // Reset fields
      setName('');
      setCountry('');
      setGroup('Solo');
      setComment('');
      setRating(5);
      alert('Reseña enviada correctamente. ¡Gracias!');
    }, (error) => {
      console.error('Error al enviar reseña:', error);
      alert('Error al enviar tu reseña. Intenta de nuevo.');
    })
    .finally(() => setSending(false));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 transition-shadow duration-300 hover:shadow-lg flex flex-col gap-1">
      <h3 className="text-xl font-semibold mb-4 text-red-800">Opiniones de Clientes</h3>
      <div className="space-y-4">
        {reviews.map((r, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-200">
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
              {Array.from({ length: r.rating }).map((_, i) => <span key={`full-${i}`} className="text-yellow-500">★</span>)}
              {Array.from({ length: 5 - r.rating }).map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
            </div>
            <p className="text-gray-700">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Form para dejar reseña */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-medium text-red-800">Deja tu reseña</h4>
        {/* Selector de estrellas */}
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
                <span className={rating >= value ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>★</span>
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
          disabled={sending}
          className="py-2 px-4 bg-blue-700 text-white rounded-2xl transition-colors duration-300 disabled:opacity-50"
        >
          {sending ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </form>
    </div>
  );
}
