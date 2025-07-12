import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import FooterImg from '../assets/cph.webp';

function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(t('footer.contact_email_address')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer className="bg-white text-gray-800 pt-12">
      {/* Sección principal: enlaces y newsletter */}
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sobre nosotros */}
        <div>
          <h4 className="text-xl font-semibold mb-4">{t('footer.about_title')}</h4>
          <p className="text-sm leading-relaxed">{t('footer.about_text')}</p>
        </div>
        {/* Enlaces rápidos */}
        <div>
          <h4 className="text-xl font-semibold mb-4">{t('footer.quick_links_title')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-red-800">{t('footer.link_home')}</a></li>
            <li><a href="/Tour01" className="hover:text-red-800">{t('footer.link_walking_tour')}</a></li>
            <li><a href="/Tour02" className="hover:text-red-800">{t('footer.link_boat_tour')}</a></li>
            <li><a href="/contacto" className="hover:text-red-800">{t('footer.link_winter_tour')}</a></li>
          </ul>
        </div>
        {/* Contacto */}
        <div>
          <h4 className="text-xl font-semibold mb-4">{t('footer.contact_title')}</h4>
          <div className="flex items-center">
            <a
              href="#"
              onClick={copyEmail}
              className="flex items-center text-sm hover:text-red-800"
            >
              <Icon icon="icon-park-twotone:mail" className="w-6 h-6 mr-2 text-red-800" />
              <span>{t('footer.contact_email_address')}</span>
            </a>
            {copied && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 rounded">
                {t('footer.copied')}
              </span>
            )}
          </div>
          <div className="flex mt-2 text-sm">
            <Icon icon="icon-park-twotone:phone-incoming" className="w-6 h-6 mr-2 text-red-800" />
            <span>{t('footer.contact_phone')}</span>
          </div>
          <a
            className="flex mt-2 text-sm"
            href="https://www.instagram.com/free.tourcph"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="icon-park-twotone:instagram" className="w-6 h-6 mr-2 text-red-800" />
            <span>@freetourcph</span>
          </a>
          <a
            className="flex mt-2 text-sm"
            href="https://www.facebook.com/profile.php?id=61578180240831&rdid=RQjha5at7dVD4Uip&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18yGpzwhQD%2F#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="icon-park-twotone:facebook" className="w-6 h-6 mr-2 text-red-800" />
            <span>@freetourcph</span>
          </a>
        </div>
      </div>

      <div className="mt-12 overflow-hidden">
        <img
          src={FooterImg}
          className="w-full object-cover object-center h-36"
          alt={t('footer.image_alt')}
        />
      </div>
    </footer>
  );
}

export default Footer;
