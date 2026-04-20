// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/Logo.png';

export default function Header() {
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
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
      if (languageRef.current && !languageRef.current.contains(event.target)) setIsLanguageOpen(false);
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
    <nav className="Navbar fixed z-[100] bg-white rounded-2xl flex justify-between items-center left-0 right-0 mx-auto w-[calc(100%-1rem)] max-w-[calc(100%-1.5rem)] mt-4 py-2 px-4 backdrop-blur-sm shadow-lg transition-shadow duration-300">
      {/* Logo */}
      <div className="NavbarLogo flex items-center">
        <Link to="/"><img src={Logo} className="h-14" alt="Logo" /></Link>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-2 items-center">
        <Link to="/" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.home')}</Link>
        <Link to="/Tour01" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour01')}</Link>
        <Link to="/Tour02" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour02')}</Link>
        <Link to="/Tour03" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour03')}</Link>
        <Link to="/Tour04" className="text-blue-950 hover:bg-gray-100 py-2 px-4 rounded-full">{t('header.tour04')}</Link>
        <Link
          to="/b2b"
          className="flex items-center gap-1.5 py-2 px-4 rounded-full font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 2px 10px rgba(220,38,38,0.35)' }}
        >
          <Icon icon="ph:buildings-bold" className="w-4 h-4" />
          {t('header.b2b')}
        </Link>
      </div>

      {/* Right side: admin gear + language + mobile menu */}
      <div className="flex gap-2 items-center">

        {/* Admin — icono discreto de engranaje */}
        <Link
          to="/admin"
          title="Admin Panel"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition"
        >
          <Icon icon="ph:gear-six-bold" className="w-5 h-5" />
        </Link>

        {/* Selector de idioma */}
        <div className="relative" ref={languageRef}>
          <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
            <Icon icon={languageIcons[language]} className="w-6 h-6" />
          </button>
          {isLanguageOpen && (
            <ul className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-2xl p-2 z-50">
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

        {/* Mobile hamburger */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Icon icon="icon-park-twotone:app-switch" className="w-6 h-6 text-red-700" />
          </button>

          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-2xl p-4 flex flex-col gap-2 z-50 min-w-[180px]">
              {[
                { to: '/', label: t('header.home') },
                { to: '/Tour01', label: t('header.tour01') },
                { to: '/Tour02', label: t('header.tour02') },
                { to: '/Tour03', label: t('header.tour03') },
                { to: '/Tour04', label: t('header.tour04') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 hover:text-red-800 rounded-2xl">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/b2b"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                >
                  <Icon icon="ph:buildings-bold" />
                  {t('header.b2b')}
                </Link>
              </li>
              <li className="border-t border-gray-100 pt-1">
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:text-gray-500 rounded-2xl text-gray-400 text-sm"
                >
                  <Icon icon="ph:gear-six-bold" />
                  Admin Panel
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
