// BookingCalendar.jsx
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'Inglés' },
  { code: 'other', label: 'Otro (aclarar en notas)' },
];

const timeSlots = ['10:00', '13:00', '15:00'];

function getDatePlusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy}`;
}

function isSunday(dateStr) {
  const d = new Date(dateStr);
  return d.getDay() === 0;
}

/**
 * @param {Object} props
 * @param {string} props.tourName - Nombre del tour para incluir en el email
 * @param {number} [props.maxParticipants]
 */
export default function BookingCalendar({ tourName, maxParticipants = 30 }) {
  const minDate = getDatePlusDays(3); // no permite los próximos dos días
  const [date, setDate] = useState(minDate);
  const [time, setTime] = useState(timeSlots[0]);
  const [participants, setParticipants] = useState(1);
  const [language, setLanguage] = useState(languages[0].code);
  const [notes, setNotes] = useState('');
  const [mail, setMail] = useState('');

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (!isSunday(selected)) setDate(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      tour_name: tourName,
      tour_date: date,
      tour_time: time,
      participants: participants,
      language: language,
      notes: notes,
      user_email: mail,
    };

    emailjs
      .send(
        'service_r9951ua',      // reemplaza con tu service ID
        'template_cmubhxk',     // reemplaza con tu template ID
        templateParams,
        'pahGhN_NUndIlVHnB'          // reemplaza con tu user ID (public key)
      )
      .then(
        () => {
          alert(`Reserva para "${tourName}" enviada correctamente. ¡Gracias!`);
          // limpiar campos
          setDate(minDate);
          setTime(timeSlots[0]);
          setParticipants(1);
          setLanguage(languages[0].code);
          setNotes('');
          setMail('');
        },
        (error) => {
          console.error('Error al enviar email:', error.text);
          alert('Error al enviar tu reserva. Intenta de nuevo.');
        }
      );
  };

  return (
    <form
      className="sticky top-30 bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 transition-shadow duration-300 hover:shadow-lg flex flex-col gap-1"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-semibold mb-4 text-red-800">Reserva tu Tour</h3>

      {/* Fecha y Hora */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex-1 block">
          <span className="block font-medium text-gray-600">Selecciona fecha:</span>
          <input
            type="date"
            required
            value={date}
            onChange={handleDateChange}
            min={minDate}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2"
          />
          <p className="text-sm text-gray-500 mt-1">Domingos no disponibles.</p>
        </label>

        <label className="flex-1 block">
          <span className="block font-medium text-gray-600">Hora de Inicio:</span>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Participantes e Idioma */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className="block flex-1">
          <span className="block font-medium text-gray-600">Personas:</span>
          <input
            type="number"
            min="1"
            max={maxParticipants}
            required
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2"
          />
        </label>
        <label className="block flex-1">
          <span className="block font-medium text-gray-600">Idioma:</span>
          <select
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2"
          >
            {languages.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Notas y Email */}
      <label className="block">
        <span className="block font-medium text-gray-600">Notas ó solicitudes:</span>
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 p-2"
        />
      </label>
      <label className="block">
        <span className="block font-medium text-gray-600">Email de contacto:</span>
        <input
          type="email"
          required
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 p-2"
        />
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-700 text-white rounded-2xl transition duration-300 hover:bg-blue-800 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!date || !time || !participants || !mail}
      >
        Reservar Ahora
      </button>
    </form>
  );
}
