# General Championship 2026 - Frontend Platform

A modern, high-performance, frontend-only tournament management and spectator platform for the General Championship. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **React Router**.

Deployed Reference: [https://general-championship-seven.vercel.app/](https://general-championship-seven.vercel.app/)

> [!IMPORTANT]
> **SAMPLE FICTIONAL DATASET NOTICE**: All initial tournament data provided in `public/data/` (`teams.csv`, `sports.csv`, `matches.csv`, `history.csv`, `gallery.csv`) is **fictional sample data** designed for frontend development, component testing, and layout demonstration. This dataset must be replaced with official championship schedules, department rosters, and confirmed rules prior to public launch.

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

### 1. `teams.csv` (8 records)
Defines participating department teams with consistent stable IDs.
- `id` (string, PK): Stable identifier (`team-red`, `team-blue`, `team-gold`, `team-green`, `team-purple`, `team-orange`, `team-silver`, `team-cyan`)
- `name` (string): Team name (e.g. `Red Phoenix`, `Blue Titans`, `Golden Eagles`)
- `short_name` (string): 3-letter abbreviation (`RED`, `BLU`, `GLD`, `GRN`, `PUR`, `ORG`, `SLV`, `CYN`)
- `department` (string): Department affiliation (e.g. `Mechanical & Aerospace Engineering`)
- `image` (string): Local SVG placeholder logo (e.g. `/assets/teams/team-red.svg`)
- `primary_color` (string): Hex color code
- `description` (string): Team profile description

### 2. `sports.csv` (6 records)
Defines championship sports and disciplines: Football, Cricket, Basketball, Volleyball, Badminton, and Table Tennis.
- `id` (string, PK): Sport slug (`football`, `cricket`, `basketball`, `volleyball`, `badminton`, `table-tennis`)
- `title` (string): Display title
- `category` (string): Category (`Team Sport` or `Racquet`)
- `description` (string): Discipline format and description
- `image` (string): Local SVG sport banner (e.g. `/assets/sports/football.svg`)
- `venue` (string): Campus ground / stadium
- `max_points` (number): Maximum potential championship points weight

### 3. `matches.csv` (36 records)
Defines all 36 fixtures (26 completed results and 10 upcoming scheduled fixtures) evenly distributed across the 6 sports.
- `id` (string, PK): Unique match ID (e.g. `m-fb-01` to `m-tt-06`)
- `sport_id` (string, FK -> `sports.id`): Associated sport
- `date` (string): Real calendar ISO date (`YYYY-MM-DD`)
- `time` (string): Scheduled start time (e.g. `16:00`)
- `venue` (string): Court or pitch location
- `stage` (string): Round/stage (`Final`, `Semi-Final`, `Quarter-Final`, `Group Match`)
- `team1_id` (string, FK -> `teams.id`): Team 1
- `team2_id` (string, FK -> `teams.id`): Team 2
- `winner_id` (string, FK -> `teams.id`): Winning team (empty for scheduled matches)
- `points_awarded` (number): Points allocated to the winner (0 for scheduled matches)
- `status` (enum): `completed` | `scheduled` | `live` | `cancelled`
- `score_team1` (string): Team 1 final score (empty for scheduled matches)
- `score_team2` (string): Team 2 final score (empty for scheduled matches)
- `mvp_name` (string, optional): Player of the match
- `mvp_title` (string, optional): Accolade (e.g. `Top Scorer`, `Finals Captain Knock`)
- `mvp_image` (string, optional): Local MVP photo/icon path

### 4. `history.csv` (4 records)
Historical record of past tournaments.
- `year` (number, PK): Year of the championship edition (`2022` - `2025`)
- `edition` (string): Edition name (e.g. `General Championship 2025`)
- `winner_team_id` (string, FK -> `teams.id`): Champion department (`team-gold`, `team-red`, etc.)
- `runner_up_team_id` (string, FK -> `teams.id`): Runner-up department
- `second_runner_up_team_id` (string, FK -> `teams.id`): 3rd place department
- `winner_points` (number): Winning points total
- `total_sports` (number): Count of sports conducted
- `summary` (string): Historical highlights

### 5. `gallery.csv` (8 records)
Curated championship photo moments with local safe SVG placeholders.
- `id` (string, PK): Gallery item ID (`gal-01` - `gal-08`)
- `title` (string): Moment title
- `description` (string): Event description
- `category` (string): Sport or event category (`Cricket`, `Basketball`, `Ceremony`, etc.)
- `image` (string): Local SVG path (e.g. `/assets/gallery/cricket-trophy.svg`)
- `date` (string, optional): Date of capture

---

## Scoring Engine & Provisional Rules Documentation

The championship points are calculated dynamically by `src/data/rankings.ts` via `calculateStandings(...)`.

### Current Scoring Mode: `explicit_match_points` (Provisional)
- **Origin**: Matches individual completed match weights (e.g. 15-20 pts for Finals, 8-10 pts for Semis, 5-8 pts for League).
- **Provisional Status**: Marked as provisional (`provisional: true` in `DEFAULT_SCORING_CONFIG`) until the athletic organizing committee provides official rulebook points matrices.
- **Rules applied**:
  1. Only matches with `status === 'completed'` award championship points.
  2. If `winner_id` matches a team, `points_awarded` is credited to that team's total and sport breakdown.
  3. Losers receive 0 points.
  4. Scheduled matches have no final scores and award no points until completed.
- **Tie-Breaking Order**:
  1. Primary: Total `overallPoints` (descending)
  2. Secondary: Total match `wins` (descending)
  3. Tertiary: Total `matchesPlayed`
  4. Quaternary: Alphabetical by `teamName`
- **Tied Standings**: Teams with equal points and tie-breakers are awarded the identical rank.

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

All 4 feature branches share the exact same CSV schemas, IDs, and data access utilities.
