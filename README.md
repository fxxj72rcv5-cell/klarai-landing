# KlarAI Landing Page

Landing Page für KlarAI – KI-Automatisierung für KMUs im DACH-Raum.

## Features

- **Quiz-Flow**: 5-Fragen Assessment zur Lead-Qualifizierung
- **Score-Berechnung**: Automatisches Scoring mit €-Einsparpotenzial
- **KI-Chat**: Claude API Integration für qualifizierte Leads
- **Responsive Design**: Mobile-optimiert, dunkles Theme

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Claude API (Anthropic)

## Setup

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build
```

## Deployment

### Vercel (empfohlen)

1. Repo mit Vercel verbinden
2. Framework: Vite
3. Done – Auto-Deploy bei Push

### Netlify

1. Build Command: `npm run build`
2. Publish Directory: `dist`

## Konfiguration

### Calendly Link

In `src/App.jsx` den Platzhalter-Link ersetzen:
```javascript
// Suche nach:
https://calendly.com/klarai

// Ersetze mit deinem echten Calendly Link
```

### Claude API

Die API funktioniert automatisch im Claude.ai Artifact-Preview. Für Production-Deployment:

1. Backend-Proxy erstellen (API Key nicht im Frontend!)
2. Oder: Eigenen Chat-Endpoint bauen

## Struktur

```
klarai-landing/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Hauptkomponente
│   ├── main.jsx         # Entry Point
│   └── index.css        # Tailwind Imports
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Lizenz

Privat – KlarAI
