# EcoSync — Carbon Footprint Intelligence Platform

> **Hack2Skill PromptWars Challenge 3** | Carbon Footprint Awareness Platform
> Helping individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

🚀 **Live Demo:** [https://eco-sync-opal.vercel.app/](https://eco-sync-opal.vercel.app/)

[![CI/CD](https://github.com/namanraii/ecosync/actions/workflows/ci.yml/badge.svg)](https://github.com/namanraii/ecosync/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

---

## Chosen Vertical

**Personal Environmental Impact & Sustainability**

We address the challenge of making carbon footprint awareness accessible, actionable, and engaging for everyday individuals. Our platform bridges the gap between climate data and personal behavior change.

---

## Approach and Logic

### Problem Analysis
Most carbon calculators are either too simplistic (giving a single number without context) or too complex (requiring expert knowledge). EcoSync strikes the balance by:

1. **Intelligent Profiling**: 5-dimensional assessment covering Transport, Diet, Energy, Digital, and Consumption
2. **Real Data**: Uses IPCC 2023, EPA GHG Hub, and peer-reviewed emission factors
3. **Actionable Insights**: Not just "you emit X kg" but "here's exactly how to reduce it"
4. **Progress Tracking**: Visual trends and milestones to maintain motivation

### Algorithm Design

**Carbon Calculation Engine** (`src/lib/utils/calculator.ts`):
- Pure functions with deterministic outputs
- Category-specific calculations with confidence scores
- Regional adjustment factors (India, EU, US, Global)
- Bonus/penalty system for behaviors (local food, recycling, renewables)

**Scoring System**:
- Score = 100 - (actual_emissions / target_range * 100)
- Targets aligned with Paris Agreement (2t CO₂e = 100 points)
- Percentile ranking against regional averages

**Recommendation Engine**:
- Sorts actions by impact score descending
- Filters by user's highest emission categories
- Considers difficulty and cost for personalization

---

## How the Solution Works

### Architecture
```
ecosync/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Atomic design components
│   │   ├── ui/          # Primitive components (Button, Card, Input)
│   │   ├── charts/      # Recharts visualizations
│   │   ├── forms/       # Onboarding wizard
│   │   └── layout/      # Navbar, Footer
│   ├── lib/
│   │   ├── data/        # Emission factors & actions database
│   │   ├── utils/       # Calculator, validation, helpers
│   │   └── hooks/       # Zustand store, localStorage
│   ├── types/           # TypeScript interfaces
│   └── __tests__/       # Unit & E2E tests
```

### User Flow
1. **Landing Page** → Value proposition with animated score gauge
2. **Onboarding** (5 steps, ~3 minutes) → Multi-step wizard with sliders and selects
3. **Dashboard** → Real-time carbon profile with breakdown charts
4. **Actions** → Curated, quantified reduction actions with progress tracking
5. **Insights** → AI-generated personalized recommendations
6. **Trends** → Historical tracking with milestone projections

### Data Flow
```
User Input → Validation (Zod) → Calculation Engine → Carbon Profile →
Visualization (Recharts) → Insights Generation → Action Recommendations
```

---

## Assumptions Made

1. **Data Sources**: Carbon emission factors based on IPCC 2023, EPA GHG Hub, Our World in Data, and Carbon Trust. Regional defaults use global averages with manual override.

2. **User Honesty**: Self-reported data is assumed accurate. The platform encourages honesty through privacy guarantees (no server storage, local-only).

3. **Simplified Energy Model**: Home energy usage is estimated from square meters and occupants rather than actual utility bills, balancing accuracy with usability.

4. **Digital Footprint**: Digital emissions are estimated based on screen time, streaming, and device count using industry-standard coefficients.

5. **No Backend Required**: All data stored in localStorage for privacy and simplicity. No authentication needed.

6. **Static Export**: Built as static export for easy deployment on any hosting platform.

---

## Features

### Core Features
- 🌍 **5-Dimensional Carbon Calculator**: Transport, Diet, Energy, Digital, Consumption
- 📊 **Real-time Visualizations**: Donut charts, trend lines, category bars, score gauges
- 💡 **Personalized Insights**: AI-generated warnings, opportunities, and achievements
- ⚡ **Curated Action Library**: 20+ quantified reduction actions with step-by-step guides
- 📈 **Progress Tracking**: Historical trends with milestone projections
- 🎯 **Carbon Score**: 0-100 rating system with percentile rankings

### Technical Features
- ♿ **WCAG 2.1 AA Accessible**: Keyboard navigation, screen reader support, skip links, ARIA live regions, focus traps
- 🔒 **Security Hardened**: CSP + HSTS + COOP + CORP headers, XSS prevention, input sanitization, rate limiting (10 ops/sec), 500KB item / 5MB storage caps
- 🧪 **Comprehensive Testing**: 85%+ unit coverage (axe-core a11y, store integration, edge-cases, performance benchmarks), full E2E suite
- 📱 **Fully Responsive**: Mobile-first design with breakpoints for all devices
- ⚡ **Performance Optimized**: Lighthouse 95+ target, `dynamic()` imports, React.memo, useMemo/useCallback, will-change hints
- 🌙 **Dark Mode Ready**: `darkMode: ['class']`, CSS variables, system preference detection
- 📋 **PWA Ready**: Web App Manifest, Service Worker, offline caching
- 🖨️ **Print Stylesheet**: Optimized `@media print` layout for reports
- 🔄 **Reduced Motion**: `prefers-reduced-motion` and `prefers-reduced-data` respected

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | React framework with SSG |
| Language | TypeScript 5.4 | Type safety, strict mode |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| Components | shadcn/ui pattern | Accessible primitives |
| State | Zustand 4.5 | Lightweight global store |
| Charts | Recharts 2.12 | Responsive visualizations |
| Validation | Zod 3.23 | Schema validation |
| Testing | Vitest + Playwright | Unit + E2E testing |
| CI/CD | GitHub Actions | Automated testing pipeline |

---

## Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- npm 9 or higher

### Installation

```bash
# Clone repository
git clone https://github.com/namanraii/ecosync.git
cd ecosync

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build static export
npm run build

# Output will be in /dist directory
```

### Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all checks
npm run lint
npm run typecheck
npm run format:check
```

---

## Project Structure

```
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Landing page
│   │   ├── onboarding/        # Carbon assessment wizard
│   │   ├── dashboard/         # Main user dashboard
│   │   ├── actions/           # Reduction actions library
│   │   ├── insights/          # Personalized insights
│   │   ├── trends/            # Historical tracking
│   │   ├── layout.tsx         # Root layout with skip link, PWA meta
│   │   ├── loading.tsx        # Skeleton loading state with a11y
│   │   ├── error.tsx          # Error boundary with aria-live
│   │   └── not-found.tsx      # 404 page
│   ├── components/
│   │   ├── ui/               # Primitive components (Button, Card, Input)
│   │   ├── charts/           # Data visualizations (React.memo + aria)
│   │   │   └── chart-error-boundary.tsx  # Error boundary for charts
│   │   ├── accessibility/    # Accessibility primitives
│   │   │   ├── skip-link.tsx
│   │   │   ├── aria-live-region.tsx
│   │   │   └── focus-trap.tsx
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── lib/
│   │   ├── data/             # Emission factors & actions
│   │   ├── utils/            # Calculator, validation, helpers
│   │   └── hooks/            # Custom hooks (use-store, use-local-storage with rate limiting)
│   ├── types/                # TypeScript definitions
│   └── __tests__/            # Test suites
│       ├── setup.ts           # Mocks: matchMedia, IntersectionObserver, rIC
│       ├── unit/
│       │   ├── calculator.test.ts
│       │   ├── validation.test.ts
│       │   ├── store.test.ts         # Zustand integration tests
│       │   ├── accessibility.test.tsx # axe-core audits
│       │   ├── edge-cases.test.ts    # Edge case tests
│       │   └── performance.test.ts   # Benchmark tests
│       └── e2e/
│           └── full-flow.spec.ts     # Complete user journey E2E
├── docs/                     # Architecture decisions
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker (offline caching)
├── .github/workflows/
│   └── ci.yml                # 6-job CI pipeline
└── README.md
```

---

## Testing

### Unit Tests
- **Coverage Target**: 85%+ lines, functions, statements
- **Calculator Tests**: All 5 category calculations with edge cases
- **Validation Tests**: Zod schema validation, input sanitization
- **Utility Tests**: Helper functions, formatters

### E2E Tests
- **Onboarding Flow**: Complete wizard navigation
- **Dashboard**: Profile display after onboarding
- **Accessibility**: ARIA labels, keyboard navigation, heading structure
- **Responsive**: Mobile, tablet, desktop breakpoints

### Accessibility Tests
- WCAG 2.1 AA compliance via axe-core
- Keyboard-only navigation flow
- Screen reader compatibility
- Focus management validation

---

## Accessibility

### WCAG 2.1 AA Compliance
- **Semantic HTML**: Proper heading hierarchy, landmarks, lists
- **Keyboard Navigation**: Full tab order, Enter/Space activation, Escape to close
- **ARIA Labels**: All interactive elements have descriptive labels
- **Focus Management**: Visible focus indicators, focus trapping in modals
- **Color Contrast**: All text meets 4.5:1 ratio
- **Screen Readers**: Live regions for dynamic content, alt text for images
- **Reduced Motion**: Respects `prefers-reduced-motion` media query

---

## Security

### Implemented Measures
- **Content Security Policy**: Strict CSP + `upgrade-insecure-requests` in Next.js config
- **HSTS**: `max-age=63072000; includeSubDomains; preload` — protects against downgrade attacks
- **COOP/CORP**: `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Resource-Policy: same-origin`
- **Permissions Policy**: Restricts camera, mic, geolocation, accelerometer, payment, USB
- **XSS Prevention**: DOMPurify for user content, script-stripping regex in `sanitizeString`
- **CSRF Protection**: Built-in Next.js handling
- **Rate Limiting**: localStorage ops capped at 10/sec; 500KB/item; 5MB total
- **Key Sanitization**: localStorage keys stripped of `< > ' " &`, limited to 256 chars
- **Input Security**: `maxLength`, `autocomplete`, `pattern` attributes on all form inputs
- **Secure Headers**: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy
- **Long-term Caching**: Static assets `max-age=31536000, immutable`
- **Dependency Audit**: Automated `npm audit` in CI pipeline
- **No Secrets**: Environment variables via `.env.example` only

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Static Hosting
The project builds to static HTML in `/dist`:
```bash
npm run build
# Upload /dist to any static host (Netlify, GitHub Pages, AWS S3)
```

---

## Performance

### Targets
- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### Optimizations
- Server Components for reduced client JS
- Code splitting with dynamic imports
- SVG-only graphics (no external images)
- CSS variables for theme switching
- Debounced input handlers

---

## License

MIT License - Built for Hack2Skill PromptWars Challenge 3

---

## Acknowledgments

- **Data Sources**: IPCC, EPA, Our World in Data, Carbon Trust
- **Design System**: shadcn/ui component patterns
- **Icons**: Lucide React

---

**Built with ❤️ for the planet 🌍**
