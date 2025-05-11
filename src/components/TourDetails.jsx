// components/TourDetails.jsx
import React from 'react';

export default function TourDetails({
  duration,
  includes,
  tips,
  accessibility,
  operator,
  pets,
  meetingPoint,
  mapUrl,
  contactEmail,
  contactPhone
}) {
  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 transition-shadow duration-300 hover:shadow-lg">

      {/* DETALLES */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-red-800">Detalles</h3>
        <div className="grid grid-cols-1 gap-4">
          <DetailCard title="Duración" value={duration} />
          <DetailList title="Qué incluye" items={includes} />
          <DetailList title="Consejos" items={tips} />
          <DetailCard title="Accesibilidad" value={accessibility} />
          <DetailCard title="Operador" value={operator} />
          <DetailCard title="Mascotas" value={pets} />
        </div>
      </section>

      {/* PUNTO DE ENCUENTRO */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Punto de encuentro</h3>
        <p className="text-gray-700">{meetingPoint}</p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white font-medium rounded-2xl shadow hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
        >
          Ver en Google Maps
        </a>
      </section>

      {/* CONTACTO */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Contáctanos</h3>
        <p className="text-gray-700">
          Email: <a href={`mailto:${contactEmail}`} className="text-blue-600">{contactEmail}</a> |  
          Teléfono: <a href={`tel:${contactPhone}`} className="text-blue-600">{contactPhone}</a>
        </p>
      </section>
    </div>
  );
}

// Subcomponentes de ayuda
function DetailCard({ title, value }) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-200">
      <h4 className="font-medium text-gray-600">{title}</h4>
      <p className="text-gray-400 italic">{value}</p>
    </div>
  );
}

function DetailList({ title, items }) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-200">
      <h4 className="font-medium text-gray-600">{title}</h4>
      <ul className="list-disc list-inside text-gray-400 space-y-1 italic">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}