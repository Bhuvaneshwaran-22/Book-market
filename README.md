# BOOK MARKET

Campus-only, trust-first textbook exchange built with React, Firebase Auth (Google only), and Firestore.

## Day 1 goals
- Google Sign-In limited to college emails (defaults to `.edu`)
- Verify user and store profile in Firestore
- Add textbook listings with academic context and intent (sell/lend/donate)
- View available listings in real time

## Day 2 goals
- Owners can generate an exchange QR per book (encodes bookId + ownerId)
- Second student scans QR with device camera to confirm handoff
- Firestore book status updates to `exchanged` with `exchangedAt` and `exchangedWith`
- Exchanged books disappear from the available feed instantly

## Day 3 goals
- Impact Ledger shows real-time exchanged-book metrics (reuse count, money saved, paper saved)
- QR scanner handles camera permission errors gracefully
- Successful exchange shows clear confirmation and returns to the book list
- Demo-safe UX with concise navigation (Impact Ledger, Scan QR)

## Setup
1) Copy `.env.example` to `.env` and fill your Firebase web config.
2) Install deps: `npm install`
3) Run dev server: `npm run dev`

## Firebase
- Config lives in [src/firebase/config.js](src/firebase/config.js)
- Auth/Firestore instances in [src/firebase/firebaseApp.js](src/firebase/firebaseApp.js)
- Google sign-in and user doc creation in [src/firebase/auth.js](src/firebase/auth.js)

## App flow
- Auth gate in [src/App.jsx](src/App.jsx): unauthenticated users see Login, authenticated users get navigation + routes.
- Add listing: [src/components/AddBook.jsx](src/components/AddBook.jsx) saves to `books` with status `available` and owner info.
- Live feed: [src/components/BookList.jsx](src/components/BookList.jsx) streams available books ordered by `createdAt`.
- QR exchange:
	- Owners click "Generate Exchange QR" on their book cards ( [src/components/QrExchangeGenerator.jsx](src/components/QrExchangeGenerator.jsx) ).
	- Second student opens the scanner at `/scan` ( [src/components/QrExchangeScanner.jsx](src/components/QrExchangeScanner.jsx) ).
  - Successful scan marks the book `exchanged` with `exchangedAt` + `exchangedWith` and auto-returns to the list.
- Impact Ledger: [src/components/ImpactLedger.jsx](src/components/ImpactLedger.jsx) streams `exchanged` books to surface reuse, money, and paper-saved metrics in real time.
- `books`: `title, subjectCode, department, semester, condition, intent, ownerId, ownerEmail, status, createdAt`

## Notes
- College email check currently accepts any `.edu` domain; adjust `allowedDomains` in [src/firebase/auth.js](src/firebase/auth.js) if your campus uses custom domains.
- Hackathon-friendly: minimal styling, no backend server, no payments, no chat.
