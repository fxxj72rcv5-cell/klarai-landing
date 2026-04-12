import React from 'react';
import { motion } from 'framer-motion';
import { AudioWaveform, LogOut, Mic, Users, BarChart3, Plus, Radio, Settings } from 'lucide-react';

const placeholderCards = [
  {
    icon: Mic,
    title: 'Episode erstellen',
    description: 'Generieren Sie Ihre erste KI-Podcast-Episode mit wenigen Klicks.',
    action: 'Neue Episode',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Users,
    title: 'Hosts verwalten',
    description: 'Konfigurieren Sie Ihre KI-Moderatoren und deren Persönlichkeiten.',
    action: 'Hosts ansehen',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Verfolgen Sie Performance-Daten und A/B-Test-Ergebnisse.',
    action: 'Dashboard öffnen',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Radio,
    title: 'Distribution',
    description: 'Verwalten Sie Ihre Veröffentlichungen auf allen Plattformen.',
    action: 'Plattformen',
    color: 'from-orange-500 to-red-500',
  },
];

const Dashboard = ({ user, onLogout }) => {
  const userEmail = user?.email || 'Nutzer';

  return (
    <div className="min-h-screen">
      {/* Dashboard Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <AudioWaveform className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Pod<span className="text-emerald-400">Kraft</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">{userEmail}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Willkommen bei PodKraft
            </h1>
            <p className="text-slate-400">
              Ihr Dashboard für KI-generierte Podcasts. Starten Sie mit Ihrer ersten Episode.
            </p>
          </motion.div>

          {/* Coming Soon Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Dashboard wird ausgebaut</h3>
                <p className="text-sm text-slate-400">
                  Wir arbeiten mit Hochdruck an den Produktions-Tools. Als Early-Access-Nutzer werden Sie die Features als Erstes nutzen können.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {placeholderCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-emerald-400 font-medium">
                    <Plus className="w-4 h-4" />
                    {card.action}
                    <span className="ml-1 px-2 py-0.5 bg-slate-800 text-slate-500 text-xs rounded-full">Bald</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
