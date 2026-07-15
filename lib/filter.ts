import type { Filters, TrackItem } from "@/types";
import { PRIORITY_META } from "./constants";

/** Terapkan search + filter status/kategori/prioritas, lalu sort. */
export function applyFilters(
  items: TrackItem[],
  filters: Filters
): TrackItem[] {
  const q = filters.search.trim().toLowerCase();

  const filtered = items.filter((it) => {
    if (q) {
      const haystack = `${it.title} ${it.description ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.status !== "all" && it.status !== filters.status) return false;
    if (filters.category !== "all" && it.category !== filters.category)
      return false;
    if (filters.priority !== "all" && it.priority !== filters.priority)
      return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "priority":
      sorted.sort(
        (a, b) => PRIORITY_META[b.priority].rank - PRIORITY_META[a.priority].rank
      );
      break;
    case "alpha":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "id"));
      break;
    case "newest":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }
  return sorted;
}
