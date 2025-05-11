// Footer.jsx
import { Icon } from "@iconify/react";
import { useState } from "react";
import FooterImg from "../assets/cph.webp";

function Footer() {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("Tour01cph@info.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // aquí podrías integrar con tu API de suscripción
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white text-gray-800 pt-12">
      {/* Sección principal: enlaces y newsletter */}
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sobre nosotros */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Sobre Free Tour Cph</h4>
          <p className="text-sm leading-relaxed">
            Descubre Copenhague con los mejores guías locales. Tours personalizados,
            rutas exclusivas y experiencias únicas para todos los viajeros.
          </p>
          <div className="flex items-center mt-10">
            <a
              href="#"
              onClick={copyEmail}
              className="flex items-center text-sm hover:text-red-800">
              <Icon icon="icon-park-twotone:mail" className="w-6 h-6 mr-2 text-red-800" />
              <span>freetourcph@gmail.com</span>
            </a>
            {copied && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 rounded">
                Copiado
              </span>
            )}
          </div>
          <div className=" flex mt-2 text-sm">
            <Icon icon="icon-park-twotone:phone-incoming" className="w-6 h-6 mr-2 text-red-800" />
            <span>+45 12 34 56 78</span>
          </div>
          <a className=" flex mt-2 text-sm" href="https://www.instagram.com/freetourcph" target="_blank" rel="noopener noreferrer">
            <Icon icon="icon-park-twotone:instagram" className="w-6 h-6 mr-2 text-red-800" />
            <span>@freetourcph</span>
          </a>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-red-800">Inicio</a></li>
            <li><a href="/Tour01" className="hover:text-red-800">Copenhague Tour</a></li>
            <li><a href="/Tour02" className="hover:text-red-800">Tivoli Tour</a></li>
            <li><a href="/contacto" className="hover:text-red-800">Contacto</a></li>
            <li><a href="/terms" className="hover:text-red-800">Términos y Condiciones</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 overflow-hidden">
      <img
          src={FooterImg}
          className="w-full object-cover object-center h-36"
          alt="Footer"
        />
      </div>
    </footer>
  );
}

export default Footer;
