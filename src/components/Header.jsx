//Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Header() {
  const navigate = useNavigate();
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

  return (
    <nav className="Navbar fixed z-100 bg-white/80 border border-gray-300 rounded-2xl flex justify-between items-center left-0 right-0 mx-auto w-[calc(100%-1rem)] max-w-[calc(100%-1.5rem)] mt-4 p-4 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
      <div className="NavbarLogo flex items-center">
        <Link to="/">
          <img className="h-8" alt="Logo" />
        </Link>
      </div>

      {/* Navegación principal */}
      <div className="hidden md:flex gap-2">
        <Link to="/" className="text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-full">Inicio</Link>
        <Link to="/Tour01" className="text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-full">Tour</Link>
      </div>

      {/* Menú móvil e idioma */}
      <div className="flex gap-4 items-center">
        <div className="relative" ref={languageRef}>
          <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="p-2 rounded-full hover:bg-gray-100">
            <Icon icon={languageIcons['es']} className="w-6 h-6" />
          </button>
          {isLanguageOpen && (
            <ul className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-2xl p-2">
              {['en','es'].map((lang) => (
                <li key={lang}>
                  <button onClick={() => {/* i18n.changeLanguage(lang) */}} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-2xl">
                    <Icon icon={languageIcons[lang]} className="w-5 h-5" />{lang.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-full hover:bg-gray-100" ref={menuRef}>
          <Icon icon="icon-park-twotone:app-switch" className="w-6 h-6 text-pink-800" />
        </button>

        {isMenuOpen && (
          <ul className="absolute right-4 top-16 bg-white border border-gray-300 rounded-2xl p-4 flex flex-col gap-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-800">Inicio</Link>
            <Link to="/Tour01" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-800">Tour</Link>
          </ul>
        )}
      </div>
    </nav>
  );
}