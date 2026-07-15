"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppState, Status, TrackItem } from "@/types";
import { computeStreak, EMPTY_STATE, loadState, saveState } from "@/lib/storage";

export type NewItemInput = Omit<
  TrackItem,
  "id" | "createdAt" | "completedAt"
>;

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useTracker() {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  // Hindari mismatch hydration: baru render data setelah mount di client
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hidrasi dari localStorage hanya bisa terjadi di client setelah mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage tak tersedia saat SSR
    setState(loadState());
    setHydrated(true);
  }, []);

  // Persist tiap kali state berubah (setelah hydrate)
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  /** Tandai ada aktivitas hari ini → update streak. */
  const touchStreak = useCallback((prev: AppState): AppState => {
    const { currentStreak, lastActiveDate } = computeStreak(
      prev.lastActiveDate,
      prev.currentStreak
    );
    return { ...prev, currentStreak, lastActiveDate };
  }, []);

  const addItem = useCallback(
    (input: NewItemInput) => {
      setState((prev) => {
        const item: TrackItem = {
          ...input,
          id: makeId(),
          createdAt: new Date().toISOString(),
          completedAt:
            input.status === "done" ? new Date().toISOString() : undefined,
        };
        const categories = prev.categories.includes(input.category)
          ? prev.categories
          : [...prev.categories, input.category];
        return touchStreak({ ...prev, items: [item, ...prev.items], categories });
      });
    },
    [touchStreak]
  );

  const updateItem = useCallback(
    (id: string, input: NewItemInput) => {
      setState((prev) => {
        const items = prev.items.map((it) => {
          if (it.id !== id) return it;
          const becomingDone = input.status === "done" && it.status !== "done";
          const leavingDone = input.status !== "done" && it.status === "done";
          return {
            ...it,
            ...input,
            completedAt: becomingDone
              ? new Date().toISOString()
              : leavingDone
                ? undefined
                : it.completedAt,
          };
        });
        const categories = prev.categories.includes(input.category)
          ? prev.categories
          : [...prev.categories, input.category];
        return touchStreak({ ...prev, items, categories });
      });
    },
    [touchStreak]
  );

  const deleteItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  }, []);

  const setStatus = useCallback(
    (id: string, status: Status) => {
      setState((prev) => {
        const items = prev.items.map((it) => {
          if (it.id !== id) return it;
          const becomingDone = status === "done" && it.status !== "done";
          const leavingDone = status !== "done" && it.status === "done";
          return {
            ...it,
            status,
            completedAt: becomingDone
              ? new Date().toISOString()
              : leavingDone
                ? undefined
                : it.completedAt,
          };
        });
        return touchStreak({ ...prev, items });
      });
    },
    [touchStreak]
  );

  const addCategory = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setState((prev) =>
      prev.categories.includes(clean)
        ? prev
        : { ...prev, categories: [...prev.categories, clean] }
    );
  }, []);

  /** Rename kategori sekaligus update semua item yang memakainya. */
  const renameCategory = useCallback((oldName: string, newName: string) => {
    const clean = newName.trim();
    if (!clean || clean === oldName) return;
    setState((prev) => {
      // Kalau nama baru sudah ada, gabungkan (item lama diarahkan ke nama baru)
      const categories = prev.categories
        .map((c) => (c === oldName ? clean : c))
        .filter((c, i, arr) => arr.indexOf(c) === i);
      const items = prev.items.map((it) =>
        it.category === oldName ? { ...it, category: clean } : it
      );
      return { ...prev, categories, items };
    });
  }, []);

  /**
   * Hapus kategori dari daftar. `reassignTo` opsional: kalau ada item yang
   * memakai kategori ini, item diarahkan ke kategori tujuan tersebut.
   */
  const deleteCategory = useCallback((name: string, reassignTo?: string) => {
    setState((prev) => {
      const categories = prev.categories.filter((c) => c !== name);
      const items =
        reassignTo != null
          ? prev.items.map((it) =>
              it.category === name ? { ...it, category: reassignTo } : it
            )
          : prev.items;
      return { ...prev, categories, items };
    });
  }, []);

  return {
    state,
    hydrated,
    addItem,
    updateItem,
    deleteItem,
    setStatus,
    addCategory,
    renameCategory,
    deleteCategory,
  };
}
