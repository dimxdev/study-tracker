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

  const bySort = (a: TrackItem, b: TrackItem): number => {
    switch (filters.sort) {
      case "priority":
        return (
          PRIORITY_META[b.priority].rank - PRIORITY_META[a.priority].rank
        );
      case "alpha":
        return a.title.localeCompare(b.title, "id");
      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  // Item "In Progress" selalu dipin ke atas (apa pun sort-nya),
  // supaya yang lagi aktif dikerjain langsung kelihatan di nomor 1.
  const sorted = [...filtered].sort((a, b) => {
    const aActive = a.status === "in-progress" ? 0 : 1;
    const bActive = b.status === "in-progress" ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return bySort(a, b);
  });
  return sorted;
}
