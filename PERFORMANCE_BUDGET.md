# Performance Budget — Aswin on Finance

Follow this checklist on every change to keep the site fast.

## Rules

### 1. No new third-party scripts in `<head>`
- Analytics, chat widgets, and tracking must load via `defer` or `requestIdleCallback`
- Only critical CSS and preloads belong in `<head>`

### 2. No client-side fetch for core content above the fold
- Blog posts, articles, and primary content must come from the edge (Cloudflare Functions + Cache API)
- "Loading..." spinners for primary content are a bug, not a feature

### 3. Images must be WebP/AVIF + sized
- All new images must be in WebP or AVIF format
- Every `<img>` must have explicit `width` and `height` attributes (prevents CLS)
- Above-the-fold images get `fetchpriority="high"` and no `loading="lazy"`
- Below-the-fold images get `loading="lazy"`

### 4. Assets must be fingerprinted / immutable-cached
- Static assets (`/css/*`, `/js/*`, `/assets/*`, `/fonts/*`) are cached for 1 year with `immutable`
- When updating CSS/JS, change the version query string (e.g., `style.css?v=4`) or rename the file
- HTML pages always revalidate (`max-age=0, must-revalidate`)

### 5. PostHog / analytics must always be deferred
- Use the shared `/js/analytics.js` with `defer` attribute
- Never inline analytics in `<head>`

### 6. Fonts
- Self-host font files (WOFF2 format)
- Preload only the primary weight needed for above-the-fold text
- Use `font-display: swap` in all `@font-face` declarations

### 7. Cache invalidation
- After publishing/editing a post via admin, call `/api/purge` to clear edge cache
- New content should appear within seconds of publishing
