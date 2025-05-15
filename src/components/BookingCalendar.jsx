import React, { useState, useEffect } from 'react';

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'Inglés' },
  { code: 'other', label: 'Otro (dejar en los comentarios)' },
];

const timeSlots = ['10:00', '13:00', '15:00'];

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getCurrentTimeString() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}

export default function BookingCalendar({
  onSubmit,
  maxParticipants = 30
}) {
  const todayStr = getTodayString();
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [language, setLanguage] = useState(languages[0].code);
  const [notes, setNotes] = useState('');
  const [mail, setMail] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // Determine available time slots based on selected date
    const nowStr = getCurrentTimeString();
    let slots = [...timeSlots];
    if (date === todayStr) {
      slots = slots.filter((slot) => slot > nowStr);
    }
    setAvailableSlots(slots);
  }, [date, todayStr]);

  useEffect(() => {
    // Set default time to first available slot
    if (availableSlots.length > 0) {
      setTime((prev) => availableSlots.includes(prev) ? prev : availableSlots[0]);
    }
  }, [availableSlots]);

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
            onChange={(e) => setDate(e.target.value)}
            min={todayStr}
            className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-700"
          />
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
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <option key={slot} value={slot} className="text-gray-800">
                  {slot}
                </option>
              ))
            ) : (
              <option value="" disabled>No hay franjas disponibles</option>
            )}
          </select>
        </label>
      </div>

      {/* Participantes */}
      <label className="block mb-4">
        <span className="block font-medium text-gray-600">Número de Personas:</span>
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
      <label className="block mb-4">
        <span className="block font-medium text-gray-600">Idioma preferido:</span>
        <select
          required
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-400"
        >
          {languages.map(({ code, label }) => (
            <option key={code} value={code} className="text-gray-800">
              {label}
            </option>
          ))}
        </select>
      </label>

      {/* Notas */}
      <label className="block mb-6">
        <span className="block font-medium text-gray-600">Notas ó solicitudes:</span>
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 p-2 text-gray-400"
        />
      </label>

      {/* Email */}
      <label className="block mb-6">
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
        disabled={availableSlots.length === 0}
        className="w-full py-2 px-4 bg-blue-700 text-white rounded-2xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
      >
        Reservar Ahora
      </button>
    </form>
  );
}
