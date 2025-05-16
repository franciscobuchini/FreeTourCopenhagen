import React, { useState } from 'react';

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
  return `${yyyy}-${mm}-${dd}`;
}

function isSunday(dateStr) {
  const d = new Date(dateStr);
  return d.getDay() === 0;
}

export default function BookingCalendar({ onSubmit, maxParticipants = 30 }) {
  const minDate = getDatePlusDays(3); // No permite los próximos 2 días
  const [date, setDate] = useState(minDate);
  const [time, setTime] = useState(timeSlots[0]);
  const [participants, setParticipants] = useState(1);
  const [language, setLanguage] = useState(languages[0].code);
  const [notes, setNotes] = useState('');
  const [mail, setMail] = useState('');

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (isSunday(selected)) {
      alert('Los tours no están disponibles los domingos.');
      return;
    }
    setDate(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = { date, time, participants, language, notes, mail };
    if (onSubmit) onSubmit(bookingData);
    console.log('Booking submitted:', bookingData);
  };

  return (
    <form
      className="sticky top-30 bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 transition-shadow duration-300 hover:shadow-lg flex flex-col gap-1"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-semibold mb-4 text-red-800">Reserva tu Tour</h3>

      {/* Fecha y Hora en la misma fila */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Fecha */}
        <label className="flex-1 block">
          <span className="block font-medium text-gray-600">Selecciona fecha:</span>
          <input
            type="date"
            required
            value={date}
            onChange={handleDateChange}
            min={minDate}
            className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-700"
          />
          <p className="text-sm text-gray-500 mt-1">Domingos no disponibles.</p>
        </label>
        {/* Hora */}
        <label className="flex-1 block">
          <span className="block font-medium text-gray-600">Hora de Inicio:</span>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-700"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Participantes e idioma en la misma fila */}
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
            className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-400"
          />
          <p className="text-sm text-gray-500 mt-1">Máximo permitido: {maxParticipants}</p>
        </label>

        {/* Idioma */}
        <label className="block flex-1">
          <span className="block font-medium text-gray-600">Idioma:</span>
          <select
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-400"
          >
            {languages.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Notas */}
      <label className="block">
        <span className="block font-medium text-gray-600">Notas ó solicitudes:</span>
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-400"
        />
      </label>

      {/* Email */}
      <label className="block">
        <span className="block font-medium text-gray-600">Email de contacto:</span>
        <input
          type="email"
          required
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-400"
        />
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-700 text-white rounded-2xl transition-colors duration-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reservar Ahora
      </button>
    </form>
  );
}