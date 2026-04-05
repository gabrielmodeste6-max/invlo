import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [langue, setLangue] = useState('fr');

  const t = {
    fr: {
      hero: 'Gerez vos factures comme un pro',
      heroSub: 'La solution de facturation la plus simple pour les entrepreneurs africains. Cree, envoie et suis tes factures en quelques secondes.',
      commencer: 'Commencer gratuitement',
      dejaCompte: 'Deja un compte ? Se connecter',
      fonctions: 'Tout ce dont tu as besoin',
      f1: 'Factures en 30 secondes',
      f1Sub: 'Cree des factures professionnelles en quelques clics et envoie-les directement par WhatsApp.',
      f2: 'Paiements africains',
      f2Sub: 'M-Pesa, Airtel Money, MTN MoMo — tous les modes de paiement africains sont supportes.',
      f3: 'Export PDF',
      f3Sub: 'Telecharge tes factures en PDF professionnel pour les envoyer a tes clients.',
      f4: 'Stats en temps reel',
      f4Sub: 'Suis tes revenus, clients et factures avec des graphiques clairs et precis.',
      f5: 'Bilingue FR/EN',
      f5Sub: 'Interface disponible en francais et en anglais pour toucher toute l Afrique.',
      f6: 'Securise',
      f6Sub: 'Tes donnees sont protegees et visibles uniquement par toi.',
      prix: 'Un prix simple et transparent',
      gratuit: 'Gratuit',
      gratuitPrix: '$0 / mois',
      gratuitF1: '10 factures par mois',
      gratuitF2: 'Export PDF',
      gratuitF3: 'WhatsApp',
      gratuitF4: 'Stats de base',
      pro: 'Pro',
      proPrix: '$5 / mois',
      proF1: 'Factures illimitees',
      proF2: 'Export PDF illimite',
      proF3: 'WhatsApp illimite',
      proF4: 'Stats avancees',
      proF5: 'Support prioritaire',
      choisir: 'Choisir ce plan',
      populaire: 'Le plus populaire',
      temoignages: 'Ce que disent nos utilisateurs',
      footer: 'Invlo — La facturation simple pour les entrepreneurs africains',
      cta: 'Pret a commencer ?',
      ctaSub: 'Rejoins des milliers d entrepreneurs qui utilisent Invlo',
      ctaBtn: 'Creer mon compte gratuit',
    },
    en: {
      hero: 'Manage your invoices like a pro',
      heroSub: 'The simplest invoicing solution for African entrepreneurs. Create, send and track your invoices in seconds.',
      commencer: 'Start for free',
      dejaCompte: 'Already have an account? Login',
      fonctions: 'Everything you need',
      f1: 'Invoices in 30 seconds',
      f1Sub: 'Create professional invoices in a few clicks and send them directly via WhatsApp.',
      f2: 'African payments',
      f2Sub: 'M-Pesa, Airtel Money, MTN MoMo — all African payment methods are supported.',
      f3: 'PDF Export',
      f3Sub: 'Download your invoices as professional PDFs to send to your clients.',
      f4: 'Real-time stats',
      f4Sub: 'Track your revenue, clients and invoices with clear and accurate charts.',
      f5: 'Bilingual FR/EN',
      f5Sub: 'Interface available in French and English to reach all of Africa.',
      f6: 'Secure',
      f6Sub: 'Your data is protected and only visible to you.',
      prix: 'Simple and transparent pricing',
      gratuit: 'Free',
      gratuitPrix: '$0 / month',
      gratuitF1: '10 invoices per month',
      gratuitF2: 'PDF Export',
      gratuitF3: 'WhatsApp',
      gratuitF4: 'Basic stats',
      pro: 'Pro',
      proPrix: '$5 / month',
      proF1: 'Unlimited invoices',
      proF2: 'Unlimited PDF export',
      proF3: 'Unlimited WhatsApp',
      proF4: 'Advanced stats',
      proF5: 'Priority support',
      choisir: 'Choose this plan',
      populaire: 'Most popular',
      temoignages: 'What our users say',
      footer: 'Invlo — Simple invoicing for African entrepreneurs',
      cta: 'Ready to start?',
      ctaSub: 'Join thousands of entrepreneurs using Invlo',
      ctaBtn: 'Create my free account',
    }
  };

  const text = t[langue];

  const fonctions = [
    { titre: text.f1, desc: text.f1Sub, icone: '⚡' },
    { titre: text.f2, desc: text.f2Sub, icone: '💳' },
    { titre: text.f3, desc: text.f3Sub, icone: '📄' },
    { titre: text.f4, desc: text.f4Sub, icone: '📊' },
    { titre: text.f5, desc: text.f5Sub, icone: '🌍' },
    { titre: text.f6, desc: text.f6Sub, icone: '🔒' },
  ];

  const temoignages = [
    { nom: 'Amina K.', pays: 'Kenya', texte: langue === 'fr' ? 'Invlo a transforme ma facon de gerer mes clients. Je cree une facture en 30 secondes !' : 'Invlo transformed how I manage my clients. I create an invoice in 30 seconds!', avatar: 'AK' },
    { nom: 'Moussa D.', pays: 'Senegal', texte: langue === 'fr' ? 'Enfin une app simple qui supporte M-Pesa et Airtel Money. Parfait pour mon business !' : 'Finally a simple app that supports M-Pesa and Airtel Money. Perfect for my business!', avatar: 'MD' },
    { nom: 'Grace O.', pays: 'Nigeria', texte: langue === 'fr' ? 'Les stats en temps reel m aident a comprendre mon business comme jamais avant.' : 'Real-time stats help me understand my business like never before.', avatar: 'GO' },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", backgroundColor: '#0F172A', color: 'white', minHeight: '100vh' }}>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, backgroundColor: '#0F172A', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800' }}>I</div>
          <span style={{ fontSize: '18px', fontWeight: '700' }}>Invlo</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setLangue(langue === 'fr' ? 'en' : 'fr')}
            style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
            {langue === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '8px 16px', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
            {langue === 'fr' ? 'Commencer' : 'Get started'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px 60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#60A5FA', fontWeight: '600', marginBottom: '24px' }}>
          {langue === 'fr' ? 'La facturation made in Africa' : 'Invoicing made in Africa'}
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 20px 0', lineHeight: '1.15', background: 'linear-gradient(135deg, white 0%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {text.hero}
        </h1>
        <p style={{ fontSize: '18px', color: '#64748B', margin: '0 0 40px 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
          {text.heroSub}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/register')}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontWeight: '700' }}>
            {text.commencer}
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '14px 28px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' }}>
            {text.dejaCompte}
          </button>
        </div>

        {/* Preview app */}
        <div style={{ marginTop: '60px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', maxWidth: '360px', margin: '60px auto 0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{langue === 'fr' ? 'Revenus ce mois' : 'Revenue this month'}</p>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '800' }}>$2,840.00</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: langue === 'fr' ? 'Payees' : 'Paid', value: '18', color: '#60A5FA' },
              { label: langue === 'fr' ? 'En attente' : 'Pending', value: '4', color: '#F59E0B' },
              { label: langue === 'fr' ? 'En retard' : 'Overdue', value: '2', color: '#EF4444' },
              { label: langue === 'fr' ? 'Clients' : 'Clients', value: '12', color: '#A78BFA' },
            ].map((item) => (
              <div key={item.label} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
                <p style={{ margin: 0, fontSize: '10px', color: item.color, fontWeight: '600', textTransform: 'uppercase' }}>{item.label}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: 'white' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fonctions */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', margin: '0 0 12px 0' }}>{text.fonctions}</h2>
        <p style={{ textAlign: 'center', color: '#64748B', margin: '0 0 48px 0', fontSize: '16px' }}>
          {langue === 'fr' ? 'Tout ce qu il faut pour gerer ton business' : 'Everything you need to manage your business'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {fonctions.map((f) => (
            <div key={f.titre} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(37,99,235,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '14px' }}>
                {f.icone}
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{f.titre}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', margin: '0 0 12px 0' }}>{text.prix}</h2>
        <p style={{ textAlign: 'center', color: '#64748B', margin: '0 0 48px 0', fontSize: '16px' }}>
          {langue === 'fr' ? 'Commence gratuitement, evolue quand tu es pret' : 'Start for free, upgrade when ready'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>

          {/* Plan gratuit */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{text.gratuit}</p>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '36px', fontWeight: '800' }}>{text.gratuitPrix}</h3>
            {[text.gratuitF1, text.gratuitF2, text.gratuitF3, text.gratuitF4].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ color: '#60A5FA', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '14px', color: '#CBD5E1' }}>{f}</span>
              </div>
            ))}
            <button
              onClick={() => navigate('/register')}
              style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', marginTop: '20px' }}>
              {text.choisir}
            </button>
          </div>

          {/* Plan Pro */}
          <div style={{ backgroundColor: 'rgba(37,99,235,0.08)', border: '2px solid #2563EB', borderRadius: '20px', padding: '28px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563EB', borderRadius: '20px', padding: '4px 16px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
              {text.populaire}
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{text.pro}</p>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '36px', fontWeight: '800' }}>{text.proPrix}</h3>
            {[text.proF1, text.proF2, text.proF3, text.proF4, text.proF5].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ color: '#60A5FA', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '14px', color: '#CBD5E1' }}>{f}</span>
              </div>
            ))}
            <button
              onClick={() => navigate('/register')}
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontWeight: '700', marginTop: '20px' }}>
              {text.choisir}
            </button>
          </div>

        </div>
      </div>

      {/* Temoignages */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', margin: '0 0 48px 0' }}>{text.temoignages}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {temoignages.map((t) => (
            <div key={t.nom} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#94A3B8', lineHeight: '1.7', fontStyle: 'italic' }}>"{t.texte}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'white' }}>{t.nom}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{t.pays}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1D4ED8, #4F46E5, #7C3AED)', borderRadius: '24px', padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: '800' }}>{text.cta}</h2>
          <p style={{ margin: '0 0 32px 0', fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>{text.ctaSub}</p>
          <button
            onClick={() => navigate('/register')}
            style={{ padding: '16px 32px', backgroundColor: 'white', color: '#1D4ED8', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontWeight: '700' }}>
            {text.ctaBtn}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>{text.footer}</p>
      </div>

    </div>
  );
}

export default Landing;