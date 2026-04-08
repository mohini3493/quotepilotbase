This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Embed Product Cards on Any Website

You can embed the product cards widget on any external website using one of the methods below. Replace `your-domain.com` with your actual deployed domain (e.g. `infinityglazing.com`).

### Option 1 — Script Embed (Recommended)

```html
<div id="quotepilot-products"></div>
<script src="https://your-domain.com/embed.js"></script>
```

### Option 2 — With Custom Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-cols` | Number of columns (`1`, `2`, or `3`) | `3` |
| `data-target` | Custom container element ID | `quotepilot-products` |

```html
<div id="my-container"></div>
<script src="https://your-domain.com/embed.js" data-cols="2" data-target="my-container"></script>
```

### Option 3 — Direct Iframe

```html
<iframe
  src="https://your-domain.com/embed/products?cols=3"
  style="width:100%; min-height:600px; border:none;"
  scrolling="no"
></iframe>
```

### Notes

- Clicking **Get Quote** opens the product page in a new tab.
- The iframe auto-resizes to fit content (no scrollbars).
- All styles are self-contained — no CSS conflicts with the host site.
- Set `NEXT_PUBLIC_SITE_URL` in your environment if the auto-detected URL is incorrect.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
