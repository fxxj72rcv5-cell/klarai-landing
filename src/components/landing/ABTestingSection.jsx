import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, SkipForward, Repeat, Share2, ArrowRight } from 'lucide-react';
import SectionWrapper from '../shared/SectionWrapper';

const metrics = [
  { icon: Clock, label: 'Hördauer', desc: 'Wie lange hören Nutzer zu?', value: '78%' },
  { icon: SkipForward, label: 'Skip-Rate', desc: 'Wo steigen Nutzer aus?', value: '12%' },
  { icon: Repeat, label: 'Replays', desc: 'Welche Stellen werden wiederholt?', value: '340' },
  { icon: Share2, label: 'Shares', desc: 'Wie oft wird geteilt?', value: '2.1k' },
];

const loopSteps = ['Publizieren', 'Messen', 'Lernen', 'Optimieren'];

const ABTestingSection = () => {
  return (
    <SectionWrapper id="ab-testing" alternate>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Jede Episode in mehreren Varianten
      </h2>
      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
        Verschiedene Hooks, Hosts, Tonalitäten und Längen – das System findet automatisch heraus, was bei Ihrer Zielgruppe funktioniert.
      </p>

      {/* A/B Comparison Visual */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded">A</span>
            <span className="text-sm font-medium text-white">Sachlich & informativ</span>
          </div>
          <p className="text-sm text-slate-400 mb-3">Ruhiger Einstieg, Fakten zuerst, moderater Ton</p>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[62%] bg-blue-500 rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-2">62% durchschnittliche Hördauer</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-slate-900/50 border border-emerald-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded">B</span>
            <span className="text-sm font-medium text-white">Provokant & emotional</span>
            <span className="ml-auto px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">Winner</span>
          </div>
          <p className="text-sm text-slate-400 mb-3">Starker Hook, kontroverse These, energischer Ton</p>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[89%] bg-emerald-500 rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-2">89% durchschnittliche Hördauer</p>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-center"
            >
              <Icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{metric.value}</p>
              <p className="text-xs text-slate-400 mt-1">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Feedback Loop */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {loopSteps.map((step, i) => (
          <React.Fragment key={step}>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.3 }}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/20"
            >
              {step}
            </motion.span>
            {i < loopSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-600" />
            )}
          </React.Fragment>
        ))}
        <ArrowRight className="w-4 h-4 text-slate-600" />
        <span className="text-sm text-slate-500">∞ Repeat</span>
      </div>
    </SectionWrapper>
  );
};

export default ABTestingSection;
