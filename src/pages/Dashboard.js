import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#60A5FA', '#F59E0B', '#EF4444'];

const textes = {
  fr: {
    bienvenue: 'Bienvenue,',
    revenus: 'Revenus totaux',
    payees: 'Payées',
    attente: 'En attente',
    retard: 'En retard',
    clients: 'Clients',
    nouvelleFacture: 'Nouvelle facture',
    mesClients: 'Mes clients',
    graphTitle: 'Revenus — 6 mois',
    statutTitle: 'Statut des factures',
    paiements: 'Paiements acceptés',
    aucune: "Aucune facture pour l'instant",
    aucuneSub: 'Crée ta première facture',
    creer: 'Créer une facture',
    conseil: 'Les vendeurs qui envoient leurs factures dans les 24h sont payés 2x plus vite.',
    conseil_titre: 'Conseil',
    factures: 'factures',
    recherche: 'Rechercher un client ou une facture...',
    facturesRecentes: 'Factures récentes',
    chargement: 'Chargement...',
    voirTout: 'Voir tout',
    aucunResultat: 'Aucun résultat trouvé',
    dashboard: 'Tableau de bord',
    navigation: 'Navigation',
    stats: 'Statistiques',
    parametres: 'Paramètres',
  },
  en: {
    bienvenue: 'Welcome,',
    revenus: 'Total revenue',
    payees: 'Paid',
    attente: 'Pending',
    retard: 'Overdue',
    clients: 'Clients',
    nouvelleFacture: 'New invoice',
    mesClients: 'My clients',
    graphTitle: 'Revenue — 6 months',
    statutTitle: 'Invoice status',
    paiements: 'Accepted payments',
    aucune: 'No invoices yet',
    aucuneSub: 'Create your first invoice',
    creer: 'Create an invoice',
    conseil: 'Sellers who send invoices within 24h get paid 2x faster.',
    conseil_titre: 'Tip',
    factures: 'invoices',
    recherche: 'Search a client or invoice...',
    facturesRecentes: 'Recent invoices',
    chargement: 'Loading...',
    voirTout: 'See all',
    aucunResultat: 'No results found',
    dashboard: 'Dashboard',
    navigation: 'Navigation',
    stats: 'Statistics',
    parametres: 'Settings',
  }
};

function Dashboard({ langue, setLangue }) {
  const navigate = useNavigate();
  const t = textes[langue] || textes['fr'];
  const [stats, setStats] = useState({ revenus: 0, payees: 0, attente: 0, retard: 0, clients: 0 });
  const [facturesRecentes, setFacturesRecentes] = useState([]);
  const [toutesFactures, setToutesFactures] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [resultatsRecherche, setResultatsRecherche] = useState([]);
  const [user, setUser] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [dataBar, setDataBar] = useState([
    { mois: 'Nov', revenus: 0 },
    { mois: 'Dec', revenus: 0 },
    { mois: 'Jan', revenus: 0 },
    { mois: 'Fev', revenus: 0 },
    { mois: 'Mar', revenus: 0 },
    { mois: 'Avr', revenus: 0 },
  ]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUser();
    fetchStats();
    fetchFacturesRecentes();
  }, []);

  // Recherche en temps réel
  useEffect(() => {
    if (recherche.trim() === '') {
      setResultatsRecherche([]);
      return;
    }
    const q = recherche.toLowerCase();
    const resultats = toutesFactures.filter(f =>
      f.client_nom?.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q) ||
      f.statut?.toLowerCase().includes(q) ||
      String(f.montant)?.includes(q)
    );
    setResultatsRecherche(resultats);
  }, [recherche, toutesFactures]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchStats = async () => {
    const { data } = await supabase.from('factures').select('*');
    if (data) {
      setToutesFactures(data);
      const payees = data.filter(f => f.statut === 'payee');
      const attente = data.filter(f => f.statut === 'attente');
      const retard = data.filter(f => f.statut === 'retard');
      const revenus = payees.reduce((sum, f) => sum + Number(f.montant), 0);
      const clients = [...new Set(data.map(f => f.client_nom))].length;
      setStats({ revenus, payees: payees.length, attente: attente.length, retard: retard.length, clients });

      // Graphique revenus réels par mois
      const maintenant = new Date();
      const moisLabels = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
        moisLabels.push({ mois: d.toLocaleString(langue === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }), annee: d.getFullYear(), moisNum: d.getMonth() });
      }
      const graphData = moisLabels.map(({ mois, annee, moisNum }) => {
        const revenus = payees
          .filter(f => {
            const d = new Date(f.created_at);
            return d.getFullYear() === annee && d.getMonth() === moisNum;
          })
          .reduce((sum, f) => sum + Number(f.montant), 0);
        return { mois, revenus };
      });
      setDataBar(graphData);
    }
  };

  const fetchFacturesRecentes = async () => {
    const { data } = await supabase
      .from('factures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setFacturesRecentes(data);
  };

  const couleurStatut = {
    payee: { bg: 'rgba(96,165,250,0.1)', color: '#60A5FA', label: langue === 'fr' ? 'Payée' : 'Paid' },
    attente: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: langue === 'fr' ? 'En attente' : 'Pending' },
    retard: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: langue === 'fr' ? 'En retard' : 'Overdue' },
  };

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px',
  };

  const nomUtilisateur = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Gabriel';

  const facturesAffichees = recherche.trim() !== '' ? resultatsRecherche : facturesRecentes;

  // ===== SIDEBAR DESKTOP =====
  const Sidebar = () => (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#0B1120',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '32px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '8px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: 'white' }}>I</div>
        <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>Invlo</span>
      </div>

      {/* Nav items */}
      {[
        { label: t.dashboard, icon: '▦', path: '/dashboard', active: true },
        { label: langue === 'fr' ? 'Factures' : 'Invoices', icon: '📄', path: '/factures', active: false },
        { label: t.mesClients, icon: '👥', path: '/clients', active: false },
        { label: t.stats, icon: '📊', path: '/stats', active: false },
        { label: t.parametres, icon: '⚙️', path: '/parametres', active: false },
      ].map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 14px', borderRadius: '12px', cursor: 'pointer',
            backgroundColor: item.active ? 'rgba(37,99,235,0.15)' : 'transparent',
            border: item.active ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent',
            color: item.active ? '#60A5FA' : '#64748B',
            fontSize: '14px', fontWeight: item.active ? '600' : '400',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!item.active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94A3B8'; }}}
          onMouseLeave={e => { if (!item.active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}}
        >
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          {item.label}
        </div>
      ))}

      {/* Upgrade card */}
      <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)', borderRadius: '14px', padding: '16px', cursor: 'pointer' }} onClick={() => navigate('/parametres')}>
        <p style={{ margin: '0 0 4px 0', fontWeight: '700', fontSize: '13px', color: 'white' }}>🚀 Plan Pro</p>
        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{langue === 'fr' ? 'Factures illimitées' : 'Unlimited invoices'}</p>
        <div style={{ backgroundColor: 'white', color: '#2563EB', borderRadius: '8px', padding: '6px 0', textAlign: 'center', fontSize: '12px', fontWeight: '700' }}>
          {langue === 'fr' ? 'Upgrade — 5$/mois' : 'Upgrade — $5/month'}
        </div>
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
          {nomUtilisateur[0].toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nomUtilisateur}</p>
          <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>Free plan</p>
        </div>
      </div>
    </div>
  );

  // ===== CONTENU PRINCIPAL =====
  const Contenu = () => (
    <div style={{ padding: isDesktop ? '32px 36px' : '28px 20px 100px 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>{t.bienvenue}</p>
          <h1 style={{ margin: '2px 0 0 0', fontSize: isDesktop ? '26px' : '22px', fontWeight: '700', color: 'white' }}>{nomUtilisateur}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')}
            style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
            {langue === 'fr' ? 'EN' : 'FR'}
          </button>
          {!isDesktop && (
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
              {nomUtilisateur[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Grille desktop */}
      {isDesktop ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Colonne gauche */}
          <div>
            {/* Carte revenus */}
            <div style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #4F46E5 50%, #7C3AED 100%)', borderRadius: '20px', padding: '28px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
              <p style={{ margin: '0 0 6px 0', color: 'rgba(255,255,255,0.65)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.revenus}</p>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '40px', fontWeight: '800', letterSpacing: '-1px' }}>${stats.revenus.toFixed(2)}</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{stats.payees} {t.payees}</span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{stats.attente} {t.attente}</span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{stats.retard} {t.retard}</span>
              </div>
            </div>

            {/* Métriques */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: t.payees, valeur: stats.payees, couleur: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
                { label: t.attente, valeur: stats.attente, couleur: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
                { label: t.retard, valeur: stats.retard, couleur: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
                { label: t.clients, valeur: stats.clients, couleur: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
              ].map((item) => (
                <div key={item.label} style={{ backgroundColor: item.bg, padding: '16px', borderRadius: '14px', border: `1px solid ${item.border}` }}>
                  <p style={{ margin: 0, fontSize: '11px', color: item.couleur, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                  <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', color: 'white', fontWeight: '700' }}>{item.valeur}</h3>
                </div>
              ))}
            </div>

            {/* Boutons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => navigate('/nouvelle-facture')} style={{ padding: '14px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                + {t.nouvelleFacture}
              </button>
              <button onClick={() => navigate('/clients')} style={{ padding: '14px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                {t.mesClients}
              </button>
            </div>

            {/* Paiements */}
            <div style={{ ...cardStyle }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{t.paiements}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['M-Pesa', 'Airtel Money', 'MTN MoMo', 'Cash', 'Virement'].map((mode) => (
                  <span key={mode} style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(96,165,250,0.2)' }}>
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div>
            {/* Barre de recherche */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <input
                type="text"
                placeholder={t.recherche}
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', color: 'white' }}
              />
              <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: '15px' }}>🔍</span>
              {recherche && (
                <span onClick={() => setRecherche('')} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', cursor: 'pointer', fontSize: '15px' }}>✕</span>
              )}
            </div>

            {/* Graphique */}
            <div style={{ ...cardStyle }}>
              <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{t.graphTitle}</p>
              <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748B' }}>USD</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={dataBar} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => ['$' + value, t.revenus]} contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: 'white' }} />
                  <Area type="monotone" dataKey="revenus" stroke="#2563EB" strokeWidth={2.5} fill="url(#colorRevenu)" dot={{ fill: '#2563EB', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Camembert */}
            <div style={{ ...cardStyle }}>
              <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{t.statutTitle}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="55%" height={140}>
                  <PieChart>
                    <Pie data={[
                      { name: t.payees, value: stats.payees || 1 },
                      { name: t.attente, value: stats.attente || 0 },
                      { name: t.retard, value: stats.retard || 0 },
                    ]} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}>
                      {COLORS.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ width: '45%' }}>
                  {[
                    { name: t.payees, value: stats.payees, color: '#60A5FA' },
                    { name: t.attente, value: stats.attente, color: '#F59E0B' },
                    { name: t.retard, value: stats.retard, color: '#EF4444' },
                  ].map((entry, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: entry.color, marginRight: '8px', flexShrink: 0 }}></div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1', fontWeight: '500' }}>{entry.name}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{entry.value} {t.factures}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Factures récentes / résultats recherche */}
            <div style={{ ...cardStyle }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: 'white' }}>
                  {recherche ? `🔍 "${recherche}"` : t.facturesRecentes}
                </p>
                {!recherche && <span onClick={() => navigate('/factures')} style={{ fontSize: '12px', color: '#60A5FA', cursor: 'pointer' }}>{t.voirTout} →</span>}
              </div>
              <FacturesList factures={facturesAffichees} />
            </div>
          </div>
        </div>

      ) : (
        // ===== MOBILE =====
        <>
          {/* Carte revenus */}
          <div style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #4F46E5 50%, #7C3AED 100%)', borderRadius: '20px', padding: '24px', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
            <p style={{ margin: '0 0 6px 0', color: 'rgba(255,255,255,0.65)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.revenus}</p>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' }}>${stats.revenus.toFixed(2)}</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{stats.payees} {t.payees}</span>
              <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{stats.attente} {t.attente}</span>
              <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>{stats.retard} {t.retard}</span>
            </div>
          </div>

          {/* Barre de recherche */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <input
              type="text"
              placeholder={t.recherche}
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', color: 'white' }}
            />
            <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: '15px' }}>🔍</span>
            {recherche && (
              <span onClick={() => setRecherche('')} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', cursor: 'pointer', fontSize: '15px' }}>✕</span>
            )}
          </div>

          {/* Résultats recherche */}
          {recherche && (
            <div style={{ ...cardStyle }}>
              <p style={{ margin: '0 0 14px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>🔍 "{recherche}"</p>
              <FacturesList factures={resultatsRecherche} />
            </div>
          )}

          {/* Métriques */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            {[
              { label: t.payees, valeur: stats.payees, couleur: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
              { label: t.attente, valeur: stats.attente, couleur: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
              { label: t.retard, valeur: stats.retard, couleur: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
              { label: t.clients, valeur: stats.clients, couleur: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
            ].map((item) => (
              <div key={item.label} style={{ backgroundColor: item.bg, padding: '16px', borderRadius: '14px', border: `1px solid ${item.border}` }}>
                <p style={{ margin: 0, fontSize: '11px', color: item.couleur, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', color: 'white', fontWeight: '700' }}>{item.valeur}</h3>
              </div>
            ))}
          </div>

          {/* Boutons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => navigate('/nouvelle-facture')} style={{ padding: '14px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
              + {t.nouvelleFacture}
            </button>
            <button onClick={() => navigate('/clients')} style={{ padding: '14px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
              {t.mesClients}
            </button>
          </div>

          {/* Graphique */}
          <div style={{ ...cardStyle }}>
            <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{t.graphTitle}</p>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748B' }}>USD</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={dataBar} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenu2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => ['$' + value, t.revenus]} contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: 'white' }} />
                <Area type="monotone" dataKey="revenus" stroke="#2563EB" strokeWidth={2.5} fill="url(#colorRevenu2)" dot={{ fill: '#2563EB', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Camembert */}
          <div style={{ ...cardStyle }}>
            <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{t.statutTitle}</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="55%" height={140}>
                <PieChart>
                  <Pie data={[
                    { name: t.payees, value: stats.payees || 1 },
                    { name: t.attente, value: stats.attente || 0 },
                    { name: t.retard, value: stats.retard || 0 },
                  ]} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {COLORS.map((color, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ width: '45%' }}>
                {[
                  { name: t.payees, value: stats.payees, color: '#60A5FA' },
                  { name: t.attente, value: stats.attente, color: '#F59E0B' },
                  { name: t.retard, value: stats.retard, color: '#EF4444' },
                ].map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: entry.color, marginRight: '8px', flexShrink: 0 }}></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1', fontWeight: '500' }}>{entry.name}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{entry.value} {t.factures}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paiements */}
          <div style={{ ...cardStyle }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{t.paiements}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['M-Pesa', 'Airtel Money', 'MTN MoMo', 'Cash', 'Virement'].map((mode) => (
                <span key={mode} style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: '#60A5FA', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(96,165,250,0.2)' }}>
                  {mode}
                </span>
              ))}
            </div>
          </div>

          {/* Factures récentes */}
          {!recherche && (
            <div style={{ ...cardStyle }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: 'white' }}>{t.facturesRecentes}</p>
                <span onClick={() => navigate('/factures')} style={{ fontSize: '12px', color: '#60A5FA', cursor: 'pointer' }}>{t.voirTout} →</span>
              </div>
              <FacturesList factures={facturesRecentes} />
            </div>
          )}

          {/* Conseil */}
          <div style={{ backgroundColor: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)', padding: '14px 16px', borderRadius: '12px', marginBottom: '20px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: '700', color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.conseil_titre}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: '1.6' }}>{t.conseil}</p>
          </div>
        </>
      )}
    </div>
  );

  // ===== LISTE FACTURES =====
  const FacturesList = ({ factures }) => {
    if (factures.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
            {recherche ? t.aucunResultat : t.aucune}
          </p>
          {!recherche && (
            <button onClick={() => navigate('/nouvelle-facture')} style={{ marginTop: '12px', padding: '10px 20px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
              {t.creer}
            </button>
          )}
        </div>
      );
    }
    return factures.map((facture) => (
      <div key={facture.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }} onClick={() => navigate('/factures')}>
        <div>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'white' }}>{facture.client_nom}</p>
          <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#64748B' }}>{facture.mode_paiement}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'white' }}>${facture.montant}</p>
          <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px', backgroundColor: couleurStatut[facture.statut]?.bg || 'rgba(255,255,255,0.1)', color: couleurStatut[facture.statut]?.color || 'white' }}>
            {couleurStatut[facture.statut]?.label || facture.statut}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", backgroundColor: '#0F172A', minHeight: '100vh', color: 'white', display: 'flex' }}>
      {isDesktop && <Sidebar />}
      <div style={{ flex: 1, marginLeft: isDesktop ? '240px' : '0', width: isDesktop ? 'calc(100% - 240px)' : '100%' }}>
        <Contenu />
      </div>
    </div>
  );
}

export default Dashboard;