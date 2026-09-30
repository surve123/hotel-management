# 🎨 Aranavee Hospitality — LMS Frontend

> **Project:** Lead Management System (LMS) — Frontend  
> **Client:** Aranavee Hospitality  
> **Built by:** Knowlia  
> **Framework:** React 19 + Vite 8  
> **Status:** 🔨 In Active Development  

---

## 📑 Table of Contents

1. [📌 Project Overview & Scope](#-project-overview--scope)
2. [👥 User Roles & Access Control (RBAC)](#-user-roles--access-control-rbac)
3. [📄 Pages & Route Mapping](#-pages--route-mapping)
4. [🏠 Properties Managed](#-properties-managed)
5. [🖥️ Core Technology Stack](#️-core-technology-stack)
6. [📦 Complete Dependencies & `package.json`](#-complete-dependencies--packagejson)
7. [🎨 Design System & Typography Guide](#-design-system--typography-guide)
8. [⚙️ Configuration Files Blueprint](#️-configuration-files-blueprint)
9. [📁 Directory & Folder Architecture](#-directory--folder-architecture)
10. [🗄️ State Management & RTK Query Data Layer](#️-state-management--rtk-query-data-layer)
11. [🔐 Multi-Role Auth & Route Guarding](#-multi-role-auth--route-guarding)
12. [🎥 Real-Time Communication & Media Streaming](#-real-time-communication--media-streaming)
13. [🧩 Code Reusability & Shared Patterns](#-code-reusability--shared-patterns)
14. [🚀 Local Setup & Quickstart Guide](#-local-setup--quickstart-guide)
15. [🔗 API Endpoints & Environments](#-api-endpoints--environments)

---

## 📌 Project Overview & Scope

The **Aranavee Hospitality Lead Management System (LMS)** frontend is an enterprise-grade, high-performance React application designed to streamline customer inquiries, sales funnels, booking confirmations, telecaller assignments, and real-time performance analytics across multiple hospitality properties.

### Key Capabilities:
- **Lead Pipeline Management**: Lead creation, status pipelines, automated assignment, and activity timelines.
- **Role-Based Workflows**: Tailored portals and permission boundaries for Super Admins, Property Admins, and Telecallers.
- **Property Multitenancy**: Multi-property switching (Celebrino Garden Villa, Pulse Resort, and upcoming properties).
- **Follow-up Reminders**: Task scheduling, calendar integration, and overdue notification tracking.
- **Booking & Revenue Analytics**: In-depth reports, exportable Excel/PDF summaries, and revenue metrics.
- **Real-Time Synchronisation**: WebSocket alerts, interactive chat, and live status updates.

---

## 👥 User Roles & Access Control (RBAC)

| Role | Permissions & Access Scope |
| :--- | :--- |
| **Super Admin** | Full platform control — all properties, leads, financial reports, user access management, and system settings. |
| **Admin** | Property-level lead management, telecaller assignment, follow-up monitoring, and property revenue reports. |
| **Telecaller** | Assigned lead management, calling logs, status updates, scheduled follow-ups, and personal performance dashboard. |

---

## 📄 Pages & Route Mapping

| Page | Route | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **Login** | `/login` | Public | Role-based secure authentication screen |
| **Dashboard** | `/dashboard` | All Authenticated | KPIs, lead counts, conversion rate & revenue overview |
| **Leads List** | `/leads` | All Authenticated | Searchable, filterable lead table with bulk actions |
| **Add Lead** | `/leads/add` | Super Admin / Admin | Quick & detailed customer inquiry creation form |
| **Lead Detail** | `/leads/:id` | All Authenticated | Complete lead profile, communication timeline & notes |
| **Follow-ups** | `/followups` | All Authenticated | Today's scheduled, upcoming, and overdue calls |
| **Bookings** | `/bookings` | Super Admin / Admin | Confirmed property reservations and payment statuses |
| **Team Management**| `/team` | Super Admin / Admin | Telecaller team roster, workload balance & targets |
| **Reports & Analytics** | `/reports` | Super Admin / Admin | Conversion funnels, agent performance, revenue exports |

---

## 🏠 Properties Managed

- 🏡 **Celebrino Garden Villa** — Luxury villa bookings, event spaces, and weekend getaways.
- 🏨 **Pulse Resort** — Resort stays, conference bookings, and corporate packages.
- 🔜 **3rd Property** *(Coming Soon)* — Expandable multi-property architecture.

---

## 🖥️ Core Technology Stack

| Layer | Technology | Purpose / Role |
| :--- | :--- | :--- |
| **Framework / Runtime** | **React 19** (`react`, `react-dom`) | Modern component model with optimized concurrency |
| **Build Tool & Bundler** | **Vite 8** (`@vitejs/plugin-react`) | Sub-millisecond HMR & optimized production bundling |
| **Styling Engine** | **Tailwind CSS v4** + PostCSS | Utility-first styling with custom tokens and theme extension |
| **Component Libraries** | **MUI Material v9** + Emotion | Accessible UI components, data pickers, dialogs & icons |
| **Routing** | **React Router v7** (`react-router-dom`) | Declarative nested routing & RBAC route guards |
| **Global State & API** | **Redux Toolkit 2.x & RTK Query** | Centralized auth state, caching, automated re-auth & queries |
| **Real-time WebSockets** | **Socket.io-client** + **SockJS / STOMP** | Instant notifications, lead sync & status alerts |
| **Live Media / WebRTC** | **LiveKit Client & React** | Ultra-low-latency interactive audio/video calls |
| **Video Streaming** | **HLS.js** | Adaptive bitrate HTTP Live Streaming for property walkthroughs |
| **Animations** | **Framer Motion 12** | Smooth layout animations, modal reveals & micro-interactions |
| **Documents & Data** | **jsPDF**, **html2canvas**, **xlsx**, `@cyntler/react-doc-viewer` | PDF quote/receipt generation, Excel lead import/export, document viewer |
| **Form Management** | **React Hook Form** | High-performance, re-render optimized form validation |
| **Calendar & Scheduling** | **FullCalendar v7** | Follow-up schedules, booking calendar & inspection visits |

---

## 📦 Complete Dependencies & `package.json`

```json
{
  "name": "lms-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@cyntler/react-doc-viewer": "^1.17.1",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@fullcalendar/daygrid": "^6.1.21",
    "@fullcalendar/interaction": "^6.1.21",
    "@fullcalendar/react": "^7.0.2",
    "@fullcalendar/timegrid": "^6.1.21",
    "@livekit/components-react": "^2.9.24",
    "@livekit/components-styles": "^1.2.0",
    "@mui/icons-material": "^9.2.0",
    "@mui/material": "^9.2.0",
    "@reduxjs/toolkit": "^2.12.0",
    "@stomp/stompjs": "^7.0.0",
    "axios": "^1.18.0",
    "date-fns": "^4.4.0",
    "framer-motion": "^12.42.2",
    "hls.js": "^1.7.1",
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.1",
    "livekit-client": "^2.22.1",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-hook-form": "^7.79.0",
    "react-redux": "^9.3.0",
    "react-router-dom": "^7.18.0",
    "react-toastify": "^11.0.5",
    "socket.io-client": "^4.8.1",
    "sockjs-client": "^1.6.1",
    "stompjs": "^2.3.3",
    "uuid": "^14.0.2",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/postcss": "^4.3.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.2",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "postcss": "^8.5.16",
    "tailwindcss": "^4.3.2",
    "vite": "^8.0.12"
  }
}
```

### 📦 Dependency Categorization & Rationale

```
├── 🎨 UI, Typography & Visuals
│   ├── tailwindcss & @tailwindcss/postcss : Zero-runtime utility-first layout styling
│   ├── @mui/material & @emotion/react     : Accessible enterprise components
│   ├── @mui/icons-material                : Consistent, crisp iconography
│   └── framer-motion                      : Production-grade declarative animations
│
├── 🗄️ State & Data Architecture
│   ├── @reduxjs/toolkit                   : Predictable global state + RTK Query API slice generation
│   ├── react-redux                        : React bindings with selector hooks
│   └── react-router-dom                   : Client-side routing with nested layout hierarchy
│
├── ⚡ Real-Time & Live Multimedia
│   ├── livekit-client & components-react  : Ultra-low-latency WebRTC video conference rooms
│   ├── socket.io-client                   : Instant messaging & active status sync
│   ├── @stomp/stompjs & sockjs-client     : Enterprise fallback WebSocket protocol
│   └── hls.js                             : Adaptive HTTP Live Streaming video player
│
├── 📄 Forms, Dates & Export Utilities
│   ├── react-hook-form                    : High performance, minimal re-render form controller
│   ├── date-fns                           : Immutable lightweight date formatting
│   ├── jspdf & html2canvas                : Direct DOM-to-PDF invoice & summary generators
│   ├── xlsx                               : Excel spreadsheet parsing for bulk lead import/export
│   └── @cyntler/react-doc-viewer          : In-browser contract & quotation viewer
```

---

## 🎨 Design System & Typography Guide

### 🔤 Google Fonts Setup

Imported via `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@500;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
```

### 🎯 Typography Guidelines

| Font Family | Style / Weights | Primary Use Case |
| :--- | :--- | :--- |
| **`Plus Jakarta Sans`** | `500, 600, 700, 800` | **Primary UI & Headings**: Dashboards, cards, modals, and navigation. |
| **`Inter`** | `400, 500, 600, 700, 800, 900` | **Body & High Density Data**: Tables, lead detail timeline, chat feeds, forms. |
| **`Playfair Display`** | `600, 800 (Italic & Regular)` | **Editorial & Hospitality Hero**: Premium property headers & guest spotlights. |
| **`Cinzel`** | `500, 700, 800, 900` | **Branding & Official Invoices**: Official letterheads and booking vouchers. |
| **`Alex Brush`** | `Cursive` | **Signatures & Flourishes**: Authorization signatures on booking contracts. |

### 📏 Typography Scale

| Tailwind Class | Size (rem) | Size (px) | Line Height | Ideal Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-xs` | `0.75rem` | `12px` | `1rem (16px)` | Timestamps, status badges, table metadata |
| `text-sm` | `0.875rem` | `14px` | `1.25rem (20px)` | Secondary body text, form help text, button labels |
| `text-base` | `1rem` | `16px` | `1.5rem (24px)` | Default standard body text, input fields, navigation links |
| `text-lg` | `1.125rem` | `18px` | `1.75rem (28px)` | Card headers, modal titles, featured list item titles |
| `text-xl` | `1.25rem` | `20px` | `1.75rem (28px)` | Section sub-headers, KPI metrics numbers, tab headers |
| `text-2xl` | `1.5rem` | `24px` | `2rem (32px)` | Page titles, primary dashboard headings, prominent modal titles |
| `text-3xl` | `1.875rem` | `30px` | `2.25rem (36px)` | Major page hero titles, total revenue highlights |
| `text-4xl` | `2.25rem` | `36px` | `2.5rem (40px)` | Marketing landing section headlines |
| `text-5xl` | `3rem` | `48px` | `1` | Landing page primary hero headline |

### 🎨 Color Palette & Theme Tokens (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        indigo: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [],
}
```

---

## ⚙️ Configuration Files Blueprint

### ⚙️ `vite.config.js`
Provides development proxying, automatic CORS deduplication, and browser window compatibility for WebRTC/STOMP:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // Polyfill global for STOMP & WebRTC libraries
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req) => {
            // Deduplicate CORS header to resolve multiple Access-Control-Allow-Origin conflict
            if (proxyRes.headers['access-control-allow-origin']) {
              proxyRes.headers['access-control-allow-origin'] = req.headers.origin || '*';
            }
          });
        },
      },
      '/media': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### ⚙️ `src/index.css`
Tailwind CSS v4 direct import and base resets:

```css
@import "tailwindcss";
@config "../tailwind.config.js";

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  overflow-x: hidden;
  font-family: 'Inter', 'Plus Jakarta Sans', sans-serif;
}

#root {
  display: contents;
}
```

---

## 📁 Directory & Folder Architecture

The project follows a **Feature-First + Role-Segmented Modular Architecture**:

```
lms-frontend/
├── public/                     # Static assets & brand logos
├── src/
│   ├── components/             # Reusable UI & Feature-specific widgets
│   │   ├── Charts/             # Lead conversion & revenue charts
│   │   ├── Common/             # Shared universal components
│   │   │   ├── BulkLeadUploadModal.jsx # Excel lead import + parser
│   │   │   ├── StatusModal.jsx         # Action confirmation dialogs
│   │   │   └── ToastContainer.jsx      # Custom notifications
│   │   ├── Followups/          # Follow-up list, calendar & reminder cards
│   │   ├── Leads/              # LeadCard, LeadTimeline, LeadFilterBar
│   │   ├── NavBar/             # Role-aware navigation & property switcher
│   │   ├── Reports/            # Exportable analytics & report tables
│   │   ├── Sidebar/            # Responsive collapsible sidebar
│   │   └── HlsVideoPlayer.jsx  # Property virtual tour streaming player
│   │
│   ├── config/                 # Environment & API configurations
│   │   └── apiConfig.js        # Base URL, timeouts, and env defaults
│   │
│   ├── constants/              # Static enums, roles & route constants
│   │   └── roles.js            # User roles (SUPER_ADMIN, ADMIN, TELECALLER)
│   │
│   ├── context/                # React context providers (AuthContext, ThemeContext)
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/                  # Custom business logic & helper hooks
│   │   ├── useAuth.js          # Token reader, role inspector & session state
│   │   ├── useDebounce.js      # Lead search input debouncing
│   │   ├── useNotifications.js # WebSocket notification listener
│   │   └── useScrollToTop.js   # Auto-scroll on route transition
│   │
│   ├── pages/                  # Page views
│   │   ├── Auth/               # Login, Forgot Password, Reset
│   │   ├── Bookings/           # Booking management & confirmations
│   │   ├── Dashboard/          # Role-based KPI dashboard
│   │   ├── Followups/          # Daily & pending follow-ups
│   │   ├── Leads/              # Lead list, Add Lead, Lead Details
│   │   ├── Reports/            # Revenue & conversion reports
│   │   └── Team/               # Telecaller user management
│   │
│   ├── routes/                 # Centralized Route Tree & RBAC Guards
│   │   ├── components/
│   │   │   ├── PrivateRoute.jsx# Guard requiring auth & specific roles
│   │   │   └── PublicRoute.jsx # Guest-only guard (redirects if authenticated)
│   │   └── index.jsx           # Master route combiner
│   │
│   ├── services/               # API call wrappers & Axios client
│   │   ├── api.js              # Central Axios instance with interceptors
│   │   ├── leadService.js      # Lead CRUD & status management
│   │   ├── bookingService.js   # Booking & payment endpoints
│   │   └── reportService.js    # Metric export endpoints
│   │
│   ├── socket/                 # Real-time WebSocket connection managers
│   │   ├── socket.js           # Global notification socket client
│   │   ├── socketEvents.js     # Event name constants
│   │   └── socketHelpers.js    # Reconnection & payload helpers
│   │
│   ├── store/                  # Redux Toolkit Global State & RTK Query
│   │   ├── api/                # RTK Query API slice definitions
│   │   │   └── common/         # baseQuery, authApi, leadApi, reportApi
│   │   ├── auth/               # authSlice.js (sync authentication state)
│   │   └── index.js            # configureStore root combiner with middleware
│   │
│   ├── utils/                  # Helper libraries & singletons
│   │   ├── formatters.js       # Currency (INR), date & phone formatting
│   │   └── toast.js            # Universal toast notification triggers
│   │
│   ├── App.jsx                 # Top-level Router & Toast Provider
│   ├── index.css               # Tailwind CSS v4 root stylesheet
│   └── main.jsx                # Root ReactDOM mount with Providers
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🗄️ State Management & RTK Query Data Layer

### 🛡️ Unified Base Query with Dual-Token Re-Auth (`baseQuery.js`)

Key features:
1. **Automatic Bearer Token Injection**: Extracts `authToken` and injects `Authorization: Bearer <token>`, `X-User-Id`, and `X-User-Type` headers.
2. **Business Response Envelope Unwrapping**: Inspects backend payloads (`{ success: true, data: ... }`) and automatically converts failure flags into standard RTK Query rejected errors.
3. **Automatic Token Refresh Queue**: If a `401 Unauthorized` occurs, pending requests wait on a single shared `refreshPromise` to exchange `refreshToken` for a new `accessToken` without request storms.
4. **Automatic Mutation Success Toasts**: Detects successful `POST`, `PUT`, `PATCH`, `DELETE` operations and triggers toast notifications.

```javascript
// src/store/api/common/baseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserData, clearUserData } from "../../auth/authSlice";
import { showSuccessToast } from "../../../utils/toast";

let refreshPromise = null;

export const createBaseQueryWithReauth = (baseUrl) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user?.userId) headers.set("X-User-Id", String(user.userId));
          if (user?.userType) headers.set("X-User-Type", String(user.userType));
        } catch (e) {}
      }
      return headers;
    },
  });

  const refreshQuery = fetchBaseQuery({ baseUrl: "http://localhost:8080" });

  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Business Logic Failure Check
    if (!result.error && result.data && typeof result.data === "object") {
      const d = result.data;
      if (d.success === false || (typeof d.statusCode === "number" && d.statusCode >= 400)) {
        result = {
          error: {
            status: d.statusCode || 400,
            data: d,
            message: d.message || "Operation failed.",
          },
        };
      }
    }

    // Token Expired? Auto Refresh Logic
    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken && !refreshPromise) {
        refreshPromise = (async () => {
          const refreshResult = await refreshQuery({
            url: "/api/auth/refresh-token",
            method: "POST",
            body: { refreshToken: storedRefreshToken },
          }, api, extraOptions);

          if (refreshResult.data?.data?.accessToken) {
            return refreshResult.data.data;
          }
          return null;
        })();

        const tokens = await refreshPromise;
        refreshPromise = null;

        if (tokens?.accessToken) {
          localStorage.setItem("authToken", tokens.accessToken);
          result = await baseQuery(args, api, extraOptions); // Retry original call
        } else {
          api.dispatch(clearUserData());
        }
      }
    }

    return result;
  };
};
```

---

## 🔐 Multi-Role Auth & Route Guarding

### 🛡️ Route Guard Pattern (`PrivateRoute.jsx`)

Supports strict role segregation (`SUPER_ADMIN`, `ADMIN`, `TELECALLER`):

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/roles';
import { useEffect, useState } from 'react';

export default function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600 font-medium">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
}
```

---

## 🎥 Real-Time Communication & Media Streaming

### 🎬 Adaptive Video Tour Player (`HlsVideoPlayer.jsx`)
Stream high-resolution property walkthroughs with HLS adaptive bitrate:

```jsx
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HlsVideoPlayer({ src, poster, onEnded }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      poster={poster}
      className="w-full h-full rounded-xl shadow-lg bg-black"
      onEnded={onEnded}
    />
  );
}
```

---

## 🧩 Code Reusability & Shared Patterns

1. **`useAuth.js`**: Centralized hook to verify JWT authentication status, current role, permissions, and logout actions.
2. **`useDebounce.js`**: Prevents spamming the search API while typing customer names/phone numbers.
3. **Excel Parser Modal (`BulkLeadUploadModal.jsx`)**: Reusable drag-and-drop Excel importer using `xlsx` with preview and validation error table before API submission.
4. **PDF Invoice & Summary Generation**: Generates booking receipts using `html2canvas` and exports via `jspdf`.
5. **Universal Toast Dispatcher (`toast.js`)**: Uniform toast notifications for success, error, warning, and info alerts.

---

## 🚀 Local Setup & Quickstart Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

App will run at: **`http://localhost:5173`**

> **Note:** Backend must be running at: `http://localhost:8080` (or configured via environment variables).

### Step 3: Production Build & Linting
```bash
# Typecheck & lint
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔗 API Endpoints & Environments

| Environment | Base URL |
| :--- | :--- |
| **Development** | `http://localhost:8080/api` |
| **Production** | `https://aranavee-backend.up.railway.app/api` |

---

*Client: **Aranavee Hospitality** | Built by **Knowlia** | 2026*
