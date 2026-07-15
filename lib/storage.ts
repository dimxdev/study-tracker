import type { AppState, Resource, TrackItem } from "@/types";
import { DEFAULT_CATEGORIES, STORAGE_KEY } from "./constants";

/**
 * Normalisasi item saat dibaca dari storage, termasuk migrasi format lama:
 * dulu resource cuma satu string (`resourceLink`), sekarang array `resources`.
 */
function normalizeItem(raw: unknown): TrackItem {
  const it = raw as TrackItem & { resourceLink?: string };
  let resources: Resource[] | undefined;

  if (Array.isArray(it.resources)) {
    resources = it.resources
      .filter((r): r is Resource => !!r && typeof r.url === "string")
      .map((r) => ({ url: r.url, label: r.label }));
  } else if (typeof it.resourceLink === "string" && it.resourceLink.trim()) {
    resources = [{ url: it.resourceLink }];
  }

  return {
    id: it.id,
    title: it.title,
    description: it.description,
    resources,
    category: it.category,
    priority: it.priority,
    status: it.status,
    createdAt: it.createdAt,
    completedAt: it.completedAt,
  };
}

export const EMPTY_STATE: AppState = {
  items: [],
  categories: [...DEFAULT_CATEGORIES],
  lastActiveDate: undefined,
  currentStreak: 0,
};

/** Baca seluruh AppState dari localStorage. Aman dipanggil saat SSR (return default). */
export function loadState(): AppState {
  if (typeof window === "undefined") return { ...EMPTY_STATE };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATE };

    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items.map(normalizeItem) : [],
      categories:
        Array.isArray(parsed.categories) && parsed.categories.length > 0
          ? parsed.categories
          : [...DEFAULT_CATEGORIES],
      lastActiveDate: parsed.lastActiveDate,
      currentStreak:
        typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0,
    };
  } catch {
    // Data korup / bukan JSON valid — fallback ke state kosong biar app tetap jalan
    return { ...EMPTY_STATE };
  }
}

/** Tulis seluruh AppState ke localStorage. */
export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Kuota penuh / storage diblokir — abaikan supaya UI nggak crash
  }
}

/** Format tanggal jadi "YYYY-MM-DD" lokal (tanpa jam) untuk perbandingan hari. */
function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Selisih hari antara dua day-key (b - a). */
function dayDiff(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

/**
 * Hitung streak baru saat ada aktivitas hari ini.
 * - Aktivitas di hari yang sama: streak tetap.
 * - Aktivitas di hari berikutnya (selisih 1 hari): streak + 1.
 * - Selisih > 1 hari (ada hari bolong): streak reset ke 1.
 * - Pertama kali: streak = 1.
 */
export function computeStreak(
  lastActiveDate: string | undefined,
  currentStreak: number,
  now: Date = new Date()
): { currentStreak: number; lastActiveDate: string } {
  const today = toDayKey(now);

  if (!lastActiveDate) {
    return { currentStreak: 1, lastActiveDate: today };
  }

  const diff = dayDiff(lastActiveDate, today);
  if (diff <= 0) {
    // Hari yang sama (atau jam mundur) — pertahankan minimal 1
    return { currentStreak: Math.max(currentStreak, 1), lastActiveDate: today };
  }
  if (diff === 1) {
    return { currentStreak: currentStreak + 1, lastActiveDate: today };
  }
  return { currentStreak: 1, lastActiveDate: today };
}
