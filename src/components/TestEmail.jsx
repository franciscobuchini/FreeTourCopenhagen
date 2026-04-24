import React from 'react';
import emailjs from '@emailjs/browser';
import { SERVICE_ID, PUBLIC_KEY, TEMPLATE_ID_BOOKING } from '../config/email';

export default function TestEmail() {
  const handleClick = () => {
    const templateParams = {
      tour_name: 'Test',
      tour_date: '2026-05-20',
      tour_time: '10:00',
      participants: '2',
      language: 'Español',
      notes: 'Test notes',
      user_email: 'test@example.com',
    };
    try {
      console.log('ABOUT TO SEND EMAILJS');
      emailjs.send(SERVICE_ID, TEMPLATE_ID_BOOKING, templateParams, PUBLIC_KEY)
        .then((res) => console.log('EMAILJS SUCCESS:', res.status, res.text))
        .catch((err) => console.log('EMAILJS ERROR:', JSON.stringify(err)));
      console.log('EMAILJS SEND CALLED');
    } catch(err) {
      console.log('EMAILJS SYNC EXCEPTION:', err.toString());
    }
  };

  return <button type="button" onClick={handleClick} id="test-email-btn">TEST EMAIL</button>;
}
