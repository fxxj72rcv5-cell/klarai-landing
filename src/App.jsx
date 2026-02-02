import React, { useState, useRef, useEffect } from 'react';

// Quiz Questions
const questions = [
  {
    id: 1,
    question: "In welcher Branche ist Ihr Unternehmen tätig?",
    options: [
      { label: "Handwerk & Produktion", value: "handwerk", score: 25 },
      { label: "Dienstleistung & Beratung", value: "dienstleistung", score: 25 },
      { label: "Handel & E-Commerce", value: "handel", score: 25 },
      { label: "Gesundheit & Pflege", value: "gesundheit", score: 20 },
      { label: "Andere Branche", value: "andere", score: 15 }
    ]
  },
  {
    id: 2,
    question: "Wie viele Mitarbeiter beschäftigt Ihr Unternehmen?",
    options: [
      { label: "1-4 Mitarbeiter", value: "1-4", score: 5 },
      { label: "5-15 Mitarbeiter", value: "5-15", score: 20 },
      { label: "16-50 Mitarbeiter", value: "16-50", score: 25 },
      { label: "51-200 Mitarbeiter", value: "51-200", score: 25 },
      { label: "Über 200 Mitarbeiter", value: "200+", score: 20 }
    ]
  },
  {
    id: 3,
    question: "Was ist aktuell Ihr größtes operatives Problem?",
    options: [
      { label: "Zu viel Bürokratie & Papierkram", value: "buerokratie", score: 25 },
      { label: "Fachkräftemangel", value: "fachkraefte", score: 20 },
      { label: "Hohe Fehlerquoten", value: "fehler", score: 25 },
      { label: "Prozesse skalieren nicht", value: "skalierung", score: 25 },
      { label: "Keines der genannten", value: "keines", score: 5 }
    ]
  },
  {
    id: 4,
    question: "Wo verbrennt Ihr Team die meiste Zeit?",
    options: [
      { label: "Rechnungen & Buchhaltung", value: "buchhaltung", score: 25, savings: 1800 },
      { label: "Kundenanfragen beantworten", value: "kundenservice", score: 25, savings: 2400 },
      { label: "Angebote & Dokumente erstellen", value: "angebote", score: 25, savings: 3200 },
      { label: "Daten eingeben & übertragen", value: "dateneingabe", score: 20, savings: 1500 },
      { label: "Qualitätskontrolle", value: "qualitaet", score: 20, savings: 2000 }
    ]
  },
  {
    id: 5,
    question: "Wie digital arbeitet Ihr Unternehmen bereits?",
    options: [
      { label: "Noch viel Papier & Excel", value: "analog", score: 25 },
      { label: "Teilweise digitalisiert", value: "teilweise", score: 20 },
      { label: "Weitgehend digital", value: "digital", score: 15 },
      { label: "Voll digitalisiert", value: "voll_digital", score: 10 }
    ]
  }
];

// Floating particles background
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-500/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// Progress bar component
const ProgressBar = ({ current, total }) => (
  <div className="w-full max-w-md mx-auto mb-8">
    <div className="flex justify-between text-sm text-slate-400 mb-2">
      <span>Frage {current} von {total}</span>
      <span>{Math.round((current / total) * 100)}%</span>
    </div>
    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
);

// Score display component
const ScoreDisplay = ({ score, savings, answers, onBookCall, onChat, onReset }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);
  
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev >= score) return score;
        return prev + 1;
      });
    }, 20);
    
    const savingsInterval = setInterval(() => {
      setAnimatedSavings(prev => {
        if (prev >= savings) return savings;
        return prev + Math.ceil(savings / 50);
      });
    }, 30);
    
    return () => {
      clearInterval(scoreInterval);
      clearInterval(savingsInterval);
    };
  }, [score, savings]);

  const getScoreColor = () => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-slate-400';
  };

  const getScoreMessage = () => {
    if (score >= 70) return {
      title: 'Hohes Automatisierungspotenzial',
      desc: 'Ihr Unternehmen ist ideal für KI-Automatisierung geeignet.',
      cta: 'call'
    };
    if (score >= 40) return {
      title: 'Gutes Potenzial erkannt',
      desc: 'Es gibt Bereiche, die von Automatisierung profitieren könnten.',
      cta: 'chat'
    };
    return {
      title: 'Aktuell begrenztes Potenzial',
      desc: 'Für Ihre aktuelle Situation haben wir leider keine passende Lösung.',
      cta: 'none'
    };
  };

  const message = getScoreMessage();

  return (
    <div className="text-center space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <p className="text-slate-400 uppercase tracking-widest text-sm">Ihr Ergebnis</p>
        <div className="relative">
          <span className={`text-8xl font-bold ${getScoreColor()} tabular-nums`}>
            {animatedScore}
          </span>
          <span className={`text-4xl ${getScoreColor()}`}>%</span>
        </div>
        <p className="text-xl text-white font-medium">{message.title}</p>
        <p className="text-slate-400">{message.desc}</p>
      </div>

      {score >= 40 && (
        <div className="bg-slate-800/50 border border-emerald-500/20 rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-slate-400 text-sm mb-1">Geschätztes Einsparpotenzial</p>
          <p className="text-3xl font-bold text-emerald-400">
            ~{animatedSavings.toLocaleString('de-DE')}€
            <span className="text-lg text-slate-400 font-normal"> /Monat</span>
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {message.cta === 'call' && (
          <>
            <button
              onClick={onBookCall}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Kostenloses Audit buchen →
            </button>
            <button
              onClick={onChat}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-300 border border-slate-700"
            >
              Erst Fragen klären
            </button>
          </>
        )}
        {message.cta === 'chat' && (
          <button
            onClick={onChat}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
          >
            Mit KI-Berater sprechen →
          </button>
        )}
        {message.cta === 'none' && (
          <button
            onClick={onReset}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-300 border border-slate-700"
          >
            Quiz wiederholen
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// AI Chat component
const AIChat = ({ quizAnswers, score, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting based on quiz results
    const greeting = `Hallo! Basierend auf Ihrem Quiz-Ergebnis (${score}% Automatisierungspotenzial) sehe ich einige interessante Möglichkeiten für Ihr Unternehmen.

${quizAnswers[3]?.label ? `Sie haben angegeben, dass "${quizAnswers[3].label}" viel Zeit kostet – genau hier können wir oft am schnellsten helfen.` : ''}

Was möchten Sie wissen? Ich kann Ihnen erklären:
• Wie ein kostenloses Audit abläuft
• Welche konkreten KI-Lösungen für Sie passen
• Realistische Zeitleisten und Kosten`;

    setMessages([{ role: 'assistant', content: greeting }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `Du bist der KI-Berater von KlarAI, einer Agentur die KMUs bei der Automatisierung von Bürokratie hilft.

Kontext zum Lead:
- Quiz-Score: ${score}%
- Branche: ${quizAnswers[0]?.label || 'Nicht angegeben'}
- Unternehmensgröße: ${quizAnswers[1]?.label || 'Nicht angegeben'}
- Hauptproblem: ${quizAnswers[2]?.label || 'Nicht angegeben'}
- Zeitfresser: ${quizAnswers[3]?.label || 'Nicht angegeben'}
- Digitalisierungsgrad: ${quizAnswers[4]?.label || 'Nicht angegeben'}

Deine Aufgaben:
1. Beantworte Fragen kompetent und konkret
2. Beziehe dich auf die Quiz-Antworten wenn relevant
3. Führe subtil zum nächsten Schritt: Kostenloses Audit buchen
4. Sei professionell aber nicht steif
5. Nenne konkrete Zahlen wo möglich (basierend auf den Use Cases)
6. Halte Antworten kurz (max 3-4 Sätze, außer bei komplexen Fragen)

Use Cases die du kennen solltest:
- Buchhaltung/Belegerfassung: ~1.800€/Monat Ersparnis
- Kundenservice-Automatisierung: ~2.400€/Monat
- Angebotsgenerierung: ~3.200€/Monat
- Qualitätskontrolle mit KI: -60% Reklamationen

Der kostenlose Audit beinhaltet:
- 2-3 Stunden Prozessanalyse
- Identifikation der Top-3 Automatisierungschancen
- Konkreter ROI-Bericht
- Kein Verkaufsdruck, keine versteckten Kosten`;

      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...conversationHistory, { role: 'user', content: userMessage }]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content?.[0]?.text || 'Entschuldigung, es gab ein technisches Problem. Bitte versuchen Sie es erneut.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entschuldigung, es gab ein Verbindungsproblem. Bitte versuchen Sie es erneut oder buchen Sie direkt ein kostenloses Audit.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">KlarAI Berater</p>
              <p className="text-xs text-emerald-400">Online</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-emerald-500 text-slate-900' 
                  : 'bg-slate-800 text-slate-100'
              }`}>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ihre Frage eingeben..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Oder direkt: <a href="https://calendly.com/klarai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Kostenloses Audit buchen</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function KlarAILanding() {
  const [stage, setStage] = useState('landing'); // landing, quiz, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showChat, setShowChat] = useState(false);

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, ans) => sum + (ans.score || 0), 0);
  };

  const calculateSavings = () => {
    const baseCase = answers[3]?.savings || 2000;
    const multiplier = answers[1]?.value === '51-200' ? 2.5 : 
                       answers[1]?.value === '16-50' ? 1.5 : 1;
    return Math.round(baseCase * multiplier);
  };

  const handleAnswer = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => setStage('result'), 500);
    }
  };

  const resetQuiz = () => {
    setStage('landing');
    setCurrentQuestion(0);
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-slate-900">
              K
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Klar<span className="text-emerald-400">AI</span>
            </span>
          </div>
          {stage === 'landing' && (
            <button 
              onClick={() => setStage('quiz')}
              className="px-4 py-2 text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
            >
              Bürokratie-Check →
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Landing Stage */}
        {stage === 'landing' && (
          <div className="min-h-[calc(100vh-5rem)] flex flex-col">
            {/* Hero */}
            <section className="flex-1 flex items-center justify-center px-6 py-20">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  KI-Automatisierung für KMUs
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Bürokratie frisst
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                    Ihre besten Leute
                  </span>
                </h1>
                
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Deutsche KMUs verlieren durchschnittlich <span className="text-white font-medium">23 Stunden pro Woche</span> an Routineaufgaben. 
                  Wir finden, was Sie übersehen – und automatisieren es.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button
                    onClick={() => setStage('quiz')}
                    className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                  >
                    Kostenlosen Bürokratie-Check starten
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <a
                    href="https://calendly.com/klarai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-300 border border-slate-700"
                  >
                    Direkt Termin buchen
                  </a>
                </div>

                <p className="text-sm text-slate-500">
                  ✓ 2 Minuten · ✓ Keine E-Mail nötig · ✓ Sofort Ergebnis
                </p>
              </div>
            </section>

            {/* Problem Stats */}
            <section className="border-t border-slate-800/50 bg-slate-900/30">
              <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { number: '67%', label: 'der KMUs kämpfen mit Bürokratie' },
                    { number: '23h', label: 'pro Woche für Routineaufgaben' },
                    { number: '42.000€', label: 'durchschnittliche Jahreskosten' },
                    { number: '73%', label: 'wären automatisierbar' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-3xl md:text-4xl font-bold text-emerald-400">{stat.number}</p>
                      <p className="text-sm text-slate-400 mt-2">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section className="border-t border-slate-800/50">
              <div className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Wo wir am meisten sparen
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { 
                      title: 'Buchhaltung & Belege',
                      problem: 'Rechnungen manuell abtippen',
                      solution: 'KI-Belegerfassung',
                      savings: '~1.800€/Monat'
                    },
                    { 
                      title: 'Kundenservice',
                      problem: 'Gleiche Fragen, immer wieder',
                      solution: 'KI-Assistent',
                      savings: '~2.400€/Monat'
                    },
                    { 
                      title: 'Angebotswesen',
                      problem: '45 Min pro Angebot',
                      solution: 'KI-Generierung',
                      savings: '~3.200€/Monat'
                    },
                    { 
                      title: 'Qualitätskontrolle',
                      problem: 'Nur Stichproben möglich',
                      solution: '100% KI-Prüfung',
                      savings: '-60% Reklamationen'
                    },
                  ].map((useCase, i) => (
                    <div key={i} className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg text-white">{useCase.title}</h3>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full">
                          {useCase.savings}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-slate-500">
                          <span className="text-red-400">✗</span> {useCase.problem}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-emerald-400">✓</span> {useCase.solution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="border-t border-slate-800/50 bg-slate-900/30">
              <div className="max-w-4xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">
                  So funktioniert's
                </h2>
                <div className="space-y-8">
                  {[
                    { step: '01', title: 'Bürokratie-Check', desc: '5 Fragen zeigen Ihr Automatisierungspotenzial' },
                    { step: '02', title: 'Kostenloses Audit', desc: '2-3 Stunden Prozessanalyse vor Ort oder remote' },
                    { step: '03', title: 'Maßgeschneiderte Lösung', desc: 'Konkrete KI-Tools für Ihre größten Zeitfresser' },
                    { step: '04', title: 'Fortlaufende Optimierung', desc: 'Monatliche SaaS-Gebühr, nur für nachgewiesene Ersparnis' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <span className="text-4xl font-bold text-emerald-500/30">{item.step}</span>
                      <div>
                        <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="border-t border-slate-800/50">
              <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Bereit, Ihre Bürokratie zu automatisieren?
                </h2>
                <p className="text-slate-400 mb-8">
                  Starten Sie mit dem kostenlosen Bürokratie-Check. 2 Minuten, sofort Ergebnis.
                </p>
                <button
                  onClick={() => setStage('quiz')}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Bürokratie-Check starten →
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 bg-slate-900/50">
              <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-xs text-slate-900">
                    K
                  </div>
                  <span className="text-sm text-slate-400">
                    KlarAI © 2025
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-slate-500">
                  <a href="#" className="hover:text-white transition-colors">Impressum</a>
                  <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
                  <a href="#" className="hover:text-white transition-colors">Kontakt</a>
                </div>
              </div>
            </footer>
          </div>
        )}

        {/* Quiz Stage */}
        {stage === 'quiz' && (
          <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-2xl">
              <ProgressBar current={currentQuestion + 1} total={questions.length} />
              
              <div className="text-center mb-10 animate-fadeIn" key={currentQuestion}>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {questions[currentQuestion].question}
                </h2>
                <p className="text-slate-400">Wählen Sie die passendste Option</p>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      answers[currentQuestion]?.value === option.value
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-800/50'
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        answers[currentQuestion]?.value === option.value
                          ? 'border-emerald-500 bg-emerald-500 text-slate-900'
                          : 'border-slate-600'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>

              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  className="mt-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Zurück
                </button>
              )}
            </div>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.4s ease-out forwards;
              }
            `}</style>
          </div>
        )}

        {/* Result Stage */}
        {stage === 'result' && (
          <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-2xl">
              <ScoreDisplay 
                score={calculateScore()}
                savings={calculateSavings()}
                answers={answers}
                onBookCall={() => window.open('https://calendly.com/klarai', '_blank')}
                onChat={() => setShowChat(true)}
                onReset={resetQuiz}
              />
            </div>
          </div>
        )}
      </main>

      {/* AI Chat Modal */}
      {showChat && (
        <AIChat 
          quizAnswers={answers}
          score={calculateScore()}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}
