"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { TrackItem } from "@/types";
import { titleCase } from "@/lib/format";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";

interface CategoriesViewProps {
  categories: string[];
  items: TrackItem[];
  onAdd: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (name: string, reassignTo?: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-white/50 bg-white/35 px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-turquoise focus:bg-white/70 transition";

export default function CategoriesView({
  categories,
  items,
  onAdd,
  onRename,
  onDelete,
}: CategoriesViewProps) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reassignTo, setReassignTo] = useState<string>("");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) map.set(it.category, (map.get(it.category) ?? 0) + 1);
    return map;
  }, [items]);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const clean = titleCase(newName);
    if (!clean) {
      setError("Nama kategori nggak boleh kosong.");
      return;
    }
    if (categories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      setError("Kategori itu sudah ada.");
      return;
    }
    onAdd(clean);
    setNewName("");
    setError("");
  }

  function startRename(name: string) {
    setRenaming(name);
    setRenameValue(name);
  }

  function submitRename(e: FormEvent) {
    e.preventDefault();
    const formatted = titleCase(renameValue);
    if (renaming && formatted) {
      onRename(renaming, formatted);
    }
    setRenaming(null);
  }

  function openDelete(name: string) {
    setDeleting(name);
    // default tujuan reassign: kategori lain pertama yang tersedia
    setReassignTo(categories.find((c) => c !== name) ?? "");
  }

  function confirmDelete() {
    if (!deleting) return;
    const used = counts.get(deleting) ?? 0;
    onDelete(deleting, used > 0 ? reassignTo || undefined : undefined);
    setDeleting(null);
  }

  const deletingCount = deleting ? counts.get(deleting) ?? 0 : 0;
  const otherCategories = categories.filter((c) => c !== deleting);

  return (
    <div className="flex flex-col gap-5">
      {/* Tambah kategori */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-2 rounded-2xl glass p-4"
      >
        <label htmlFor="newcat" className="text-sm font-bold text-navy">
          🏷️ Tambah Kategori
        </label>
        <div className="flex gap-2">
          <input
            id="newcat"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (error) setError("");
            }}
            placeholder="cth: Machine Learning"
            className={inputClass}
          />
          <Button type="submit" className="shrink-0">
            Tambah
          </Button>
        </div>
        {error && <p className="text-xs font-medium text-coral">{error}</p>}
      </form>

      {/* Daftar kategori */}
      <div className="flex flex-col gap-2 rounded-2xl glass p-4">
        <h2 className="text-sm font-bold text-navy">
          Daftar Kategori ({categories.length})
        </h2>
        {categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            Belum ada kategori. Tambahkan satu di atas ya. 🙂
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {categories.map((cat) => {
              const used = counts.get(cat) ?? 0;
              return (
                <li
                  key={cat}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-navy">{cat}</span>
                    <span className="rounded-full bg-cyan-bg px-2 py-0.5 text-[11px] font-semibold text-muted">
                      {used} item
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startRename(cat)}
                      aria-label={`Rename ${cat}`}
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
                      onClick={() => openDelete(cat)}
                      aria-label={`Hapus ${cat}`}
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
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal rename */}
      <Modal
        open={renaming !== null}
        onClose={() => setRenaming(null)}
        title="Ubah Nama Kategori"
      >
        <form onSubmit={submitRename} className="flex flex-col gap-4">
          <input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className={inputClass}
            autoFocus
          />
          <p className="text-xs text-muted">
            Semua item di kategori ini akan ikut diperbarui.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRenaming(null)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* Modal hapus */}
      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Hapus Kategori?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">
            Hapus kategori{" "}
            <span className="font-semibold text-navy">{deleting}</span>?
          </p>

          {deletingCount > 0 &&
            (otherCategories.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-navy">
                  Ada <span className="font-bold">{deletingCount} item</span> di
                  kategori ini. Pindahkan ke:
                </p>
                <Select
                  value={reassignTo}
                  options={otherCategories.map((c) => ({ value: c, label: c }))}
                  onChange={setReassignTo}
                  ariaLabel="Pindahkan item ke kategori"
                />
              </div>
            ) : (
              <p className="rounded-xl bg-coral/20 px-3 py-2 text-sm text-navy">
                Ada {deletingCount} item di sini tapi nggak ada kategori lain
                buat memindahkannya. Buat kategori baru dulu, ya.
              </p>
            ))}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deletingCount > 0 && otherCategories.length === 0}
            >
              🗑️ Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
