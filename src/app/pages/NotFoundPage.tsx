import { Link } from "react-router-dom";
import { usePageMeta } from "@shared/seo/usePageMeta";
import { Button } from "@components/Button/Button";
import { EmptyState } from "@components/EmptyState/EmptyState";

/** Catch-all 404 for unknown routes. */
export function NotFoundPage() {
  usePageMeta({ title: "Page not found", noIndex: true });

  return (
    <EmptyState
      icon="🧭"
      title="Page not found"
      message="The page you're looking for doesn't exist or has moved."
      action={
        <Link to="/announcements">
          <Button variant="primary">Go to announcements</Button>
        </Link>
      }
    />
  );
}
