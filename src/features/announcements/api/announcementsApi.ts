import { apiGet } from "@shared/api/client";
import type { Announcement, RawPost } from "@features/announcements/types";
import { toAnnouncement } from "@features/announcements/utils/transformAnnouncement";

/** Fetch and transform every announcement */
export async function fetchAnnouncements(
  signal?: AbortSignal,
): Promise<Announcement[]> {
  const posts = await apiGet<RawPost[]>("/posts", { signal });
  return posts.map(toAnnouncement);
}

/** Fetch a single announcement by id */
export async function fetchAnnouncementById(
  id: number,
  signal?: AbortSignal,
): Promise<Announcement> {
  const post = await apiGet<RawPost>(`/posts/${id}`, { signal });
  return toAnnouncement(post);
}
