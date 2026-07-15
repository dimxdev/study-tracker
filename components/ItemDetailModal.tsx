"use client";

import type { Status, TrackItem } from "@/types";
import { PRIORITY_META, STATUS_META, STATUS_ORDER } from "@/lib/constants";
import Modal from "./Modal";
import Button from "./Button";
import Badge from "./Badge";

interface ItemDetailModalProps {
  item: TrackItem | null;
  onClose: () => void;
  onEdit: (item: TrackItem) => void;
  onDelete: (item: TrackItem) => void;
  onStatusChange: (id: string, status: Status) => void;
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function labelFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ItemDetailModal({
  item,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: ItemDetailModalProps) {
  const priority = item ? PRIORITY_META[item.priority] : null;
  const resources = item?.resources ?? [];

  return (
    <Modal open={item !== null} onClose={onClose} title="Detail Item">
      {item && priority && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-xl font-extrabold leading-tight tracking-tight text-navy">
              {item.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className="border border-white/60 bg-white/50 text-navy">
                🏷️ {item.category}
              </Badge>
              <Badge className={priority.className}>
                {priority.emoji} {priority.label}
              </Badge>
            </div>
          </div>

          {item.description && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Catatan
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-navy">
                {item.description}
              </p>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              Resource {resources.length > 0 && `(${resources.length})`}
            </p>
            {resources.length === 0 ? (
              <p className="text-sm text-muted">Belum ada resource.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {resources.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-turquoise/50 bg-turquoise/10 px-3 py-2 text-sm transition-colors hover:bg-turquoise/25"
                    >
                      <span>🔗</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-navy">
                          {r.label || labelFromUrl(r.url)}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {r.url}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Ubah status */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              Status
            </p>
            <div className="inline-flex rounded-full bg-cyan-bg/50 p-0.5">
              {STATUS_ORDER.map((s) => {
                const active = s === item.status;
                const meta = STATUS_META[s];
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(item.id, s)}
                    disabled={active}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "cursor-default bg-white text-navy shadow-sm"
                        : "text-muted hover:text-navy"
                    }`}
                  >
                    {meta.emoji} {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/50 bg-white/25 p-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-muted">Dibuat</p>
              <p className="font-medium text-navy">{formatDate(item.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted">Selesai</p>
              <p className="font-medium text-navy">
                {item.status === "done" ? formatDate(item.completedAt) : "-"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/40 pt-4">
            <Button variant="danger" onClick={() => onDelete(item)}>
              🗑️ Hapus
            </Button>
            <Button variant="secondary" onClick={() => onEdit(item)}>
              ✏️ Edit
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
