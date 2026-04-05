import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function NewInvoice({ langue }) {
  const navigate = useNavigate();
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState('');
  const [paiement, setPaiement] = useState('M-Pesa');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const t = {
    fr: {
      titre: 'Nouvelle facture',
      client: 'Nom du client',
      clientPlaceholder: 'ex: Boutique Amina',
      description: 'Description',
      descPlaceholder: 'ex: Livraison de marchandises',
      montant: 'Montant ($)',
      montantPlaceholder: '0.00',
      date: 'Date limite',
      paiement: 'Mode de paiement',
      envoyer: 'Envoyer la facture',
      envoi: 'Envoi en cours...',
      erreurVide: 'Remplis tous les champs !',
      erreurMontant: 'Le montant doit etre superieur a 0',
      succes: 'Facture creee avec succes !',
      apercu: 'Apercu',
      limiteAtteinte: 'Limite atteinte ! Passe au plan Pro pour continuer.',
      upgradeBtn: 'Passer au Pro',
    },
    en: {
      titre: 'New invoice',
      client: 'Client name',
      clientPlaceholder: 'ex: Amina Store',
      description: 'Description',
      descPlaceholder: 'ex: Goods delivery',
      montant: 'Amount ($)',
      montantPlaceholder: '0.00',
      date: 'Due date',
      paiement: 'Payment method',
      envoyer: 'Send invoice',
      envoi: 'Sending...',
      erreurVide: 'Please fill all fields!',
      erreurMontant: 'Amount must be greater than 0',
      succes: 'Invoice created successfully!',
      apercu: 'Preview',
      limiteAtteinte: 'Limit reached! Upgrade to Pro to continue.',
      upgradeBtn: 'Upgrade to Pro',
    }
  };

  const text = t[langue] || t['fr'];

  const handleSubmit = async () => {
    if (!client || !description || !montant) {
      setErreur(text.erreurVide);
      return;
    }

    if (parseFloat(montant) <= 0) {
      setErreur(text.erreurMontant);
      return;
    }

    setLoading(true);
    setErreur('');

    const { data: { user } } = await supabase.auth.getUser();

    const { count } = await supabase
      .from('factures')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count >= 10) {
      setErreur(text.limiteAtteinte);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('factures').insert([{
      client_nom: client,
      description: description,
      montant: parseFloat(montant),
      mode_paiement: paiement,
      date_limite: date || null,
      statut: 'attente',
      user_id: user.id,
    }]);

    setLoading(false);

    if (error) {
      setErreur('Erreur : ' + error.message);
    } else {
      alert(text.succes);
      navigate('/factures');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '14px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    boxSizing: 'border-box',
    outline: 'none',
    color: 'white',
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#64748B',
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white' }}>
      <div style={{ padding: '28px 20px 20px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', gap: '14px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{text.titre}</h1>
        </div>

        {/* Compteur factures */}
        <div style={{ backgroundColor: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#60A5FA' }}>
            {langue === 'fr' ? 'Plan gratuit — 10 factures/mois' : 'Free plan — 10 invoices/month'}
          </p>
          <span
            onClick={() => navigate('/parametres')}
            style={{ fontSize: '12px', color: '#60A5FA', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
            {text.upgradeBtn}
          </span>
        </div>

        {/* Formulaire */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px' }}>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{text.client}</label>
            <input
              type="text"
              placeholder={text.clientPlaceholder}
              value={client}
              onChange={(e) => setClient(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{text.description}</label>
            <input
              type="text"
              placeholder={text.descPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>{text.montant}</label>
              <input
                type="number"
                placeholder={text.montantPlaceholder}
                value={montant}
                min="0"
                onChange={(e) => setMontant(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>{text.date}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{text.paiement}</label>
            <select
              value={paiement}
              onChange={(e) => setPaiement(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="MTN MoMo">MTN MoMo</option>
              <option value="Cash">Cash</option>
              <option value="Virement">Virement bancaire</option>
            </select>
          </div>

          {/* Apercu */}
          {client && montant && parseFloat(montant) > 0 && (
            <div style={{ backgroundColor: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#60A5FA', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{text.apercu}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'white', fontWeight: '600' }}>{client}</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748B' }}>{paiement}</p>
                </div>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#60A5FA' }}>${parseFloat(montant).toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {erreur && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#EF4444' }}>{erreur}</p>
              {erreur.includes('Pro') || erreur.includes('Limit') ? (
                <button
                  onClick={() => navigate('/parametres')}
                  style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                  {text.upgradeBtn}
                </button>
              ) : null}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700' }}>
            {loading ? text.envoi : text.envoyer}
          </button>

        </div>
      </div>
    </div>
  );
}

export default NewInvoice;