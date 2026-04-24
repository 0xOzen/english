# English Deck

English Deck is a personal B2-C1 English study app for Turkish speakers. It is built around three loops:

- reviewing newly learned English vocabulary with flashcards
- learning natural speaking patterns, idioms, phrasal verbs, and collocations
- practicing advanced grammar topics in an English-Turkish context

## Architecture

- Frontend: `Vite + React`
- Persistence: local `IndexedDB`
- Install path: PWA-friendly browser app for desktop and iPad
- AI image mnemonics: optional Gemini browser key or `/api` proxy
- Login: not required

## Current Phase

Phase 1 converts the original German-focused shell into an English-Turkish B2-C1 app:

- `EN -> TR` and `TR -> EN` study directions
- English vocabulary-focused card model
- B2-C1 default lists
- English speaking pattern and grammar surfaces
- English TTS voice configuration
- updated app metadata, manifest, and backup naming

## Content Direction

The starter decks are shaped by B2-C1 learner priorities from Oxford and Cambridge-style resources:

- Oxford 5000-style advanced learner vocabulary focus
- Cambridge B2 First and C1 Advanced exam skills: vocabulary range, register, paraphrase, discourse, sentence transformations, speaking functions, and writing clarity
- Turkish explanations, original example sentences, collocations, phrasal verbs, idioms, and speaking patterns written specifically for this app

The app does not copy dictionary definitions or copyrighted example sentences. It uses learner-resource categories as guidance and keeps the card explanations original.

## Run Locally

Prerequisite: Node.js

```bash
npm install
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000).

Optional API proxy:

```bash
npm run dev:api
npm run dev:web
```

## Build

```bash
npm run build:web
```

## iPad Install

Open the app in Safari, use the share menu, then choose `Add to Home Screen`.

## Backup

Settings includes local JSON export/import. The app stores vocabulary, stats, API key settings, and install hint preferences locally on the device.
