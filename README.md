# Hotstart Web

The Next.js frontend for Hotstart, deployed on Cloudflare Workers.

## Architecture

All backend requests go through the centralized API Gateway:

```
https://api.hotstart.dev
```

The gateway routes to individual services:
- `/auth/*` → Auth service (login, register, sessions)
- `/blueprint/*` → Blueprint service (project templates)
- `/ui/*` → UI service
- `/billing/*` → Billing service

**⚠️ Never call worker URLs directly. All requests must go through the gateway.**

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp env.example .env.local
```

For local development, the default config points to `http://localhost:8787`.

For production, set:
```
NEXT_PUBLIC_API_URL=https://api.hotstart.dev
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

| Command | Action |
|:--------|:-------|
| `npm run build` | Build production site |
| `npm run preview` | Preview build locally |
| `npm run deploy` | Deploy to Cloudflare |

## Project Structure

```
src/
├── app/
│   ├── dashboard/     # Protected dashboard page
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   └── page.tsx       # Landing page
└── lib/
    └── api.ts         # API Gateway client with service modules
```

## API Services

The `src/lib/api.ts` file provides typed clients for all services:

```typescript
import { authApi, blueprintApi, billingApi } from '@/lib/api';

// Auth
await authApi.login(email, password);
await authApi.register(email, password);
await authApi.logout();

// Blueprints
await blueprintApi.list();
await blueprintApi.create({ name, config });

// Billing
await billingApi.getPlans();
await billingApi.createCheckout(planId);
```
