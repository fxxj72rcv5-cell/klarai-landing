import React from 'react';
import { motion } from 'framer-motion';
import { Podcast, MonitorPlay, Music, ArrowRight } from 'lucide-react';
import SectionWrapper from '../shared/SectionWrapper';

const platforms = [
  {
    icon: Podcast,
    name: 'TikTok',
    format: 'Kurz-Clips (30–60s)',
    color: 'from-pink-500 to-red-500',
    features: ['Starker Hook in 3 Sekunden', 'Emotionale Highlights', 'Teaser für Vollversion']
  },
  {
    icon: MonitorPlay,
    name: 'YouTube',
    format: 'Mid-Form (5–15 Min)',
    color: 'from-red-500 to-orange-500',
    features: ['Kompakte Episoden', 'Kapitelmarken', 'Optimierte Thumbnails']
  },
  {
    icon: Music,
    name: 'Spotify',
    format: 'Longform (30–60 Min)',
    color: 'from-green-500 to-emerald-500',
    features: ['Vollständige Episoden', 'Premium-Audioqualität', 'Serienstruktur']
  }
];

const DistributionSection = () => {
  return (
    <SectionWrapper id="distribution">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Ein Podcast. Drei Plattformen.
      </h2>
      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
        Aus einer Episode werden automatisch plattformgerechte Formate – von kurzen TikTok-Clips bis zur Spotify-Vollversion.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {platforms.map((platform, i) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">{platform.name}</h3>
              <p className="text-sm text-emerald-400 mb-4">{platform.format}</p>

              <ul className="space-y-2">
                {platform.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                    <ArrowRight className="w-3 h-3 text-emerald-400 mt-1 shrink-0" />
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

export default DistributionSection;
