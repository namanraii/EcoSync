# Architecture Decision Record

## ADR 1: Next.js App Router with Static Export

**Status**: Accepted

**Context**: Need a modern React framework with excellent performance, SEO, and developer experience.

**Decision**: Use Next.js 14 with App Router and static export (`output: 'export'`).

**Consequences**:
- ✅ Excellent performance with Server Components
- ✅ Built-in SEO optimization
- ✅ Easy deployment to any static host
- ✅ File-based routing simplifies navigation
- ❌ No server-side APIs (acceptable for this challenge)

## ADR 2: Zustand over Redux/Context

**Status**: Accepted

**Context**: Need lightweight state management for user profile, carbon data, and UI state.

**Decision**: Use Zustand with persistence middleware.

**Consequences**:
- ✅ Minimal bundle size (~1KB)
- ✅ No providers needed
- ✅ Built-in localStorage persistence
- ✅ TypeScript-friendly
- ❌ Less devtools support than Redux

## ADR 3: Client-Side Storage (localStorage)

**Status**: Accepted

**Context**: No backend requirement, need data persistence across sessions.

**Decision**: Store all user data in localStorage via Zustand persistence.

**Consequences**:
- ✅ Zero backend complexity
- ✅ Instant data availability
- ✅ Privacy by design (data never leaves browser)
- ❌ Data lost on browser cache clear
- ❌ No cross-device sync

## ADR 4: Recharts for Visualizations

**Status**: Accepted

**Context**: Need responsive, accessible charts for carbon data visualization.

**Decision**: Use Recharts with custom tooltip and accessibility wrappers.

**Consequences**:
- ✅ Built on React (no wrapper needed)
- ✅ Responsive by default
- ✅ Customizable components
- ✅ Tree-shakeable
- ❌ Larger bundle than D3 (but easier to use)

## ADR 5: No External Images (SVG-Only)

**Status**: Accepted

**Context**: Need to keep repo under 10MB for Hack2Skill submission.

**Decision**: Use inline SVG for all icons, logos, and graphics.

**Consequences**:
- ✅ Zero external dependencies
- ✅ Scalable without quality loss
- ✅ Tiny file sizes
- ✅ Full CSS control
- ❌ More complex than img tags

## ADR 6: Comprehensive Testing Strategy

**Status**: Accepted

**Context**: Need to demonstrate code quality, security, and reliability.

**Decision**: Three-tier testing: Unit (Vitest), Integration (React Testing Library), E2E (Playwright).

**Consequences**:
- ✅ 85%+ coverage target
- ✅ CI/CD automated testing
- ✅ Accessibility testing included
- ✅ Cross-browser E2E
- ❌ Longer CI pipeline
- ❌ More maintenance overhead

## ADR 7: WCAG 2.1 AA Accessibility First

**Status**: Accepted

**Context**: Accessibility is a core evaluation parameter (20% of score).

**Decision**: Build accessibility into every component from day one.

**Consequences**:
- ✅ Screen reader compatible
- ✅ Keyboard navigable
- ✅ Color contrast compliant
- ✅ Reduced motion support
- ❌ More development time
- ❌ Requires ongoing testing
