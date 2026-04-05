import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const textes = {
  fr: {
    titre: 'Réglages',
    profil: 'Profil',
    nom: 'Nom',
    email: 'Email',
    telephone: 'Téléphone',
    preferences: 'Préférences',
    langue: 'Langue',
    notifications: 'Notifications',
    notifSub: 'Alertes factures en retard',
    darkMode: 'Mode sombre',
    darkSub: 'Interface sombre activée',
    compte: 'Compte & Plan',
    plan: 'Plan actuel',
    gratuit: 'Gratuit — 10 factures/mois',
    upgrade: '🚀 Passer au Pro — $5/mois',
    upgradeSub: 'Factures illimitées, export PDF, priorité support',
    deconnexion: 'Se déconnecter',
    version: 'Invlo v1.0',
    proAvantages: ['Factures illimitées', 'Export PDF pro', 'Support prioritaire', 'Stats avancées'],
    planPro: 'Plan Pro',
    actif: 'Actif',
    navigation: 'Navigation',
    dashboard: 'Tableau de bord',
    factures: 'Factures',
    clients: 'Clients',
    stats: 'Statistiques',
    modifier: 'Modifier',
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
    compte: 'Account & Plan',
    plan: 'Current plan',
    gratuit: 'Free — 10 invoices/month',
    upgrade: '🚀 Upgrade to Pro — $5/month',
    upgradeSub: 'Unlimited invoices, PDF export, priority support',
    deconnexion: 'Log out',
    version: 'Invlo v1.0',
    proAvantages: ['Unlimited invoices', 'Pro PDF export', 'Priority support', 'Advanced stats'],
    planPro: 'Pro Plan',
    actif: 'Active',
    navigation: 'Navigation',
    dashboard: 'Dashboard',
    factures: 'Invoices',
    clients: 'Clients',
    stats: 'Statistics',
    modifier: 'Edit',
  }
};

// Remplace par ton vrai lien Stripe Payment Link quand tu l'auras créé
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_XXXXXXXX';

function Parametres({ langue, setLangue }) {
  const navigate = useNavigate();
  const t = textes[langue] || textes['fr'];
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleDeconnexion = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const confirmerUpgrade = () => {
    // Ouvre Stripe dans un nouvel onglet
    window.open(STRIPE_PAYMENT_LINK, '_blank');
    setShowUpgradeModal(false);
  };

  const nomUtilisateur = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Gabriel';
  const emailUtilisateur = user?.email || 'gabriel@email.com';
  const initiales = nomUtilisateur.slice(0, 2).toUpperCase();

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

  // Modal Upgrade
  const UpgradeModal = () => (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '28px', maxWidth: '380px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Header modal */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px auto' }}>🚀</div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '800', color: 'white' }}>Plan Pro</h2>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>{langue === 'fr' ? 'Débloquez toutes les fonctionnalités' : 'Unlock all features'}</p>
        </div>

        {/* Prix */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '42px', fontWeight: '800', color: 'white' }}>$5</span>
          <span style={{ fontSize: '16px', color: '#64748B' }}>{langue === 'fr' ? '/mois' : '/month'}</span>
        </div>

        {/* Avantages */}
        <div style={{ marginBottom: '24px' }}>
          {t.proAvantages.map((avantage, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#60A5FA', fontSize: '11px', fontWeight: '700' }}>✓</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1' }}>{avantage}</p>
            </div>
          ))}
        </div>

        {/* Boutons */}
        <button
          onClick={confirmerUpgrade}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'pointer', fontWeight: '700', marginBottom: '10px' }}>
          {langue === 'fr' ? '💳 Payer avec Stripe' : '💳 Pay with Stripe'}
        </button>
        <button
          onClick={() => setShowUpgradeModal(false)}
          style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
          {langue === 'fr' ? 'Annuler' : 'Cancel'}
        </button>
      </div>
    </div>
  );

  // Sidebar desktop
  const Sidebar = () => (
    <div style={{ width: '240px', minHeight: '100vh', backgroundColor: '#0B1120', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '32px 16px', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '8px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: 'white' }}>I</div>
        <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>Invlo</span>
      </div>
      {[
        { label: t.dashboard, icon: '▦', path: '/dashboard' },
        { label: t.factures, icon: '📄', path: '/factures' },
        { label: t.clients, icon: '👥', path: '/clients' },
        { label: t.stats, icon: '📊', path: '/stats' },
        { label: t.titre, icon: '⚙️', path: '/parametres', active: true },
      ].map((item) => (
        <div key={item.path} onClick={() => navigate(item.path)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', cursor: 'pointer', backgroundColor: item.active ? 'rgba(37,99,235,0.15)' : 'transparent', border: item.active ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent', color: item.active ? '#60A5FA' : '#64748B', fontSize: '14px', fontWeight: item.active ? '600' : '400' }}>
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
      <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)', borderRadius: '14px', padding: '16px', cursor: 'pointer' }} onClick={handleUpgrade}>
        <p style={{ margin: '0 0 4px 0', fontWeight: '700', fontSize: '13px', color: 'white' }}>🚀 Plan Pro</p>
        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{langue === 'fr' ? 'Factures illimitées' : 'Unlimited invoices'}</p>
        <div style={{ backgroundColor: 'white', color: '#2563EB', borderRadius: '8px', padding: '6px 0', textAlign: 'center', fontSize: '12px', fontWeight: '700' }}>
          {langue === 'fr' ? 'Upgrade — 5$/mois' : 'Upgrade — $5/month'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{initiales}</div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nomUtilisateur}</p>
          <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>Free plan</p>
        </div>
      </div>
    </div>
  );

  const Contenu = () => (
    <div style={{ padding: isDesktop ? '32px 36px' : '28px 20px 100px 20px', maxWidth: isDesktop ? '640px' : '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: '700' }}>{t.titre}</h1>
        <button onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')}
          style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
          {langue === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      {/* Avatar */}
      <div style={{ ...cardStyle, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '58px', height: '58px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0 }}>
          {initiales}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 3px 0', fontWeight: '700', fontSize: '16px', color: 'white' }}>{nomUtilisateur}</p>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748B' }}>{emailUtilisateur}</p>
          <span style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', border: '1px solid rgba(96,165,250,0.2)' }}>
            Plan Gratuit
          </span>
        </div>
      </div>

      {/* Profil */}
      <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.profil}</p>
      <div style={{ ...cardStyle }}>
        {[
          { label: t.nom, valeur: nomUtilisateur },
          { label: t.email, valeur: emailUtilisateur },
          { label: t.telephone, valeur: '+254 700 000 000' },
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

      {/* Préférences */}
      <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.preferences}</p>
      <div style={{ ...cardStyle }}>
        <div style={{ ...rowStyle }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>{t.langue}</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#475569' }}>{langue === 'fr' ? 'Français' : 'English'}</p>
          </div>
          <button onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')}
            style={{ padding: '5px 12px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
            {langue === 'fr' ? 'EN' : 'FR'}
          </button>
        </div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>{t.notifications}</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#475569' }}>{t.notifSub}</p>
          </div>
          <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
        </div>
      </div>

      {/* Plan */}
      <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.compte}</p>
      <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))', border: '1px solid rgba(37,99,235,0.25)', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#475569' }}>{t.plan}</p>
            <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: '600' }}>{t.gratuit}</p>
          </div>
          <span style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(96,165,250,0.2)' }}>FREE</span>
        </div>

        {/* Avantages Pro */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {langue === 'fr' ? 'Avec le plan Pro :' : 'With Pro plan:'}
          </p>
          {t.proAvantages.map((avantage, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#60A5FA', fontSize: '12px' }}>✓</span>
              <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1' }}>{avantage}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'pointer', fontWeight: '700', letterSpacing: '0.3px' }}>
          {t.upgrade}
        </button>
        <p style={{ margin: '8px 0 0 0', textAlign: 'center', fontSize: '11px', color: '#475569' }}>
          {langue === 'fr' ? 'Paiement sécurisé via Stripe · Annulable à tout moment' : 'Secure payment via Stripe · Cancel anytime'}
        </p>
      </div>

      {/* Déconnexion */}
      <button
        onClick={handleDeconnexion}
        style={{ width: '100%', padding: '14px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', marginBottom: '14px' }}>
        {t.deconnexion}
      </button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#1E293B', marginBottom: '80px' }}>{t.version}</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", backgroundColor: '#0F172A', minHeight: '100vh', color: 'white', display: 'flex' }}>
      {showUpgradeModal && <UpgradeModal />}
      {isDesktop && <Sidebar />}
      <div style={{ flex: 1, marginLeft: isDesktop ? '240px' : '0' }}>
        <Contenu />
      </div>
    </div>
  );
}

export default Parametres;