"use client";

import { useEffect, useState } from "react";
import type { Filters, Status, TrackItem } from "@/types";
import { useTracker, type NewItemInput } from "@/hooks/useTracker";
import { getRandomQuote } from "@/lib/quotes";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import ItemForm from "@/components/ItemForm";
import Button from "@/components/Button";
import Confetti from "@/components/Confetti";
import SideNav, { type ViewKey } from "@/components/SideNav";
import HomeView from "@/components/views/HomeView";
import HistoryView from "@/components/views/HistoryView";
import AnalyticsView from "@/components/views/AnalyticsView";
import CategoriesView from "@/components/views/CategoriesView";

const DEFAULT_FILTERS: Filters = {
  search: "",
  status: "all",
  category: "all",
  priority: "all",
  sort: "newest",
};

const VIEW_TITLES: Record<ViewKey, string> = {
  home: "Beranda",
  categories: "Kelola Kategori",
  analytics: "Analitik",
  history: "Riwayat Selesai",
};

export default function Home() {
  const {
    state,
    hydrated,
    addItem,
    updateItem,
    deleteItem,
    setStatus,
    addCategory,
    renameCategory,
    deleteCategory,
  } = useTracker();

  const [view, setView] = useState<ViewKey>("home");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TrackItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrackItem | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random quote client-only, mencegah hydration mismatch
    setQuote(getRandomQuote());
  }, []);

  const doneCount = state.items.filter((i) => i.status === "done").length;

  function patchFilters(patch: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: TrackItem) {
    setEditing(item);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  function fireConfetti() {
    setConfettiKey((k) => k + 1);
  }

  function handleSubmit(input: NewItemInput) {
    if (editing) {
      const wasDone = editing.status === "done";
      updateItem(editing.id, input);
      if (!wasDone && input.status === "done") fireConfetti();
    } else {
      addItem(input);
      if (input.status === "done") fireConfetti();
    }
    closeForm();
  }

  function handleStatusChange(id: string, status: Status) {
    const item = state.items.find((i) => i.id === id);
    setStatus(id, status);
    if (item && item.status !== "done" && status === "done") fireConfetti();
  }

  function confirmDelete() {
    if (deleteTarget) deleteItem(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-full">
      <SideNav active={view} onChange={setView} historyCount={doneCount} />

      <div className="md:pl-60">
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-24 pt-6 sm:px-6 md:pb-10 md:pt-8">
          <Header streak={state.currentStreak} quote={quote} />

          {!hydrated ? (
            <div className="py-20 text-center text-muted">Memuat data… 🐢</div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-navy">
                  {VIEW_TITLES[view]}
                </h2>
                {view === "home" && (
                  <Button onClick={openAdd} size="sm">
                    ➕ Tambah
                  </Button>
                )}
              </div>

              {view === "home" && (
                <HomeView
                  items={state.items}
                  filters={filters}
                  categories={state.categories}
                  onFilterChange={patchFilters}
                  onAdd={openAdd}
                  onStatusChange={handleStatusChange}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              )}

              {view === "categories" && (
                <CategoriesView
                  categories={state.categories}
                  items={state.items}
                  onAdd={addCategory}
                  onRename={renameCategory}
                  onDelete={deleteCategory}
                />
              )}

              {view === "analytics" && <AnalyticsView items={state.items} />}

              {view === "history" && (
                <HistoryView
                  items={state.items}
                  onStatusChange={handleStatusChange}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Form tambah/edit */}
      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit Item" : "Tambah Item Baru"}
      >
        <ItemForm
          initial={editing}
          categories={state.categories}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      {/* Konfirmasi hapus item */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus item?"
      >
        <p className="text-sm text-muted">
          Yakin mau menghapus{" "}
          <span className="font-semibold text-navy">{deleteTarget?.title}</span>?
          Tindakan ini nggak bisa dibatalkan.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            🗑️ Hapus
          </Button>
        </div>
      </Modal>

      {confettiKey > 0 && <Confetti key={confettiKey} />}
    </div>
  );
}
