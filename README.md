# USTAAD AI — deploy in 5 minutes, free

A single-page Indian classical + global music studio with a real, internet-connected,
voice-enabled AI music mentor ("Ustaad AI"). No build step, no database required.

## What changed in this version

- **Chat now works everywhere, not just on Vercel.** The app tries the secure server
  function first (`/api/chat`); if that's not available — e.g. you're previewing the raw
  HTML somewhere without a backend — it automatically falls back to calling Gemini
  directly from the browser using a free API key you paste in once (saved only in your
  browser's local storage). A small popup asks for it the first time it's needed.
- **Floating Ustaad AI bot** — a mic button fixed in the corner on every tab, not just the
  chat tab. Tap it to open a compact chat panel, or tap the mic inside it to talk hands-free.
- **Real voice output.** Ustaad AI now speaks its replies aloud using the browser's
  built-in text-to-speech, with a 🔊/🔇 toggle. Combined with the existing real speech-to-text,
  this is a genuine two-way voice conversation, not a script.
- **Real MP3 export.** Export now renders your exact arrangement offline (via Tone.js) and
  encodes it to an actual `.mp3` with a pure-JavaScript encoder (lamejs) — entirely on your
  device. It's instant (no more waiting for real-time playback) and the file is properly
  shareable anywhere — Instagram, WhatsApp, email — unlike the earlier `.webm` export.
- **AI Music Master.** A new button that sends your current track volumes to Ustaad AI and
  gets back specific mixing suggestions you can apply with one tap each, individually or
  all at once.
- **Console noise removed.** Tone.js's own startup banner is now silenced at load time.
  Note: if you're previewing this in a third-party tool with its own "Console Messages"
  panel, that panel itself belongs to that tool, not this app — there's simply nothing left
  for it to show now.

## What's actually real in this build

15 instruments (10 Indian classical, 5 global) synthesised live in your browser — zero
cost, no samples to host. A real 16-step sequencer you tap to compose, with shuffle and
AI-suggested patterns. Export MP3 renders and encodes a real playable file. Ustaad AI chat,
voice in, and voice out are all real and internet-connected. Hum to Ustaad runs real
pitch-detection on your mic and asks the AI what raga it might be. Discover posts and Grow
& Earn stats are saved for real in your browser's local storage.

## What's intentionally NOT pretending to be real

No shared backend, so Discover is private to your browser, not a public feed. No
song-matching against a real catalogue (needs a paid fingerprinting service) — Hum to
Ustaad gives real detected notes + AI interpretation instead. No payment processing — Grow
& Earn is honest strategy plus your real stats, not a fake currency simulator.

## Deploy to Vercel (free tier covers this completely)

1. **Get a free Gemini API key** at https://aistudio.google.com/apikey (no card required).
2. Push this folder to a GitHub repo (or drag-and-drop into Vercel's dashboard under
   "Add New… → Project → Upload").
3. In Vercel: **Project Settings → Environment Variables**, add `GEMINI_API_KEY` = your key.
4. Deploy — no build command, no install command, no framework preset needed (pick "Other"
   if asked).

This gives you the secure path, where your key lives server-side. If you skip this entirely
and just open `index.html` anywhere, the app will instead prompt each visitor once for their
own free key, stored only in their own browser — handy for testing, less ideal for a public
audience since each visitor needs their own key.

## Files

```
index.html      — the entire app: markup, styles, and JS (Tone.js + lamejs from CDN)
api/chat.js      — optional serverless function: keeps your key server-side when deployed
package.json     — minimal, zero dependencies
```

## Honest next steps, when you want them

- **Real shared Discover feed** — wire up Supabase (free tier) so posts are visible to
  everyone, not just your browser.
- **Real payments** — a Razorpay payment link for sample packs or paid 1:1 sessions.
- **Real raga selector** — let tracks lock to a specific raga's swaras instead of a fixed
  major scale.
- **Sampled instrument audio** — swap any synth for a real recorded sample for a more
  authentic timbre.
