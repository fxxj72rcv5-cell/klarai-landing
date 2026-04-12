import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../shared/SectionWrapper';
import { hosts } from '../../data/hosts';

const PersonalitySlider = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
      />
    </div>
    <span className="text-xs text-slate-500 w-8 text-right">{value}%</span>
  </div>
);

const HostShowcase = () => {
  return (
    <SectionWrapper id="hosts">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        KI-Hosts mit Charakter
      </h2>
      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
        Keine perfekten Sprecher – sondern menschlich wirkende Persönlichkeiten mit einzigartigen Eigenschaften.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {hosts.map((host, i) => (
          <motion.div
            key={host.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${host.color} flex items-center justify-center text-white font-bold text-sm`}>
                {host.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-white">{host.name}</h3>
                <p className="text-sm text-emerald-400">{host.role}</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {host.description}
            </p>

            <div className="space-y-3">
              {Object.entries(host.traits).map(([trait, value]) => (
                <PersonalitySlider key={trait} label={trait} value={value} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default HostShowcase;
