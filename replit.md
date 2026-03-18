# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **File uploads**: Multer (screenshots + QR codes)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── al-mehandi/         # Al Mehandi e-commerce React app
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── uploads/                # Server-side file uploads
│   ├── screenshots/        # Payment screenshots from customers
│   └── qr/                 # QR code images per combo
```

## Al Mehandi App

**Brand**: Al Mehandi - Henna brand selling combo offers  
**Instagram**: @al_mehandi_  
**Phone/WhatsApp**: 8136917338  
**Email**: almehandi1@gmail.com

### Pages
- `/` - Homepage with 6 combo product cards
- `/checkout/:comboId` - Customer details form
- `/payment/:orderId?comboId=X` - UPI QR payment + screenshot upload
- `/order-confirmed` - Order success page
- `/admin/login` - Admin authentication
- `/admin` - Admin dashboard (order management)

### Products (Combos)
1. Combo 1: ₹70 - 1 Henna + 1 Nail Cone
2. Combo 2: ₹100 - 1 Henna + 2 Nail Cones
3. Combo 3: ₹110 - 2 Henna + 1 Nail Cone
4. Combo 4: ₹190 - 3 Henna + 2 Nail Cones
5. Combo 5: ₹250 - 4 Henna + 3 Nail Cones
6. Combo 6: ₹560 - 10 Henna + 5 Nail Cones

### Admin Credentials
- Username: `admin`
- Password: `almehandi2024`
- Can be changed via `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars

### API Endpoints
- `POST /api/orders` - Create order
- `POST /api/orders/:id/payment-screenshot` - Upload payment screenshot
- `GET /api/qr/:comboId` - Get QR code for a combo
- `POST /api/admin/login` - Admin login (returns sessionId)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/orders` - List all orders (requires x-session-id header)
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/orders/export` - Export orders as CSV
- `POST /api/admin/qr/:comboId` - Upload QR image for a combo

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`.

## Packages

### `artifacts/al-mehandi` (`@workspace/al-mehandi`)
React + Vite frontend. Uses wouter for routing, react-query + generated hooks for API, framer-motion for animations.

### `artifacts/api-server` (`@workspace/api-server`)
Express 5 API server. Handles orders, admin auth (session-based), file uploads via Multer.

### `lib/db` (`@workspace/db`)
Tables: `orders`, `qr_codes`

### `lib/api-spec` (`@workspace/api-spec`)
OpenAPI 3.1 spec. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
