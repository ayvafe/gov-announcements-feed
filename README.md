# Government Announcements Feed

A single-page app for browsing, searching, filtering and bookmarking government
announcements. Built with **React + TypeScript + React Router + Vite** and
**plain CSS (CSS Modules)** — no UI kits, no state libraries, no data-fetching libraries.

---

## Getting started

### Prerequisites

- Node.js **18+**
- npm **9+**

### Install

```bash
npm install
```

### Run (development)

```bash
npm start        # alias for `vite` — opens http://localhost:5173
```

### Other scripts

```bash
npm run build     # type-check (tsc --noEmit) then production build
npm run preview   # serve the production build locally
npm run typecheck # type-check only
```

### Configuration

The API base URL is read from an environment variable:

```bash
# .env
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

A `.env` is included with the default; copy `.env.example` and override per
environment. If unset, the client falls back to the default URL so the app
runs out of the box.

---

## Project structure

A **feature-based** structure: each domain feature (`announcements`,
`bookmarks`) is self-contained, and only genuinely cross-cutting code lives in
`shared/`. Adding or removing a feature touches one folder.

```
src/
├── main.tsx                      # entry: Router + StrictMode + global CSS
├── app/
│   ├── App.tsx                   # routes, route-level code splitting, provider scoping
│   └── pages/                    # all route pages live here, decoupled from features
│
├── shared/
│    ├── api/
│    │   └── client.ts          # fetch wrapper (base URL, headers, errors, abort)
│    ├── storage/
│    │   └── storage.ts         # safe localStorage wrapper
│    ├── hooks/                 # shared reusable hooks
│    ├── seo/
│    │   └── ...                # usePageMeta + siteMeta constants
│    ├── types/
│    │   └── async.ts           # AsyncState discriminated union (idle/loading/success/error)
│    ├── utils/                 # shared utility files/functions
│    ├── components/            # generic UI atoms (Button, Badge, Spinner, Skeleton, ...)
│    ├── layout/                # Navbar, Layout
│    └── styles/                # CSS variables + global reset
│
└── features/
    ├── announcements/
    │   ├── constants.ts          # categories + business-rule numbers (single source of truth)
    │   ├── types.ts              # RawPost, Announcement, Category, CategoryFilter
    │   ├── api/announcementsApi.ts
    │   ├── utils/
    │   │   ├── transformAnnouncement.ts   # API → domain model (category/urgent rules)
    │   │   └── filterAnnouncements.ts     # pure search + category filter
    │   ├── context/              # Context + Provider + (separate files)
    │   ├── hooks/                # useAnnouncements, useAnnouncement, useAnnouncementFilters
    │   └── components/           # AnnouncementCard(+Skeleton), CategoryBadge, UrgentTag, CategoryFilter
    │
    └── bookmarks/
        ├── constants.ts          # localStorage key
        ├── store/bookmarksStore.ts        # app-independent pub/sub store
        ├── hooks/                # useBookmarks, useBookmarkedAnnouncements
        └── components/           # BookmarkButton
```

### Import path aliases

Cross-directory imports use aliases instead of `../../../` chains — they read
clearly and survive file moves. Defined once in `vite.config.ts`
(`resolve.alias`) and `tsconfig.json` (`paths`), which must stay in sync.

| Alias           | Resolves to               | Use for                                  |
| --------------- | ------------------------- | ---------------------------------------- |
| `@app/*`        | `src/app/*`               | app entry / routing                      |
| `@pages/*`      | `src/app/pages/*`         | route pages                              |
| `@scopes/*`     | `src/app/scopes/*`        | route-scope wrappers (provider scoping)  |
| `@features/*`   | `src/features/*`          | feature modules (incl. their components) |
| `@shared/*`     | `src/shared/*`            | cross-cutting code                       |
| `@components/*` | `src/shared/components/*` | the reusable UI kit                      |

---

## Trade-offs

- **Client-side search/filter.** The dataset is small (100 posts) and fetched in
  full, so filtering in memory is instant and simpler than server queries. For a
  large/paginated API this would move server-side
- **Whole list fetched up front.** Enables instant detail navigation and feed
  filtering, at the cost of one larger initial request. Fine here; a real feed
  would paginate / virtualize.
- **Emoji glyphs for icons** to stay dependency-free (no icon library). A real
  product would use an SVG icon set.
- **SEO limited by client-rendering.** `usePageMeta` updates the `<head>` after
  JS executes, so social unfurlers only see the static defaults. Full per-page
  share cards would require SSR or build-time prerendering.

---

## Future considerations

- **Tests.** The architecture is unit-test-ready: pure utils
  (`transformAnnouncement`, `filterAnnouncements`, `text`), the framework-free
  `bookmarksStore`, and hooks isolated from components. Add Vitest +
  React Testing Library + MSW for the API layer.
- **Pagination / infinite scroll / list virtualization** for large datasets.
- **Optimistic, server-backed bookmarks** if bookmarks become a backend
  resource (the store/hook split makes this swap localized).
- **Error boundary** around routes for render-time failures.
- **Toast notifications** on bookmark add/remove.
- **i18n** for copy and date/number formatting.

---

## Tech stack

React 18 · TypeScript (strict) · React Router 6 · Vite 5 · CSS Modules.
