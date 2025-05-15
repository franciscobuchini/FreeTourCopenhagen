// components/TourDetails.jsx
export default function TourDetails({
  duration,
  includes,
  tips,
  accessibility,
  operator,
  price,
  meetingPoint,
  mapUrl,
  contactEmail,
  contactPhone
}) {
  const hasDetails = [
    duration,
    includes?.length,
    tips?.length,
    accessibility,
    operator,
    price
  ].some(Boolean);

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-0 p-6 space-y-6 transition-shadow duration-300 hover:shadow-lg flex flex-col gap-1">

      {/* DETALLES */}
      {hasDetails && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold mb-4 text-red-800">Detalles</h3>
          <div className="grid grid-cols-1 gap-4">
            {duration && <DetailCard title="Duración" value={duration} />}
            {includes?.length > 0 && <DetailList title="Qué incluye" items={includes} />}
            {tips?.length > 0 && <DetailList title="Consejos" items={tips} />}
            {accessibility && <DetailCard title="Accesibilidad" value={accessibility} />}
            {operator && <DetailCard title="Operador" value={operator} />}
            {price && <DetailCard title="Precio" value={price} />}
          </div>
        </section>
      )}

      {/* PUNTO DE ENCUENTRO */}
      {meetingPoint && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Punto de encuentro</h3>
          <p className="text-gray-700">{meetingPoint}</p>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white font-medium rounded-2xl shadow hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
            >
              Ver en Google Maps
            </a>
          )}
        </section>
      )}

      {/* CONTACTO */}
      {(contactEmail || contactPhone) && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Contáctanos</h3>
          <p className="text-gray-700">
            {contactEmail && (
              <>Email: <a href={`mailto:${contactEmail}`} className="text-blue-600">{contactEmail}</a></>
            )}
            {contactEmail && contactPhone && ' | '}
            {contactPhone && (
              <>Teléfono: <a href={`tel:${contactPhone}`} className="text-blue-600">{contactPhone}</a></>
            )}
          </p>
        </section>
      )}
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