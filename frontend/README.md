# Bookstore frontend

A Next.js (App Router, TypeScript) frontend for the bookstore backend (Node/Express/MongoDB).
Editorial "reading lamp" design system, light/dark theme, motion budget per the design brief.

## Setup

```bash
npm install
```

Copy the env file and adjust if your backend runs somewhere other than `localhost:1000`:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_API_URL=http://localhost:1000/api/v1
NEXT_PUBLIC_CURRENCY=USD
NEXT_PUBLIC_SITE_NAME=Bookstore
```

## Running the backend

The backend lives outside this folder. From its own directory:

```bash
cd backend
npm install
node app.js
```

There is no `start` script on the backend — always run it with `node app.js`. It needs a `.env`
with `PORT` and `URI` (a MongoDB connection string) already in place; this repo doesn't touch it.

## Running the frontend

```bash
npm run dev       # http://localhost:3000
npm run build      # production build
npm run start       # serve the production build
npm run lint          # ESLint
npx tsc --noEmit        # type-check
```

All four commands pass clean as of this handoff (see the final report below for exactly what was
verified and what wasn't, since this environment couldn't reach the backend's MongoDB Atlas
cluster to run it live — see "Known limitations").

## Creating an admin account

Sign-up always creates a `"user"` role — there is no route that creates an admin. To test the admin
screens: sign up normally, then in MongoDB set that user's `role` field to `"admin"` directly
(e.g. in MongoDB Compass or `mongosh`, `db.users.updateOne({ username: "you" }, { $set: { role:
"admin" } })` — adjust the collection name to whatever the backend's `User` model maps to). Sign out
and back in afterward so the new role is picked up.

## Folder map

```
src/
  app/                    routes (App Router), layout.tsx, template.tsx (page transition), globals.css
  components/
    ui/                   shadcn/Radix primitives (dialog, sheet, select, dropdown, slider, switch, tooltip, avatar, label, separator, sonner)
    vengeance/             components copied from Vengeance UI and retokenized (button, badge, card, input, textarea, tabs, table, skeleton, empty, spinner)
    motion/                 Animmaster-style effect wrappers: Reveal, SplitText, Tilt, NumberTicker, LampGlow (WebGL), PageTransition
    layout/                  Navbar, Footer, ThemeToggle, MobileMenu, guards (AuthGuard/AdminGuard/GuestGuard), CartButton, SearchDialog, UserMenu, AuthSplit
    books/                    BookCard, BookGrid, BookCover, BookFilters, BookForm, AddToCartButton, FavouriteButton, StockBadge
    cart/  orders/  admin/     per-domain components
    states/                     EmptyState, ErrorState, NotFoundState, skeletons
    providers/                   Providers (theme/query/motion/tooltip), AuthBootstrap, AuthPromptProvider
  lib/
    api/                    client.ts (fetch wrapper + 401/expired-403 handling), auth.ts, books.ts, library.ts (favourites/cart/orders), types.ts, mappers.ts
    hooks/                    useMe, useBooks, useBook, useCart, useFavourites, useOrders, useAdminOrders, useCatalogFilters, ...
    store/                     auth.ts (Zustand, persisted to localStorage)
    motion.ts  utils.ts  format.ts  site-config.ts  fly-to-cart.ts  gsap.ts
docs/
  component-log.md          full origin/changes log for every third-party component, and every deviation from the brief
```

## Design system and motion

- **Tokens** live entirely in `src/app/globals.css` as CSS custom properties, mapped into Tailwind
  v4 via `@theme inline`. Nothing outside this file contains a literal color. Both themes were
  checked against WCAG AA (4.5:1 body text, 3:1 large text/UI); the plan's stated `amber` and
  `success` light-mode values were darkened slightly (`#B7791F → #8A5A0C` for small text, `#1F8A5B →
  #187A50`) to actually clear 4.5:1 on the card surface — the original values were used as-is for
  large text and icons, where 3:1 is the bar.
- **Type**: Newsreader (serif, display/reading) + Instrument Sans (UI), both via `next/font` local
  packages (`@fontsource-variable/*`) rather than Google Fonts CDN, so there's no external font
  request and no layout shift from a slow font host.
- **Motion tokens** in `src/lib/motion.ts` (durations, eases, stagger) are the single source every
  animated component reads from. The whole app is wrapped in `<MotionConfig reducedMotion="user">`;
  every GSAP animation is gated with `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
  Only `transform`/`opacity` are animated anywhere in the app.
- **The one WebGL canvas** (`components/motion/lamp-glow.tsx`) is landing-page only, lazy-loaded via
  `next/dynamic({ ssr: false })`, skipped under 900px width, paused via `IntersectionObserver` and
  `visibilitychange`, and rendered at half resolution capped near 30fps.

## Known limitations

- **Not run against a live backend.** This was built in a sandboxed environment whose network
  egress is limited to package registries; the backend's `URI` points at a `mongodb+srv://` Atlas
  cluster, which that sandbox couldn't reach (DNS/connection never completed). `npm run build`,
  `npx tsc --noEmit`, and `npm run lint` all pass clean, and the API layer was written directly
  against every route, header, and body shape in the backend's route files — but the full
  acceptance checklist (sign up → sign in → browse → cart → checkout → admin) has not been run
  live. Please run it once against your own backend before treating this as final; see
  `docs/component-log.md` for exactly what's untested and why.
- **No Skiper UI or Animmaster Lib access** in this environment — see `docs/component-log.md` for
  the full explanation and what was built instead.
- Backend gaps carried through as-is (not frontend bugs): no ratings/reviews, no cart quantities,
  no payment processing, no server-side search/pagination, no password reset, no wishlist sharing,
  no admin-creation route, stock is display-only (not decremented or checked at order time), and
  `get-all-orders` populates the full user document including a password hash — the frontend's
  `toCustomer` mapper explicitly picks only `username`/`email`/`address` and drops everything else
  before it ever reaches a component or the query cache.

## Suggested backend improvements

- A `start` script (`node app.js`) in `package.json`, for convention.
- An endpoint to promote a user to admin (or an initial-admin seed), so admin testing doesn't
  require direct database access.
- `add-book` returning the created book, to avoid a full list refetch after every create.
- Decrementing stock on order placement, or documenting that it's intentionally left to a separate
  fulfillment step.
