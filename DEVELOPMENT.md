# DormHunt Full-Stack Development Guide

## Current Status

### ✅ Backend (Go) - Ready for Testing
- RESTful API server (Chi router)
- PostgreSQL/Supabase database setup
- Entities: Dorm, Report, Message
- Repositories: PostgresDormRepository, PostgresReportRepository, PostgresMessageRepository
- Use-cases: DormUseCase, ReportUseCase, MessageUseCase
- HTTP Handlers: DormHandler, ReportHandler, MessageHandler
- Simple auth middleware (X-User-ID or Bearer token)

**API Routes**:
- `GET/POST /api/v1/dorms` - List/create listings
- `POST /api/v1/reports` - Submit report (auth required)
- `GET /api/v1/reports/open` - List open reports (auth required)
- `PATCH /api/v1/reports/{id}/resolve` - Resolve report (auth required)
- `POST /api/v1/messages` - Send message (auth required)
- `GET /api/v1/messages/conversation/{user_id}` - Get conversation (auth required)

### ✅ Frontend (React) - Scaffolded & Routed
- Vite + React 19 + TypeScript
- React Router v6 (all 9 pages routed)
- Zustand state management (auth store)
- Axios API client with service layer
- Design tokens (colors, typography, spacing)
- Global CSS with CSS variables
- Protected routes (authentication guard)

**Pages Created**:
1. HomePage
2. SearchPage
3. ListingDetailPage
4. LoginPage
5. ManageListingsPage (Owner)
6. CompareListingsPage
7. FavoritesPage
8. AdminDashboardPage
9. FindRoommatePage
10. OwnerDashboardPage

## Quick Start

### Backend

```bash
# From project root
cd backend

# Set DATABASE_URL in .env
# export DATABASE_URL="postgres://user:pass@localhost:5432/dormhunt"

# Run migrations on Supabase
# Use `supabase/migrations/` with the Supabase CLI, or paste the SQL into the dashboard

# Start server
go run ./cmd
# Server starts on http://localhost:8080
```

**Test API**:
```bash
# List dorms (no auth needed)
curl http://localhost:8080/api/v1/dorms

# Submit report (with user ID header)
curl -X POST http://localhost:8080/api/v1/reports \
  -H "X-User-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "reported_item_id": "550e8400-e29b-41d4-a716-446655440001",
    "reported_item_type": "dorm",
    "reason": "Suspicious listing",
    "details": "Multiple red flags"
  }'
```

### Frontend

```bash
# From project root
cd frontend

# Install deps
npm install

# Create .env
cp .env.example .env
# (keep defaults or update VITE_API_URL if backend not on localhost:8080)

# Run dev server
npm run dev
# Frontend available at http://localhost:5173
```

Visit `http://localhost:5173` to see the app. All pages route correctly but are placeholders.

## Next Steps

### Phase 1: Core UI Components
1. Create base components: Button, Card, Input, Modal
2. Implement Navigation/Layout shells (header, sidebar)
3. Build Listing cards with images/details

### Phase 2: Page Implementation
1. **HomePage**: Hero + featured listings + CTA
2. **SearchPage**: Filter panel + listing grid + pagination
3. **ListingDetailPage**: Gallery + info + reviews section
4. **LoginPage**: Auth form + validation

### Phase 3: Integrations
1. Connect API calls to pages
2. Add form validation and error handling
3. Implement image upload (Supabase storage)
4. Build admin/owner dashboards with charts

### Phase 4: Polish & Test
1. Add E2E tests (Playwright)
2. Performance optimization
3. CI/CD setup (GitHub Actions)
4. Docker compose for local dev

## Database Schema

### Tables
- `profiles` - Users linked to Supabase auth
- `dorms` - Property listings
- `reports` - Content/user reports
- `messages` - Direct messages between users

See `backend/migrations/` for SQL.

## Design Reference

Design tokens extracted from Figma designs in `design-ref/` folder:
- **Primary**: Indigo (#6366F1, #4F46E5)
- **Success**: Green (#22C55E)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale (50-900)

All tokens in `frontend/src/styles/tokens.ts` and CSS variables in `frontend/src/styles/globals.css`.

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgres://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=...
PORT=8080
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8080/api/v1
VITE_USER_ID=00000000-0000-0000-0000-000000000001  # For dev testing
```

## File Structure

```
DormHunt/
├── backend/
│   ├── cmd/main.go
│   ├── internal/
│   │   ├── entity/       # Domain models
│   │   ├── repository/   # Data access
│   │   ├── usecase/      # Business logic
│   │   └── delivery/http/
│   │       ├── middleware/auth.go
│   │       └── v1/       # HTTP handlers
│   ├── pkg/              # utilities
│   ├── migrations/       # SQL migrations
│   ├── go.mod
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── services/
│   │   ├── pages/
│   │   ├── components/   # TODO: Build these
│   │   ├── store/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env
├── migrations/
├── .env.example
└── README.md
```

## Notes

- Backend uses simple token-based auth for dev; integrate Supabase JWT in production
- Frontend design tokens ready but components not yet built
- All page stubs present; ready for component implementation
- State management (Zustand) set up; add more stores as needed
- Ready to build component library next

---

**Last Updated**: May 11, 2026
**Next Phase**: Build base UI component library (Button, Card, Input, Modal, Navigation)
