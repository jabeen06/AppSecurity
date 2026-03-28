# The Oratory Guild (Production-Style Full-Stack Mobile App)

The Oratory Guild is a modular public speaking management platform for **Classes 6–8** with secure school-only access, structured roles, OR tracking, notifications, and governance tools.

## Stack

- **Backend:** Node.js + Express + **PostgreSQL** (Prisma; Supabase-compatible)
- **Frontend:** React web (Vite) + React Native (Expo)

## Production-Like Folder Structure

```text
.
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── constants/
│       ├── controllers/
│       ├── middleware/
│       ├── prisma/
│       ├── db/
│       ├── routes/
│       ├── services/
│       └── utils/
└── frontend/
    ├── web/
    └── mobile/
        ├── App.js
        ├── package.json
        └── src/
            ├── components/
            ├── constants/
            ├── context/
            ├── navigation/
            ├── screens/
            ├── services/
            ├── theme/
            └── utils/
```

## Feature Coverage

### Mandatory role pages and guidelines
- Dedicated mobile **Role Guidelines** screen
- Dedicated API routes for role listing/details
- All required roles included with responsibilities and skill sets:
  - G.O.D, Chronomaster, T.T.M, Grammarian, Articulation Auditor, Critical Listener, Guild Speaker, Speech Evaluator, General Evaluator, Ballot Steward

### Authentication and security
- Email domain restriction (`@arborinternationalschool.com` by default)
- Class restriction (6, 7, 8)
- JWT auth + role-based access middleware
- Admin control via configured admin emails

### Core systems
- Role assignment (one role per student per meeting + one student per role)
- Meeting creation (admin-defined date/time + available roles)
- Role selection with duplicate-prevention and G.O.D restriction (OR level >= 3)
- OR tracking system (OR-1 to OR-5): Completed / Pending / Locked + current OR level
  - Admin can mark OR stages completed via API
- Timing & voting rules are *display only* (no live timer / no in-app voting)
- Code of Conduct and Oaths screens

## Run

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run db:push
npm run start
```

### Mobile App

```bash
cd frontend/mobile
npm install
npm run start
```

### Web App

```bash
cd frontend/web
npm install
npm run dev
```

## Notes

- Backend uses **PostgreSQL** via Prisma. Set `DATABASE_URL` in `backend/.env` (see `backend/.env.example`). Supabase passwords with `@` must be URL-encoded (`@` → `%40`).
- After changing the schema, run `npm run db:push` in `backend/`.
- Admin emails are stored in the `AdminList` table; there are no hardcoded admin emails in code.
- Admin bootstrap is supported via `INITIAL_ADMIN_SETUP_TOKEN` (one-time).
