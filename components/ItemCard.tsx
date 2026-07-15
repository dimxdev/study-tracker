"use client";

import type { Priority, Status, TrackItem } from "@/types";
import { PRIORITY_META, STATUS_META, STATUS_ORDER } from "@/lib/constants";
import Badge from "./Badge";

interface ItemCardProps {
  item: TrackItem;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (item: TrackItem) => void;
  onDelete: (item: TrackItem) => void;
  onOpenDetail: (item: TrackItem) => void;
}

const MAX_RESOURCE_CHIPS = 3;

/** Warna aksen tepi kiri card berdasarkan prioritas. */
const PRIORITY_ACCENT: Record<Priority, string> = {
  high: "bg-coral",
  medium: "bg-sunny",
  low: "bg-mint",
};

/** Fallback label saat resource tak diberi keterangan: pakai domain-nya. */
function labelFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ItemCard({
  item,
  onStatusChange,
  onEdit,
  onDelete,
  onOpenDetail,
}: ItemCardProps) {
  const priority = PRIORITY_META[item.priority];
  const isDone = item.status === "done";
  const resources = item.resources ?? [];
  const shownResources = resources.slice(0, MAX_RESOURCE_CHIPS);
  const extraResources = resources.length - shownResources.length;

  return (
    <article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl glass p-4 pl-5 transition-shadow duration-200 hover:shadow-lg">
      {/* Aksen prioritas di tepi kiri */}
      <span
        className={`absolute inset-y-0 left-0 w-1.5 ${PRIORITY_ACCENT[item.priority]}`}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpenDetail(item)}
          title="Lihat detail"
          className={`line-clamp-2 text-left text-[15px] font-bold leading-snug tracking-tight text-navy transition-colors hover:text-turquoise ${
            isDone ? "line-through opacity-60" : ""
          }`}
        >
          {item.title}
        </button>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => onEdit(item)}
            aria-label="Edit item"
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-cyan-bg hover:text-navy"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20h4L18 10l-4-4L4 16v4zM14 6l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(item)}
            aria-label="Hapus item"
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-coral/20 hover:text-navy"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 7h12M9 7V5h6v2m-8 0l1 12h8l1-12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {item.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {item.description}
        </p>
      )}

      {resources.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {shownResources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              title={r.url}
              className="inline-flex max-w-48 items-center gap-1 rounded-full border border-turquoise/60 bg-turquoise/15 px-2.5 py-1 text-xs font-semibold text-navy transition-colors hover:bg-turquoise/30"
            >
              🔗 <span className="truncate">{r.label || labelFromUrl(r.url)}</span>
            </a>
          ))}
          {extraResources > 0 && (
            <button
              type="button"
              onClick={() => onOpenDetail(item)}
              className="rounded-full border border-white/60 bg-white/50 px-2.5 py-1 text-xs font-semibold text-muted transition-colors hover:text-navy"
            >
              +{extraResources} lainnya
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="border border-white/60 bg-white/50 text-navy">
          <span className="inline-block max-w-36 truncate align-bottom">
            {item.category}
          </span>
        </Badge>
        <Badge className={priority.className}>
          {priority.emoji} {priority.label}
        </Badge>
      </div>

      {/* Segmented control: pindah status */}
      <div className="mt-auto flex items-center gap-2 border-t border-white/40 pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Status
        </span>
        <div className="ml-auto inline-flex rounded-full bg-cyan-bg/50 p-0.5">
          {STATUS_ORDER.map((s) => {
            const active = s === item.status;
            const meta = STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => onStatusChange(item.id, s)}
                disabled={active}
                title={meta.label}
                aria-label={`Tandai ${meta.label}`}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                  active
                    ? "cursor-default bg-white text-navy shadow-sm"
                    : "text-muted hover:text-navy"
                }`}
              >
                <span>{meta.emoji}</span>
                {active && <span className="ml-1">{meta.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
