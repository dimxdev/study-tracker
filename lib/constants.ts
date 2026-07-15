import type { Priority, Status } from "@/types";

export const STORAGE_KEY = "crawl-tracker-data";

export const DEFAULT_CATEGORIES = [
  "Frontend",
  "Backend",
  "Mobile",
  "System Design",
  "DevOps",
];

export const STATUS_META: Record<
  Status,
  { label: string; emoji: string; className: string; dot: string }
> = {
  "to-learn": {
    label: "To Learn",
    emoji: "📚",
    className: "bg-cyan-bg text-navy border border-border",
    dot: "bg-muted",
  },
  "in-progress": {
    label: "In Progress",
    emoji: "⚡",
    className: "bg-turquoise/25 text-navy border border-turquoise",
    dot: "bg-turquoise",
  },
  done: {
    label: "Done",
    emoji: "✅",
    className: "bg-mint/30 text-navy border border-mint",
    dot: "bg-mint",
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; emoji: string; className: string; rank: number }
> = {
  high: {
    label: "High",
    emoji: "🔴",
    className: "bg-coral/25 text-navy border border-coral",
    rank: 3,
  },
  medium: {
    label: "Medium",
    emoji: "🟡",
    className: "bg-sunny/30 text-navy border border-sunny",
    rank: 2,
  },
  low: {
    label: "Low",
    emoji: "🟢",
    className: "bg-mint/25 text-navy border border-mint",
    rank: 1,
  },
};

export const STATUS_ORDER: Status[] = ["to-learn", "in-progress", "done"];
