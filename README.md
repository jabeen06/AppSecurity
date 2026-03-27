# The Oratory Guild (Production-Style Full-Stack Mobile App)

The Oratory Guild is a modular public speaking management platform for **Classes 6–8** with secure school-only access, structured roles, OR tracking, notifications, and governance tools.

## Stack

- **Backend:** Node.js + Express (modular API design)
- **Frontend:** React Native (Expo) mobile client

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
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
└── frontend/
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
- OR stage submission and admin approval workflow
- Role assignment (one role per user per meeting + one user per role)
- Meeting SMS notifications via service layer stub
- Timing support screen for Chronomaster checkpoints
- Voting API with timing eligibility check
- Dashboard metrics endpoint for admin panel
- Code of Conduct and Oaths screens

## Run

### Backend

```bash
cd backend
npm install
npm run start
```

### Mobile App

```bash
cd frontend/mobile
npm install
npm run start
```

## Notes

- `backend/src/models/db.js` uses an in-memory datastore as a clean, testable baseline.
- For deployment, replace with PostgreSQL/Mongo and persistent queues for SMS jobs.
