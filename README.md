# QuotePilot — Infinity Glazing

**QuotePilot** is the quoting platform powering [Infinity Glazing](https://infinityglazing.com/). It lets customers configure doors and windows step by step and submit quote requests, while admins manage every product option, lead, and user from a role-gated dashboard.

## Live

[https://infinityglazing.com/](https://infinityglazing.com/)

## Features

**Customer-facing**
- 9-step visual quote configurator: Product Type → Panel Style → Dimensions → Postcode → External Color → Internal Color → Glazing → Handle Color → Summary
- Embeddable product cards via a drop-in `<script>` tag (iframe-based, configurable columns)
- Mobile-responsive multi-step flow with animated transitions

**Admin dashboard**
- Role-based access: `superadmin`, `admin`, `product_manager`, `lead_manager`
- Manage Products, Product Types (door types), Panel Styles, External Colors, Internal Colors, Handle Colors, Glazing Options — all with drag-and-drop ordering and active/inactive toggles
- Lead Details: view all customer quote submissions
- User Management: superadmin can create, edit, and delete admin accounts
- Analytics overview with bar charts and live customer activity feed

## Embedding Product Cards

Add the product card widget to any external page:

```html
<div id="quotepilot-products"></div>
<script src="https://infinityglazing.com/embed.js"></script>
```

Options via data attributes:

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-cols` | `3` | Number of columns (1, 2, or 3) |
| `data-target` | `quotepilot-products` | Custom container element ID |

## Project Structure

```
api/     Node.js/Express backend — REST API, rule engine, DB scripts
web/     Next.js frontend — public site, admin dashboard, configurator
```

## Tech Stack

**Frontend**
- Next.js 16, React 19
- Tailwind CSS 4, Framer Motion
- Radix UI, DnD Kit (drag-and-drop ordering)
- Chart.js, Recharts
- TypeScript 5

**Backend**
- Node.js 20+, Express 4, TypeScript 5
- PostgreSQL (pg)
- Cloudinary (image uploads)
- JWT + cookie-based auth, bcryptjs
- Multer (file handling)

**Dev & Infra**
- ESLint 9, tsx / ts-node
- Railway (API), Vercel (web), Docker

## Database Schema

| Table | Purpose |
|-------|---------|
| `products` | Top-level product entries |
| `door_types` | Product types linked to a product |
| `panel_styles` | Panel styles (many-to-many with door types) |
| `dimensions` | Width/height options |
| `postcodes` | Postcode / area options |
| `external_colors` | External finish colours |
| `internal_colors` | Internal finish colours |
| `handle_colors` | Handle finish colours |
| `glazing_options` | Glazing options |
| `customers` | Quote submissions (leads) |
| `admins` | Admin accounts with role |

## Quick Start

```bash
# Backend
cd api
npm install
cp .env.example .env   # fill in DB, JWT, Cloudinary vars
npm run dev

# Frontend
cd web
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

Create the first admin account:

```bash
cd api && npm run create-admin
```

Apply the database schema:

```bash
cd api && npm run run-schema
```

## License

MIT
