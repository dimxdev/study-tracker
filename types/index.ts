export type Priority = "low" | "medium" | "high";
export type Status = "to-learn" | "in-progress" | "done";

export interface TrackItem {
  id: string;
  title: string;
  description?: string;
  resourceLink?: string;
  category: string;
  priority: Priority;
  status: Status;
  createdAt: string; // ISO date
  completedAt?: string; // ISO date, diisi saat status jadi "done"
}

export interface AppState {
  items: TrackItem[];
  categories: string[]; // daftar kategori custom yang pernah dibuat
  lastActiveDate?: string; // dipakai untuk hitung streak
  currentStreak: number;
}

export type SortOption = "newest" | "priority" | "alpha";

export interface Filters {
  search: string;
  status: Status | "all";
  category: string | "all";
  priority: Priority | "all";
  sort: SortOption;
}
