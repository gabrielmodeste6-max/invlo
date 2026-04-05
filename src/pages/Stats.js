import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

function Stats({ langue }) {
  const [stats, setStats] = useState({ revenus: 0, factures: 0, clients: 0, tauxPaiement: 0 });
  const [dataArea, setDataArea] = useState([]);
  const [dataLine, setDataLine] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = {
    fr: {
      titre: 'Statistiques',
      revenus: 'Revenus totaux',
      factures: 'Total factures',
      clients: 'Total clients',
      tauxPaiement: 'Taux de paiement',
      revenusMois: 'Revenus par mois',
      evolution: 'Evolution des factures',
      topClients: 'Top clients',
      facture: 'factures',
      usd: 'En dollars USD',
      parMois: 'Nombre par mois',
      chargement: 'Chargement...',
      payees: 'Payees',
      attente: 'En attente',
      retard: 'En retard',
    },
    en: {
      titre: 'Statistics',
      revenus: 'Total revenue',
      factures: 'Total invoices',
      clients: 'Total clients',
      tauxPaiement: 'Payment rate',
      revenusMois: 'Revenue per month',
      evolution: 'Invoice evolution',
      topClients: 'Top clients',
      facture: 'invoices',
      usd: 'In USD',
      parMois: 'Count per month',
      chargement: 'Loading...',
      payees: 'Paid',
      attente: 'Pending',
      retard: 'Overdue',
    }
  };

  const text = t[langue] || t['fr'];
  const COLORS = ['#60A5FA', '#F59E0B', '#EF4444'];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('factures').select('*');

    if (!error && data) {
      const payees = data.filter(f => f.statut === 'payee');
      const attente = data.filter(f => f.statut === 'attente');
      const retard = data.filter(f => f.statut === 'retard');
      const revenus = payees.reduce((sum, f) => sum + Number(f.montant), 0);
      const clientsUniques = [...new Set(data.map(f => f.client_nom))].length;
      const taux = data.length > 0 ? Math.round((payees.length / data.length) * 100) : 0;

      setStats({
        revenus,
        factures: data.length,
        clients: clientsUniques,
        tauxPaiement: taux,
        payees: payees.length,
        attente: attente.length,
        retard: retard.length,
      });

      // Revenus par mois
      const moisNoms = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenusParMois = {};
      const facturesParMois = {};

      data.forEach(f => {
        const date = new Date(f.created_at);
        const mois = moisNoms[date.getMonth()];
        if (!revenusParMois[mois]) revenusParMois[mois] = 0;
        if (!facturesParMois[mois]) facturesParMois[mois] = 0;
        if (f.statut === 'payee') revenusParMois[mois] += Number(f.montant);
        facturesParMois[mois] += 1;
      });

      const derniersMois = moisNoms.slice(-6);
      setDataArea(derniersMois.map(m => ({ mois: m, revenus: revenusParMois[m] || 0 })));
      setDataLine(derniersMois.map(m => ({ mois: m, factures: facturesParMois[m] || 0 })));

      // Top clients
      const clientsMap = {};
      data.forEach(f => {
        if (!clientsMap[f.client_nom]) clientsMap[f.client_nom] = { nom: f.client_nom, montant: 0, factures: 0 };
        clientsMap[f.client_nom].montant += Number(f.montant);
        clientsMap[f.client_nom].factures += 1;
      });
      const sorted = Object.values(clientsMap).sort((a, b) => b.montant - a.montant).slice(0, 5);
      setTopClients(sorted);
    }
    setLoading(false);
  };

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px',
  };

  const tooltipStyle = {
    backgroundColor: '#1E293B',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'white'
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748B' }}>{text.chargement}</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white' }}>
      <div style={{ padding: '28px 20px 20px 20px' }}>

        {/* Header */}
        <h1 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700' }}>{text.titre}</h1>

        {/* Metriques */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: text.revenus, valeur: '$' + stats.revenus.toFixed(0), couleur: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
            { label: text.factures, valeur: stats.factures, couleur: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
            { label: text.clients, valeur: stats.clients, couleur: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
            { label: text.tauxPaiement, valeur: stats.tauxPaiement + '%', couleur: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
          ].map((item) => (
            <div key={item.label} style={{ backgroundColor: item.bg, padding: '16px', borderRadius: '14px', border: `1px solid ${item.border}` }}>
              <p style={{ margin: 0, fontSize: '11px', color: item.couleur, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', color: 'white', fontWeight: '700' }}>{item.valeur}</h3>
            </div>
          ))}
        </div>

        {/* Graphique area revenus */}
        <div style={{ ...cardStyle }}>
          <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{text.revenusMois}</p>
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748B' }}>{text.usd}</p>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={dataArea} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => ['$' + value, text.revenus]} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenus" stroke="#2563EB" strokeWidth={2.5} fill="url(#colorStats)" dot={{ fill: '#2563EB', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique ligne */}
        <div style={{ ...cardStyle }}>
          <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{text.evolution}</p>
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748B' }}>{text.parMois}</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={dataLine} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [value, text.facture]} contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="factures" stroke="#A78BFA" strokeWidth={2.5} dot={{ fill: '#A78BFA', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Camembert */}
        <div style={{ ...cardStyle }}>
          <p style={{ margin: '0 0 14px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>Statut</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="55%" height={140}>
              <PieChart>
                <Pie
                  data={[
                    { name: text.payees, value: stats.payees || 1 },
                    { name: text.attente, value: stats.attente || 0 },
                    { name: text.retard, value: stats.retard || 0 },
                  ]}
                  cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={4}>
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: '45%' }}>
              {[
                { name: text.payees, value: stats.payees || 0, color: '#60A5FA' },
                { name: text.attente, value: stats.attente || 0, color: '#F59E0B' },
                { name: text.retard, value: stats.retard || 0, color: '#EF4444' },
              ].map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: entry.color, marginRight: '8px', flexShrink: 0 }}></div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1', fontWeight: '500' }}>{entry.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{entry.value} {text.facture}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top clients */}
        <div style={{ ...cardStyle, marginBottom: '80px' }}>
          <p style={{ margin: '0 0 16px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{text.topClients}</p>
          {topClients.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '13px', textAlign: 'center' }}>Aucun client pour l instant</p>
          ) : (
            topClients.map((client, index) => (
              <div key={client.nom} style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: index === 0 ? 'rgba(245,158,11,0.2)' : index === 1 ? 'rgba(148,163,184,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : '#475569', marginRight: '12px', flexShrink: 0 }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'white' }}>{client.nom}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{client.factures} {text.facture}</p>
                </div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#60A5FA' }}>${client.montant.toFixed(0)}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Stats;