# DashboardGpilot — Frontend

> Real-time Trading Dashboard สำหรับนักเทรด Forex เชื่อมต่อกับ MetaTrader 5 ผ่าน Backend API

---

## 🚀 Tech Stack

| หมวด | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript 5 (Strict Mode) |
| UI Library | MUI v7 (Material UI) |
| Charts | @mui/x-charts v8 |
| Data Grid | @mui/x-data-grid v8 |
| Styling | Emotion + TailwindCSS v4 |

---

## 🏗 Architecture

โปรเจคใช้ **Feature-based Clean Architecture** แยก Layer ชัดเจน:

```
src/
├── app/                        # Next.js App Router (Route Definitions)
│   └── (Gpilot)/               # Route Group: requires sidebar layout
│       ├── dashboard/
│       ├── analytics/
│       ├── cashflow/
│       └── history/
│
├── features/                   # Feature Modules (UI + Application Layer)
│   ├── dashboard/              # Dashboard feature
│   │   ├── DashboardPage.tsx   # Page component (Server Component)
│   │   ├── components/         # Feature-specific UI components
│   │   └── hooks/              # Feature-specific hooks (Client-side)
│   ├── analytics/
│   ├── cashflow/
│   └── history/
│
├── shared/                     # Shared cross-feature code
│   ├── api/                    # Infrastructure: API clients
│   │   ├── client.ts           # apiClient — สำหรับ Client Components (/api/gateway proxy)
│   │   └── server.ts           # apiServer — สำหรับ Server Components (direct backend URL)
│   ├── services/               # Application Layer: Business logic + data fetching
│   │   ├── account-service.ts
│   │   └── trade-history-service.ts
│   ├── types/                  # Domain Types (shared TypeScript interfaces)
│   │   └── api.ts              # ServiceResponse<T>, AccountInfo, Deal, etc.
│   ├── config/                 # Configuration (theme, etc.)
│   └── ui/                     # Shared reusable UI components
│
├── layouts/                    # Shared layout components (Sidebar, Header)
└── proxy.ts                    # Next.js Middleware (Auth guard / Gateway routing)
```

---

## 🔄 Data Flow

```
User visits /dashboard
  → Server Component renders (static shell)
  → useDashboardData() hook fetches data client-side
  → apiClient("/api/v1/...") → Next.js Gateway Proxy (/api/gateway/*)
  → FastAPI Backend → MT5Client → MetaTrader 5
  → ServiceResponse<T> flows back to UI
```

---

## ⚙️ Getting Started

### 1. ติดตั้ง dependencies

```bash
pnpm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

```env
# URL ของ Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# เปิด Mock Mode เพื่อพัฒนา UI โดยไม่ต้องเชื่อมต่อ Backend จริง
NEXT_PUBLIC_IS_MOCK_MODE=true
```

### 3. รัน Development Server

```bash
pnpm dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

---

## 🧪 Mock Mode

เมื่อตั้ง `NEXT_PUBLIC_IS_MOCK_MODE=true` ทุก Service จะคืนข้อมูลจำลอง ทำให้ทีม UI พัฒนาได้โดยไม่ต้องรอ Backend:

| Service | Mock Data |
|---------|-----------|
| `AccountService.getAccountInfo()` | Demo account, balance $10,000 |
| `TradeHistoryService.getHistory()` | 6 deals: XAUUSD, EURUSD, GBPUSD |

---

## 📌 API Layer Pattern

ตาม Global Rules #10 — ห้าม fetch ตรงจาก UI Component:

| Client | ใช้เมื่อ | Path |
|--------|---------|------|
| `apiClient` | Client Components | `/api/gateway/*` (proxy) |
| `apiServer` | Server Components / Server Actions | Direct backend URL |

ทุก Service คืนค่าในรูปแบบ `ServiceResponse<T>`:

```typescript
{
  success: boolean;
  data: T | null;
  error: string | ValidationErrorDetail[] | null;
}
```

---

## 📂 Naming Conventions

| สิ่ง | รูปแบบ | ตัวอย่าง |
|-----|--------|---------|
| React Components | PascalCase | `MetricCard.tsx` |
| Hooks | `use` prefix | `use-dashboard-data.ts` |
| Services | kebab-case | `account-service.ts` |
| Types/Interfaces | PascalCase | `AccountInfo`, `Deal` |
| Folders | kebab-case | `trade-history/` |
