# Crystal Quiz

An interactive, picture-led personality quiz for a live event. Guests tap through six
image questions on a **16:9 touch screen**; their result is revealed in real time on a
separate **1 m × 3 m (1:3 portrait) display wall**. The two screens run on different
computers and stay in sync over the local network.

The quiz is framed as a bit of fun — an **aesthetic / personality match**, not a health,
medical, or "crystal healing" claim — which keeps it appropriate for a medical event.

## The eight outcomes

Citrine · Rose Quartz · Amethyst · Clear Quartz · Aventurine · Aquamarine ·
Strawberry Quartz · Obsidian

Scoring is balanced so all eight are roughly equally likely (verified across all 4096
possible answer paths — run `npm run validate`).

## Tech

- **Vite + React + TypeScript**, animation by **`motion`** (Framer Motion).
- **`server/relay.mjs`** — a tiny Node (Express + `ws`) process that serves the built
  app *and* relays sync messages between the screens. Holds the session state so a
  mid-quiz refresh on the wall recovers instantly.
- AI imagery (Nano Banana Pro) lives in `public/images/`. Any missing image falls back to
  a hand-built faceted SVG gem, so the app always looks finished.

## Run it

```bash
npm install

# Development (hot reload). Vite on :5173, relay on :8787.
npm run dev
#   touch screen  -> http://localhost:5173/?screen=touch
#   display wall  -> http://localhost:5173/?screen=display

# Event / production: build once, then serve everything from the relay.
npm run kiosk
#   Relay prints its LAN address, e.g. http://192.168.1.42:8787
#   On the TOUCH pc:    http://localhost:8787/?screen=touch
#   On the DISPLAY pc:  http://192.168.1.42:8787/?screen=display
```

Both machines must be on the same network. Run `npm run kiosk` on the machine driving the
touch screen (or any always-on box); the display PC just opens its URL in a browser
(use F11 / kiosk mode for fullscreen).

### Network notes

- The client connects to the relay on **port 8787** by default. If you serve the app from
  a different host/port, append `?ws=HOST:PORT` (e.g. `?screen=display&ws=192.168.1.42:8787`).
- Allow Node through the Windows firewall the first time (private networks).

## Images

See `public/images/README.md` and `scripts/image-prompts.md` for the slot names and the
exact generation prompts. Drop files in as:

```
public/images/crystals/<crystal-id>.png   # 8 hero images (reveal wall)
public/images/options/<option>.png         # 24 question tiles
```

## Content / scoring

- Crystals & copy: `src/data/crystals.ts`
- Questions & score vectors: `src/data/questions.ts`
- Scoring + tie-break: `src/lib/scoring.ts` (`npm run validate` to re-check balance)
