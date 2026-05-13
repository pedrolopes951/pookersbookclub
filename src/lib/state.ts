"use client";
import { useEffect, useState } from "react";
import type React from "react";
import {
  books,
  notes as notesData,
  nextTopics,
  month as monthSeed,
  discussion as discussionSeed,
  prompts as promptsSeed,
  type NoteEntry,
  type NextTopic,
} from "@/data/books";

export type MonthState = {
  name: string;
  topic: string;
  topicShort: string;
  monthNum: number;
  blurb: string;
};

export type DiscussionState = {
  dateISO: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
};

export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {}
    setHydrated(true);
  }, [key]);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, hydrated]);
  return [value, setValue];
}

export const useNotes = () =>
  useLocalStorage<NoteEntry[]>("pbc-notes", notesData);
export const useTopics = () =>
  useLocalStorage<NextTopic[]>("pbc-topics", nextTopics);
export const usePedroVotes = () =>
  useLocalStorage<string[]>("pbc-votes-p", []);
export const useLauraVotes = () =>
  useLocalStorage<string[]>("pbc-votes-l", ["t2"]);
export const useVotingAs = () =>
  useLocalStorage<"p" | "l">("pbc-voting-as", "p");
export const useReadBookA = () =>
  useLocalStorage<number>("pbc-read-a", books[0].current);
export const useReadBookB = () =>
  useLocalStorage<number>("pbc-read-b", books[1].current);
export const usePrompts = () =>
  useLocalStorage<string[]>("pbc-prompts", promptsSeed);
export const useMonthState = () =>
  useLocalStorage<MonthState>("pbc-month", monthSeed);
export const useDiscState = () =>
  useLocalStorage<DiscussionState>("pbc-disc", {
    dateISO: discussionSeed.date.toISOString(),
    dateLabel: discussionSeed.dateLabel,
    timeLabel: discussionSeed.timeLabel,
    location: discussionSeed.location,
  });

export function daysUntil(date: Date): number {
  const ms = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function formatDateLabel(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeLabel(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toDateTimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
