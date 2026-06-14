import type { CATEGORIES, CATEGORY_FILTERS } from "./constants";

export interface RawPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type Category = (typeof CATEGORIES)[number];

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: Category;
  isUrgent: boolean;
}
