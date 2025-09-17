// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/Logo.png';

export default function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language || 'es');
  const languageIcons = {
    en: 'twemoji:flag-united-kingdom',
    es: 'twemoji:flag-spain',
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const menuRef = useRef(null);
  const languageRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <nav className="Navbar fixed z-100 bg-white rounded-2xl flex justify-between items-center left-0 right-0 mx-auto w-[calc(100%-1rem)] max-w-[calc(100%-1.5rem)] mt-4 py-2 px-4 backdrop-blur-sm shadow-lg transition-shadow duration-300">
      <div className="NavbarLogo flex items-center">
        <Link to="/">
          <img src={Logo} className="h-14" alt="Logo" />
        </Link>
      </div>

      {/* Navegación principal */}
      <div className="hidden md:flex gap-2">
        <Link to="/" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.home')}</Link>
        <Link to="/Tour01" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour01')}</Link>
        <Link to="/Tour02" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour02')}</Link>
        <Link to="/Tour03" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour03')}</Link>
        <Link to="/Tour04" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour04')}</Link>
      </div>

      {/* Menú móvil e idioma */}
      <div className="flex gap-4 items-center">
        {/* Selector de idioma */}
        <div className="relative" ref={languageRef}>
          <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
            <Icon icon={languageIcons[language]} className="w-6 h-6" />
          </button>
          {isLanguageOpen && (
            <ul className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-2xl p-2">
              {['en', 'es'].map((lang) => (
                <li key={lang}>
                  <button
                    onClick={() => changeLanguage(lang)}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-2xl"
                  >
                    <Icon icon={languageIcons[lang]} className="w-5 h-5" />
                    {lang.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Menú móvil */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Icon icon="icon-park-twotone:app-switch" className="w-6 h-6 text-red-700" />
          </button>

          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-2xl p-4 flex flex-col gap-2">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 hover:text-red-800 rounded-2xl"
                >
                  {t('header.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/Tour01"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 hover:text-red-800 rounded-2xl"
                >
                  {t('header.tour01')}
                </Link>
              </li>
              <li>
                <Link
                  to="/Tour02"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 hover:text-red-800 rounded-2xl"
                >
                  {t('header.tour02')}
                </Link>
              </li>
              <li>
                <Link
                  to="/Tour01"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 hover:text-red-800 rounded-2xl"
                >
                  {t('header.tour03')}
                </Link>
                                <Link
                  to="/Tour01"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 hover:text-red-800 rounded-2xl"
                >
                  {t('header.tour04')}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
