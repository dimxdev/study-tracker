"use client";

import type { Status, TrackItem } from "@/types";
import { PRIORITY_META, STATUS_META, STATUS_ORDER } from "@/lib/constants";
import Badge from "./Badge";

interface ItemCardProps {
  item: TrackItem;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (item: TrackItem) => void;
  onDelete: (item: TrackItem) => void;
}

export default function ItemCard({
  item,
  onStatusChange,
  onEdit,
  onDelete,
}: ItemCardProps) {
  const status = STATUS_META[item.status];
  const priority = PRIORITY_META[item.priority];
  const isDone = item.status === "done";

  return (
    <article className="group relative flex flex-col gap-3 rounded-2xl glass p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`text-base font-bold leading-snug text-navy ${
            isDone ? "line-through opacity-60" : ""
          }`}
        >
          {item.title}
        </h3>
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
        <p className="text-sm leading-relaxed text-muted">{item.description}</p>
      )}

      {item.resourceLink && (
        <a
          href={item.resourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-navy underline decoration-turquoise decoration-2 underline-offset-2 hover:text-turquoise"
        >
          🔗 Buka resource
        </a>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-cyan-bg text-navy border border-border">
          {item.category}
        </Badge>
        <Badge className={priority.className}>
          {priority.emoji} {priority.label}
        </Badge>
        <Badge className={status.className}>
          {status.emoji} {status.label}
        </Badge>
      </div>

      {/* Quick action: pindah status */}
      <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
        {STATUS_ORDER.map((s) => {
          const active = s === item.status;
          const meta = STATUS_META[s];
          return (
            <button
              key={s}
              onClick={() => onStatusChange(item.id, s)}
              disabled={active}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                active
                  ? `${meta.className} cursor-default`
                  : "bg-cyan-bg/60 text-muted hover:bg-cyan-bg hover:text-navy"
              }`}
            >
              {meta.emoji} {meta.label}
            </button>
          );
        })}
      </div>
    </article>
  );
}
