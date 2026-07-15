"use client";

import { useMemo } from "react";
import { AnimatePresence } from "motion/react";
import type { Filters, Status, TrackItem } from "@/types";
import { applyFilters } from "@/lib/filter";
import Toolbar from "@/components/Toolbar";
import ItemCard from "@/components/ItemCard";
import AnimatedItem from "@/components/AnimatedItem";
import EmptyState from "@/components/EmptyState";

const ACTIVE_STATUSES: Status[] = ["to-learn", "in-progress"];

interface HomeViewProps {
  items: TrackItem[]; // seluruh item (belum difilter aktif)
  filters: Filters;
  categories: string[];
  onFilterChange: (patch: Partial<Filters>) => void;
  onAdd: () => void;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (item: TrackItem) => void;
  onDelete: (item: TrackItem) => void;
  onOpenDetail: (item: TrackItem) => void;
}

export default function HomeView({
  items,
  filters,
  categories,
  onFilterChange,
  onAdd,
  onStatusChange,
  onEdit,
  onDelete,
  onOpenDetail,
}: HomeViewProps) {
  const activeItems = useMemo(
    () => items.filter((it) => it.status !== "done"),
    [items]
  );
  const visible = useMemo(
    () => applyFilters(activeItems, filters),
    [activeItems, filters]
  );

  const isFiltering =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.priority !== "all";

  return (
    <div className="flex flex-col gap-5">
      <Toolbar
        filters={filters}
        categories={categories}
        onChange={onFilterChange}
        onAdd={onAdd}
        statusOptions={ACTIVE_STATUSES}
        allStatusLabel="Semua (aktif)"
      />

      {visible.length === 0 ? (
        <EmptyState filtered={activeItems.length > 0 && isFiltering} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item) => (
              <AnimatedItem key={item.id}>
                <ItemCard
                  item={item}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onOpenDetail={onOpenDetail}
                />
              </AnimatedItem>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
