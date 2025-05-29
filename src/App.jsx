import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

// Páginas
import Home from './pages/Home';
import Tour01 from './pages/Tour01';
import Tour02 from './pages/Tour02';
import Tour03 from './pages/Tour03';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 pt-20 xl:px-36 lg:px-24 md:px-16 sm:px-6 px-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Tour01" element={<Tour01 />} />
            <Route path="/Tour02" element={<Tour02 />} />
            <Route path="/Tour03" element={<Tour03 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
