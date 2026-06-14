import { capitalizeWords } from "@shared/utils/text";
import {
  CATEGORY_COUNT,
  URGENT_ID_DIVISOR,
} from "@features/announcements/constants";
import type {
  Announcement,
  Category,
  RawPost,
} from "@features/announcements/types";

/**
 * Derive a category from a post id:
 *   id % 4 === 0 → "Health"
 *   id % 4 === 1 → "Transport"
 *   id % 4 === 2 → "Education"
 *   anything else → "Infrastructure"
 */
export function categoryForId(id: number): Category {
  switch (id % CATEGORY_COUNT) {
    case 0:
      return "Health";
    case 1:
      return "Transport";
    case 2:
      return "Education";
    default:
      return "Infrastructure";
  }
}

/** An announcement is urgent when its id divides evenly by 7. */
export function isUrgentForId(id: number): boolean {
  return id % URGENT_ID_DIVISOR === 0;
}

// Maps a raw API post → Announcement. Pure and testable
export function toAnnouncement(post: RawPost): Announcement {
  return {
    id: post.id,
    title: capitalizeWords(post.title),
    body: post.body,
    category: categoryForId(post.id),
    isUrgent: isUrgentForId(post.id),
  };
}
