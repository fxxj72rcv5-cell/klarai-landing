import React, { useState, useEffect } from 'react';
import { AudioWaveform } from 'lucide-react';

const Navigation = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/50' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <AudioWaveform className="w-5 h-5 text-slate-900" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Pod<span className="text-emerald-400">Kraft</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          {[
            { label: 'Pipeline', id: 'pipeline' },
            { label: 'Engines', id: 'engines' },
            { label: 'Hosts', id: 'hosts' },
            { label: 'A/B Testing', id: 'ab-testing' },
            { label: 'Roadmap', id: 'roadmap' },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('auth', 'login')}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            Anmelden
          </button>
          <button
            onClick={() => onNavigate('auth', 'register')}
            className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg transition-all duration-300"
          >
            Registrieren
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
