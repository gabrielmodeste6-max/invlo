import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function Clients({ langue }) {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = {
    fr: {
      titre: 'Clients',
      recherche: 'Rechercher un client...',
      factures: 'factures',
      total: 'Total depense',
      aucun: 'Aucun client pour l instant',
      aucunSub: 'Tes clients apparaitront apres ta premiere facture',
      creer: 'Creer une facture',
      chargement: 'Chargement...',
      revenus: 'Revenus',
      totalFactures: 'Factures',
      totalClients: 'Clients',
    },
    en: {
      titre: 'Clients',
      recherche: 'Search a client...',
      factures: 'invoices',
      total: 'Total spent',
      aucun: 'No clients yet',
      aucunSub: 'Your clients will appear after your first invoice',
      creer: 'Create an invoice',
      chargement: 'Loading...',
      revenus: 'Revenue',
      totalFactures: 'Invoices',
      totalClients: 'Clients',
    }
  };

  const text = t[langue] || t['fr'];

  const couleurs = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2'];

  const initiales = (nom) => {
    const mots = nom.split(' ');
    return mots.length >= 2 ? mots[0][0] + mots[1][0] : nom[0];
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('factures')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const clientsMap = {};
      data.forEach((facture) => {
        if (!clientsMap[facture.client_nom]) {
          clientsMap[facture.client_nom] = {
            nom: facture.client_nom,
            factures: 0,
            total: 0,
          };
        }
        clientsMap[facture.client_nom].factures += 1;
        clientsMap[facture.client_nom].total += Number(facture.montant);
      });
      setClients(Object.values(clientsMap));
    }
    setLoading(false);
  };

  const clientsFiltres = clients.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const totalRevenue = clients.reduce((sum, c) => sum + c.total, 0);
  const totalFactures = clients.reduce((sum, c) => sum + c.factures, 0);

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white' }}>
      <div style={{ padding: '28px 20px 20px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{text.titre}</h1>
          <button
            onClick={() => navigate('/nouvelle-facture')}
            style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
            + New
          </button>
        </div>

        {/* Stats rapides */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: text.totalClients, valeur: clients.length, couleur: '#60A5FA' },
            { label: text.totalFactures, valeur: totalFactures, couleur: '#A78BFA' },
            { label: text.revenus, valeur: '$' + totalRevenue.toFixed(0), couleur: '#34D399' },
          ].map((item) => (
            <div key={item.label} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: item.couleur }}>{item.valeur}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Recherche */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder={text.recherche}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', color: 'white' }}
          />
        </div>

        {/* Liste clients */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            <p>{text.chargement}</p>
          </div>
        ) : clientsFiltres.length === 0 ? (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '40px 20px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ fontWeight: '600', color: 'white', margin: '0 0 5px 0' }}>{text.aucun}</p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0' }}>{text.aucunSub}</p>
            <button
              onClick={() => navigate('/nouvelle-facture')}
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
              {text.creer}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '80px' }}>
            {clientsFiltres.map((client, index) => (
              <div key={client.nom} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: couleurs[index % couleurs.length] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: couleurs[index % couleurs.length], flexShrink: 0, border: `1px solid ${couleurs[index % couleurs.length]}33` }}>
                  {initiales(client.nom).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 3px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{client.nom}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{client.factures} {text.factures}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '700', fontSize: '15px', color: '#60A5FA' }}>${client.total.toFixed(0)}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>{text.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Clients;