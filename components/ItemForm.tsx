"use client";

import { useState, type FormEvent } from "react";
import type { Priority, Status, TrackItem } from "@/types";
import type { NewItemInput } from "@/hooks/useTracker";
import { PRIORITY_META, STATUS_META, STATUS_ORDER } from "@/lib/constants";
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
  const [resourceLink, setResourceLink] = useState(initial?.resourceLink ?? "");
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Judul wajib diisi ya 🙂");
      return;
    }
    const finalCategory = (addingCategory ? newCategory : category).trim();
    if (!finalCategory) {
      setError("Pilih atau isi kategori dulu.");
      return;
    }

    onSubmit({
      title: cleanTitle,
      description: description.trim() || undefined,
      resourceLink: resourceLink.trim() || undefined,
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
        <label htmlFor="link" className={labelClass}>
          Link Resource
        </label>
        <input
          id="link"
          type="url"
          value={resourceLink}
          onChange={(e) => setResourceLink(e.target.value)}
          placeholder="https://... (dokumentasi, video, repo)"
          className={inputClass}
        />
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
