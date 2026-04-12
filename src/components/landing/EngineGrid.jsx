import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users, FileText, Mic, Globe, Share2 } from 'lucide-react';
import SectionWrapper from '../shared/SectionWrapper';
import { engines } from '../../data/engines';

const iconMap = { Search, Users, FileText, Mic, Globe, Share2 };

const EngineGrid = () => {
  return (
    <SectionWrapper id="engines" alternate>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        6 Engines. Ein System.
      </h2>
      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
        Jede Engine ist spezialisiert – zusammen bilden sie die leistungsfähigste Podcast-Produktions-Pipeline der Welt.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engines.map((engine, i) => {
          const Icon = iconMap[engine.icon];
          return (
            <motion.div
              key={engine.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{engine.name}</h3>
                  <p className="text-xs text-emerald-400">{engine.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                {engine.description}
              </p>

              <ul className="space-y-2">
                {engine.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default EngineGrid;
