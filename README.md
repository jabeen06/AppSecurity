# The Oratory Guild

A secure, role-based school web app for Classes 6–8 to run and track structured student-led speaking meetings.

## Run

Open `index.html` in a browser.

## Key Features

- School-domain-only registration (`@arborinternationalschool.com`)
- Strict class validation (6, 7, 8)
- Admin access control via designated email
- Meeting setup, role assignment rules, OR stage tracking
- Voting with timing eligibility checks
- Progress dashboard, role history, participation reporting

## Security Controls

- Input validation for class, phone, and email domain
- Role-based admin panel guards
- Duplicate role prevention per meeting
- One role per student per meeting
- Escaped user-generated output to reduce XSS risk
