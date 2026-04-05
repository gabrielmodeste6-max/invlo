import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function Register({ langue }) {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const t = {
    fr: {
      titre: 'Creer un compte',
      sousTitre: 'Rejoins Invlo gratuitement',
      nom: 'Nom complet',
      email: 'Email',
      password: 'Mot de passe',
      inscription: 'Creer mon compte',
      connexion: 'Deja un compte ? Se connecter',
      chargement: 'Creation...',
      erreurVide: 'Remplis tous les champs',
      succes: 'Compte cree ! Verifie ton email.',
    },
    en: {
      titre: 'Create account',
      sousTitre: 'Join Invlo for free',
      nom: 'Full name',
      email: 'Email',
      password: 'Password',
      inscription: 'Create my account',
      connexion: 'Already have an account? Login',
      chargement: 'Creating...',
      erreurVide: 'Please fill all fields',
      succes: 'Account created! Check your email.',
    }
  };

  const text = t[langue] || t['fr'];

  const handleRegister = async () => {
    if (!nom || !email || !password) {
      setErreur(text.erreurVide);
      return;
    }
    setLoading(true);
    setErreur('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nom }
      }
    });

    setLoading(false);

    if (error) {
      setErreur(error.message);
    } else {
      alert(text.succes);
      navigate('/login');
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
    marginBottom: '14px',
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '24px', fontWeight: '800' }}>
          I
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Invlo</h1>
        <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>{text.sousTitre}</p>
      </div>

      {/* Formulaire */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '700' }}>{text.titre}</h2>

        <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px', fontWeight: '500' }}>{text.nom}</label>
        <input
          type="text"
          placeholder="Gabriel Mutombo"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          style={inputStyle}
        />

        <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px', fontWeight: '500' }}>{text.email}</label>
        <input
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px', fontWeight: '500' }}>{text.password}</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {erreur && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#EF4444' }}>{erreur}</p>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', marginBottom: '16px' }}>
          {loading ? text.chargement : text.inscription}
        </button>

        <p
          onClick={() => navigate('/login')}
          style={{ textAlign: 'center', fontSize: '13px', color: '#60A5FA', cursor: 'pointer', margin: 0 }}>
          {text.connexion}
        </p>
      </div>
    </div>
  );
}

export default Register;