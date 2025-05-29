// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-red-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-700 text-white font-medium rounded-2xl shadow hover:bg-blue-800 transition-colors duration-200"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
