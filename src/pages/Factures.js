import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import jsPDF from 'jspdf';

function Factures({ langue }) {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState('tout');
  const [recherche, setRecherche] = useState('');
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [factureSelectionnee, setFactureSelectionnee] = useState(null);

  const t = {
    fr: {
      titre: 'Factures',
      recherche: 'Rechercher...',
      tout: 'Tout',
      payees: 'Payees',
      attente: 'En attente',
      retard: 'En retard',
      nouvelle: '+ Nouvelle',
      aucune: 'Aucune facture trouvee',
      aucuneSub: 'Cree ta premiere facture',
      chargement: 'Chargement...',
      statut: 'Changer le statut',
      supprimer: 'Supprimer cette facture',
      confirmer: 'Confirmer la suppression ?',
      modePaiement: 'Mode de paiement',
      montant: 'Montant',
      description: 'Description',
      telecharger: 'Telecharger PDF',
      whatsapp: 'Envoyer par WhatsApp',
    },
    en: {
      titre: 'Invoices',
      recherche: 'Search...',
      tout: 'All',
      payees: 'Paid',
      attente: 'Pending',
      retard: 'Overdue',
      nouvelle: '+ New',
      aucune: 'No invoices found',
      aucuneSub: 'Create your first invoice',
      chargement: 'Loading...',
      statut: 'Change status',
      supprimer: 'Delete this invoice',
      confirmer: 'Confirm deletion?',
      modePaiement: 'Payment method',
      montant: 'Amount',
      description: 'Description',
      telecharger: 'Download PDF',
      whatsapp: 'Send via WhatsApp',
    }
  };

  const text = t[langue] || t['fr'];

  const couleurStatut = {
    payee: { bg: 'rgba(96,165,250,0.1)', color: '#60A5FA', border: 'rgba(96,165,250,0.2)', label: langue === 'fr' ? 'Payee' : 'Paid' },
    attente: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)', label: langue === 'fr' ? 'En attente' : 'Pending' },
    retard: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'rgba(239,68,68,0.2)', label: langue === 'fr' ? 'En retard' : 'Overdue' },
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('factures')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setFactures(data);
    setLoading(false);
  };

  const changerStatut = async (id, nouveauStatut) => {
    const { error } = await supabase
      .from('factures')
      .update({ statut: nouveauStatut })
      .eq('id', id);
    if (!error) {
      await fetchFactures();
      setFactureSelectionnee(prev => ({ ...prev, statut: nouveauStatut }));
    }
  };

  const supprimerFacture = async (id) => {
    if (window.confirm(text.confirmer)) {
      const { error } = await supabase
        .from('factures')
        .delete()
        .eq('id', id);
      if (!error) {
        await fetchFactures();
        setFactureSelectionnee(null);
      }
    }
  };

  const exporterPDF = (facture) => {
    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('INVLO', 20, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('invlo.app', 150, 25);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 20, 60);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Date :', 20, 75);
    doc.text('Statut :', 20, 83);

    doc.setTextColor(30, 41, 59);
    doc.text(new Date().toLocaleDateString('fr-FR'), 60, 75);
    doc.text(facture.statut.toUpperCase(), 60, 83);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 95, 190, 95);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Client', 20, 110);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Nom :', 20, 120);
    doc.setTextColor(30, 41, 59);
    doc.text(facture.client_nom, 60, 120);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 130, 190, 130);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Details', 20, 145);

    doc.setFillColor(248, 250, 252);
    doc.rect(20, 150, 170, 40, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Description', 25, 162);
    doc.text('Mode de paiement', 25, 172);
    doc.text('Date limite', 25, 182);

    doc.setTextColor(30, 41, 59);
    doc.text(facture.description || '-', 100, 162);
    doc.text(facture.mode_paiement || '-', 100, 172);
    doc.text(facture.date_limite || '-', 100, 182);

    doc.setFillColor(37, 99, 235);
    doc.rect(20, 205, 170, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 25, 221);
    doc.setFontSize(16);
    doc.text('$' + Number(facture.montant).toFixed(2), 140, 221);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Merci pour votre confiance — Invlo', 105, 270, { align: 'center' });
    doc.text('invlo.app', 105, 278, { align: 'center' });

    doc.save('facture-' + facture.client_nom + '.pdf');
  };

  const envoyerWhatsApp = (facture) => {
    const message = `
*FACTURE INVLO*
--------------------------
*Client :* ${facture.client_nom}
*Description :* ${facture.description}
*Montant :* $${Number(facture.montant).toFixed(2)}
*Mode de paiement :* ${facture.mode_paiement}
*Statut :* ${facture.statut.toUpperCase()}
*Date :* ${new Date().toLocaleDateString('fr-FR')}
--------------------------
_Merci pour votre confiance_
_Invlo — invlo.app_
    `.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const facturesFiltrees = factures.filter((f) => {
    const matchFiltre = filtre === 'tout' || f.statut === filtre;
    const matchRecherche = f.client_nom.toLowerCase().includes(recherche.toLowerCase());
    return matchFiltre && matchRecherche;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white' }}>

      {/* Modal */}
      {factureSelectionnee && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px 20px 0 0', padding: '24px 24px 100px 24px', width: '100%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{factureSelectionnee.client_nom}</h3>
              <button onClick={() => setFactureSelectionnee(null)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>{text.montant}</span>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>${factureSelectionnee.montant}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>{text.description}</span>
                <span style={{ color: 'white', fontSize: '13px' }}>{factureSelectionnee.description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>{text.modePaiement}</span>
                <span style={{ color: 'white', fontSize: '13px' }}>{factureSelectionnee.mode_paiement}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>Statut</span>
                <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '6px', backgroundColor: couleurStatut[factureSelectionnee.statut]?.bg, color: couleurStatut[factureSelectionnee.statut]?.color }}>
                  {couleurStatut[factureSelectionnee.statut]?.label}
                </span>
              </div>
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{text.statut}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {[
                { key: 'payee', label: langue === 'fr' ? 'Payee' : 'Paid', color: '#60A5FA' },
                { key: 'attente', label: langue === 'fr' ? 'En attente' : 'Pending', color: '#F59E0B' },
                { key: 'retard', label: langue === 'fr' ? 'En retard' : 'Overdue', color: '#EF4444' },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => changerStatut(factureSelectionnee.id, s.key)}
                  style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${s.color}44`, backgroundColor: factureSelectionnee.statut === s.key ? `${s.color}22` : 'transparent', color: s.color, fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => exporterPDF(factureSelectionnee)}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', marginBottom: '10px' }}>
              {text.telecharger}
            </button>

            <button
              onClick={() => envoyerWhatsApp(factureSelectionnee)}
              style={{ width: '100%', padding: '14px', backgroundColor: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', marginBottom: '10px' }}>
              {text.whatsapp}
            </button>

            <button
              onClick={() => supprimerFacture(factureSelectionnee.id)}
              style={{ width: '100%', padding: '14px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
              {text.supprimer}
            </button>

          </div>
        </div>
      )}

      <div style={{ padding: '28px 20px 20px 20px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{text.titre}</h1>
          <button onClick={() => navigate('/nouvelle-facture')} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
            {text.nouvelle}
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder={text.recherche}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', color: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'tout', label: text.tout },
            { key: 'payee', label: text.payees },
            { key: 'attente', label: text.attente },
            { key: 'retard', label: text.retard },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFiltre(item.key)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', backgroundColor: filtre === item.key ? '#2563EB' : 'rgba(255,255,255,0.05)', color: filtre === item.key ? 'white' : '#64748B' }}>
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            <p>{text.chargement}</p>
          </div>
        ) : facturesFiltrees.length === 0 ? (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '40px 20px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ fontWeight: '600', color: 'white', margin: '0 0 5px 0' }}>{text.aucune}</p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{text.aucuneSub}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '80px' }}>
            {facturesFiltrees.map((facture) => (
              <div
                key={facture.id}
                onClick={() => setFactureSelectionnee(facture)}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px', color: 'white' }}>{facture.client_nom}</p>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#64748B' }}>{facture.description}</p>
                  <span style={{ fontSize: '11px', color: '#64748B', backgroundColor: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>{facture.mode_paiement}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: 'white' }}>${facture.montant}</p>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '6px', backgroundColor: couleurStatut[facture.statut]?.bg || 'rgba(255,255,255,0.1)', color: couleurStatut[facture.statut]?.color || 'white', border: `1px solid ${couleurStatut[facture.statut]?.border || 'rgba(255,255,255,0.1)'}` }}>
                    {couleurStatut[facture.statut]?.label || facture.statut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Factures;