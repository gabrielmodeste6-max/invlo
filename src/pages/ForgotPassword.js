import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function ForgotPassword({ langue }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState('');

  const t = {
    fr: {
      titre: 'Mot de passe oublie',
      sousTitre: 'Entre ton email pour recevoir un lien de reinitialisation',
      email: 'Email',
      envoyer: 'Envoyer le lien',
      envoi: 'Envoi en cours...',
      retour: 'Retour a la connexion',
      succesMsg: 'Lien envoye ! Verifie ton email.',
      erreurVide: 'Entre ton email',
    },
    en: {
      titre: 'Forgot password',
      sousTitre: 'Enter your email to receive a reset link',
      email: 'Email',
      envoyer: 'Send reset link',
      envoi: 'Sending...',
      retour: 'Back to login',
      succesMsg: 'Link sent! Check your email.',
      erreurVide: 'Please enter your email',
    }
  };

  const text = t[langue] || t['fr'];

  const handleReset = async () => {
    if (!email) {
      setErreur(text.erreurVide);
      return;
    }
    setLoading(true);
    setErreur('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3001/reset-password',
    });

    setLoading(false);

    if (error) {
      setErreur(error.message);
    } else {
      setSucces(true);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '24px', fontWeight: '800' }}>
          I
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Invlo</h1>
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>

        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700' }}>{text.titre}</h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#64748B' }}>{text.sousTitre}</p>

        {succes ? (
          <div style={{ backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#34D399', fontWeight: '600' }}>{text.succesMsg}</p>
          </div>
        ) : (
          <>
            <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px', fontWeight: '500' }}>{text.email}</label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', color: 'white', marginBottom: '14px' }}
            />

            {erreur && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#EF4444' }}>{erreur}</p>
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', marginBottom: '16px' }}>
              {loading ? text.envoi : text.envoyer}
            </button>
          </>
        )}

        <p
          onClick={() => navigate('/login')}
          style={{ textAlign: 'center', fontSize: '13px', color: '#60A5FA', cursor: 'pointer', margin: 0 }}>
          {text.retour}
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;