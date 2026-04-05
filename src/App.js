import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import Dashboard from './pages/Dashboard';
import NewInvoice from './pages/NewInvoice';
import Clients from './pages/Clients';
import Parametres from './pages/Parametres';
import Factures from './pages/Factures';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Register from './pages/Register';
import BottomNav from './components/BottomNav';

function App() {
  const [langue, setLangue] = useState('fr');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", maxWidth: '420px', margin: '0 auto', backgroundColor: '#0F172A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '24px', fontWeight: '800', color: 'white' }}>
            I
          </div>
          <p style={{ color: '#64748B', fontSize: '14px' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ maxWidth: '420px', margin: '0 auto', paddingBottom: session ? '70px' : '0' }}>
        <Routes>
          <Route path="/login" element={!session ? <Login langue={langue} /> : <Navigate to="/" />} />
          <Route path="/register" element={!session ? <Register langue={langue} /> : <Navigate to="/" />} />
          <Route path="/" element={session ? <Dashboard langue={langue} setLangue={setLangue} /> : <Navigate to="/login" />} />
          <Route path="/nouvelle-facture" element={session ? <NewInvoice langue={langue} /> : <Navigate to="/login" />} />
          <Route path="/clients" element={session ? <Clients langue={langue} /> : <Navigate to="/login" />} />
          <Route path="/parametres" element={session ? <Parametres langue={langue} setLangue={setLangue} /> : <Navigate to="/login" />} />
          <Route path="/factures" element={session ? <Factures langue={langue} /> : <Navigate to="/login" />} />
          <Route path="/stats" element={session ? <Stats langue={langue} /> : <Navigate to="/login" />} />
        </Routes>
        {session && <BottomNav langue={langue} />}
      </div>
    </Router>
  );
}

export default App;