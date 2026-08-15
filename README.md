


# RaktSetu — Blood Emergency Network (MERN)

A **working core** of a blood-donation emergency platform: real auth, a real
compatibility-and-distance donor-matching engine, and role-based dashboards.

## What's actually implemented (and runs)

- JWT access + refresh token auth, bcrypt password hashing, httpOnly refresh cookie
- Roles: donor, patient, hospital, blood bank, NGO, admin
- **Blood matching engine**: real transfusion compatibility rules (`utils/bloodCompatibility.js`)
  + MongoDB geospatial `$near` queries + automatic radius expansion (10km → 50km) if too few
  donors are found + 90-day donation-eligibility filter
- Emergency request lifecycle: create → matched → donor accepts/rejects → fulfilled, with a
  status timeline
- Donor availability toggle, reward points, leaderboard
- Security: helmet, rate limiting, mongo-sanitize, CORS, input validation, RBAC middleware
- Landing page, login/register, donor dashboard, patient dashboard (create + track requests)

## What's scaffolded but not built out

The spec you shared also asked for: Socket.IO realtime feed, chat, push notifications
(FCM/SMS/email), Google Maps, PWA, i18n, admin CMS, hospital/blood-bank/NGO feature sets,
Swagger docs, Docker/CI, and automated tests. Those are genuinely large sub-projects — the
`GenericDashboard` page and the existing route/controller structure are built so each of
those slots in cleanly. Tell me which one to build next and I'll do it properly (real,
tested code) rather than stub it out.

## Run it locally

### Backend
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI (MongoDB Atlas) and JWT secrets
npm install
npm run dev             # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` to `localhost:5000`, so just open the frontend URL.

## Project structure
```
backend/
  config/db.js
  models/          User.js, BloodRequest.js
  controllers/     authController.js, requestController.js, donorController.js
  routes/          authRoutes.js, requestRoutes.js, donorRoutes.js
  middleware/      auth.js, errorHandler.js
  utils/           bloodCompatibility.js, generateTokens.js
  server.js

frontend/
  src/
    api/client.js           axios instance with auto refresh-token retry
    context/AuthContext.jsx
    components/             Navbar, PulseLine, ProtectedRoute
    pages/                  Landing, Login, Register, DonorDashboard,
                             PatientDashboard, GenericDashboard
```

## Try the matching engine end-to-end
1. Register a donor (role: donor, pick a blood group + city, allow location).
2. Register a patient in the same city.
3. From the patient dashboard, create a request for a compatible blood group.
4. The response includes `matchedDonorsCount` — the engine ran real compatibility +
   distance + eligibility filtering, expanding the radius automatically if needed.
