import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePageMeta, type PageMeta } from "@shared/seo/usePageMeta";
import { Button } from "@components/Button/Button";
import { EmptyState } from "@components/EmptyState/EmptyState";
import { Skeleton } from "@components/Skeleton/Skeleton";
import { BookmarkButton } from "@features/bookmarks/components/BookmarkButton/BookmarkButton";
import { CategoryBadge } from "@features/announcements/components/CategoryBadge/CategoryBadge";
import { UrgentTag } from "@features/announcements/components/UrgentTag/UrgentTag";
import { useAnnouncement } from "@features/announcements/hooks/useAnnouncement";
import styles from "./DetailPage.module.css";

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Uses cache when coming from the feed; fetches from network on direct open
  const state = useAnnouncement(id);

  // Go back if we came from within the app, otherwise fall back to the feed
  const hasHistory = location.key !== "default";
  const goBack = () => (hasHistory ? navigate(-1) : navigate("/announcements"));

  // Derive head tags from the current state
  const pageMeta: PageMeta =
    state.status === "success"
      ? {
          title: state.data.title,
          description: state.data.body
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 160),
          type: "article",
          path: `/announcements/${state.data.id}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: state.data.title,
            articleBody: state.data.body,
            articleSection: state.data.category,
            identifier: String(state.data.id),
          },
        }
      : state.status === "error"
        ? { title: "Announcement not found", noIndex: true }
        : { title: "Loading announcement…" };

  usePageMeta(pageMeta);

  return (
    <article className={styles.page}>
      <Button
        variant="ghost"
        size="sm"
        onClick={goBack}
        className={styles.back}
      >
        ← Back
      </Button>

      {state.status === "loading" && (
        <div className={styles.card} aria-busy="true">
          <Skeleton width="30%" height="1.1rem" radius="var(--radius-pill)" />
          <Skeleton width="80%" height="2rem" />
          <Skeleton width="100%" height="0.9rem" />
          <Skeleton width="100%" height="0.9rem" />
          <Skeleton width="60%" height="0.9rem" />
        </div>
      )}

      {state.status === "error" && (
        <EmptyState
          icon="🚫"
          title="Announcement not found"
          message={state.error}
          action={
            <Button
              variant="primary"
              onClick={() => navigate("/announcements")}
            >
              Back to announcements
            </Button>
          }
        />
      )}

      {state.status === "success" && (
        <div className={styles.card}>
          <div className={styles.topRow}>
            <div className={styles.tags}>
              <CategoryBadge category={state.data.category} />
              {state.data.isUrgent && <UrgentTag />}
            </div>
            <BookmarkButton announcementId={state.data.id} size="md" />
          </div>

          <h1 className={styles.title}>{state.data.title}</h1>
          <p className={styles.meta}>Announcement #{state.data.id}</p>
          <p className={styles.body}>{state.data.body}</p>
        </div>
      )}
    </article>
  );
}
