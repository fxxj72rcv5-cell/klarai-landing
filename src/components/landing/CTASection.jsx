import React from 'react';
import { motion } from 'framer-motion';

const CTASection = ({ onNavigate }) => {
  return (
    <section className="border-t border-slate-800/50">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Gehören Sie zu den Ersten
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Registrieren Sie sich jetzt und starten Sie als einer der Ersten mit der KI-Podcast-Revolution.
          </p>
          <button
            onClick={() => onNavigate('auth', 'register')}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Kostenlos registrieren →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
