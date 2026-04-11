import React from 'react';
import { AudioWaveform } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <AudioWaveform className="w-3.5 h-3.5 text-slate-900" />
          </div>
          <span className="text-sm text-slate-400">
            PodKraft © 2025
          </span>
        </div>
        <div className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Impressum</a>
          <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
          <a href="#" className="hover:text-white transition-colors">Kontakt</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
