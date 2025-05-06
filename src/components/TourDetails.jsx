import React from 'react';

export default function TourDetails() {
  const mapUrl =
    'https://www.google.com/maps/place/Kongens+Nytorv/@55.680525,12.5833821,532m/data=!3m2!1e3!4b1!4m6!3m5!1s0x465253182013b227:0x36248075ccf0be0!8m2!3d55.680522!4d12.585957!16zL20vMGdqbnA1?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D';

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 transition-shadow duration-300 hover:shadow-lg">

      <section className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-red-800">Detalles</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Duración */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-medium text-gray-600">Duración</h4>
            <p className="text-gray-400 italic">Aprox. 2 horas.</p>
          </div>

          {/* Qué incluye */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-medium text-gray-600">Qué incluye</h4>
            <ul className="list-disc list-inside text-gray-400 space-y-1 italic">
              <li>Guía local profesional</li>
              <li>Auriculares para escuchar al guía</li>
            </ul>
          </div>

          {/* Qué no incluye */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-medium text-gray-600">Qué no incluye</h4>
            <ul className="list-disc list-inside text-gray-400 space-y-1 italic">
              <li>Propinas</li>
              <li>Bebidas y snacks</li>
            </ul>
          </div>

          {/* Accesibilidad */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-medium text-gray-600">Accesibilidad</h4>
            <p className="text-gray-400 italic">Recorrido apto para silla de ruedas.</p>
          </div>

          {/* Operador */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-medium text-gray-600">Operador</h4>
            <p className="text-gray-400 italic">Tour Operadores XYZ.</p>
          </div>

          {/* Mascotas */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200">
            <h4 className="font-medium text-gray-600">Mascotas</h4>
            <p className="text-gray-400 italic">No se admiten mascotas.</p>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Punto de encuentro</h3>
        <p className="text-gray-700">Kongens Nytorv, frente a la estatua central.</p>
        <div>
          {/* Botón para abrir Google Maps */}
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white font-medium rounded-2xl shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Ver en Google Maps
          </a>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Contáctanos</h3>
        <p className="text-gray-700">
          Email: info@freewalkingtour.com | Teléfono: +34 600 000 000
        </p>
      </section>
    </div>
  );
}