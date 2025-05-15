// AboutUs.jsx
import { useTranslation } from 'react-i18next';
import { Icon } from "@iconify/react";

const AboutUs = () => {
  const { t } = useTranslation("global");
  return (
    <div className="container mx-auto px-6 py-12 mt-20 flex flex-col items-center gap-12">
      <h1 className="text-3xl font-bold mb-10 text-gray-600 flex items-center gap-4">
        <Icon icon="icon-park-twotone:diving" className="w-10 h-10 flex-shrink-0 text-pink-800" />
        {t("about.title")}
      </h1>
      <p className="text-gray-600 leading-relaxed text-center max-w-3xl">
        Bienvenido a FREE WALKING TOUR CPH, Somos una agencia joven, con el
        corazón puesto en mostrarte la ciudad más encantadora del norte de
        Europa.Nuestro equipo está formado por personas que aman lo que hacen:
        caminar, contar historias y hacerte sentir parte de esta ciudad.Caminamos por las
        calles del centro, navegamos los canales como lo hacían los antiguos
        comerciantes, y compartimos curiosidades que no encontrás en las guías.Si
        buscás una experiencia auténtica, cercana y en tu idioma, estás en el lugar
        correcto.
      </p>
    </div>
  );
};

export default AboutUs;
