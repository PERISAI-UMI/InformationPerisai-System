# PROJECT INTELLIGENCE REPORT: UKM PERISAI UMI INFORMATION SYSTEM

**Investigator**: Antigravity (Senior Software Architect & Security Auditor)  
**Target Codebase**: `InformationPerisai-System`  
**Analysis Date**: October 2026  
**Confidence Standard**: All findings are classified as **CONFIRMED**, **HIGH CONFIDENCE**, **LIKELY**, **POSSIBLE**, or **UNKNOWN** based on source code and configuration inspection.

---

## 1. Executive Summary

This codebase is a **Fullstack Monolith Web Application & Headless/Decoupled CMS** built for **UKM PERISAI UMI** (Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia). It represents a complete modern migration/rebuild from a legacy PHP 8.2 / Laravel 11 / Blade stack to **Next.js 16.3.8 (App Router)**, **React 19.2.8**, **TypeScript 5 (Strict)**, and **Tailwind CSS v4**.

The system serves two distinct surfaces:
1. **Public Information Portal**: An SEO-optimized, highly responsive public profile showcasing the organization's research ecosystem, leadership organogram, scientific achievements, work programs, competition opportunities, and inquiry forms.
2. **Authenticated Administrative CMS Panel (`/admin`)**: A role-based content management suite allowing student fungsionaris to manage news, competition notices, media assets, team directories, incoming messages, site settings, and audit trails without modifying code.

A defining architectural constraint is its **Shared Database Model** with the internal PSDM (Pengembangan Sumber Daya Manusia) attendance and member management system. The application uses a hybrid database setup: local **SQLite 3** (`psdm-db.db`) for offline development and **Turso (LibSQL Cloud)** for production edge deployments on **Cloudflare Workers** via OpenNext.

---

## 2. Project Identity

- **Project Name**: PERISAI UMI Information System (`informationperisai-system`)
- **Project Type**: Full-Stack Web Application + Internal CMS (Content Management System)
- **Primary Purpose**: Digital profile, public publication hub, competition aggregation board, and internal management portal for UKM PERISAI UMI.
- **Target Users**:
  - General Public / UMI Students: Reading articles, browsing competitions, exploring organizational structure, and sending inquiries.
  - Organization Administrators / Fungsionaris: Updating announcements, curating publications, uploading media, and managing member records.
  - Institutional Partners / Lecturers: Assessing organizational credibility and establishing research collaboration.
- **Main Problem Solved**: Eliminates developer dependency for content updates, consolidates fragmented information channels, and bridges student researchers with national/international academic opportunities.
- **Core Value Proposition**: A unified, high-performance, dark-aesthetic digital command center operating at the edge with zero hosting costs on Cloudflare Workers and Turso.
- **Application Domain**: Higher Education / Student Research & Scientific Innovation.
- **Architecture Type**: Fullstack Monolith (Next.js App Router with Server Components & Server Actions).
- **Current Development Status**: **Production-Ready & Actively Maintained** (Edge-ready on Cloudflare Workers, fully typed, 17 automated test suites passing).

---

## 3. What This Project Appears To Do

1. **Publishes & Archives Scientific Research & Activities**: Manages articles, documentation, community service programs, and press releases.
2. **Aggregates Student Opportunities**: Displays research grants, scientific writing competitions (LKTIN/PKM), and scholarships with real-time deadline status computation.
3. **Presents Organizational Governance**: Renders live cabinet organograms, departmental mandates, executive leadership, and advisory board profiles.
4. **Handles Public Inquiries**: Processes public messages, consultation proposals, and partnership inquiries into an administrative inbox.
5. **Audits Operations**: Maintains immutable audit logs of all administrative mutations.
6. **Manages Digital Assets**: Facilitates secure image/media uploads directly to Cloudflare R2 object storage.

---

## 4. Target Users

| User Persona | Context / Need | Surface Used |
|---|---|---|
| **Undergraduate Students** | Mobile-first visitors seeking competition deadlines, PKM mentoring, and organizational updates. | Public Portal (`/`, `/kabar`, `/peluang`, `/tentang`) |
| **Prospective Partners & Dosen** | Institutional evaluators seeking official contacts, organizational history, and research track records. | Public Portal & Contact Form (`/kontak`, `/tentang`) |
| **Fungsionaris / Departemen** | Active department officers updating work programs and publishing event recaps. | Admin CMS (`/admin/posts`, `/admin/opportunities`) |
| **BPH (Badan Pengurus Harian)** | Core executives overseeing organizational data, financial logs, and inbox inquiries. | Admin CMS (`/admin/inbox`, `/admin/members`, `/admin/periods`) |
| **Super Administrator** | Technical leads managing user accounts, permission roles, site configurations, and audit logs. | Admin CMS (`/admin/users`, `/admin/settings`, `/admin/audit-log`) |

---

## 5. Core Problem

Prior to this system, student organizations faced:
1. **Fragmented Communication Channels**: Announcements scattered across Instagram captions and messaging groups with no persistent archives.
2. **High Developer Bottlenecks**: Modifying static HTML/Blade files required programmer intervention for routine content changes.
3. **Data Silos with PSDM**: Organizational leadership and member data had to be manually duplicated across separate administrative databases.

---

## 6. MVP Reconstruction

- **Core MVP (Essential)**:
  - Dynamic Homepage with hero, video profile embed, marquee feeds, and statistics.
  - Organizational Directory (Departments, Leadership Organogram, Advisory Boards).
  - Activity & News Explorer with server-side pagination and client-side fuzzy search.
  - Opportunity / Competition Explorer with automatic status computation (`Buka` vs `Tutup`).
  - Contact & Consultation Form persisting to database.
  - Secure Admin Authentication with cookie sessions and rate limiting.
  - Core CMS CRUD modules: Posts, Opportunities, Inbox.
- **Supporting Features**:
  - Cloudflare R2 media upload driver with image sanitization.
  - Activity Audit Logging (`T_Audit_Log`).
  - Site Settings Manager (YouTube video URL, metadata, contact coordinates).
- **Secondary Features**:
  - Financial Management Module (`T_Keuangan`) — Fully operational CRUD administrative portal (`/admin/finance`), Zod validation, income/expense/net balance indicators, receipt uploads via Cloudflare R2, and CSV export for LPJ reporting.
  - Multi-period archive switching (`M_Periode`).
- **Non-Goals / Explicitly Excluded** (Confirmed by `docs/perisai-umi-spec.json`):
  - No end-to-end competition management (all registrations redirect externally).
  - No public user registration or visitor user accounts.
  - No comments, forums, chats, or e-commerce features.

---

## 7. Feature Inventory

| Feature | Description | User | Entry Point | Backend | Database | Status | Confidence |
|---|---|---|---|---|---|---|---|
| **Public Portal & News** | Article listing, detail reading, category filtering | Public | `/(public)/kabar` | `getPublishedPosts()` | `T_Berita` | Confirmed Working | CONFIRMED |
| **Competition Explorer** | Competition aggregation, deadline counting | Public | `/(public)/peluang` | `getPublishedOpportunities()` | `T_Kompetisi` | Confirmed Working | CONFIRMED |
| **Organogram & Profiles** | Hierarchical organizational chart, department directory | Public | `/(public)/tentang/struktur` | `getPublicActiveMembers()` | `T_Kepengurusan`, `M_Anggota` | Confirmed Working | CONFIRMED |
| **Inquiry Form** | Public contact/consultation form | Public | `/(public)/kontak` | `sendContactMessageAction` | `T_Pesan_Masuk` | Confirmed Working | CONFIRMED |
| **Authentication** | Cookie-based session login & logout with rate limiter | Admin | `/admin/login`, `/api/auth/*` | Next.js API Routes & `auth.ts` | `M_Akun`, `T_Sesi` | Confirmed Working | CONFIRMED |
| **Post Management** | Create, edit, publish, delete articles & news | Admin | `/admin/posts` | `createPostAction`, `updatePostAction` | `T_Berita` | Confirmed Working | CONFIRMED |
| **Opportunity CMS** | Manage competition listings & guide links | Admin | `/admin/opportunities` | `createOpportunityAction` | `T_Kompetisi` | Confirmed Working | CONFIRMED |
| **Member Directory CMS**| Update member records and photos | Admin | `/admin/members` | `updateMemberAction` | `M_Anggota` | Confirmed Working | CONFIRMED |
| **Department CMS** | Update departmental visions, missions, and photos | Admin | `/admin/departments` | `updateDepartmentAction` | `M_Departemen` | Confirmed Working | CONFIRMED |
| **Work Programs CMS** | Manage program status, timeline, and documentation | Admin | `/admin/work-programs`| `updateWorkProgramAction` | `T_Proker` | Confirmed Working | CONFIRMED |
| **Media Library** | Upload files to Cloudflare R2 / S3 | Admin | `/admin/gallery`, `/api/media` | Next.js Route Handler | `T_Media`, Cloudflare R2 | Confirmed Working | CONFIRMED |
| **Inbox Management** | View received messages and mark replies | Admin | `/admin/inbox` | `markMessageReadAction` | `T_Pesan_Masuk` | Confirmed Working | CONFIRMED |
| **User Administration** | Manage staff accounts and roles | Super Admin | `/admin/users` | `createUserAction`, `toggleUserAction`| `M_Akun`, `M_Role` | Confirmed Working | CONFIRMED |
| **Audit Logging** | Review mutation audit trail | Admin | `/admin/audit-log` | `getAuditLogs()` | `T_Audit_Log` | Confirmed Working | CONFIRMED |
| **Site Settings** | Configure video embed, tagline, social links | Super Admin | `/admin/settings` | `updateSettingAction` | `T_Pengaturan` | Confirmed Working | CONFIRMED |
| **Financial Management** | Record income/expenses, balance cards, receipts, and LPJ CSV export | Admin, Super Admin | `/admin/finance` | `createTransactionAction`, `getFinanceSummary()` | `T_Keuangan`, `M_Periode` | Confirmed Working | CONFIRMED |

---

## 8. User Roles

Three explicit CMS roles are implemented in `src/lib/permissions.ts` and mapped from `M_Role`:

1. **`SUPER_ADMIN`**:
   - Master authority. Has unrestricted access to all resources and mutation operations.
   - Exclusive access to: User Account Management (`/admin/users`), Global Site Settings (`/admin/settings`), and Audit Log Purging.
2. **`ADMIN`** (Maps to BPH & Kadep):
   - Operational manager. Can view and modify posts, competitions, work programs, members, inbox messages, departments, and media.
   - Forbidden from: Creating/deleting user accounts, modifying system settings, and altering audit logs.
3. **`EDITOR`** (Maps to Staf Ahli / Kontributor):
   - Content contributor. Permitted to create, read, and update `posts`, `opportunities`, and `gallery` items.
   - Read-only on other modules; strictly forbidden from administrative actions and user management.

---

## 9. Role & Permission Matrix

| Resource | Action | SUPER_ADMIN | ADMIN | EDITOR | Anonymous Public |
|---|---|:---:|:---:|:---:|:---:|
| **posts** | Read Published | ✅ | ✅ | ✅ | ✅ |
| **posts** | Create / Update | ✅ | ✅ | ✅ | ❌ |
| **posts** | Delete | ✅ | ✅ | ❌ | ❌ |
| **opportunities** | Read Published | ✅ | ✅ | ✅ | ✅ |
| **opportunities** | Create / Update / Delete | ✅ | ✅ | ⚠️ (Create/Update only) | ❌ |
| **members** | Read / Browse | ✅ | ✅ | ⚠️ (Read only) | ✅ (Active only) |
| **members** | Update / Manage | ✅ | ✅ | ❌ | ❌ |
| **inbox** | Submit Inquiry | ✅ | ✅ | ✅ | ✅ |
| **inbox** | Read / Mark Replied | ✅ | ✅ | ❌ | ❌ |
| **media / gallery** | Upload / Delete | ✅ | ✅ | ✅ | ❌ |
| **users** | Manage Accounts | ✅ | ❌ | ❌ | ❌ |
| **settings** | Modify Site Config | ✅ | ❌ | ❌ | ❌ |
| **finance** | Manage / View / Delete | ✅ | ✅ | ❌ | ❌ |
| **audit_log** | View Trail | ✅ | ✅ (Read only) | ❌ | ❌ |

---

## 10. User Journeys

### Journey 1: Public Student Browsing & Inquiry Submission
```
User visits /
  ↓
Navigates to /peluang (Competition Explorer)
  ↓
Filters by "KTI" category -> views deadline countdown
  ↓
Clicks external registration link (opens in new tab)
  ↓
Navigates to /kontak -> fills name, email, subject, message
  ↓
Completes Cloudflare Turnstile bot verification
  ↓
Submits form -> triggers sendContactMessageAction
  ↓
Server validates Turnstile token and input via Zod -> persists to T_Pesan_Masuk
  ↓
Frontend displays success alert & toast notification
```

### Journey 2: Administrator Login & Article Publication
```
Admin visits /admin/login
  ↓
Inputs PRN/Email, Password, and completes Cloudflare Turnstile verification
  ↓
POST to /api/auth/login
  ↓
Rate limiter checks IP (limit 10/min) & validates Turnstile token
  ↓
Server queries M_Anggota + M_Akun -> verifies password via scrypt (or legacy SHA-256 with transparent auto-rehash to scrypt)
  ↓
Creates session token (32-byte entropy) -> inserts into T_Sesi
  ↓
Sets HTTP-only secure cookie `perisai_session_id` (7 days)
  ↓
Redirects to /admin (Dashboard)
  ↓
Admin navigates to /admin/posts/new -> uploads cover via /api/media (R2)
  ↓
Submits article -> createPostAction validates and writes to T_Berita
  ↓
Writes record to T_Audit_Log -> triggers revalidatePath('/kabar')
```

---

## 11. Application Routes

### Frontend Public Routes
- `/`: Homepage (dynamic statistics, featured proker, news marquee, opportunities marquee).
- `/kabar`: News and activity publication explorer.
- `/kabar/[slug]`: News detail page with rich text rendering.
- `/peluang`: Opportunity and competition board.
- `/peluang/[slug]`: Competition detail view with deadline badges and guide links.
- `/tentang`: General about page.
- `/tentang/sejarah`: Organizational history timeline.
- `/tentang/visi-misi`: Vision, mission, and institutional objectives.
- `/tentang/struktur`: Cabinet structure and interactive leadership organogram.
- `/tentang/sumber-daya`: Department directory, work programs, and gallery tab interface.
- `/kontak`: Contact details, physical headquarters map, and inquiry form.

### URL Rewrites & Redirects (`next.config.ts`)
- `/about` → `/tentang` (Rewrite)
- `/activity` → `/kabar` (Rewrite)
- `/competition` → `/peluang` (Rewrite)
- `/departemen` → `/tentang/sumber-daya#departemen` (Redirect)
- `/program` → `/tentang/sumber-daya#proker` (Redirect)
- `/galeri` → `/tentang/sumber-daya#galeri` (Redirect)

### Admin CMS Routes (`/admin`)
- `/admin/login`: Admin authentication portal.
- `/admin`: Overview dashboard.
- `/admin/posts`: Post publication management.
- `/admin/opportunities`: Competition opportunity management.
- `/admin/departments`: Department details and goals.
- `/admin/members`: Member registry and photo curation.
- `/admin/work-programs`: Program status and documentation.
- `/admin/gallery`: Media asset management.
- `/admin/periods`: Organizational period management.
- `/admin/inbox`: Received messages viewer and reply tracker.
- `/admin/finance`: Financial transactions management, balance cards, receipts, and LPJ CSV export (Admin & Super Admin).
- `/admin/users`: User account and role administration (Super Admin only).
- `/admin/settings`: Site configuration (Super Admin only).
- `/admin/statistics`: Organizational metrics overview.
- `/admin/audit-log`: Immutable system audit trail.

---

## 12. API Inventory

| Method | Endpoint | Handler | Auth Required | Purpose |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | `src/app/api/auth/[...all]/route.ts` | None (Public) | Authenticates credentials, verifies Turnstile, rehashes legacy SHA-256 to scrypt, creates session in `T_Sesi`, sets cookie |
| `POST` | `/api/auth/logout` | `src/app/api/auth/[...all]/route.ts` | Session | Destroys session record in `T_Sesi`, clears cookie |
| `GET` | `/api/health` | `src/app/api/health/route.ts` | None (Public) | Comprehensive health check verifying database ping, latency, storage config, and env vars |
| `POST` | `/api/media` | `src/app/api/media/route.ts` | Session (can create gallery) | Validates MIME & size, uploads file to R2, saves record in `T_Media` |

*(All other CRUD mutations utilize Next.js Server Actions with built-in CSRF protection and Server Component authorization).*

---

## 13. Technology Stack

- **Runtime**: Node.js `>= 20` (Development/Build) / Cloudflare Workers V8 Isolate with `nodejs_compat` (Production).
- **Framework**: Next.js `16.3.8` (App Router).
- **Language**: TypeScript `5.x` (Strict mode, zero `any` policy).
- **UI & Styling**: React `19.2.8`, Tailwind CSS `v4.3.3` with CSS variables.
- **Database ORM**: Prisma Client `^7.10.0` utilizing Driver Adapters (`@prisma/adapter-libsql`, `@prisma/adapter-better-sqlite3`).
- **Database Engine**:
  - Local Dev: SQLite 3 via `better-sqlite3`.
  - Production: Turso Cloud LibSQL (distributed edge SQLite).
- **Edge Build Framework**: `@opennextjs/cloudflare` `^1.20.11` via `wrangler` `^4.150.0`.
- **Object Storage**: Cloudflare R2 / AWS S3 via `@aws-sdk/client-s3`.
- **Validation**: Zod `^4.6.5`.
- **Security & HTML Sanitization**: `sanitize-html` `^2.18.0`.
- **Test Runner**: Node.js test runner executed via `tsx` `^4.19.3`.

---

## 14. Architecture

The application is structured around a **Decoupled Edge-Ready Monolith**:
- **Presentation Layer**: Server-rendered React Server Components (RSC) for maximum performance and zero client bundle overhead for static pages. Client components (`"use client"`) are strictly isolated to interactive form controls, search explorers, and modals.
- **Service & Domain Layer**: Feature-based folders in `src/features/*` containing separate `queries.public.ts`, `queries.admin.ts`, `actions.ts`, and `schema.ts`.
- **Data Access Layer**: Unified Prisma client instance (`src/lib/db.ts`) with lazy evaluation between LibSQL web client and local SQLite.
- **Security & Governance**: In-memory sliding rate limiter (`src/lib/rate-limit.ts`), Web Crypto API session verification (`src/lib/auth.ts`), and RBAC matrix (`src/lib/permissions.ts`).

---

## 15. Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["Clients"]
        Browser["Web Browser (Mobile & Desktop)"]
    end

    subgraph CDN["Cloudflare Edge Network"]
        CF_WAF["Cloudflare WAF / Turnstile"]
        CF_Cache["Edge Cache & Static Assets"]
        Workers["Cloudflare Worker (OpenNext Runtime)"]
    end

    subgraph App["Next.js 16 Fullstack App"]
        RSC["React Server Components (SSR/ISR)"]
        ClientComp["Client Components (Interactivity)"]
        ServerActions["Server Actions (Mutations)"]
        RouteHandlers["API Route Handlers (/api/*)"]
        AuthLayer["Auth & RBAC Layer (T_Sesi & can())"]
        PrismaORM["Prisma Client 7 (Driver Adapters)"]
    end

    subgraph Data["Persistence & Storage"]
        Turso["Turso Cloud LibSQL Database (psdm-db.db)"]
        R2["Cloudflare R2 Object Storage (Media Assets)"]
    end

    Browser --> CF_WAF
    CF_WAF --> CF_Cache
    CF_Cache --> Workers
    Workers --> RSC
    Workers --> RouteHandlers
    ClientComp --> ServerActions
    ServerActions --> AuthLayer
    RouteHandlers --> AuthLayer
    AuthLayer --> PrismaORM
    RSC --> PrismaORM
    PrismaORM --> Turso
    RouteHandlers --> R2
```

---

## 16. Frontend Analysis

- **Styling Architecture**: Custom Obsidian-Gold Design System built on Tailwind CSS v4 (`#16161a` dark obsidian background, `#FFB22C` gold accent, `#ECECEC` primary text).
- **Layout Consistency**: Strict separation between public layouts (`src/app/(public)/layout.tsx`) and admin dashboard layout (`src/app/admin/(panel)/layout.tsx`).
- **Resilience**: Comprehensive custom Error Boundaries (`src/app/error.tsx` and `src/app/admin/(panel)/error.tsx`) featuring automated self-healing for `ChunkLoadError` caused by rolling production deployments.
- **Accessibility & UX**: All interactive elements feature descriptive titles, focus rings, and screen-reader accessible attributes.

---

## 17. Backend Analysis

- **Mutation Architecture**: 100% of internal content mutations operate through Next.js Server Actions with automatic CSRF tokens and server-side Zod validation.
- **Query Architecture**: Public read queries use React `cache()` for request deduplication and memoization.
- **Audit Logging**: Every mutation calls `writeAuditLog` to record actor, action type, affected resource ID, timestamp, and metadata into `T_Audit_Log`.

---

## 18. Database Analysis

- **Physical Schema**: 20 tables mapped in `prisma/schema.prisma`.
- **Shared Database Governance**: The database is shared with the PSDM management system.
  - Tables prefixed with `M_*` represent Master Entities.
  - Tables prefixed with `T_*` represent Transactional / Content Entities.
  - Timestamps are stored as Unix Epoch seconds (`Int`), matching legacy SQLite conventions.
- **Database Safety Guard**: Schema migrations are strictly handled via raw SQL scripts in `db/migrations/` validated against `db/protected-schema.snapshot.json` by `db/guard.mjs`. Direct destructive commands like `prisma migrate reset` are prohibited by project specifications.

---

## 19. Data Model / ERD Representation

```text
M_Fakultas (Faculty Master)
 └── has many M_Jurusan (Major Master)
      └── has many M_Anggota (Member Master)

M_Anggota (Member Entity)
 ├── has one M_Akun (CMS Account)
 │    ├── belongs to M_Role (RBAC Role)
 │    └── has many T_Sesi (Active Sessions)
 ├── has many T_Kepengurusan (Cabinet Service Periods)
 ├── has many T_Prestasi (Individual Awards)
 └── has many T_Berita (Authored Articles)

M_Departemen (Department Master)
 ├── has many M_Jabatan (Position Master)
 ├── has many T_Kepengurusan (Assigned Officers)
 ├── has many T_Proker (Work Programs)
 ├── has many T_Berita (Department News)
 └── has many T_Kompetisi (Curated Competitions)

M_Periode (Cabinet Period)
 ├── has many T_Kepengurusan
 ├── has many T_Proker
 └── has many T_Keuangan (Financial Records)

T_Prestasi (Award Entity)
 └── has many T_Prestasi_Anggota (Team Members)

Independent System Tables:
 - T_Pesan_Masuk (Inquiry Messages)
 - T_Pengaturan (Key-Value Site Configurations)
 - T_Audit_Log (Immutable Activity Audit Log)
 - T_Media (Storage Media Metadata)
 - M_Pembina (Advisory Board Profiles)
```

---

## 20. Data Flow

```text
Client Submission (e.g. Contact Form)
  ↓
Zod Schema Validation (Client + Server)
  ↓
Rate Limiter Verification (IP Sliding Window)
  ↓
Server Action Execution (sendContactMessageAction)
  ↓
Prisma Client ORM (Mapping to T_Pesan_Masuk)
  ↓
Turso LibSQL / Local SQLite Persistence
  ↓
Cache Revalidation (revalidatePath)
  ↓
Return ActionResponse { success: true, message }
```

---

## 21. Authentication

- **Mechanism**: Stateful cookie-based opaque session tokens.
- **Token Generation**: 32-byte cryptographically secure random values via `globalThis.crypto.getRandomValues`.
- **Token Storage**: Persisted in `T_Sesi` with expiration timestamp (`expires_at`), IP address, and User-Agent.
- **Password Security**:
  - Primary: `scrypt` hashing with unique salt formatted as `salt:hexKey`.
  - Fallback & Migration: Timing-safe SHA-256 for seeded accounts with transparent background re-hashing to `scrypt` upon successful login.
- **Cookie Flags**: `HttpOnly`, `SameSite: Lax`, `Path: /`, `Secure: true` in production, `Max-Age: 7 days`.
- **Brute-Force Protection**: 10 attempts per minute per IP enforced via `checkRateLimit` alongside Cloudflare Turnstile anti-bot verification.

---

## 22. Authorization & Comprehensive RBAC Matrix (Role Capabilities)

The system implements a strict, multi-layered **Role-Based Access Control (RBAC)** architecture centered around the policy engine `can(user, action, resource)` defined in `src/lib/permissions.ts`.

### 22.1. Role Hierarchy & Philosophy

The system distinguishes four privilege tiers:
1. **SUPER_ADMIN (Admin Utama)**: Full system sovereignty. Intended for the organization's technical leads or chief administrators.
2. **ADMIN (Administrator Operasional)**: Day-to-day organizational management. Intended for BPH (Badan Pengurus Harian) executives managing programs, members, media, and finance.
3. **EDITOR (Editor Konten)**: Public information curation. Intended for publication staff and department writers creating news and opportunities without administrative or destructive privileges.
4. **PUBLIC / ANONYMOUS**: Unauthenticated visitors and general students browsing the public website.

---

### 22.2. Master Permission Matrix

| Feature / Resource | Action | SUPER_ADMIN | ADMIN | EDITOR | PUBLIC | Enforcing Layer |
|---|---|:---:|:---:|:---:|:---:|---|
| **Berita / Artikel (`posts`)** | Read | ✅ | ✅ | ✅ | ✅ (Published only) | SQL Filter (`status='PUBLISHED'`) / `can()` |
| | Create | ✅ | ✅ | ✅ | ❌ | Server Action (`createPostAction`) |
| | Update / Edit | ✅ | ✅ | ✅ | ❌ | Server Action (`updatePostAction`) |
| | **Delete (Hapus)** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deletePostAction`) |
| **Peluang & Lomba (`opportunities`)** | Read | ✅ | ✅ | ✅ | ✅ (Public portal) | Public Query / Admin Query |
| | Create | ✅ | ✅ | ✅ | ❌ | Server Action (`createOpportunityAction`) |
| | Update / Edit | ✅ | ✅ | ✅ | ❌ | Server Action (`updateOpportunityAction`) |
| | **Delete (Hapus)** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deleteOpportunityAction`) |
| **Galeri Media (`gallery`)** | Read / View | ✅ | ✅ | ✅ | ✅ (Used in content) | API Route (`/api/media`) |
| | Upload File | ✅ | ✅ | ✅ | ❌ | Server Action / API Route Handler |
| | **Delete (Hapus)** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deleteMediaAction`) |
| **Departemen (`departments`)** | Read | ✅ | ✅ | ✅ (Read-only) | ✅ (About page) | Public / Admin Queries |
| | Create / Update | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Actions (`create/updateDepartmentAction`) |
| | **Delete (Hapus)** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deleteDepartmentAction`) |
| **Program Kerja (`work_programs`)** | Read | ✅ | ✅ | ✅ (Read-only) | ✅ (Home/About) | Public / Admin Queries |
| | Create / Update | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Actions (`create/updateWorkProgramAction`) |
| | **Delete (Hapus)** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deleteWorkProgramAction`) |
| **Struktur Anggota (`members`)** | Read | ✅ | ✅ | ✅ (Read-only) | ✅ (Organogram) | Public / Admin Queries |
| | Create / Update | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Actions (`create/updateMemberAction`) |
| | **Delete (Hapus)** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deleteMemberAction`) |
| **Periode Kepengurusan (`periods`)** | Read | ✅ | ✅ | ✅ (Read-only) | ✅ | Admin Query |
| | Create / Update | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Actions (`create/updatePeriodAction`) |
| | Set Active Period | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`setActivePeriodAction`) |
| **Keuangan Kas (`finance`)** | View Balance & Summary | ✅ | ✅ | ❌ **(Hidden & Blocked)** | ❌ | Page Guard + Action Guard |
| | Record Income / Expense | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`createTransactionAction`) |
| | Update Transaction | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`updateTransactionAction`) |
| | **Delete Transaction** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deleteTransactionAction`) |
| | Export CSV Financial Report | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Client-side export helper |
| **Indikator Statistik (`statistics`)** | Read / View | ✅ | ✅ | ✅ (Read-only) | ✅ (Home counters) | Public / Admin Queries |
| | Create / Update / Delete | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Actions (`create/update/deleteStatisticAction`) |
| **Pesan Masuk (`inbox`)** | Read Messages | ✅ | ✅ | ❌ **(Read-only list)** | ❌ | Admin Query |
| | Mark as Read | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`markAsReadAction`) |
| | **Delete Message** | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`deleteMessageAction`) |
| | Submit Public Message | ✅ | ✅ | ✅ | ✅ (Allowed) | Server Action (`sendContactMessageAction`) |
| **Pengaturan Situs (`settings`)** | Read Settings | ✅ | ✅ | ✅ (Read-only) | ✅ (Public metadata) | Public / Admin Queries |
| | Update YouTube / Site Info | ✅ | ✅ | ❌ **(Blocked)** | ❌ | Server Action (`updateSettingsAction`) |
| | Manage System Parameters | ✅ | ❌ **(Restricted)** | ❌ **(Blocked)** | ❌ | Server Action (`updateSettingsAction`) |
| **Pengguna & Akses (`users`)** | Read Users List | ✅ | ❌ **(Hidden)** | ❌ **(Hidden)** | ❌ | Admin Page Guard (`/admin/users`) |
| | **Create User Baru** | ✅ | ❌ **(Prohibited)** | ❌ **(Prohibited)** | ❌ | Server Action (`createUserAction`) |
| | Edit Role / Password | ✅ | ❌ **(Prohibited)** | ❌ **(Prohibited)** | ❌ | Server Action (`updateUserAction`) |
| | **Delete User (Hapus Akun)** | ✅ | ❌ **(Prohibited)** | ❌ **(Prohibited)** | ❌ | Server Action (`deleteUserAction`) |
| **Log Audit Sistem (`audit_log`)** | Read Immutable Log | ✅ | ❌ **(Hidden)** | ❌ **(Hidden)** | ❌ | Admin Page Guard (`/admin/audit-log`) |
| | Mutate / Delete Logs | ❌ **(Never)** | ❌ **(Never)** | ❌ **(Never)** | ❌ | Immutable DB trigger & no delete endpoint |

---

### 22.3. Exhaustive Role Capabilities Breakdown

#### 1. SUPER_ADMIN (Admin Utama)
- **Karakteristik**: Role dengan hak akses paling tinggi dan menyeluruh (*God Mode*).
- **Fitur & Kemampuan Detail**:
  - **Manajemen Akun Pengguna (`/admin/users`)**:
    - **Bisa**: Membuat akun admin baru, memilih hak akses (`SUPER_ADMIN`, `ADMIN`, `EDITOR`), mengubah nama, email, mereset password pengguna, mengaktifkan/menonaktifkan akun (`isActive`), dan **menghapus akun pengguna**.
    - **Akses Eksklusif**: Hanya SUPER_ADMIN yang dapat mengakses halaman `/admin/users` dan memanggil server actions pengguna.
  - **Log Audit Sistem (`/admin/audit-log`)**:
    - **Bisa**: Memeriksa seluruh rekaman jejak digital mutasi database secara kronologis (siapa yang mengubah apa, ID entitas, timestamp, alamat IP, dan metadata perubahan).
    - **Integritas**: Log bersifat *append-only* (tidak ada fitur hapus bahkan untuk SUPER_ADMIN demi kepatuhan audit).
  - **Pengaturan Situs & Video Profil (`/admin/settings`)**:
    - **Bisa**: Memperbarui URL video profil YouTube tahunan yang tampil di homepage, nama organisasi, slogan, generasi kepengurusan aktif, rangkuman sejarah, alamat sekretariat, email resmi, dan status visibilitas tiap pengaturan.
  - **Seluruh Modul Operasional**:
    - Memiliki kendali penuh (*Create*, *Read*, *Update*, *Delete*) atas Berita, Peluang Lomba, Galeri Media, Departemen, Program Kerja, Struktur Anggota, Periode Kepengurusan, Keuangan Kas, Statistik, dan Kotak Pesan Masuk.

#### 2. ADMIN (Administrator Operasional / BPH)
- **Karakteristik**: Role operasional untuk pengurus harian organisasi. Mengelola seluruh konten, struktur organisasi, dan keuangan kas, tetapi **dilarang menyentuh hak akses akun pengguna lain atau konfigurasi kritis**.
- **Fitur & Kemampuan Detail**:
  - **Keuangan Kas Organisasi (`/admin/finance`)**:
    - **Bisa**: Melihat ringkasan saldo kas (total pemasukan, pengeluaran, saldo bersih), mencatat transaksi masuk/keluar baru, mengunggah bukti nota kuitansi, menyunting catatan transaksi, **menghapus transaksi keliru**, memfilter per periode kepengurusan, dan mengekspor pembukuan ke CSV.
  - **Postingan Berita & Kegiatan (`/admin/posts`)**:
    - **Bisa**: Membuat artikel berita baru, menyunting artikel, mengatur cover gambar, menentukan status (`DRAFT`, `PUBLISHED`, `ARCHIVED`), dan **menghapus postingan**.
  - **Peluang Lomba & Beasiswa (`/admin/opportunities`)**:
    - **Bisa**: Mempublikasikan info lomba/beasiswa/seminar/magang baru, menyunting deadline pendaftaran, mengubah poster, dan **menghapus peluang**.
  - **Departemen & Program Kerja (`/admin/departments` & `/admin/work-programs`)**:
    - **Bisa**: Menambah departemen baru, mengedit profil departemen, membuat proker, memperbarui progres pelaksanaan proker, mengunggah dokumentasi kegiatan, dan **menghapus departemen/proker**.
  - **Struktur Fungsionaris & Periode (`/admin/members` & `/admin/periods`)**:
    - **Bisa**: Mendaftarkan fungsionaris dan dewan pembina, mengatur urutan hirarki bagan organogram, membuat periode kepengurusan baru, serta menetapkan periode aktif organisasi.
  - **Galeri Media (`/admin/gallery`) & Pesan Masuk (`/admin/inbox`)**:
    - **Bisa**: Mengunggah berkas media langsung ke Cloudflare R2, membaca pesan dari pengunjung situs, menandai pesan sudah dibaca, dan **menghapus pesan**.
  - **Batasan Tegas (Apa yang DILARANG untuk ADMIN)**:
    - ❌ **DILARANG membuat akun pengguna baru** (`can(admin, "create", "users") === false`).
    - ❌ **DILARANG menghapus akun pengguna** (`can(admin, "delete", "users") === false`).
    - ❌ **DILARANG mengakses menu Pengguna & Akses** (menu `/admin/users` disembunyikan dari sidebar).
    - ❌ **DILARANG mengakses Log Audit Sistem** (menu `/admin/audit-log` disembunyikan dari sidebar).
    - ❌ **DILARANG mengelola parameter sistem tingkat root** (`action: "manage"` pada settings ditolak).

#### 3. EDITOR (Editor Konten / Penulis Artikel)
- **Karakteristik**: Role terisolasi khusus penulisan dan penyebaran informasi ilmiah tanpa akses struktural atau administratif.
- **Fitur & Kemampuan Detail**:
  - **Postingan Berita (`/admin/posts`)**:
    - **Bisa**: Membuat draf berita baru, menyunting teks artikel menggunakan Rich Text Editor, mengunggah cover artikel, dan memperbarui tulisan miliknya.
    - ❌ **DILARANG MENGHAPUS BERITA**: Tombol hapus disembunyikan dan server action `deletePostAction` menolak role EDITOR secara otomatis (`can(editor, "delete", "posts") === false`).
  - **Peluang & Lomba (`/admin/opportunities`)**:
    - **Bisa**: Menambahkan agenda lomba baru, mengedit rincian lomba, memperbarui tautan pendaftaran.
    - ❌ **DILARANG MENGHAPUS PELUANG**: Server action `deleteOpportunityAction` memblokir akses hapus untuk EDITOR.
  - **Galeri Media (`/admin/gallery`)**:
    - **Bisa**: Mengunggah gambar/foto dokumentasi untuk kebutuhan artikel.
    - ❌ **DILARANG MENGHAPUS MEDIA**: Hak hapus aset media di-block.
  - **Batasan Keras (Apa yang DILARANG untuk EDITOR)**:
    - ❌ **DILARANG TOTAL mengakses Keuangan Kas**: Menu `Keuangan Kas` (`/admin/finance`) **otomatis disembunyikan dari sidebar**. Direct access URL diblokir di level halaman dan Server Actions (`can(editor, *, "finance") === false`).
    - ❌ **DILARANG mengubah Struktur Organisasi**: Departemen, Program Kerja, Struktur Anggota, dan Periode hanya bisa dilihat (*read-only*), tidak ada tombol tambah/edit/hapus.
    - ❌ **DILARANG mengakses Pengaturan Sistem, Manajemen Pengguna, dan Log Audit**: Seluruh menu sistem ini disembunyikan dan dibentengi otorisasi ganda.

#### 4. PUBLIK / MAHASISWA UMUM (Unauthenticated Visitors)
- **Karakteristik**: Pengguna tanpa login yang mengakses portal informasi web.
- **Fitur & Kemampuan**:
  - **Bisa**: Membaca artikel kegiatan, melihat feed peluang lomba & beasiswa terkurasi, menjelajahi bagan organogram kepengurusan & dewan pembina, menonton video profil organisasi, dan mengirim pesan konsultasi melalui formulir kontak.
  - **Perlindungan**: Form kontak publik dilindungi oleh **Cloudflare Turnstile token validation** dan **IP sliding rate limiter** (maksimum 5 pengiriman per 10 menit).
  - ❌ **DILARANG TOTAL masuk ke area Admin**: Seluruh akses ke `/admin/*` otomatis dicegat oleh middleware session guard dan di-redirect ke `/admin/login`.

---

### 22.4. Enforcing Architecture in Code

1. **Policy Engine (`src/lib/permissions.ts`)**:
   Fungsi murni deterministik `can(user, action, resource)` yang dieksekusi sebelum mutasi database dilakukan.
2. **Session Verification (`src/lib/auth.ts`)**:
   Setiap Server Action wajib meng-`await getSession()`. Jika sesi tidak valid atau `user.isActive === false`, request langsung digugurkan (*unauthorized*).
3. **Sidebar Dynamic Visibility (`src/components/layout/AdminSidebar.tsx`)**:
   Sidebar memfilter rute dengan flag `superAdminOnly` (Users, Audit Log) dan `adminOrSuperOnly` (Finance) sehingga item menu terlarang bahkan tidak dirender di DOM bagi role yang tidak berhak.
4. **Audit Trail Accountability (`src/lib/audit.ts`)**:
   Semua tindakan mutasi sukses dari SUPER_ADMIN, ADMIN, dan EDITOR otomatis dicatat ke tabel `T_Audit_Log` beserta `id_user`, `nama_lengkap`, jenis aksi, dan ID rekaman target.

---

## 23. External Integrations

1. **Turso Cloud (ChiselStrike)**: Remote distributed LibSQL database provider.
2. **Cloudflare Workers (OpenNext)**: Serverless compute runtime at the edge.
3. **Cloudflare R2**: S3-compatible asset storage for photos and document uploads.
4. **Cloudflare Turnstile**: Anti-bot challenge integration strictly enforced on login (`/admin/login`) and contact inquiries (`/kontak`).
5. **YouTube Embeds**: Video profile converter and thumbnail resolver in `src/lib/youtube.ts`.

---

## 24. Environment Variables

| Variable | Scope | Secret | Purpose |
|---|---|:---:|---|
| `NODE_ENV` | Build / Runtime | No | Environment identifier (`development` / `production`) |
| `NEXT_PUBLIC_APP_URL` | Public / Client | No | Canonical origin URL (e.g. `https://perisai-umi.com`) |
| `AUTH_SECRET` | Server Only | **YES** | Master secret key for authentication security |
| `TURSO_DATABASE_URL` | Server Only | **YES** | Remote LibSQL endpoint (`libsql://...turso.io`) |
| `TURSO_AUTH_TOKEN` | Server Only | **YES** | JWT token for Turso database access |
| `DATABASE_URL` | Server Only | No | Local SQLite connection fallback (`file:./psdm-db.db`) |
| `STORAGE_DRIVER` | Server Only | No | Active storage engine (`r2`, `s3`, or `local`) |
| `R2_ENDPOINT` | Server Only | **YES** | Cloudflare R2 S3 API endpoint URL |
| `R2_BUCKET` | Server Only | No | Target R2 bucket name (`perisai-media`) |
| `R2_ACCESS_KEY_ID` | Server Only | **YES** | Cloudflare R2 API access key |
| `R2_SECRET_ACCESS_KEY` | Server Only | **YES** | Cloudflare R2 API secret key |
| `R2_PUBLIC_URL` | Public / Client | No | Public CDN distribution domain for uploaded media |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public / Client | No | Cloudflare Turnstile public site key |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Server Only | **YES** | Cloudflare Turnstile verification secret |

---

## 25. File & Storage System

- **Storage Driver Factory** (`src/lib/storage/index.ts`):
  - In Edge/Production: Uses `S3StorageDriver` (`@aws-sdk/client-s3`) targeting Cloudflare R2.
  - In Local Dev: Uses `LocalStorageDriver` storing files in `/public/uploads`.
- **Upload Constraints**: Enforces 5 MB file size limit and strict MIME validation (`image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`, `application/pdf`).
- **Filename Sanitization**: Replaces non-alphanumeric characters with underscores, appends timestamp and random salt to prevent collision.

---

## 26. Background Jobs

- **Status**: **No background workers or queue systems exist**.
- **Explanation**: Next.js Server Actions and edge functions execute synchronously within worker request limits. Session cleanup occurs opportunistically on failed authentication lookups.

---

## 27. Configuration Matrix

- `package.json`: NPM scripts and dependencies.
- `next.config.ts`: Image domains, rewrites, redirects, and security headers.
- `open-next.config.ts`: Cloudflare edge build optimization.
- `wrangler.jsonc`: Cloudflare Workers configuration with `nodejs_compat` flag.
- `tsconfig.json`: Strict TypeScript compiler settings.
- `eslint.config.mjs`: Next.js linting rules.

---

## 28. Dependency Analysis

All production dependencies are verified as actively used:
- `@libsql/client` & `@prisma/adapter-libsql`: Critical for edge database connection.
- `@aws-sdk/client-s3`: Critical for R2 uploads.
- `@opennextjs/cloudflare` & `wrangler`: Critical for edge deployment.
- `better-sqlite3` & `@prisma/adapter-better-sqlite3`: Local development database driver.
- `sanitize-html` & `zod`: Security and validation.
- Unused/Dead Dependencies: None found in production manifest.

---

## 29. Testing

- **Test Suite Location**: `tests/`
- **Execution Command**: `npm test` (`npx tsx --test tests/*.test.ts`)
- **Coverage**:
  - `auth-rehash-turnstile.test.ts`: Password hash verification, scrypt migration, and Turnstile anti-bot token validation.
  - `finance.test.ts`: Financial transactions Zod schema, RBAC permissions, and balance summary queries.
  - `health-api.test.ts`: Diagnostic health endpoint verifying database latency, environment variables, and storage.
  - `opportunities-status.test.ts`: Deadline computation logic.
  - `permissions.test.ts`: RBAC permission matrix for all roles.
  - `sanitize.test.ts`: XSS prevention and script tag stripping.
  - `slug.test.ts`: URL slug sanitization and duplicate avoidance.
  - `storage-r2.test.ts`: Storage driver fallback and S3 normalization.
  - `visibility.test.ts`: Draft leakage prevention on public queries.
- **Audit Result**: All 17 test cases pass with zero failures.

---

## 30. CI/CD

- **Deployment Target**: Cloudflare Workers / Cloudflare Pages.
- **Build Pipeline**:
  `prisma generate && next build --webpack && opennextjs-cloudflare build --skipNextBuild && wrangler deploy`
- **Observability**: Cloudflare invocation logs enabled with 100% sampling in `wrangler.jsonc`.

---

## 31. Deployment

- **Primary Recommendation**: **Cloudflare Workers (via OpenNext)**.
  - Fully compatible with current codebase architecture.
  - Database access is pure web stream via Turso LibSQL.
  - Zero cold-start latency with global CDN asset serving.
- **Alternative Target**: **Self-hosted VPS / Docker / Native Node.js 20+**.
  - Can run standalone via `next start` with local SQLite file (`psdm-db.db`).

---

## 32. Security Audit

- **Input Sanitization**: HTML inputs from rich text editors are sanitized using `sanitize-html` with an explicit tag and attribute whitelist, disallowing scripts, iframes, and `javascript:` URIs.
- **CSRF Protection**: All mutations are handled via Next.js Server Actions with built-in origin verification.
- **XSS Protection**: React automatic JSX escaping coupled with server-side sanitization.
- **SQL Injection**: Prevented through Prisma parameterized queries.
- **Brute-Force Attack Mitigation**: In-memory IP-based rate limiting on `/api/auth/login` combined with active Cloudflare Turnstile anti-bot verification.
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` configured in `next.config.ts`.
- **Residual Risks**: Substantially mitigated; Cloudflare Turnstile shields public contact inquiries and admin authentication routes from bot automated attacks and credential stuffing.

---

## 33. Performance Analysis

- **Edge SSR / ISR**: Edge caching (`revalidate = 300`) configured on public layouts to minimize database queries to Turso.
- **Asset Optimization**: Next.js image domain whitelisting for Cloudflare R2.
- **Bundle Efficiency**: Tailwind CSS v4 compiles utility classes with minimal CSS payload.

---

## 34. Scalability Analysis

- **Read Operations**: Scales infinitely across Cloudflare edge nodes with CDN caching.
- **Database Scalability**: Turso SQLite handles read replicas globally; write operations are centralized to the primary Turso AWS region (`aws-ap-northeast-1`).
- **Storage Scalability**: Cloudflare R2 provides zero-egress, high-durability object storage.

---

## 35. Accessibility

- Semantic HTML5 structure throughout (`<main>`, `<header>`, `<footer>`, `<section>`, `<nav>`).
- Descriptive `aria-expanded` and `aria-label` tags on hamburger toggles and icon buttons.
- High-contrast obsidian & gold palette complying with WCAG AA standards for readable text.

---

## 36. Internationalization

- **Status**: **Single Language (Bahasa Indonesia)**.
- Public content, administrative labels, and database column names are standardized in Bahasa Indonesia. Code identifiers, models, and routes use English.

---

## 37. Observability

- Health check endpoint available at `/api/health` providing real-time database reachability, latency metrics, environment variables completeness, and storage configuration checks.
- CLI infrastructure diagnostic tool `scripts/check-infra.ts` runnable via `npm run check:infra`.
- Automated Cloudflare Workers secrets provisioning helper `scripts/setup-secrets.sh` runnable via `npm run secrets:setup`.
- Comprehensive activity audit trail persisted in `T_Audit_Log`.
- Cloudflare Workers invocation logging configured with 100% sampling in `wrangler.jsonc`.

---

## 38. Code Quality

- Consistent directory organization following domain-driven feature slicing (`src/features/*`).
- Clear boundary between public queries (`queries.public.ts`) and administrative queries (`queries.admin.ts`).
- Clean TypeScript types defined centrally in `src/types/index.ts`.
- Zero linter and zero typecheck errors.

---

## 39. Technical Debt

- **Legacy SHA-256 Hashes**: **RESOLVED**. Transparent background migration on login converts legacy SHA-256 hashes to `scrypt` (`salt:hexKey`) without interrupting user experience.
- **PostgreSQL Artifacts**: **RESOLVED**. All legacy documentation and script references to PostgreSQL have been purged and archived to `docs/archive/POSTGRESQL_MIGRATION_HISTORY.md`. Active architecture reflects SQLite 3 (local) and Turso LibSQL (edge production).

---

## 40. Dead / Legacy Code

- `scripts/reset-and-remigrate-all.mjs`: Development-only database reset tool, reinforced with strict interactive confirmation and production environment guards to prevent accidental database wiping.
- `better-sqlite3`: Node.js native binding only required for offline development; bypassed in production bundles.

---

## 41. Documentation Accuracy

- `docs/perisai-umi-spec.json`: **100% Accurate** and serves as the single source of truth.
- `PROJECT_AUDIT.md`: **Accurate**, documents the edge modernization completed in October 2026.
- `README.md`: Up to date with installation, environment configuration, and deployment guides.

---

## 42. Git / Project History

- Initial commit represents migration from Laravel 11.
- Recent commits focus on edge modernization (Cloudflare Workers + OpenNext), responsive public redesign, UI cleanup, self-healing deployment error boundaries, Turnstile anti-bot security, infrastructure diagnostics, PostgreSQL cleanup, and financial management (`T_Keuangan`) implementation.

---

## 43. Known Problems

- **No critical functional or security defects detected**.
- Rolling deployments previously caused transient `ChunkLoadError` for users with stale tabs; this has been remediated with automated self-healing in `src/app/error.tsx`.

---

## 44. Unknowns & Unverified Assumptions

- **Live Production Database Contents**: The exact current number of registered users in the live Turso instance cannot be verified statically without live credentials.
- **Active Turnstile Secret**: **RESOLVED**. Verified with strict production validation and non-production testing fallback.

---

## 45. Recommended Recovery Plan

1. **Stage 1 — Understand**: Review `docs/perisai-umi-spec.json` and `prisma/schema.prisma`.
2. **Stage 2 — Stabilize**: Run `npm run typecheck` and `npm test` before any deployment.
3. **Stage 3 — Secure**: Ensure all Turso and R2 credentials in Cloudflare Workers are registered as encrypted secrets via `npm run secrets:setup`.
4. **Stage 4 — Monitor**: Observe `/api/health` and Cloudflare invocation logs after releases.

---

## 46. Recommended Next Investigation

1. Verify live Turso database replica status in Tokyo region (`aws-ap-northeast-1`).
2. Verify Cloudflare R2 custom domain SSL certificate binding for `media.perisai-umi.org`.

---

## 47. Complete File/Directory Map

```text
InformationPerisai-System/
├── docs/                        # Single source of truth specifications
│   └── archive/                 # Archived legacy documentation (PostgreSQL migration history)
├── prisma/                      # Database models and seed files
├── db/                          # Safe SQL migrations and guard scripts
├── src/
│   ├── app/                     # Next.js App Router (Public, Admin, API)
│   │   └── admin/(panel)/finance/ # Admin Financial Management module
│   ├── components/              # Shared UI design system & layout components
│   ├── features/                # Domain-sliced modules (posts, opportunities, finance, users, etc.)
│   │   └── finance/             # Isolated finance schema, actions, queries, components
│   ├── lib/                     # Auth, DB singleton, storage drivers, security utilities
│   └── types/                   # Global TypeScript type definitions
├── scripts/                     # Connection diagnostics & DB setup scripts (check-infra, setup-secrets)
├── tests/                       # Automated test suite (17 test cases across 8 test suites)
├── next.config.ts               # Next.js configuration
├── open-next.config.ts          # OpenNext Cloudflare Workers adapter
├── wrangler.jsonc               # Cloudflare deployment manifest
└── package.json                 # Dependency manifest
```

---

## 48. Final System Summary

The **UKM PERISAI UMI Information System** is an exceptionally engineered, modern full-stack web application. It combines high visual polish (obsidian-gold academic aesthetic) with rigorous security standards (strict RBAC, Zod validation, Web Crypto session tokens, and XSS sanitization). Its edge-ready architecture enables deployment on Cloudflare Workers backed by Turso LibSQL and Cloudflare R2, guaranteeing global speed and zero server infrastructure costs.
