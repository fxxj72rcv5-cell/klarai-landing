import React from 'react';
import { motion } from 'framer-motion';

const AudioWaveformVisual = () => {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-[3px] h-16 my-8">
      {[...Array(bars)].map((_, i) => {
        const center = bars / 2;
        const distance = Math.abs(i - center) / center;
        const maxHeight = 100 - distance * 60;
        return (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-emerald-300"
            animate={{
              height: [`${maxHeight * 0.3}%`, `${maxHeight}%`, `${maxHeight * 0.3}%`],
            }}
            transition={{
              duration: 1.2 + Math.random() * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.05,
            }}
          />
        );
      })}
    </div>
  );
};

const Hero = ({ onNavigate }) => {
  return (
    <section id="hero" className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Die Zukunft des Audio-Contents
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          KI-Podcasts, die sich{' '}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
            wie echte Gespräche
          </span>{' '}
          anhören
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AudioWaveformVisual />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Eine datengetriebene Plattform, die Podcasts automatisch produziert, testet und optimiert –{' '}
          <span className="text-white font-medium">mit menschlicher Natürlichkeit statt synthetischer Perfektion.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <button
            onClick={() => onNavigate('auth', 'register')}
            className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            Jetzt kostenlos starten
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-300 border border-slate-700"
          >
            Mehr erfahren
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm text-slate-500"
        >
          ✓ 6 KI-Engines · ✓ Vollautomatisch · ✓ Datengetrieben
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
