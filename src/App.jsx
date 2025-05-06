import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';

// Páginas
import Home from './pages/Home';
import Tour01 from './pages/Tour01';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Tour01" element={<Tour01 />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
