# File Tree: quotepilot

**Generated:** 1/30/2026, 10:57:36 AM
**Root Path:** `e:\quotepilot`

```
├── 📁 api
│   ├── 📁 db
│   │   └── 📄 index.ts
│   ├── 📁 scripts
│   │   ├── 📄 checkDimensions.ts
│   │   ├── 📄 checkProducts.ts
│   │   ├── 📄 createAdmin.ts
│   │   ├── 📄 runSchema.ts
│   │   └── 📄 testCloudinary.ts
│   ├── 📁 sql
│   │   └── 📄 schema.sql
│   ├── 📁 src
│   │   ├── 📁 db
│   │   │   ├── 📄 index.js
│   │   │   └── 📄 index.ts
│   │   ├── 📁 engine
│   │   │   └── 📄 ruleEngine.ts
│   │   ├── 📁 lib
│   │   │   └── 📄 cloudinary.ts
│   │   ├── 📁 middleware
│   │   │   ├── 📄 auth.ts
│   │   │   └── 📄 upload.ts
│   │   ├── 📁 routes
│   │   │   ├── 📄 adminProducts.ts
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 customers.ts
│   │   │   ├── 📄 dimensions.ts
│   │   │   ├── 📄 doorTypes.ts
│   │   │   ├── 📄 externalColors.ts
│   │   │   ├── 📄 handleColors.ts
│   │   │   ├── 📄 internalColors.ts
│   │   │   ├── 📄 panelStyles.ts
│   │   │   ├── 📄 product.ts
│   │   │   ├── 📄 quote.ts
│   │   │   └── 📄 upload.ts
│   │   ├── 📁 utils
│   │   │   └── 📄 cloudinary.ts
│   │   ├── 📄 index.ts
│   │   └── 📄 rules.ts
│   ├── ⚙️ .gitignore
│   ├── 🐳 Dockerfile
│   ├── ⚙️ nodemon.json
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── ⚙️ railway.json
│   ├── 📄 start-api.bat
│   ├── ⚙️ tsconfig.json
│   └── ⚙️ vercel.json
├── 📁 web
│   ├── 📁 app
│   │   ├── 📁 admin
│   │   │   ├── 📁 customers
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 dimensions
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 door-types
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 external-colors
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 handle-colors
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 internal-colors
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 panel-styles
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 products
│   │   │   │   ├── 📁 [id]
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 new
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 admin-login
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 api
│   │   │   ├── 📁 dimensions
│   │   │   │   └── 📄 route.ts
│   │   │   └── 📁 upload
│   │   │       └── 📁 image
│   │   │           └── 📄 route.ts
│   │   ├── 📁 products
│   │   │   └── 📁 [slug]
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 quote
│   │   │   └── 📄 page.tsx
│   │   ├── 📄 favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 components
│   │   ├── 📁 admin
│   │   │   ├── 📄 AdminLayoutClient.tsx
│   │   │   ├── 📄 AdminSidebar.tsx
│   │   │   ├── 📄 BarChart.tsx
│   │   │   ├── 📄 ImageUpload.tsx
│   │   │   ├── 📄 LineChart.tsx
│   │   │   ├── 📄 PieChart.tsx
│   │   │   ├── 📄 QuestionBuilder.tsx
│   │   │   ├── 📄 RuleBuilder.tsx
│   │   │   └── 📄 SortableProductRow.tsx
│   │   ├── 📁 layout
│   │   ├── 📁 motion
│   │   │   ├── 📄 FadeUp.tsx
│   │   │   └── 📄 ScrollReveal.tsx
│   │   ├── 📁 quote
│   │   │   ├── 📄 ProductConfigurator.tsx
│   │   │   ├── 📄 QuoteForm.tsx
│   │   │   └── 📄 QuoteResult.tsx
│   │   ├── 📁 site
│   │   │   ├── 📄 FAQ.tsx
│   │   │   ├── 📄 Features.tsx
│   │   │   ├── 📄 Footer.tsx
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 Hero.tsx
│   │   │   ├── 📄 Particles.tsx
│   │   │   ├── 📄 Process.tsx
│   │   │   ├── 📄 ProductCards.tsx
│   │   │   ├── 📄 RotatingRings.tsx
│   │   │   ├── 📄 RunningText.tsx
│   │   │   ├── 📄 StickyButtons.tsx
│   │   │   ├── 📄 Support.tsx
│   │   │   ├── 📄 Testimonials.tsx
│   │   │   └── 📄 Welcome.tsx
│   │   └── 📁 ui
│   │       ├── 📄 accordion.tsx
│   │       ├── 📄 button.tsx
│   │       ├── 📄 card.tsx
│   │       ├── 📄 checkbox.tsx
│   │       ├── 📄 input.tsx
│   │       ├── 📄 label.tsx
│   │       ├── 📄 progress.tsx
│   │       ├── 📄 radio-group.tsx
│   │       ├── 📄 select.tsx
│   │       ├── 📄 switch.tsx
│   │       └── 📄 textarea.tsx
│   ├── 📁 lib
│   │   ├── 📄 useAdmin.ts
│   │   └── 📄 utils.ts
│   ├── 📁 public
│   │   ├── 🖼️ file.svg
│   │   ├── 🖼️ globe.svg
│   │   ├── 🖼️ next.svg
│   │   ├── 🖼️ quote-logo1.png
│   │   ├── 🖼️ vercel.svg
│   │   └── 🖼️ window.svg
│   ├── ⚙️ .gitignore
│   ├── 🐳 Dockerfile
│   ├── 📝 README.md
│   ├── ⚙️ components.json
│   ├── 📄 eslint.config.mjs
│   ├── 📄 next-env.d.ts
│   ├── 📄 next.config.js
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 postcss.config.mjs
│   ├── 📄 tailwind.config.ts
│   └── ⚙️ tsconfig.json
├── ⚙️ .gitignore
├── ⚙️ docker-compose.yml
├── ⚙️ package-lock.json
└── ⚙️ package.json
```

---

_Generated by FileTree Pro Extension_
