import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users, FileText, Mic, Globe, Share2, ArrowRight, ChevronDown } from 'lucide-react';
import SectionWrapper from '../shared/SectionWrapper';

const icons = { Search, Users, FileText, Mic, Globe, Share2 };

const steps = [
  { icon: 'Search', label: 'Thema', color: 'from-blue-500 to-cyan-500' },
  { icon: 'Users', label: 'Persönlichkeit', color: 'from-purple-500 to-pink-500' },
  { icon: 'FileText', label: 'Skript', color: 'from-orange-500 to-yellow-500' },
  { icon: 'Mic', label: 'Stimme', color: 'from-emerald-500 to-green-500' },
  { icon: 'Globe', label: 'Website', color: 'from-blue-500 to-indigo-500' },
  { icon: 'Share2', label: 'Distribution', color: 'from-red-500 to-pink-500' },
];

const PipelineOverview = () => {
  return (
    <SectionWrapper id="pipeline">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Von der Idee zum fertigen Podcast
      </h2>
      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16">
        Sechs KI-Engines arbeiten nahtlos zusammen – vom Trending-Topic bis zur Multi-Plattform-Veröffentlichung.
      </p>

      {/* Desktop: Horizontal */}
      <div className="hidden md:flex items-center justify-between gap-2">
        {steps.map((step, i) => {
          const Icon = icons[step.icon];
          return (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-3 group cursor-pointer"
                onClick={() => document.getElementById('engines')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {step.label}
                </span>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                >
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden flex flex-col items-center gap-3">
        {steps.map((step, i) => {
          const Icon = icons[step.icon];
          return (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 w-full max-w-xs"
              >
                <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-300">{step.label}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default PipelineOverview;
