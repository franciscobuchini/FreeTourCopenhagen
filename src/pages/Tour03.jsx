// Tour03.jsx / Tour de invierno o tours especiales
import { useState } from "react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"

const Tour03 = () => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const email = "info@freetourcph.com"
  const whatsappNumber = "4571617970"
  const whatsappLink = `https://wa.me/${whatsappNumber}`

  const handleCopy = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <>
      <div className="overflow-hidden w-screen -mt-20 sm:-mx-8 md:-mx-16 lg:-mx-24 xl:-mx-36">
        <img
          src="https://img.scandichotels.com/.netlify/images?url=https://imagevault.scandichotels.com/publishedmedia/f4e4rv2lja8t9tin1iwd/Jul_i_Tivoli_VisitDenmark.jpg&w=2400"
          alt="Special Winter Tour"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>

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

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          {/* Botón copiar email */}
          <div className="relative">
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow w-64"
            >
              <Icon icon="mdi:email-outline" className="text-2xl" />
              {email}
            </button>
            {copied && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-3 py-1 rounded-lg shadow">
                Copied
              </span>
            )}
          </div>

          {/* Botón WhatsApp */}
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
  )
}

export default Tour03
