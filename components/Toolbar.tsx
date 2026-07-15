"use client";

import type { Filters, Priority, SortOption, Status } from "@/types";
import { PRIORITY_META, STATUS_META, STATUS_ORDER } from "@/lib/constants";
import Button from "./Button";
import Select, { type SelectOption } from "./Select";

interface ToolbarProps {
  filters: Filters;
  categories: string[];
  onChange: (patch: Partial<Filters>) => void;
  onAdd: () => void;
  statusOptions?: Status[];
  allStatusLabel?: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Terbaru",
  priority: "Prioritas tertinggi",
  alpha: "Abjad (A–Z)",
};

export default function Toolbar({
  filters,
  categories,
  onChange,
  onAdd,
  statusOptions = STATUS_ORDER,
  allStatusLabel = "Semua Status",
}: ToolbarProps) {
  const statusOpts: SelectOption[] = [
    { value: "all", label: allStatusLabel },
    ...statusOptions.map((s) => ({
      value: s,
      label: STATUS_META[s].label,
      emoji: STATUS_META[s].emoji,
    })),
  ];
  const categoryOpts: SelectOption[] = [
    { value: "all", label: "Semua Kategori" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
  const priorityOpts: SelectOption[] = [
    { value: "all", label: "Semua Prioritas" },
    ...(["high", "medium", "low"] as Priority[]).map((p) => ({
      value: p,
      label: PRIORITY_META[p].label,
      emoji: PRIORITY_META[p].emoji,
    })),
  ];
  const sortOpts: SelectOption[] = (Object.keys(SORT_LABELS) as SortOption[]).map(
    (s) => ({ value: s, label: SORT_LABELS[s] })
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl glass p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
          <input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Cari judul atau catatan…"
            className="w-full rounded-xl border border-white/50 bg-white/35 py-2.5 pl-9 pr-3 text-sm text-navy placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-turquoise focus:bg-white/70 transition"
          />
        </div>
        <Button onClick={onAdd} className="shrink-0">
          ➕ Tambah Item
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.status}
          options={statusOpts}
          onChange={(v) => onChange({ status: v as Status | "all" })}
          ariaLabel="Filter status"
          fullWidth={false}
          className="min-w-40"
        />
        <Select
          value={filters.category}
          options={categoryOpts}
          onChange={(v) => onChange({ category: v })}
          ariaLabel="Filter kategori"
          fullWidth={false}
          className="min-w-40"
        />
        <Select
          value={filters.priority}
          options={priorityOpts}
          onChange={(v) => onChange({ priority: v as Priority | "all" })}
          ariaLabel="Filter prioritas"
          fullWidth={false}
          className="min-w-40"
        />

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-medium text-muted">Urutkan:</span>
          <Select
            value={filters.sort}
            options={sortOpts}
            onChange={(v) => onChange({ sort: v as SortOption })}
            ariaLabel="Urutkan"
            fullWidth={false}
            className="min-w-44"
          />
        </div>
      </div>
    </div>
  );
}
