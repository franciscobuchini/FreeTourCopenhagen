import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TourDetails({
  duration,
  includes,
  tips,
  accessibility,
  warnings,
  price,
  meetingPoint,
  mapUrl,
  contactEmail,
  contactPhone
}) {
  const { t } = useTranslation();
  const hasDetails =
    duration ||
    (includes && includes.length > 0) ||
    (tips && tips.length > 0) ||
    accessibility ||
    (warnings && warnings.length > 0) ||
    price;

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-0 p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6">
      {/* DETALLES */}
      {hasDetails && (
        <section>
          <h3 className="text-xl font-semibold mb-4 text-red-800">{t('tourDetails.details')}</h3>
          <div className="grid grid-cols-1 gap-4">
            {duration && <DetailCard title={t('tourDetails.duration')} value={duration} />}
            {includes && (
              <DetailList title={t('tourDetails.includes')} items={includes} />
            )}
            {tips && (
              <DetailList title={t('tourDetails.tips')} items={tips} />
            )}
            {accessibility && <DetailCard title={t('tourDetails.accessibility')} value={accessibility} />}
            {warnings && (
              <DetailList title={t('tourDetails.warnings')} items={warnings} />
            )}
            {price && <DetailCard title={t('tourDetails.price')} value={price} />}
          </div>
        </section>
      )}

      {/* PUNTO DE ENCUENTRO */}
      {meetingPoint && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('tourDetails.meeting_point')}</h3>
          <p className="text-gray-700">{meetingPoint}</p>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white font-medium rounded-2xl shadow hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
            >
              {t('tourDetails.view_on_map')}
            </a>
          )}
        </section>
      )}

      {/* CONTACTO */}
      {(contactEmail || contactPhone) && (
        <section className="space-y-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('tourDetails.contact_us')}</h3>
          <p className="text-gray-700">
            {contactEmail && (
              <>
                {t('tourDetails.email')}:&nbsp;
                <a href={`mailto:${contactEmail}`} className="text-blue-600">{contactEmail}</a>
              </>
            )}
            {contactEmail && contactPhone && ' | '}
            {contactPhone && (
              <>
                {t('tourDetails.phone')}:&nbsp;
                <a href={`tel:${contactPhone}`} className="text-blue-600">{contactPhone}</a>
              </>
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
  const listItems = Array.isArray(items) ? items : [items];
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-200">
      <h4 className="font-medium text-gray-600">{title}</h4>
      <ul className="list-disc list-inside text-gray-400 space-y-1 italic">
        {listItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
