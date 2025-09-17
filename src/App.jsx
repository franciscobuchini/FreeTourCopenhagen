// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';

// páginas
import Home from './pages/Home';
import Tour01 from './pages/Tour01';
import Tour02 from './pages/Tour02';
import Tour03 from './pages/Tour03';
import Tour04 from './pages/Tour04';
import NotFound from './pages/NotFound';

// Importar y ejecutar la configuración de i18n
import './i18n';


export default function App() {
  
 useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);
  }, []);
  
  return (
    // Suspense: muestra fallback mientras se carga la traducción inicial
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading…</div>}>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />

          <main className="flex-1 pt-20 xl:px-36 lg:px-24 md:px-16 sm:px-6 px-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Tour01" element={<Tour01 />} />
              <Route path="/Tour02" element={<Tour02 />} />
              <Route path="/Tour03" element={<Tour03 />} />
              <Route path="/Tour04" element={<Tour04 />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </Suspense>
  );
}
