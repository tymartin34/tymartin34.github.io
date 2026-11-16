# Personal site

Astro static site. Target: GitHub Pages, public repo.
**Do not commit, push or deploy until the owner says so.**

- Preview: `npm run dev` (port 4321). Build check: `npm run build`.
- Open items and known weak spots: `private/OPEN_ITEMS.md`. Read it only when
  picking up or closing a task; update it when an item is done or a new one appears.
- Original brief: `~/Downloads/WebsiteBrief.md` (read only if needed).

## How to work
- Make the change, verify it, report briefly. Flag anything you assumed.
- Check desktop and phone widths after any visual change.

## Design rules
- Cream background, near-black text, forest green accent (tokens in `src/styles/global.css`).
- Geist sans for text; Geist Mono for labels, numbers, dates.
- Mobile first; nothing hover-only. One signature interaction: the Traveler globe.
- Compact but not dense.

## Pages (`src/pages`)
- index: hero, cut-out portrait, animated pulse line (`src/components/PulseLine.astro`),
  four pillar boxes, About, small contact line.
- investor: five memo titles + subtitles, employer disclaimer.
- builder: card format is problem > what I built > stack > learned > link.
- athlete: 2026 Wrapped totals, race cards (Raced / Upcoming), Data-Driven Insights
  (weekly volume chart + three thesis/numbers/implication cards).
- traveler: globe + photo cards. Country name and photo only: no cities, years or
  location data anywhere. Stat is fixed at 19 countries (the list shows 18 on purpose).
- experience, principles.

## Where content lives (edit these, not the pages)
- `src/data/site.ts`: nav, bio, resume, principles, memos, pillar stats.
- `src/data/athlete.ts`: totals, races, insights. `routes.json`: course outlines.
- `src/data/countries.ts` + `photos.json`: globe and cards.
- `src/data/training.json`: chart data (derived numbers only).

## Privacy rules
- Never commit secrets, raw Garmin files, the unredacted resume, or original photos.
  `private/` is git-ignored and holds raw data and working notes.
- The public resume PDF (`public/resume/`) has phone and home town removed. Keep it that way.
- Travel photos: run `node scripts/photos.mjs "<folder>"`; it strips all metadata.
- Do not send the owner's name or details to outside services.

## Garmin work: be token-efficient
- Never page activities through MCP tools. Run local scripts with
  `uvx --from garmin-personal-mcp --with numpy python <script>` and print only summaries.
- Scripts: `scripts/garmin/` (fetch.py, analyze.py, fetch_sleep_hrv.py, analyze_sleep_hrv.py).
- Caches: `private/garmin-activities.json`, `private/garmin-sleep-hrv.json`.
- Use miles and min/mi, never km.
