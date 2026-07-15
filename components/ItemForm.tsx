"use client";

import { useState, type FormEvent } from "react";
import type { Priority, Resource, Status, TrackItem } from "@/types";
import type { NewItemInput } from "@/hooks/useTracker";
import { PRIORITY_META, STATUS_META, STATUS_ORDER } from "@/lib/constants";
import { sentenceCase, titleCase } from "@/lib/format";
import Button from "./Button";
import Select, { type SelectOption } from "./Select";

interface ItemFormProps {
  initial?: TrackItem | null;
  categories: string[];
  onSubmit: (input: NewItemInput) => void;
  onCancel: () => void;
}

const inputClass =
  "w-full rounded-xl border border-white/50 bg-white/35 px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-turquoise focus:bg-white/70 transition";
const labelClass = "block text-sm font-semibold text-navy mb-1.5";

const ADD_NEW = "__add_new__";

export default function ItemForm({
  initial,
  categories,
  onSubmit,
  onCancel,
}: ItemFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [resources, setResources] = useState<Resource[]>(
    initial?.resources && initial.resources.length > 0
      ? initial.resources.map((r) => ({ url: r.url, label: r.label ?? "" }))
      : []
  );
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [priority, setPriority] = useState<Priority>(
    initial?.priority ?? "medium"
  );
  const [status, setStatus] = useState<Status>(initial?.status ?? "to-learn");
  const [error, setError] = useState("");

  const categoryOpts: SelectOption[] = [
    ...categories.map((c) => ({ value: c, label: c })),
    { value: ADD_NEW, label: "➕ Tambah kategori baru…" },
  ];
  const priorityOpts: SelectOption[] = (
    ["high", "medium", "low"] as Priority[]
  ).map((p) => ({
    value: p,
    label: PRIORITY_META[p].label,
    emoji: PRIORITY_META[p].emoji,
  }));
  const statusOpts: SelectOption[] = STATUS_ORDER.map((s) => ({
    value: s,
    label: STATUS_META[s].label,
    emoji: STATUS_META[s].emoji,
  }));

  function handleCategoryChange(value: string) {
    if (value === ADD_NEW) {
      setAddingCategory(true);
      setCategory("");
    } else {
      setAddingCategory(false);
      setCategory(value);
    }
  }

  function addResource() {
    setResources((prev) => [...prev, { url: "", label: "" }]);
  }

  function updateResource(index: number, patch: Partial<Resource>) {
    setResources((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  }

  function removeResource(index: number) {
    setResources((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Judul wajib diisi ya 🙂");
      return;
    }
    // Kategori baru diformat Title Case; kategori existing dipakai apa adanya
    // supaya nggak bikin duplikat dengan beda kapitalisasi.
    const finalCategory = addingCategory
      ? titleCase(newCategory)
      : category.trim();
    if (!finalCategory) {
      setError("Pilih atau isi kategori dulu.");
      return;
    }

    // Buang baris resource yang URL-nya kosong, trim & format label
    const cleanResources: Resource[] = resources
      .map((r) => ({ url: r.url.trim(), label: titleCase(r.label ?? "") }))
      .filter((r) => r.url !== "")
      .map((r) => ({ url: r.url, label: r.label || undefined }));

    onSubmit({
      title: titleCase(cleanTitle),
      description: sentenceCase(description) || undefined,
      resources: cleanResources.length > 0 ? cleanResources : undefined,
      category: finalCategory,
      priority,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="title" className={labelClass}>
          Judul <span className="text-coral">*</span>
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          placeholder="cth: Belajar React Server Components"
          className={inputClass}
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi / Catatan
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Catatan bebas, progress terakhir, dll."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Link Resource</label>
        {resources.length === 0 ? (
          <p className="mb-2 text-xs text-muted">
            Belum ada resource. Tambahkan link dokumentasi, video, atau repo.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {resources.map((r, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-xl border border-white/50 bg-white/25 p-2.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={r.url}
                    onChange={(e) => updateResource(i, { url: e.target.value })}
                    placeholder="https://…"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeResource(i)}
                    aria-label="Hapus resource"
                    className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-coral/20 hover:text-navy"
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
                <input
                  value={r.label ?? ""}
                  onChange={(e) => updateResource(i, { label: e.target.value })}
                  placeholder="Keterangan (mis. Dokumentasi resmi, Video tutorial)"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addResource}
          className="mt-2"
        >
          ➕ Tambah resource
        </Button>
      </div>

      <div>
        <label className={labelClass}>
          Kategori <span className="text-coral">*</span>
        </label>
        {addingCategory ? (
          <div className="flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nama kategori baru"
              className={inputClass}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setAddingCategory(false);
                setCategory(categories[0] ?? "");
              }}
            >
              Batal
            </Button>
          </div>
        ) : (
          <Select
            value={category}
            options={categoryOpts}
            onChange={handleCategoryChange}
            ariaLabel="Kategori"
            placeholder="Pilih kategori"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prioritas</label>
          <Select
            value={priority}
            options={priorityOpts}
            onChange={(v) => setPriority(v as Priority)}
            ariaLabel="Prioritas"
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <Select
            value={status}
            options={statusOpts}
            onChange={(v) => setStatus(v as Status)}
            ariaLabel="Status"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-coral/20 px-3 py-2 text-sm font-medium text-navy">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          {initial ? "Simpan Perubahan" : "Tambah Item"}
        </Button>
      </div>
    </form>
  );
}
