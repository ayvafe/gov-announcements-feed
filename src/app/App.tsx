import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@shared/layout/Layout/Layout";
import { NotFoundPage } from "@pages/NotFoundPage";
import { AnnouncementsScope } from "@scopes/AnnouncementsScope";

/**
 * Route-level code splitting: each page is its own lazy chunk, loaded on demand
 * behind the `<Suspense>` in `Layout`. Keeps the initial bundle small.
 */
const FeedPage = lazy(() =>
  import("@pages/FeedPage/FeedPage").then((m) => ({ default: m.FeedPage })),
);
const DetailPage = lazy(() =>
  import("@pages/DetailPage/DetailPage").then((m) => ({
    default: m.DetailPage,
  })),
);
const BookmarksPage = lazy(() =>
  import("@pages/BookmarksPage/BookmarksPage").then((m) => ({
    default: m.BookmarksPage,
  })),
);

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Default redirect to the canonical feed route. */}
        <Route index element={<Navigate to="/announcements" replace />} />

        {/* Announcements-related pages sharing one provider instance. */}
        <Route element={<AnnouncementsScope />}>
          <Route path="/announcements" element={<FeedPage />} />
          <Route path="/announcements/:id" element={<DetailPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
