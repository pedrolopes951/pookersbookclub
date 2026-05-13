"use client";
import { useEffect, useState } from "react";
import type React from "react";
import useSWR, { mutate as globalMutate } from "swr";

// ---- Domain types (mirrors /api/state shape) -------------------------------

export type AppMonth = {
  id: string;
  num: number;
  name: string;
  topic: string;
  topicShort: string;
  blurb: string;
  dateISO: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  winnerLabel: string | null;
};

export type AppBook = {
  id: string;
  readerId: "p" | "l";
  pickerId: "p" | "l";
  title: string;
  subtitle: string;
  author: string;
  year: number;
  pages: number;
  currentPage: number;
  coverHue: string;
  coverAccent: string;
  coverGlyph: string;
};

export type AppNote = {
  id: string;
  who: number;
  page: number;
  text: string;
};

export type AppTopic = {
  id: string;
  label: string;
  emoji: string;
  baseVotes: number;
  position: number;
  voters: ("p" | "l")[];
};

export type AppPrompt = {
  id: string;
  position: number;
  text: string;
};

export type AppState = {
  month: AppMonth;
  books: AppBook[];
  notes: AppNote[];
  topics: AppTopic[];
  prompts: AppPrompt[];
};

// ---- SWR fetcher + main hook -----------------------------------------------

const STATE_KEY = "/api/state";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
};

export function useAppState() {
  const { data, error, isLoading, mutate } = useSWR<AppState>(STATE_KEY, fetcher, {
    refreshInterval: 4000,
    revalidateOnFocus: true,
    dedupingInterval: 1000,
  });
  return { data, error, isLoading, refresh: mutate };
}

export const refreshState = () => globalMutate(STATE_KEY);

// ---- Mutation helpers ------------------------------------------------------

const post = async (url: string, body: unknown) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return res.json();
};

const patch = async (url: string, body: unknown) => {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${url} failed: ${res.status}`);
  return res.json();
};

const del = async (url: string) => {
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.status}`);
  return res.json();
};

export const api = {
  addNote: (body: { who: number; page: number; text: string }) =>
    post("/api/notes", body).then(refreshState),
  deleteNote: (id: string) => del(`/api/notes/${id}`).then(refreshState),

  addTopic: (body: { label: string; emoji: string }) =>
    post("/api/topics", body).then(refreshState),
  updateTopic: (id: string, body: { label?: string; emoji?: string }) =>
    patch(`/api/topics/${id}`, body).then(refreshState),
  deleteTopic: (id: string) => del(`/api/topics/${id}`).then(refreshState),

  toggleVote: (topicId: string, voter: "p" | "l") =>
    post("/api/votes/toggle", { topicId, voter }).then(refreshState),

  addPrompt: (text: string) =>
    post("/api/prompts", { text }).then(refreshState),
  updatePrompt: (id: string, text: string) =>
    patch(`/api/prompts/${id}`, { text }).then(refreshState),
  deletePrompt: (id: string) => del(`/api/prompts/${id}`).then(refreshState),

  updateBookProgress: (id: string, currentPage: number) =>
    patch(`/api/books/${id}`, { currentPage }).then(refreshState),

  updateMonth: (body: Partial<{
    topic: string;
    topicShort: string;
    blurb: string;
    dateISO: string;
    dateLabel: string;
    timeLabel: string;
    location: string;
  }>) => patch("/api/month", body).then(refreshState),
};

// ---- Local-only UI preferences ---------------------------------------------

function useLocalStorage<T>(
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

export const useVotingAs = () =>
  useLocalStorage<"p" | "l">("pbc-voting-as", "p");

// ---- Date helpers ----------------------------------------------------------

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
