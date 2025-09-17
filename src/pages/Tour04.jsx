// Tour04.jsx / Pub Crawl
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const Tour04 = () => {
  const { t } = useTranslation();

  // número en formato internacional sin "+"
  const whatsappNumber = "4571617970";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      <div className="overflow-hidden w-screen -mt-20 sm:-mx-8 md:-mx-16 lg:-mx-24 xl:-mx-36">
        <img
          src="https://www.copenhagendowntown.com/__data/assets/image/0020/3917/_DSC4149.jpg"
          alt="Pub Crawl Copenhagen"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>

      <div className="container mx-auto px-6 py-12 mt-20 flex flex-col items-center gap-6 text-center max-w-2xl">
        <Icon icon="ph:beer-stein" className="text-red-700 text-5xl" />
        <h1 className="text-2xl font-semibold text-red-800">
          {t("pubcrawl.title")}
        </h1>
        <p className="text-gray-700 text-lg">
          {t("pubcrawl.description")}
          <br />
          {t("special.contact_prompt")}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <a
            href="mailto:info@freetourcph.com"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow w-64"
        >
            <Icon icon="mdi:email-outline" className="text-2xl" />
            Email
        </a>

        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-2xl shadow w-64"
        >
            <Icon icon="mdi:whatsapp" className="text-2xl" />
            WhatsApp
        </a>
        </div>

      </div>
    </>
  );
};

export default Tour04;

