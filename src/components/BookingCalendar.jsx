// src/components/BookingCalendar.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import {
  SERVICE_ID,
  PUBLIC_KEY,
  TEMPLATE_ID_BOOKING
} from '../config/email';

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

emailjs.init(PUBLIC_KEY);

export default function BookingCalendar({ tourName, maxParticipants = 30 }) {
  const { t } = useTranslation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('');
  const [language, setLanguage] = useState('');
  const [notes, setNotes] = useState('');
  const [mail, setMail] = useState('');
  const [sending, setSending] = useState(false);

  const minSelectableDate = getTodayPlusDays(3);

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (isSunday(selected)) {
      alert(t('booking.sunday_not_available'));
    } else {
      setDate(selected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const languageLabel = languages.find((l) => l.code === language)?.label || '';
    const templateParams = {
      tour_name: tourName,
      tour_date: date,
      tour_time: time,
      participants,
      language: languageLabel,
      notes,
      user_email: mail,
    };

    setSending(true);
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID_BOOKING, templateParams, PUBLIC_KEY)
      .then(() => {
        alert(t('booking.success', { tour: tourName }));
        setDate('');
        setTime('');
        setParticipants('');
        setLanguage('');
        setNotes('');
        setMail('');
      })
      .catch((error) => {
        console.error('Error al enviar email:', error.text);
        alert(t('booking.error'));
      })
      .finally(() => setSending(false));
};

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-30 bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 hover:shadow-lg flex flex-col gap-4"
    >
      <h3 className="text-xl font-semibold text-red-800">{t('booking.title')}</h3>

      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex-1">
          <span className="block font-medium text-gray-600">{t('booking.select_date')}</span>
          <input
            type="date"
            required
            value={date}
            onChange={handleDateChange}
            min={minSelectableDate}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-1">* {t('booking.sunday')}</p>
        </label>

        <label className="flex-1">
          <span className="block font-medium text-gray-600">{t('booking.start_time')}</span>
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          >
            <option value="" disabled>
              {t('booking.select_time')}
            </option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex-1">
          <span className="block font-medium text-gray-600">{t('booking.people')}</span>
          <input
            type="number"
            min="1"
            max={maxParticipants}
            required
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('booking.max_allowed', { max: maxParticipants })}
          </p>
        </label>

        <label className="flex-1">
          <span className="block font-medium text-gray-600">{t('booking.language')}</span>
          <select
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
          >
            <option value="" disabled>
              {t('booking.select_language')}
            </option>
            {languages.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span className="block font-medium text-gray-600">{t('booking.notes')}</span>
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-2xl border border-gray-300 p-2 hover:cursor-pointer"
        />
      </label>

      <label>
        <span className="block font-medium text-gray-600">{t('booking.contact_email')}</span>
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
        {sending ? t('booking.reserving') : t('booking.reserve')}
      </button>
    </form>
  );
}
