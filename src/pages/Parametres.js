import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Parametres({ langue, setLangue }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const t = {
    fr: {
      titre: 'Reglages',
      profil: 'Profil',
      nom: 'Nom',
      email: 'Email',
      telephone: 'Telephone',
      preferences: 'Preferences',
      langue: 'Langue',
      notifications: 'Notifications',
      notifSub: 'Alertes factures en retard',
      darkMode: 'Mode sombre',
      darkSub: 'Interface sombre activee',
      compte: 'Compte',
      plan: 'Plan actuel',
      gratuit: 'Gratuit — 10 factures/mois',
      upgrade: 'Passer au Pro — $5/mois',
      deconnexion: 'Se deconnecter',
      version: 'Invlo v1.0',
    },
    en: {
      titre: 'Settings',
      profil: 'Profile',
      nom: 'Name',
      email: 'Email',
      telephone: 'Phone',
      preferences: 'Preferences',
      langue: 'Language',
      notifications: 'Notifications',
      notifSub: 'Overdue invoice alerts',
      darkMode: 'Dark mode',
      darkSub: 'Dark interface enabled',
      compte: 'Account',
      plan: 'Current plan',
      gratuit: 'Free — 10 invoices/month',
      upgrade: 'Upgrade to Pro — $5/month',
      deconnexion: 'Log out',
      version: 'Invlo v1.0',
    }
  };

  const text = t[langue] || t['fr'];

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    marginBottom: '14px',
    overflow: 'hidden',
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  };

  const Toggle = ({ value, onChange }) => (
    <div
      onClick={onChange}
      style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: value ? '#2563EB' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', left: value ? '22px' : '2px', transition: 'left 0.2s' }}></div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white' }}>

      <div style={{ padding: '28px 20px 20px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{text.titre}</h1>
          <button
            onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')}
            style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
            {langue === 'fr' ? 'EN' : 'FR'}
          </button>
        </div>

        {/* Avatar */}
        <div style={{ ...cardStyle, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '58px', height: '58px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0 }}>
            GA
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 3px 0', fontWeight: '700', fontSize: '16px', color: 'white' }}>Gabriel</p>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748B' }}>gabriel@email.com</p>
            <span style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', border: '1px solid rgba(96,165,250,0.2)' }}>
              Plan Gratuit
            </span>
          </div>
        </div>

        {/* Profil */}
        <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{text.profil}</p>
        <div style={{ ...cardStyle }}>
          {[
            { label: text.nom, valeur: 'Gabriel' },
            { label: text.email, valeur: 'gabriel@email.com' },
            { label: text.telephone, valeur: '+254 700 000 000' },
          ].map((item, index, arr) => (
            <div key={item.label} style={{ ...rowStyle, borderBottom: index < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{item.label}</p>
                <p style={{ margin: '3px 0 0 0', fontSize: '14px', color: 'white' }}>{item.valeur}</p>
              </div>
              <span style={{ color: '#334155', fontSize: '18px' }}>›</span>
            </div>
          ))}
        </div>

        {/* Preferences */}
        <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{text.preferences}</p>
        <div style={{ ...cardStyle }}>
          <div style={{ ...rowStyle }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>{text.langue}</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#475569' }}>{langue === 'fr' ? 'Francais' : 'English'}</p>
            </div>
            <button
              onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')}
              style={{ padding: '5px 12px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
              {langue === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
          <div style={{ ...rowStyle }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>{text.notifications}</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#475569' }}>{text.notifSub}</p>
            </div>
            <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
          </div>
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>{text.darkMode}</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#475569' }}>{text.darkSub}</p>
            </div>
            <Toggle value={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>

        {/* Plan */}
        <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{text.compte}</p>
        <div style={{ ...cardStyle, padding: '16px' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#475569' }}>{text.plan}</p>
          <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'white', fontWeight: '600' }}>{text.gratuit}</p>
          <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
            {text.upgrade}
          </button>
        </div>

        {/* Deconnexion */}
        <button style={{ width: '100%', padding: '14px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', marginBottom: '14px' }}>
          {text.deconnexion}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#1E293B', marginBottom: '80px' }}>{text.version}</p>

      </div>
    </div>
  );
}

export default Parametres;