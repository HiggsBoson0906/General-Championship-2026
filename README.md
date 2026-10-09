# General Championship 2026 - Frontend Platform

A modern, high-performance, frontend-only tournament management and spectator platform for the General Championship. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **React Router**.

Deployed Reference: [https://general-championship-seven.vercel.app/](https://general-championship-seven.vercel.app/)

---

## Architecture & Technology Stack

- **Core**: React 19, TypeScript 7, Vite 8
- **Styling**: Tailwind CSS v4 with custom athletic tokens, dark mode, glowing pill animations, and glassmorphism
- **Routing**: React Router v7 configured with centralized routing shell
- **Data Layer**: Static relational CSV files in `public/data/` parsed in-browser via PapaParse and validated at runtime using Zod
- **Testing**: Vitest with jsdom testing CSV parsing, Zod schemas, rankings calculations, and relational integrity
- **Zero Backend**: No database, no server API, no authentication, and no cloud runtime overhead

---

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation & Commands

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Run TypeScript type check
npm run typecheck

# Execute unit test suites (Vitest)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Route Configuration

| Route | View Component | Status / Ownership | Description |
|---|---|---|---|
| `/` | `HomePage` | `feature/home` | Hero overview, podium leaderboard preview, sports highlight, quick links |
| `/rankings` | `RankingsPage` | `feature/rankings` | Full championship standings table, sport points breakdown modal |
| `/teams/:teamId` | `TeamDetailPage` | Shared / `feature/rankings` | Department team profile, total points, sport breakdown, match results |
| `/sports` | `SportsPage` | `feature/sports` | Discipline catalog with search, category filters, venues, max points |
| `/sports/:sportId` | `SportDetailPage` | `feature/sports` | Sport detail, match history, upcoming fixtures, match MVP accolades |
| `/schedule` | `SchedulePage` | `feature/schedule` | Tournament calendar, filters by status (`all`, `scheduled`, `completed`) & sport |
| `*` | `NotFoundPage` | Foundation Shell | Athletic-themed 404 handler |

---

## Shared CSV Data Layer (`public/data/`)

The tournament data lives in `public/data/` and acts as the relational single source of truth across all views. Matches are never duplicated separately between schedule, sport pages, and team profiles.

### 1. `teams.csv`
Defines participating department teams.
- `id` (string, PK): Unique stable identifier (e.g. `team-1`, `team-2`)
- `name` (string): Full team name (e.g. `Arch & MCA`, `Team B`)
- `short_name` (string): 3-4 letter abbreviation (e.g. `ARCH`, `TMB`)
- `department` (string): College department / faculty affiliation
- `image` (string): Team badge or avatar image path
- `primary_color` (string): Hex color code for team styling
- `description` (string): Department description

### 2. `sports.csv`
Defines championship sports and disciplines.
- `id` (string, PK): Sport slug (e.g. `cricket`, `basketball`, `table-tennis`)
- `title` (string): Display title (e.g. `Cricket`, `Table Tennis`)
- `category` (string): Category (e.g. `Team Sport`, `Racquet`, `Track & Field`)
- `description` (string): Discipline summary and format
- `image` (string): Sport banner image path
- `venue` (string): Default campus venue or ground
- `max_points` (number): Maximum potential championship points weight

### 3. `matches.csv`
Defines all fixtures and confirmed match results.
- `id` (string, PK): Match ID (e.g. `m-cricket-01`, `m-sch-01`)
- `sport_id` (string, FK -> `sports.id`): Associated sport
- `date` (string): ISO date (`YYYY-MM-DD`)
- `time` (string): Match start time (e.g. `16:00`)
- `venue` (string): Court or pitch location
- `stage` (string): Round/stage (`Final`, `Semi-Final`, `League Stage`)
- `team1_id` (string, FK -> `teams.id`): First team
- `team2_id` (string, FK -> `teams.id`): Second team (optional for open field)
- `winner_id` (string, FK -> `teams.id`): Winning team (empty if pending/tie)
- `points_awarded` (number): Official points allocated to the winner
- `status` (enum): `completed` \| `scheduled` \| `live` \| `cancelled`
- `score_team1` (string): Team 1 score (e.g. `156/4 (20 ov)`)
- `score_team2` (string): Team 2 score (e.g. `142/8 (20 ov)`)
- `mvp_name` (string, optional): Player of the match
- `mvp_title` (string, optional): Accolade (e.g. `Best Captain`, `Top Scorer`)
- `mvp_image` (string, optional): Photo path for player card

### 4. `championship_history.csv`
Historical record of past tournaments.
- `year` (number, PK): Year of the championship edition
- `edition` (string): Edition name (e.g. `General Championship 2025`)
- `winner_team_id` (string, FK -> `teams.id`): Champion department
- `runner_up_team_id` (string, FK -> `teams.id`): Runner-up department
- `second_runner_up_team_id` (string, FK -> `teams.id`): 3rd place department
- `winner_points` (number): Winning points total
- `total_sports` (number): Count of sports conducted
- `summary` (string): Historical highlights

---

## Scoring Engine & Provisional Rules Documentation

The championship points are calculated dynamically by `src/data/rankings.ts` via `calculateStandings(...)`.

### Current Scoring Mode: `explicit_match_points` (Provisional)
- **Origin**: Derived from the verified existing live deployment (`https://general-championship-seven.vercel.app/`), where individual match results carry explicit points awarded to winning teams (e.g., 44 pts for the Cricket final, 8 or 5 pts for preliminary/semifinal clashes).
- **Provisional Status**: Clearly identified as provisional (`provisional: true` in `DEFAULT_SCORING_CONFIG`) pending final council ratifications.
- **Rules applied**:
  1. Only matches with `status === 'completed'` award championship points.
  2. If `winner_id` matches a team, `points_awarded` is credited to that team's total and sport breakdown.
  3. Losers receive 0 points.
  4. Scheduled/upcoming matches do not award points until marked `completed`.
- **Tie-Breaking Order**:
  1. Primary: Total `overallPoints` (descending)
  2. Secondary: Total match `wins` (descending)
  3. Tertiary: Total `matchesPlayed`
  4. Quaternary: Alphabetical by `teamName`
- **Tied Standings**: Teams with equal points and tie-breakers are awarded the identical rank (e.g., Rank 1, Rank 1, Rank 3).

---

## Updating Tournament Data

To add or modify tournament data:
1. Open the relevant file in `public/data/` (e.g., `matches.csv`).
2. Add a new row following the column order specified in the CSV header.
3. Ensure all foreign key references (`sport_id`, `team1_id`, `team2_id`, `winner_id`) match existing IDs in `sports.csv` and `teams.csv`.
4. Run `npm test` to automatically verify schema validation and relational integrity before committing!

---

## Branch Ownership & Git Workflow

The project follows a strict feature branch isolation model originating from the foundation commit on `main`:

```
main (Foundation Infrastructure, Shared CSV Data Layer & Reusable UI)
├── feature/home       -> HomePage hero, widgets, podium preview, responsive animations
├── feature/rankings   -> RankingsPage standings table, sorting, filters, export utilities
├── feature/sports     -> Sports catalog, discipline rules, sport detail pages, MVP showcases
└── feature/schedule   -> Calendar fixtures, date filters, live score tickers, venue maps
```

### Feature Branch Rules
- **`feature/home`**: Owns `src/pages/HomePage.tsx` and home-specific presentation widgets.
- **`feature/rankings`**: Owns `src/pages/RankingsPage.tsx` and leaderboard-specific ranking displays.
- **`feature/sports`**: Owns `src/pages/SportsPage.tsx`, `src/pages/SportDetailPage.tsx`, and sport cards.
- **`feature/schedule`**: Owns `src/pages/SchedulePage.tsx` and schedule view components.
- **Shared Code (`src/data/`, `src/components/`, `src/context/`, `src/types/`)**: Any modifications to shared infrastructure must remain backwards-compatible and coordinated.

---

## Future Backend Migration Path

When migrating from this static CSV architecture to a backend API (e.g., PostgreSQL, Node.js REST API, GraphQL, or Supabase):

1. **Schema 1:1 Parity**:
   The TypeScript domain interfaces in `src/types/index.ts` and Zod schemas in `src/data/schemas.ts` map directly to relational database tables:
   - `teams.csv` -> `teams` table
   - `sports.csv` -> `sports` table
   - `matches.csv` -> `matches` table
   - `championship_history.csv` -> `championship_history` table

2. **Drop-in API Replacement**:
   `src/data/api.ts` abstracts all data fetching. To connect a backend API, update the fetch calls in `src/data/api.ts` from `fetchAndParseCsv('/data/teams.csv', ...)` to `fetch('/api/v1/teams')`. The rest of the React application (`TournamentContext`, pages, and ranking calculation) will function without changes.
