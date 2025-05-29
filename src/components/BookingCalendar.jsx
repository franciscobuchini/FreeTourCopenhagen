import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'Inglés' },
  { code: 'other', label: 'Otro (aclarar en notas)' },
];

const timeSlots = ['10:00', '13:00', '15:00'];

function getTodayPlusDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isSunday(dateStr) {
  const d = new Date(dateStr);
  return d.getDay() === 0;
}

/**
 * @param {Object} props
 * @param {string} props.tourName
 * @param {number} [props.maxParticipants]
 */
export default function BookingCalendar({ tourName, maxParticipants = 30 }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('');
  const [language, setLanguage] = useState('');
  const [notes, setNotes] = useState('');
  const [mail, setMail] = useState('');
  const [sending, setSending] = useState(false);

  const minSelectableDate = getTodayPlusDays(3); // bloquea hoy y próximos 2 días

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (isSunday(selected)) {
      alert('Los domingos no están disponibles para reserva.');
    } else {
      setDate(selected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateParams = {
      tour_name: tourName,
      tour_date: date,
      tour_time: time,
      participants,
      language,
      notes,
      user_email: mail,
    };
  
    setSending(true);
    emailjs.send('service_r9951ua', 'template_cmubhxk', templateParams, 'pahGhN_NUndIlVHnB')
      .then(() => {
        alert(`Reserva para \"${tourName}\" enviada correctamente. ¡Gracias!`);
        setDate('');
        setTime('');
        setParticipants('');
        setLanguage('');
        setNotes('');
        setMail('');
      }, (error) => {
        console.error('Error al enviar email:', error.text);
        alert('Error al enviar tu reserva. Intenta de nuevo.');
      })
      .finally(() => setSending(false));
  };

  return (
    <form onSubmit={handleSubmit} className="sticky top-30 bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 hover:shadow-lg flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-red-800">Reserva tu Tour</h3>

      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex-1">
          <span className="block font-medium text-gray-600">Selecciona fecha:</span>
          <input
            type="date"
            required
            value={date}
            onChange={handleDateChange}
            min={minSelectableDate}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-1">* Domingos no disponibles.</p>
        </label>

        <label className="flex-1">
          <span className="block font-medium text-gray-600">Hora de Inicio:</span>
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          >
            <option value="" disabled>Selecciona hora</option>
            {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex-1">
          <span className="block font-medium text-gray-600">Personas:</span>
          <input
            type="number"
            min="1"
            max={maxParticipants}
            required
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          />
        </label>

        <label className="flex-1">
          <span className="block font-medium text-gray-600">Idioma:</span>
          <select
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          >
            <option value="" disabled>Selecciona idioma</option>
            {languages.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
          </select>
        </label>
      </div>

      <label>
        <span className="block font-medium text-gray-600">Notas ó solicitudes:</span>
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
        />
      </label>

      <label>
        <span className="block font-medium text-gray-600">Email de contacto:</span>
        <input
          type="email"
          required
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
        />
      </label>

      <button
        type="submit"
        disabled={!date || !time || !participants || !language || !mail || sending}
        className="w-full py-2 px-4 bg-blue-700 text-white rounded-2xl transition duration-300 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? 'Reservando...' : 'Reservar Tour'}
      </button>
    </form>
  );
}
