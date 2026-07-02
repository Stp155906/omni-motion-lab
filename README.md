# Omni Motion Lab

A local-first motion template lab for faceless 9:16 reels.

The app organizes reusable OmniFlash-style motion templates by category. Each
template card stores:

- a live muted video example
- a motion template title
- a prompt cue for script story beats
- a full reference prompt for generation
- niche, duration, and source metadata

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gemini Omni Flash setup

Create `.env.local` from `.env.example` and add your Google AI Studio key:

```bash
cp .env.example .env.local
```

The dashboard calls `POST /api/omniflash/batch` when you upload a storybeat CSV
and click **Generate Batch via Omniflash API**. Without `GEMINI_API_KEY`, the
route returns payload previews. With the key, each storybeat row is sent to the
Gemini Interactions API using:

- model: `gemini-omni-flash-preview`
- aspect ratio: `9:16`
- duration: `4`
- task: `text_to_video`

Generated MP4 files are saved locally under `public/generated` and returned to
the dashboard as playable/downloadable row results.

## Checks

```bash
npm test
npm run lint
npm run build
```
