import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../shared/SectionWrapper';
import { phases } from '../../data/roadmap';

const statusColors = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  slate: 'bg-slate-700/50 text-slate-400 border-slate-600/20',
};

const RoadmapSection = () => {
  return (
    <SectionWrapper id="roadmap" alternate>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Der Weg zur Audio-Content-Maschine
      </h2>
      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
        Drei Phasen von der ersten Episode bis zur skalierbaren Plattform.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {phases.map((phase, i) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-emerald-500/30">0{phase.id}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[phase.statusColor]}`}>
                {phase.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">{phase.title}</h3>

            <ul className="space-y-2">
              {phase.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default RoadmapSection;
