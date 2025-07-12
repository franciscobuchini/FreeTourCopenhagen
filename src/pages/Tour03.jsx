// Tour03.jsx / Tour de invierno o tours especiales
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const Tour03 = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-6 py-12 mt-20 flex flex-col items-center gap-6 text-center max-w-2xl">
      <Icon icon="ph:map-pin-line" className="text-red-700 text-5xl" />
      <h1 className="text-2xl font-semibold text-red-800">
        {t("special.title")}
      </h1>
      <p className="text-gray-700 text-lg">
        {t("special.description")}
        <br />
        {t("special.contact_prompt")}
      </p>
      <a
        href="mailto:info@freetourcph.com"
        className="text-blue-700 hover:underline text-lg font-medium"
      >
        info@freetourcph.com
      </a>
    </div>
  );
};

export default Tour03;
