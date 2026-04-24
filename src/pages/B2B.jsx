import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import TourCalculator from '../components/calculator/TourCalculator';

export default function B2B() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if they already authenticated in this session
    const auth = sessionStorage.getItem('b2b_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1764') {
      setIsAuthenticated(true);
      sessionStorage.setItem('b2b_auth', 'true');
      setError('');
    } else {
      setError(t('b2b.wrong_password', 'Clave incorrecta. Intenta nuevamente.'));
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1729 0%, #1a2a4a 50%, #0f1729 100%)',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          padding: '3rem 2rem',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)',
            borderRadius: '2rem', padding: '0.35rem 1rem',
            fontSize: '0.8rem', fontWeight: 700, color: '#f87171',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            <Icon icon="ph:lock-key-bold" width={16} />
            {t('b2b.badge')}
          </div>
          <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 800 }}>
            {t('b2b.password_required', 'Acceso Restringido B2B')}
          </h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('b2b.password_placeholder', 'Ingresar clave')}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                outline: 'none',
                width: '100%',
                fontSize: '1rem'
              }}
              autoFocus
            />
            {error && <div style={{ color: '#f87171', fontSize: '0.9rem', textAlign: 'left', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{error}</div>}
            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
                padding: '1rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
                fontSize: '1rem',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {t('b2b.submit_password', 'Entrar')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1a2a4a 50%, #0f1729 100%)',
        borderRadius: '1.5rem',
        padding: '3rem 2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(220,38,38,0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)',
            borderRadius: '2rem', padding: '0.35rem 1rem',
            fontSize: '0.8rem', fontWeight: 700, color: '#f87171',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            <Icon icon="ph:buildings-bold" width={16} />
            {t('b2b.badge')}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800, color: 'white', margin: '0 0 1rem 0',
            lineHeight: 1.2,
          }}>
            {t('b2b.hero_title')}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem',
            lineHeight: 1.7, margin: '0 0 2rem 0', maxWidth: '560px',
          }}>
            {t('b2b.hero_subtitle')}
          </p>

          {/* Feature chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[
              { icon: 'ph:lightning-bold', key: 'b2b.feat_instant' },
              { icon: 'ph:file-pdf-bold', key: 'b2b.feat_invoice' },
              { icon: 'ph:translate-bold', key: 'b2b.feat_multilang' },
              { icon: 'ph:shield-check-bold', key: 'b2b.feat_secure' },
            ].map(({ icon, key }) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '2rem', padding: '0.4rem 0.9rem',
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500,
              }}>
                <Icon icon={icon} width={15} style={{ color: '#f87171' }} />
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Native React Tour Calculator */}
      <div className="w-full">
        <TourCalculator />
      </div>
    </div>
  );
}
