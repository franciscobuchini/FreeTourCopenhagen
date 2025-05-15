// pages/Tour01.jsx
import BookingCalendar from '../components/BookingCalendar';
import TourDetails from '../components/TourDetails';
import Reviews from '../components/Reviews';

export default function Tour01() {
  const handleBooking = data => console.log('Nueva reserva:', data);

  const detailsData = {
    duration: '1 hora aproximadamente',
    // includes: ['Guía local profesional', 'Auriculares para escuchar al guía'],
    tips: ['Traer bebida', 'Traer piloto de lluvia o paraguas'],
    accessibility: 'Recorrido apto para silla de ruedas',
    operator: 'Tour Operadores XYZ',
    price: 'Tour gratuito (propinas bienvenidas)',
    meetingPoint: 'Ayuntamiento (Rådhuspladsen)',
    mapUrl:
      "https://www.google.com/maps/place/55%C2%B040'32.8%22N+12%C2%B034'09.4%22E/@55.675781,12.569285,532m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d55.675781!4d12.569285?entry=ttu&g_ep=EgoyMDI1MDUxMi4wIKXMDSoASAFQAw%3D%3D",
    contactEmail: 'info@freewalkingtour.com',
    contactPhone: '+34 600 000 000'
  };

  return (
    <>
      <div className="
        overflow-hidden
        w-screen
        -mt-20
        sm:-mx-8
        md:-mx-16
        lg:-mx-24
        xl:-mx-36
      ">
        <img
          src="https://www.princess.com/content/dam/princess-headless/shorex/ports/copenhagen-denmark-waterway-night.jpg"
          alt="Copenhague"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>
      <main className="flex-1 mb-20 md:mx-4 rounded-2xl bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-10 p-2 sm:p-6 md:p-8 lg:p-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="mt-10 flex flex-col gap-4 p-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">Gran tour de Copenhague</h1>
              <p>¡Sumate a nuestro Free Walking Tour y explorá lo mejor de Copenhague con un guía local apasionado! descubriremos monumentos, palacios y rincones llenos de historia,
              caminando por sus calles como si fuéramos locales, sintiendo el pulso
              cotidiano de la vida danesa.
              <br/><br/>
              Desde el encantador puerto de Nyhavn y la famosa Sirenita, hasta el Palacio de Amalienborg y la vibrante calle Strøget, te llevamos a conocer la ciudad como un verdadero local. Aprendé sobre los vikingos, la monarquía danesa, el estilo de vida escandinavo y los secretos que hacen de Copenhague una de las capitales más felices del mundo.</p>
            </div>

            {/* Le paso toda la data como props */}
            <TourDetails {...detailsData} />

            <Reviews />
          </div>
          <div className="w-full lg:w-1/2 lg:sticky lg:top-40 flex flex-col mt-10">
            <BookingCalendar onSubmit={handleBooking} />
          </div>
        </div>
      </main>
    </>
  );
}
