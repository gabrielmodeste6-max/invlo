import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function BottomNav({ langue }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/', icone: 'M3 12L12 3L21 12V21H15V15H9V21H3V12Z', labelFr: 'Accueil', labelEn: 'Home' },
    { path: '/factures', icone: 'M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z', labelFr: 'Factures', labelEn: 'Invoices' },
    { path: '/clients', icone: 'M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z', labelFr: 'Clients', labelEn: 'Clients' },
    { path: '/stats', icone: 'M5 9.2H8V19H5V9.2ZM10.6 5H13.4V19H10.6V5ZM16.2 13H19V19H16.2V13Z', labelFr: 'Stats', labelEn: 'Stats' },
    { path: '/parametres', icone: 'M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.01 5.25 4.76 5.33 4.64 5.55L2.72 8.87C2.6 9.08 2.65 9.34 2.84 9.48L4.87 11.06C4.82 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.24 18.67L7.63 17.71C8.13 18.09 8.66 18.41 9.25 18.65L9.61 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.08 16.37 17.71L18.76 18.67C18.99 18.75 19.24 18.67 19.36 18.45L21.28 15.13C21.4 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z', labelFr: 'Reglages', labelEn: 'Settings' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '420px', backgroundColor: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-around', padding: '12px 0 18px 0', zIndex: 1000 }}>
      {items.map((item) => {
        const actif = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '4px', minWidth: '50px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: actif ? 'rgba(37,99,235,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={actif ? '#60A5FA' : '#475569'}>
                <path d={item.icone} />
              </svg>
            </div>
            <span style={{ fontSize: '10px', fontWeight: actif ? '700' : '400', color: actif ? '#60A5FA' : '#475569' }}>
              {langue === 'fr' ? item.labelFr : item.labelEn}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default BottomNav;