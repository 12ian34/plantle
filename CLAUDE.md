# CLAUDE.md

## Overview

**Plantle** is a plant-themed Wordle clone where daily word solutions are restricted to plant-related categories: herbs, spices, fruit, vegetables, beans, mushrooms, flowers, bushes, trees, and crops.

Live site: https://plantle.netlify.app

## Tech Stack

- **Frontend**: Svelte (v4) with Rollup bundler
- **Hosting**: Netlify (static site + serverless functions)
- **Database**: Supabase (stores the word list in `plantle` table)
- **Dictionary API**: dictionaryapi.dev (validates user guesses are real words)

## Project Structure

```
plantle/
├── src/
│   ├── App.svelte      # Main game logic and UI
│   ├── Modal.svelte    # Share results modal component
│   └── main.js         # Svelte app entry point
├── netlify/functions/
│   ├── getWord/        # Fetches daily word from Supabase (date-based hash)
│   └── dictionaryLookup/  # Validates words against dictionary API
├── public/
│   ├── index.html      # HTML shell
│   ├── global.css      # Base styles
│   └── favicon.png     # Plant icon
└── files/              # Screenshots and assets
```

## Key Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server with hot reload
npm run build        # Production build to public/build/
npm run start        # Serve built files locally
npm test             # Run core game-logic unit tests
```

## Architecture Notes

- **Daily word selection**: Uses a hash of the date to deterministically pick a word from Supabase, ensuring all players get the same word each day
- **State persistence**: Game state (board, guesses, stats) saved to localStorage
- **One play per day**: Enforced client-side via localStorage date check
- **Statistics**: Tracks games played, won, and average guesses

## Environment Variables

- `SUPABASE_PLANTLE_PUBLIC_ANON_API_KEY` - Supabase anon key (set in Netlify)
- Local development: copy `.env.example` to `.env` and fill in the key

## Changelog

### 2026-02-01
- Added `.env.example` documenting required Supabase key for local use
- Added core game logic module with unit tests
- Improved UI contrast, animations, and keyboard styling
- Added API fallbacks with client + Netlify function logging
- Added theme toggle, refined typography, and backspace key on keyboard

### 2022-02 - v0.4
- Added player statistics (played, won, average guesses)

### 2022-02 - v0.3
- Keyboard highlighting for correct/present/used letters
- localStorage for game state and stats
- One play per day restriction
- Share results feature
- Design overhaul with new color scheme

### 2022-02 - v0.2
- Dictionary API integration for word validation
- Supabase backend for daily word storage
- Site analytics

### 2022-02 - v0.1
- Initial game logic and word matrix
- Basic keyboard and styling
- Hardcoded solution for testing

## future

- [ ] improve responsiveness
