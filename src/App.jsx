import React, { useState, useEffect } from 'react';
import ParticleBackground from './components/shared/ParticleBackground';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import { supabase } from './lib/supabase';

export default function App() {
  const [stage, setStage] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setStage('dashboard');
        }
      }
      setLoading(false);
    };
    checkSession();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setStage('dashboard');
        } else {
          setUser(null);
          setStage('landing');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const navigate = (newStage, mode) => {
    setStage(newStage);
    if (mode) setAuthMode(mode);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setStage('dashboard');
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setStage('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <ParticleBackground />

      {stage === 'landing' && (
        <LandingPage onNavigate={navigate} />
      )}

      {stage === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onNavigate={navigate}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {stage === 'dashboard' && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
