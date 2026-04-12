# PodKraft – Kompletter Masterplan

## Kontext

PodKraft ist eine datengetriebene Plattform zur automatischen Erstellung, Optimierung und Distribution von KI-generierten Podcasts. Dieser Plan deckt **alles** ab – von der Infrastruktur-Einrichtung bis zum letzten Frontend-Modul.

**IST-Zustand:** Leeres Repo `fxxj72rcv5-cell/Podforge` auf GitHub (privat, nur README.md). **Kompletter Neustart – kein Code aus klarai-landing.**

**Repository:** `fxxj72rcv5-cell/Podforge` (GitHub, privat) – Monorepo
**Markenname:** PodKraft (Podforge ist nur der Repo-Name)
**Monorepo-Struktur:**
```
Podforge/
  packages/
    frontend/     ← React + Vite + Tailwind (Landing Page, Dashboard, Auth)
    backend/      ← Node.js Worker Service (Engines, API, Job Queue)
    shared/       ← Gemeinsame Types, Zod Schemas, Konstanten
  package.json
  pnpm-workspace.yaml
  .env.example
  .gitignore
```

---

## Modul 0: Infrastruktur & API-Keys Setup

> **MUSS VOR ALLEM ANDEREN PASSIEREN – KEIN CODE BEVOR DAS STEHT**

### 0.0 Repository & Monorepo Setup
- Podforge-Repo klonen
- pnpm installieren + Workspace Setup (`pnpm-workspace.yaml`, root `package.json`)
- `packages/frontend/` – Vite + React + Tailwind + TypeScript Projekt initialisieren
- `packages/backend/` – Node.js + TypeScript Projekt initialisieren
- `packages/shared/` – TypeScript Projekt für gemeinsame Types/Schemas
- `.gitignore`, `.env.example`, `tsconfig.base.json` auf Root-Ebene
- Alles von Anfang an in **TypeScript**

### 0.1 Supabase Projekt anlegen
- Neues Projekt auf supabase.com erstellen
- Auth: E-Mail/Passwort aktivieren (bereits im Code integriert)
- Row Level Security (RLS) für alle Tabellen
- Storage Buckets anlegen:
  - `audio-episodes` (privat, max 500MB/Datei)
  - `audio-clips` (öffentlich, max 100MB/Datei)
  - `episode-images` (öffentlich, max 10MB/Datei)
  - `transcripts` (privat)
- Edge Functions aktivieren

### 0.2 AI-Provider Accounts & API-Keys

| Aufgabe | Provider | Warum |
|---------|----------|-------|
| Skript-Generierung | **Anthropic Claude** | Beste Qualität für natürlichen deutschen Dialog |
| Themen-Recherche | **OpenAI GPT-4o** | Gutes Zusammenfassen von Recherche-Ergebnissen |
| Voice-Generierung | **ElevenLabs** (Multilingual v2) | Beste deutsche Stimmqualität, Emotionssteuerung |
| Fallback Voice | **PlayHT** | Alternative bei ElevenLabs-Limits |

> **Keine Transkriptions-KI nötig:** Das Skript wird von der Script Engine generiert – es IST bereits das Transkript. Whisper entfällt komplett.

**Accounts erstellen:**
1. Anthropic Console → API Key generieren
2. OpenAI Platform → API Key generieren
3. ElevenLabs → Account + API Key, Voice Library testen
4. PlayHT → Account als Fallback

### 0.3 Externe API-Zugänge

| API | Zweck | Setup |
|-----|-------|-------|
| NewsAPI.org | Trending-Themen (DE) | Free Tier: 100 Req/Tag |
| Google Trends (via `google-trends-api`) | Trend-Scores | Kostenlos, keine Keys nötig |
| Reddit API | Trending Posts | App registrieren unter reddit.com/prefs/apps |
| YouTube Data API v3 | Upload + Analytics | Google Cloud Console, OAuth + API Key |
| Spotify for Podcasters API | Podcast-Distribution | Developer Account |
| TikTok Business API | Video-Upload | App Review nötig |

### 0.4 Environment Variables (`.env`)

```
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=

# AI Providers
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
PLAYHT_API_KEY=
PLAYHT_USER_ID=

# Externe APIs
NEWS_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
YOUTUBE_API_KEY=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Backend
BACKEND_URL=
REDIS_URL=
```

**WICHTIG:** Nur `VITE_`-Variablen gehen ans Frontend. Alle API-Keys bleiben serverseitig.

### 0.5 Hosting & Domain

| Dienst | Zweck | Kosten |
|--------|-------|--------|
| **Vercel** | Frontend Hosting | Free / Pro |
| **Railway** oder **Render** | Backend Worker (Node.js) | ~$5-20/Monat |
| **Upstash** | Redis (Job Queue) | Free Tier bis 10k Cmds/Tag |
| **Domain** | podkraft.ai o.ä. | ~$12/Jahr |

---

## Modul 1: Datenbank-Schema (Supabase PostgreSQL)

### Tabellen

**`user_profiles`** – Erweitert auth.users
- id, display_name, role (admin/editor/viewer), plan (free/pro/enterprise), settings (JSONB)

**`hosts`** – KI-Moderatoren
- id, user_id, name, role_label, description, avatar_initials, color_gradient
- Personality: dominance, humor, emotion, provocation, speech_tempo (jeweils 0-100)
- Erweitert: error_rate, pause_frequency, laughter_frequency (0-100)
- Voice: elevenlabs_voice_id, voice_stability, voice_similarity, voice_style

**`topics`** – Themen
- id, user_id, title, description, category, source_type (trending/evergreen/manual/keyword)
- research_data (JSONB), keywords[], trend_score, demand_score, competition_score
- status (draft/researched/approved/used/archived), priority

**`episodes`** – Hauptentität
- id, user_id, topic_id, title, description
- format (dialog/interview/solo/debate/panel), target_duration_seconds, language
- status (draft → scripting → script_ready → recording → audio_ready → publishing → published)
- host_config (JSONB: [{host_id, role}])
- generation_config (JSONB), final_audio_url, final_duration_seconds
- slug, seo_title, seo_description, published_at

**`scripts`** – Skripte
- id, episode_id, version
- content (JSONB): Array von Segmenten mit type, host_id, text, emotion, tempo, is_interruption, chapter
- chapters (JSONB), hook_text, word_count, estimated_duration_seconds
- is_approved

**`audio_files`** – Audio-Dateien
- id, episode_id, script_id, type (full/segment/clip)
- storage_path, public_url, duration_seconds, file_size_bytes, format
- segment_index, host_id, status (pending/processing/ready/failed)

**`variants`** – A/B-Test Varianten
- id, episode_id, variant_label (A/B/C), variant_type (hook/host/tonality/length/format)
- changes (JSONB), script_id, audio_file_id, status

**`ab_tests`** – A/B-Tests
- id, episode_id, user_id, name, test_type
- variant_ids[], winner_variant_id, status (draft/running/completed)
- confidence_threshold, current_confidence

**`metrics`** – Performance-Daten
- id, variant_id, episode_id, platform (tiktok/youtube/spotify/website)
- impressions, plays, unique_listeners, avg_listen_duration_seconds
- avg_listen_percentage, skip_rate, replay_count, shares, likes, comments
- drop_off_points (JSONB), replay_segments (JSONB)
- ad_revenue_cents, affiliate_clicks, affiliate_revenue_cents

**`distributions`** – Veröffentlichungen
- id, episode_id, variant_id, platform, format (short_clip/midform/longform)
- platform_content_id, platform_url, title, description, tags[]
- scheduled_at, published_at, status, error_message

**`transcripts`** – SEO & Shownotes (generiert aus Script-Daten, kein Whisper)
- id, episode_id, script_id
- full_text (aus Script zusammengesetzt)
- summary, key_statements[], chapter_markers (JSONB), shownotes, sources (JSONB)

**`jobs`** – Pipeline-Status
- id, user_id, type, episode_id, variant_id
- payload (JSONB), result (JSONB), status, progress (0-100)
- error_message, attempts, max_attempts

**`api_configurations`** – User API-Keys (verschlüsselt)
- id, user_id, provider, api_key_encrypted, config (JSONB), is_active

### Storage-Struktur
```
audio-episodes/{user_id}/{episode_id}/full.mp3
audio-episodes/{user_id}/{episode_id}/segments/{index}.mp3
audio-clips/{user_id}/{episode_id}/{clip_type}_{variant}.mp4
episode-images/{user_id}/{episode_id}/cover.jpg
```

---

## Modul 2: Backend-Architektur

### Architektur-Entscheidung: Hybrid

**Supabase Edge Functions (Deno):** Leichte CRUD-Ops, Webhooks, Auth-Middleware
**Separater Node.js Worker (Railway):** Schwere AI-Aufgaben, FFmpeg, Job Queue (BullMQ + Redis)

### Backend-Projektstruktur
```
podkraft-backend/
  src/
    config/          env.ts, supabase.ts, redis.ts
    engines/
      topic/         TopicResearcher.ts, TopicScorer.ts, TopicSummarizer.ts
      personality/   HostManager.ts, PersonalityMapper.ts, VoiceProfiler.ts
      script/        ScriptGenerator.ts, DialogueBuilder.ts, StructureManager.ts, ImperfectionEngine.ts
      voice/         VoiceGenerator.ts, AudioSegmenter.ts, AudioMerger.ts, ImperfectionAudio.ts
      website/       SEOGenerator.ts, PageBuilder.ts
      distribution/
        DistributionManager.ts
        platforms/    TikTokPublisher.ts, YouTubePublisher.ts, SpotifyPublisher.ts
        ClipGenerator.ts
    jobs/
      queue.ts, scheduler.ts
      workers/       topicWorker.ts, scriptWorker.ts, voiceWorker.ts, distributionWorker.ts, metricsWorker.ts
    api/
      routes/        topics.ts, hosts.ts, episodes.ts, scripts.ts, audio.ts, variants.ts, abTests.ts, metrics.ts, distributions.ts, jobs.ts
      middleware/    auth.ts, rateLimit.ts, validation.ts
    services/
      ai/            claude.ts, openai.ts, elevenlabs.ts
      analytics/     MetricsCollector.ts, ABTestAnalyzer.ts, FeedbackLoop.ts
    utils/           ffmpeg.ts, storage.ts, encryption.ts
```

### API-Endpunkte

**Topics:** GET/POST /api/topics, POST /api/topics/discover, POST /api/topics/:id/research
**Hosts:** GET/POST /api/hosts, POST /api/hosts/:id/preview-voice
**Episodes:** GET/POST /api/episodes, POST /api/episodes/:id/generate
**Scripts:** GET /api/episodes/:id/scripts, POST /api/episodes/:id/scripts/generate, POST /api/scripts/:id/approve
**Audio:** GET /api/episodes/:id/audio, POST /api/episodes/:id/audio/generate, GET /api/audio/:id/stream
**Variants & A/B:** POST /api/episodes/:id/variants, POST /api/ab-tests, GET /api/ab-tests/:id/results
**Metrics:** GET /api/metrics/episode/:id, GET /api/metrics/dashboard, POST /api/metrics/collect
**Distribution:** POST /api/distributions, POST /api/distributions/:id/retry
**Jobs:** GET /api/jobs, POST /api/jobs/:id/cancel

### Job Queue Pipeline

```
Episode generieren →
  [1] research_topic (falls nötig)
  [2] generate_script (Claude API)
  [3] generate_audio_segment (N parallel, ElevenLabs)
  [4] merge_audio (FFmpeg)
  [5] generate_seo (AI – nutzt Script-Daten als Transkript)
  [6] generate_clip (N parallel, pro Plattform)
  [7] distribute (pro Plattform)
  [8] collect_metrics (Cron, alle 6h)
```

Jeder Job aktualisiert `episodes.status` + `jobs`-Tabelle. Frontend empfängt Updates via Supabase Realtime.

---

## Modul 3: Frontend-Erweiterung

### Neue Dependencies
- **react-router-dom** – Echtes Routing (ersetzt Stage-basiert)
- **@tanstack/react-query** – Server State Management
- **zustand** – Client State
- **react-hook-form + zod** – Formulare + Validierung
- **recharts** – Charts für Analytics
- **wavesurfer.js** – Audio Waveform Player

### Routing-Struktur
```
/                              Landing Page (besteht)
/auth                          Auth Page (besteht)
/dashboard                     Dashboard Übersicht
/dashboard/topics              Topic Management
/dashboard/topics/:id          Topic Detail
/dashboard/hosts               Host Management
/dashboard/hosts/:id           Host Editor
/dashboard/episodes            Episode Liste
/dashboard/episodes/new        Episode Creation Wizard
/dashboard/episodes/:id        Episode Detail (Tabs: Übersicht/Skript/Audio/Varianten/Distribution/Metriken)
/dashboard/episodes/:id/script Script Editor
/dashboard/ab-tests            A/B Test Übersicht
/dashboard/ab-tests/:id        A/B Test Detail
/dashboard/analytics           Analytics Dashboard
/dashboard/distribution        Distribution Manager
/dashboard/settings            Einstellungen & API Keys
/podcast/:slug                 Öffentliche Episode-Seite
```

---

## Modul 4-15: Frontend Dashboard Module (einzeln baubar)

### F0: Dashboard Layout & Router
- Sidebar-Navigation mit Icons, Breadcrumbs
- Globaler Job-Status-Indikator
- User-Dropdown, Responsive (Sidebar → Bottom-Nav)
- **Komplexität:** Mittel

### F1: Topic Management
- Tabellarische Liste mit Filtern (Status, Kategorie, Source)
- "Discover"-Button → AI-Recherche
- Topic-Detail mit Research-Daten + Scoring-Visualisierung
- Manuelles Erstellen/Bearbeiten
- **Komplexität:** Mittel

### F2: Host Configuration + AI Persona Creator
- Grid-Ansicht aller Hosts (Cards)
- **AI Persona Creator**: Chat-basierter Assistent der Host-Persönlichkeiten entwickelt
  - User beschreibt gewünschten Charakter in natürlicher Sprache
  - AI generiert komplettes Personality-Profil (Name, Rolle, alle Parameter)
  - AI empfiehlt passende Host-Kombinationen basierend auf Thema + Format
  - User kann Ergebnis über Slider nachjustieren
- Host-Editor mit allen Personality-Slidern (Dominanz, Humor, Emotion, Provokation, Tempo, Error-Rate, Pausen, Lachen)
- Voice-Preview: Testsatz generieren + abspielen
- ElevenLabs Voice-ID Auswahl + AI-Stimmenempfehlung passend zum Charakter
- **Komplexität:** Hoch

### F3: Episode Creation Wizard
- 4-Schritte:
  1. Thema wählen (aus Topics oder neu)
  2. Hosts zuweisen (Cards, Rollen: Main/Co-Host)
  3. Format & Einstellungen (Dialog/Interview/Debate, Dauer, Tonalität)
  4. Übersicht & Start
- Nach Start → Live-Status auf Episode-Detail
- **Komplexität:** Hoch

### F4: Episode Management & Detail
- Liste mit Status-Badges, Thumbnails
- Detail-Seite mit Tabs: Übersicht, Skript, Audio, Varianten, Distribution, Metriken
- Status-Pipeline-Visualisierung (welcher Schritt aktiv)
- Realtime-Updates via Supabase Subscriptions
- **Komplexität:** Hoch

### F5: Script Editor
- Chat-ähnliche Dialog-Darstellung (farbcodiert pro Host)
- Sichtbare Tags: [Pause], [Lachen], [Unterbrechung], [Denkpause]
- Inline-Editing, Kapitel-Navigation
- Versionierung, "Regenerieren"-Button
- **Komplexität:** Mittel-Hoch

### F6: Audio Player
- Wavesurfer.js Waveform-Player
- Kapitelmarken in Waveform
- Playback-Speed, Host-Wechsel farblich sichtbar
- Vergleichs-Modus: 2 Varianten nebeneinander
- **Komplexität:** Mittel

### F7: Analytics Dashboard
- KPIs: Total Plays, Avg Listen Duration, Best Episode, Best Host
- Zeitreihen-Charts (Recharts)
- Host-Vergleich, Topic-Heatmap
- Drop-off-Analyse, Plattform-Vergleich
- **Komplexität:** Mittel-Hoch

### F8: A/B Test Manager
- Test-Liste mit Status + Konfidenz
- Varianten-Vergleich mit Metriken-Overlay
- Gewinner-Indikator, Konfidenz-Fortschrittsbalken
- AI-generierte Learnings
- **Komplexität:** Mittel-Hoch

### F9: Distribution Manager
- Plattform-Karten mit Verbindungsstatus
- Scheduling-Kalender pro Episode
- Status-Timeline, Retry für Fehler
- **Komplexität:** Mittel

### F10: Settings
- API-Key-Verwaltung (verschlüsselt)
- Plattform-Verbindungen (OAuth-Flows)
- Profil, Standard-Konfigurationen
- **Komplexität:** Niedrig-Mittel

### F11: Public Episode Page (Website Engine)
- Route: `/podcast/:slug`
- Audio-Player, SEO-Titel, Zusammenfassung
- Shownotes, klickbare Kapitelmarken
- Zentrale Aussagen, Quellen, Transkript (aufklappbar)
- Schema.org structured data
- **Komplexität:** Mittel

---

## Modul 16-21: Backend Engines (einzeln baubar)

### B0: DB Schema & Supabase Setup
- Alle Tabellen anlegen, RLS Policies, Storage Buckets, Indizes
- **Komplexität:** Niedrig | **Dauer:** 1-2 Tage

### B1: Backend Projekt Setup
- Node.js Projekt, BullMQ + Redis, Supabase Admin Client
- Auth-Middleware, Basis-Routing
- **Komplexität:** Niedrig | **Dauer:** 1-2 Tage

### B2: Personality Engine + AI Persona Creator
- Host CRUD, PersonalityMapper (Params → Prompt-Anweisungen), VoiceProfiler (Params → ElevenLabs Settings)
- **AI Persona Creator Backend**: Claude-basiert – User-Beschreibung → Host-Profil (JSON mit allen Parametern)
- **Kombinations-Empfehlung**: Analysiert Thema + Format → empfiehlt optimale Host-Zusammenstellung
- **Komplexität:** Mittel | **Dauer:** 4-5 Tage

### B3: Topic Engine
- NewsAPI, Google Trends, Reddit Abfrage
- TopicScorer (Trend + Demand + Competition), AI-Zusammenfassung
- **Komplexität:** Mittel | **Dauer:** 4-5 Tage

### B4: Script Engine ⭐ (Kern)
- Claude API: Topic Research + Host-Prompts → Strukturierter Dialog
- StructureManager: Hook → Context → Main → Micro-Cliffhanger → Payoff
- DialogueBuilder: Post-Processing für Unterbrechungen, Pausen
- ImperfectionEngine: Halbsätze, Fehler, Denkpausen einfügen
- **Komplexität:** Hoch | **Dauer:** 7-10 Tage

### B5: Voice Engine ⭐ (Kern)
- ElevenLabs API: Segmentweise Audio-Generierung pro Host
- AudioSegmenter: Skript → Segmente aufteilen
- AudioMerger: FFmpeg zusammenfügen, Pausen/Lachen einfügen
- Parallele Segment-Generierung via BullMQ
- **Komplexität:** Hoch | **Dauer:** 7-10 Tage

### B6: Website Engine
- AI-generierte SEO-Daten (kein Whisper nötig – Skript = Transkript)
- Summary, Shownotes, Chapter Markers, Key Statements, Sources
- **Komplexität:** Mittel | **Dauer:** 3-4 Tage

### B7: Distribution Engine
- TikTok, YouTube, Spotify Publisher
- ClipGenerator: Audio → Kurz-Clips mit Untertiteln
- Scheduling, Retry-Mechanismus
- **Komplexität:** Mittel-Hoch | **Dauer:** 5-7 Tage

### B8: A/B Test System
- Automatische Varianten-Generierung (verschiedene Hooks/Hosts/Tonalitäten/Längen)
- Statistische Signifikanz (Chi-squared Test)
- Winner-Determination
- **Komplexität:** Mittel-Hoch | **Dauer:** 5-6 Tage

### B9: Metrics Collection
- YouTube Analytics, TikTok Analytics, Spotify Daten abfragen (Cron)
- Aggregation, Feedback-Loop (Learnings → nächste Generation)
- **Komplexität:** Mittel | **Dauer:** 3-4 Tage

---

## Build-Reihenfolge

```
PHASE 0: INFRASTRUKTUR (Woche 0)
  [0.0] Monorepo Setup: Podforge klonen, pnpm Workspaces, alle 3 Packages
  [0.1] Supabase Projekt anlegen, Storage Buckets
  [0.2] AI-Provider Accounts (Anthropic, OpenAI, ElevenLabs)
  [0.3] Externe API-Zugänge (NewsAPI, Reddit, YouTube, Spotify, TikTok)
  [0.4] .env mit allen Keys befüllen
  [0.5] Hosting: Vercel (Frontend), Railway (Backend), Upstash (Redis)
  → Muss vor allem anderen erledigt werden

PHASE 1: FUNDAMENT (Woche 1-2)
  [B0] DB Schema anlegen (Supabase)
  [B1] Backend Projekt Setup (Express/Fastify, BullMQ, Redis)
  [F0] Frontend komplett neu: Vite+React+Tailwind+TS, Landing Page, Auth, Dashboard Layout
  → Alle parallel baubar, keine Abhängigkeiten
  → Landing Page wird komplett neu in TypeScript gebaut

PHASE 2: HOSTS & TOPICS (Woche 3-4)
  [B2] Personality Engine Backend
  [F2] Host Configuration Frontend
  [B3] Topic Engine Backend
  [F1] Topic Management Frontend
  → Braucht: B0 fertig. B2/F2 und B3/F1 parallel baubar.

PHASE 3: SCRIPT ENGINE (Woche 5-7)
  [B4] Script Engine Backend ⭐
  [F3] Episode Creation Wizard
  [F5] Script Editor
  → Braucht: B2 + B3 (Hosts & Topics existieren)

PHASE 4: VOICE ENGINE (Woche 8-10)
  [B5] Voice Engine Backend ⭐
  [F6] Audio Player
  [F4] Episode Management & Detail
  → Braucht: B4 (Skripte existieren)

PHASE 5: WEBSITE & DISTRIBUTION (Woche 11-12)
  [B6] Website Engine Backend
  [F11] Public Episode Page
  [B7] Distribution Engine Backend
  [F9] Distribution Manager
  → Braucht: B5 (Audio existiert)

PHASE 6: A/B TESTING & ANALYTICS (Woche 13-15)
  [B8] A/B Test System Backend
  [B9] Metrics Collection
  [F7] Analytics Dashboard
  [F8] A/B Test Manager
  → Braucht: B7 (Episoden publiziert)

PHASE 7: POLISH (Woche 16)
  [F10] Settings
  Dashboard Feinschliff, Bug-Fixing
```

---

## Kosten-Schätzung

### AI-Kosten pro Episode (~10 Min)
| Posten | Geschätzt |
|--------|-----------|
| Claude (Skript, ~4000 Tokens) | ~$0.10 |
| GPT-4o (Recherche, SEO) | ~$0.05 |
| ElevenLabs (10 Min Audio) | ~$0.50-1.50 |
| **Gesamt pro Episode** | **~$0.65-1.65** |
| **Mit 3 A/B-Varianten** | **~$2.00-5.00** |

### Infrastruktur monatlich
| Dienst | Kosten |
|--------|--------|
| Supabase Pro | $25/Monat |
| Railway Worker | ~$5-20/Monat |
| Upstash Redis | Free Tier |
| Vercel Frontend | Free / $20 |
| Domain | ~$1/Monat |
| **Gesamt Infrastruktur** | **~$50-65/Monat** |

### Bei 100 Episoden/Monat
- AI-Kosten: ~$200-500
- Infrastruktur: ~$50-65
- **Gesamt: ~$250-565/Monat**

---

## Architektur-Entscheidungen

1. **Repository:** Monorepo `Podforge` auf GitHub (privat), Markenname bleibt "PodKraft"
2. **Monorepo:** pnpm Workspaces mit `packages/frontend`, `packages/backend`, `packages/shared`
3. **TypeScript:** Komplett von Anfang an – kein JSX, nur TSX
4. **Kein Legacy-Code:** Kompletter Neustart, nichts aus klarai-landing
5. **Realtime:** Supabase Realtime Subscriptions für Job-Status (kein Polling)
6. **Seed-Daten:** 3 initiale Hosts (Sophia, Max, Lena) als DB-Seeds

---

## Script Architecture Framework

> **Das Herzstück des Produkts. Hier entscheidet sich ob Hörer nach 10 Sekunden abschalten oder 30 Minuten dranbleiben.**

### 1. Natürlichkeits-System (ImperfectionEngine)

#### 1.1 Deutsche Füllwörter & Häufigkeit

| Füllwort-Typ | Beispiele | Frequenz pro Minute |
|-------------|-----------|---------------------|
| **Denk-Füller** | "ähm", "äh", "hmm" | 1-2× (je nach error_rate) |
| **Bestätigungs-Füller** | "ja genau", "stimmt", "absolut" | 2-3× (Back-Channeling) |
| **Verzögerungs-Füller** | "also", "naja", "sagen wir mal" | 1-2× |
| **Verbindungs-Füller** | "weißt du", "schau mal", "pass auf" | 0.5-1× |
| **Rückversicherung** | "oder?", "verstehst du?", "ne?" | 0.5× |

**Kalibrierung nach Host-Parametern:**
```
error_rate = 10  → ~1 Füllwort pro Minute (analytischer Typ, "Sophia")
error_rate = 40  → ~3 Füllwörter pro Minute (natürlicher Durchschnitt)
error_rate = 70  → ~5 Füllwörter pro Minute (sehr umgangssprachlich, "Max")
```

**Reale Referenz:** Durchschnittliche Podcast-Hosts verwenden 3-4 Füllwörter pro Minute. Professionelle Nachrichtensprecher ~0.5. Casualer Gesprächston ~5-7. Wir zielen auf den Bereich 2-5 je nach Host.

#### 1.2 Satzabbrüche & Selbstkorrekturen

**Typen:**
```
SATZABBRUCH:
"Das Interessante daran ist – nein, warte, lass mich das anders sagen."
"Also wenn man sich das mal anschaut, die haben ja – okay, fangen wir von vorne an."

SELBSTKORREKTUR:
"Die haben 30 – nein, 35 Prozent Wachstum gehabt."
"Das war im Oktober – oder war's November? Egal, Herbst letzten Jahres."

GEDANKENSPRUNG:
"Und das führt natürlich zu... oh, bevor ich das vergesse: [Nebenpunkt]"
```

**Frequenz:** 1 Satzabbruch pro 2-3 Minuten. Mehr wirkt gestört, weniger wirkt gescriptet.

#### 1.3 Back-Channeling (Zuhörer-Signale)

Wenn Host A spricht, reagiert Host B regelmäßig:
```
KURZ (während A redet):     "mhm", "ja", "okay"
ZUSTIMMEND:                 "ja genau", "stimmt", "absolut"
ÜBERRASCHT:                 "echt?", "wow", "krass", "nee oder?"
NACHDENKLICH:               "hmm", "interessant", "okay wow"
WIDERSPRUCH-VORBEREITUNG:   "ja aber...", "naja...", "hmm, ich weiß nicht..."
```

**Frequenz:** Alle 15-20 Sekunden Monolog MUSS eine Back-Channel-Reaktion kommen. Ohne das klingt es wie zwei separate Aufnahmen statt einem Gespräch.

#### 1.4 Natürliche Pausen

```
DENKPAUSE:        [Pause 1-2s] + "Hmm..." oder "Lass mich kurz überlegen..."
DRAMATISCHE PAUSE: [Pause 2-3s] vor einer überraschenden Aussage
ATEM-PAUSE:       [Pause 0.5s] mitten im Satz (natürlicher Rhythmus)
NACH-FRAGE-PAUSE: [Pause 1s] nach einer Frage bevor der andere antwortet
```

**Regel:** Nie mehr als 30 Sekunden am Stück ohne irgendeine Art von Pause. Echte Menschen atmen, denken, zögern.

#### 1.5 Unterbrechungen & Überlappungen

```
SANFTE UNTERBRECHUNG:
A: "Und deswegen glaube ich, dass –"
B: "Ja aber warte mal, das stimmt doch so nicht."

ENERGISCHE UNTERBRECHUNG:
A: "Die Daten zeigen eindeutig –"
B: "Stopp, stopp, stopp. Welche Daten denn?"

VERVOLLSTÄNDIGUNG:
A: "Und das Ergebnis war..."
B: "Katastrophal."
A: "Genau, katastrophal."
```

**Frequenz nach Dominanz-Score:**
```
Beide Hosts dominance < 50  → ~1 Unterbrechung pro 5 Minuten (respektvoll)
Ein Host dominance > 70     → ~1 Unterbrechung pro 2 Minuten
Beide Hosts dominance > 70  → ~1 Unterbrechung pro Minute (hitzig)
```

---

### 2. Engagement-System (RetentionEngine)

#### 2.1 Hook-Formeln (Erste 10 Sekunden)

**Die ersten 10 Sekunden entscheiden ob der Hörer bleibt.** 5 bewährte Hook-Typen:

```
KONTROVERSER HOOK:
"Alles was du über [Thema] weißt, ist falsch."
"[Thema] ist der größte Betrug unserer Zeit. Und ich kann es beweisen."

ÜBERRASCHUNGS-HOOK:
"Wusstest du, dass [schockierende Statistik]? Das hat mich umgehauen."
"Was wenn ich dir sage, dass [unerwartete Wahrheit]?"

STORY-HOOK:
"Letzte Woche ist mir etwas Verrücktes passiert..."
"Stell dir vor: [Szenario das den Hörer persönlich betrifft]."

FRAGE-HOOK:
"Was würdest du tun, wenn [extremes Szenario]?"
"Warum redet niemand über [wichtiges Thema]?"

CLIFFHANGER-HOOK:
"Heute erzähle ich euch etwas, das [Autorität/Experte] mir unter der Hand gesagt hat."
"Am Ende dieser Episode werdet ihr [Thema] komplett anders sehen."
```

**A/B-Test-Logik:** Für jede Episode werden 2-3 Hook-Varianten generiert. Der FeedbackLoop lernt welcher Hook-Typ für welche Themen-Kategorie am besten funktioniert.

#### 2.2 Open Loops (Spannungsbögen die offen bleiben)

**Prinzip:** Eine Frage aufwerfen → NICHT sofort beantworten → erst 3-5 Minuten später auflösen. Der Hörer bleibt dran um die Antwort zu hören.

```
OPEN LOOP SETZEN (Minute 0:30):
"Gleich erzähle ich euch, warum ausgerechnet Finnland das Gegenteil gemacht hat 
und damit besser fährt als alle anderen. Aber erstmal..."

→ ZWISCHENDURCH (Minute 2:00):
"Erinnert ihr euch an Finnland? Dazu kommen wir gleich, das ist nämlich 
der spannendste Teil."

→ LOOP AUFLÖSEN (Minute 5:00):
"So, jetzt zu Finnland. Und das wird euch überraschen..."
```

**Regeln:**
- Maximal 2 offene Loops gleichzeitig (sonst wird es verwirrend)
- Jeder Loop muss aufgelöst werden (offene Loops frustrieren)
- Loop-Dauer: 3-5 Minuten ideal. <2min zu kurz für Spannung, >8min vergisst der Hörer
- Mindestens 1 Open Loop pro 5 Minuten Episode

#### 2.3 Micro-Cliffhanger (Anti-Drop-off-Punkte)

**Platzierung:** An den statistisch häufigsten Drop-off-Punkten:

```
Minute 1:00  → Erster Micro-Cliffhanger nach Kontext-Einführung
Minute 3:00  → Zweiter Micro-Cliffhanger (viele verlieren hier Interesse)
Minute 5:00  → Dritter Micro-Cliffhanger (Hälfte einer 10-Min-Episode)
Minute 7:00  → Vierter Micro-Cliffhanger 
...alle 2-3 Minuten
```

**Formulierungen:**
```
NEUGIER-CLIFFHANGER:
"Aber das Verrückte ist: Das ist noch nicht mal der interessanteste Teil."
"Und jetzt kommt's..."

WENDEPUNKT-CLIFFHANGER:
"Aber was wenn das Gegenteil stimmt?"
"Ja – bis wir auf [überraschende Info] gestoßen sind."

KONFLIKT-CLIFFHANGER:
"Da bin ich komplett anderer Meinung." [Pause] "Und zwar deshalb..."
"Das ist genau der Punkt wo die meisten Leute falsch liegen."
```

**Regel:** NIEMALS mehr als 90 Sekunden ohne neuen Spannungspunkt. Wenn die Analyse zeigt dass ein Segment zu "flach" ist → automatisch Micro-Cliffhanger einfügen.

#### 2.4 Konflikt-System zwischen Hosts

**Warum Konflikt?** Weil Harmonie langweilig ist. Meinungsverschiedenheiten erzeugen die höchste Engagement-Rate in Podcasts.

```
LEVEL 1 – SANFTER WIDERSPRUCH (provocation < 30):
"Hmm, ich sehe das ein bisschen anders..."
"Ja, aber überleg mal von der anderen Seite..."

LEVEL 2 – DIREKTER WIDERSPRUCH (provocation 30-60):
"Nee, da muss ich dir widersprechen."
"Das stimmt so nicht. Die Daten sagen was anderes."

LEVEL 3 – KONFRONTATION (provocation 60-80):
"Quatsch! Das ist doch komplett an der Realität vorbei."
"Sorry, aber das ist genau die Denkweise die das Problem verschlimmert."

LEVEL 4 – HITZIG (provocation > 80):
"Das ist der größte Unsinn den ich je gehört habe!"
"Okay, jetzt mal ehrlich – glaubst du das wirklich?"
```

**Frequenz:** Mindestens 1 Meinungsverschiedenheit pro 5 Minuten. Bei Debate-Format: 1 pro 2 Minuten. Der Konflikt muss IMMER aufgelöst oder in eine neue Richtung gelenkt werden (nie im Streit enden → frustriert Hörer).

#### 2.5 Payoff-Strategie

**Prinzip:** Das "große Geheimnis" / die "wichtigste Erkenntnis" kommt SPÄT – nicht am Anfang.

```
FALSCH (Payoff zu früh):
Minute 1: "Die Antwort ist X." 
→ Rest der Episode ist Begründung → Hörer schaltet ab weil er die Antwort schon hat

RICHTIG (Payoff spät):
Minute 1: Hook + "Am Ende dieser Episode werdet ihr verstehen warum X"
Minute 3-8: Kontext, Argumente, Gegenargumente, Spannung aufbauen
Minute 9-10: Payoff → Die große Erkenntnis
Minute 10-11: Implikationen → "Und das bedeutet für euch..."
Minute 11-12: End-Hook → Nächste Episode anteaser
```

---

### 3. Skript-Qualitäts-Checks (automatisch)

Die Script Engine prüft nach der Generierung automatisch:

```
CHECK 1: Hook vorhanden?
  → Erstes Segment muss Hook-Typ enthalten. Sonst: Regenerieren.

CHECK 2: Füllwort-Balance?
  → Zählt Füllwörter pro Minute. Unter Minimum → mehr einfügen. 
    Über Maximum → entfernen.

CHECK 3: Back-Channeling?
  → Kein Monolog > 20 Sekunden ohne Reaktion des anderen Hosts.
    Sonst: Back-Channel einfügen.

CHECK 4: Open Loops?
  → Mindestens 1 pro 5 Minuten. Alle müssen aufgelöst werden.
    Offene Loops am Ende → Warnung.

CHECK 5: Micro-Cliffhanger?
  → Kein Segment-Block > 90 Sekunden ohne Spannungspunkt.
    Sonst: Cliffhanger einfügen.

CHECK 6: Konflikt?
  → Mindestens 1 Meinungsverschiedenheit pro 5 Minuten.
    Sonst: Widerspruch einbauen.

CHECK 7: Payoff-Timing?
  → Haupterkenntnis darf nicht in den ersten 30% der Episode kommen.
    Sonst: Umstrukturieren.

CHECK 8: End-Hook?
  → Letztes Segment muss Teaser für "nächstes Mal" enthalten.
    Sonst: Ergänzen.
```

Jeder Check hat eine Reparatur-Funktion die das Skript automatisch anpasst, ohne es komplett neu zu generieren.

---

### 4. Feedback-Integration

Die FeedbackLoop speist Learnings zurück in das Framework:

```
SIGNAL: Drop-off bei Minute 3 ist >20%
→ ANPASSUNG: Stärkeren Micro-Cliffhanger bei Minute 2:45 setzen

SIGNAL: Provokante Hooks haben 40% mehr Retention
→ ANPASSUNG: Hook-Generator bevorzugt kontroverse Hooks

SIGNAL: Episoden mit Host "Max" haben 2x mehr Shares
→ ANPASSUNG: AI Persona Creator empfiehlt ähnliche Personality-Profile

SIGNAL: Replays häufen sich bei Minuten mit Konflikt
→ ANPASSUNG: Mehr Meinungsverschiedenheiten pro Episode

SIGNAL: 30-Sekunden-Clips mit Frage-Hooks performen auf TikTok am besten
→ ANPASSUNG: ClipGenerator priorisiert Frage-Segmente
```

Das System wird mit jeder Episode besser. Nicht durch Raten, sondern durch Daten.

---

## Nächster Schritt

Modul 0 (Infrastruktur) muss zuerst erledigt werden – Supabase Projekt, API-Keys, Accounts. Erst danach kann mit dem Bauen begonnen werden.
