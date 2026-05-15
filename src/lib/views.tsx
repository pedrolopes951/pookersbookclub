"use client";
import { useState } from "react";
import type React from "react";
import Image from "next/image";
import {
  PALETTE,
  readers,
  type Reader,
} from "@/data/books";
import {
  type AppBook,
  type AppMonth,
  type AppNote,
  type AppPrompt,
  type AppTopic,
  type ArchivedMonth,
  formatDateLabel,
  formatTimeLabel,
  toDateTimeLocalValue,
} from "@/lib/state";

// ---- atoms -----------------------------------------------------------------

export function Avatar({
  reader,
  size = 32,
  ring = false,
}: {
  reader: Reader;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: reader.color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body), sans-serif",
        fontWeight: 800,
        fontSize: size * 0.42,
        boxShadow: ring
          ? `0 0 0 3px ${PALETTE.paper}, 0 0 0 4px ${reader.color}`
          : "none",
        flexShrink: 0,
      }}
    >
      {reader.initial}
    </div>
  );
}

export function BookCover({
  book,
  w = 120,
  h = 180,
  tilt = 0,
}: {
  book: AppBook;
  w?: number;
  h?: number;
  tilt?: number;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        position: "relative",
        background: `linear-gradient(135deg, ${book.coverHue} 0%, ${book.coverHue} 60%, rgba(0,0,0,.2) 100%)`,
        boxShadow:
          "0 12px 24px rgba(45,31,21,.28), inset 4px 0 0 rgba(0,0,0,.18), inset -2px 0 0 rgba(255,255,255,.08)",
        transform: `rotate(${tilt}deg)`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "absolute", left: 10, right: 10, top: 14, height: 2, background: book.coverAccent, opacity: 0.9 }} />
      <div style={{ position: "absolute", left: 10, right: 10, top: 20, height: 1, background: book.coverAccent, opacity: 0.5 }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 14, height: 1, background: book.coverAccent, opacity: 0.6 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.min(w, h) * 0.42, opacity: 0.85, filter: "saturate(.85)" }}>{book.coverGlyph}</div>
      <div className="pbc-serif" style={{ position: "absolute", left: 10, right: 18, bottom: 24, color: book.coverAccent, fontSize: Math.max(8, w * 0.08), fontWeight: 600, lineHeight: 1.1, textTransform: "uppercase", letterSpacing: ".05em" }}>{book.title}</div>
    </div>
  );
}

export function ProgressRing({
  pct,
  size = 80,
  color,
  track = "rgba(45,31,21,.1)",
}: {
  pct: number;
  size?: number;
  color: string;
  track?: string;
}) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset .4s ease" }} />
      </svg>
      <div className="pbc-display" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, color: PALETTE.espresso }}>
        {pct}
        <span style={{ fontSize: size * 0.15 }}>%</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="pbc-display" style={{ fontSize: 20, color: PALETTE.espresso, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: PALETTE.taupeDark, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

// ---- PhotoHero (landing) ---------------------------------------------------

export function PhotoHero() {
  return (
    <section
      style={{
        position: "relative",
        marginBottom: 40,
        padding: "56px 64px",
        background: PALETTE.cream,
        borderRadius: 36,
        boxShadow: "0 26px 60px rgba(45,31,21,.22)",
        display: "grid",
        gridTemplateColumns: "minmax(520px, 760px) 1fr",
        gap: 64,
        alignItems: "center",
        overflow: "hidden",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px 20px 80px",
          borderRadius: 8,
          transform: "rotate(-2.5deg)",
          boxShadow:
            "0 36px 70px rgba(45,31,21,.34), 0 0 0 1px rgba(45,31,21,.08)",
          position: "relative",
          justifySelf: "center",
          width: 680,
        }}
      >
        <div style={{ position: "relative", width: 632, height: 632, borderRadius: 4, overflow: "hidden" }}>
          <Image src="/bookclub.jpeg" alt="Pedro & Laura" fill sizes="680px" priority style={{ objectFit: "cover" }} />
        </div>
        <div className="pbc-hand" style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontSize: 56, color: PALETTE.espresso }}>the pooks ♡</div>
        <div style={{ position: "absolute", top: -14, left: "38%", width: 140, height: 38, background: "rgba(212,165,116,.7)", transform: "rotate(-6deg)", boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
      </div>

      <div>
        <div className="pbc-hand" style={{ fontSize: 40, color: PALETTE.taupeDeep, marginBottom: 6 }}>welcome to</div>
        <h1 className="pbc-display" style={{ fontSize: "clamp(72px, 7vw, 120px)", color: PALETTE.espresso, lineHeight: 0.88, margin: 0 }}>
          Pookers<br />bookclub
        </h1>
        <div className="pbc-serif" style={{ fontSize: 22, fontStyle: "italic", color: PALETTE.midBrown, marginTop: 24, maxWidth: 560, lineHeight: 1.5 }}>
          a tiny book club for two. each month we agree on a topic.{" "}{readers[0].name} picks a book for {readers[1].name}.{" "}{readers[1].name} picks a book for {readers[0].name}. we read, we talk, we rate.
        </div>
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar reader={readers[0]} size={44} ring />
          <div style={{ marginLeft: -12 }}><Avatar reader={readers[1]} size={44} ring /></div>
          <div style={{ fontSize: 14, fontWeight: 700, color: PALETTE.taupeDark, letterSpacing: ".1em", textTransform: "uppercase" }}>
            {readers[0].name} &amp; {readers[1].name} · since May 2026
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Countdown / MonthStrip -----------------------------------------------

export type MonthUpdate = Partial<Pick<AppMonth, "topic" | "topicShort" | "blurb" | "dateISO" | "dateLabel" | "timeLabel" | "location">>;

export function CountdownTile({
  days,
  month,
  onUpdate,
}: {
  days: number;
  month: AppMonth;
  onUpdate: (patch: MonthUpdate) => void;
}) {
  const [editing, setEditing] = useState(false);
  const onDateChange = (value: string) => {
    if (!value) return;
    const d = new Date(value);
    onUpdate({
      dateISO: d.toISOString(),
      dateLabel: formatDateLabel(d),
      timeLabel: formatTimeLabel(d),
    });
  };
  return (
    <div style={{ background: PALETTE.cream, borderRadius: 20, padding: "16px 22px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 10px 24px rgba(45,31,21,.14)" }}>
      <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: PALETTE.taupeDark, fontWeight: 800 }}>discussion<br />in</div>
      <div className="pbc-display" style={{ fontSize: 64, color: PALETTE.teal, lineHeight: 0.9 }}>{days}</div>
      <div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <input type="datetime-local" value={toDateTimeLocalValue(month.dateISO)} onChange={(e) => onDateChange(e.target.value)} style={{ border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 8px", fontSize: 12, background: "#fff", color: PALETTE.espresso }} />
            <input value={month.location} onChange={(e) => onUpdate({ location: e.target.value })} placeholder="location" style={{ border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 8px", fontSize: 12, background: "#fff", color: PALETTE.espresso }} />
            <button type="button" onClick={() => setEditing(false)} style={{ marginTop: 2, background: PALETTE.espresso, color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 12px", fontWeight: 700, fontSize: 11, cursor: "pointer", alignSelf: "flex-start" }}>done</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: PALETTE.espresso, fontWeight: 700 }}>days · {month.dateLabel}</div>
            <div style={{ fontSize: 12, color: PALETTE.midBrown }}>{month.timeLabel}</div>
            <button type="button" onClick={() => setEditing(true)} style={{ marginTop: 6, background: PALETTE.espresso, color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 12px", fontFamily: "var(--font-body), sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer", letterSpacing: ".05em" }}>✎ edit date</button>
          </>
        )}
      </div>
    </div>
  );
}

export function MonthStrip({
  days,
  month,
  onUpdate,
}: {
  days: number;
  month: AppMonth;
  onUpdate: (patch: MonthUpdate) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, gap: 24, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 320 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: PALETTE.cream, padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: PALETTE.taupeDark, letterSpacing: ".1em", textTransform: "uppercase" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE.sage }} />
          Month {month.num} · in progress
          <button type="button" onClick={() => setEditing((v) => !v)} style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 13, padding: 0, marginLeft: 4, opacity: 0.7 }} aria-label={editing ? "done editing" : "edit month"}>
            {editing ? "✓" : "✎"}
          </button>
        </div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, maxWidth: 580 }}>
            <input value={month.topic} onChange={(e) => onUpdate({ topic: e.target.value, topicShort: e.target.value })} placeholder="month topic" style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 40, color: PALETTE.espresso, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 12, padding: "6px 12px", background: "#fff", lineHeight: 1 }} />
            <textarea value={month.blurb} onChange={(e) => onUpdate({ blurb: e.target.value })} rows={3} placeholder="what's this month about?" style={{ fontSize: 15, color: PALETTE.midBrown, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 12, padding: "8px 12px", background: "#fff", resize: "vertical", fontFamily: "inherit" }} />
          </div>
        ) : (
          <>
            <h1 className="pbc-display" style={{ fontSize: 64, color: PALETTE.espresso, margin: "12px 0 4px", lineHeight: 0.95 }}>{month.topic}.</h1>
            <div style={{ fontSize: 16, color: PALETTE.midBrown, maxWidth: 580 }}>{month.blurb}</div>
          </>
        )}
      </div>
      <CountdownTile days={days} month={month} onUpdate={onUpdate} />
    </div>
  );
}

// ---- BookPanel -------------------------------------------------------------

export function BookPanel({
  reader,
  picker,
  book,
  notesCount,
  onUpdate,
  accent,
}: {
  reader: Reader;
  picker: Reader;
  book: AppBook;
  notesCount: number;
  onUpdate: (currentPage: number) => void;
  accent: string;
}) {
  const pct = book.pages > 0 ? Math.round((book.currentPage / book.pages) * 100) : 0;
  return (
    <div style={{ background: PALETTE.paper, borderRadius: 20, padding: 22, boxShadow: "0 12px 28px rgba(45,31,21,.14)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: PALETTE.taupeDark }}>
          <Avatar reader={picker} size={24} />
          <span style={{ fontWeight: 700 }}>{picker.name}</span>
          <span style={{ opacity: 0.6 }}>picked for</span>
          <Avatar reader={reader} size={24} />
          <span style={{ fontWeight: 700 }}>{reader.name}</span>
        </div>
        <span style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 800, color: accent, background: "rgba(0,0,0,.04)", padding: "4px 10px", borderRadius: 999 }}>currently reading</span>
      </div>

      <div style={{ display: "flex", gap: 18 }}>
        <BookCover book={book} w={110} h={166} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="pbc-display" style={{ fontSize: 32, color: PALETTE.espresso, margin: 0, lineHeight: 0.95 }}>{book.title}</h3>
          <div className="pbc-serif" style={{ fontSize: 13, color: PALETTE.midBrown, fontStyle: "italic", margin: "4px 0 8px" }}>{book.subtitle}</div>
          <div style={{ fontSize: 13, color: PALETTE.taupeDark, fontWeight: 700 }}>{book.author}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 12, fontSize: 12, color: PALETTE.midBrown }}>
            <Stat label="pages" value={book.pages} />
            <Stat label="read" value={book.currentPage} />
            <Stat label="notes" value={notesCount} />
          </div>
        </div>
        <ProgressRing pct={pct} color={accent} />
      </div>

      <div style={{ color: accent }}>
        <input type="range" min={0} max={book.pages} value={book.currentPage} onChange={(e) => onUpdate(Number(e.target.value))} style={{ width: "100%", accentColor: accent, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: PALETTE.midBrown, marginTop: 2 }}>
          <span>p. {book.currentPage}</span>
          <span>{book.pages - book.currentPage} pages left · ~{Math.ceil((book.pages - book.currentPage) / 30)} sittings</span>
          <span>p. {book.pages}</span>
        </div>
      </div>
    </div>
  );
}

// ---- NotesPanel ------------------------------------------------------------

export function NotesPanel({
  notes,
  books,
  onAdd,
  onDelete,
}: {
  notes: AppNote[];
  books: AppBook[];
  onAdd: (entry: { who: number; page: number; text: string; bookId: string | null }) => void | Promise<unknown>;
  onDelete: (id: string) => void | Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [who, setWho] = useState<number>(0);
  const [page, setPage] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [bookId, setBookId] = useState<string | null>(null);
  const whoReaderId = readers[who]?.id;
  const bookForWho = books.find((b) => b.readerId === whoReaderId) ?? books[0];
  const selectedBookId = bookId ?? bookForWho?.id ?? null;
  const bookById = (id: string | null) => (id ? books.find((b) => b.id === id) : undefined);
  const reset = () => { setPage(""); setText(""); setBookId(null); setOpen(false); };
  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const pg = Math.max(0, parseInt(page, 10) || 0);
    await onAdd({ who, page: pg, text: trimmed, bookId: selectedBookId });
    reset();
  };

  return (
    <div style={{ background: PALETTE.cream, borderRadius: 20, padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: PALETTE.taupeDark, fontWeight: 800 }}>discussion notebook</div>
          <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso, marginTop: -2 }}>things we want to bring up</div>
        </div>
        <button onClick={() => setOpen((v) => !v)} style={{ background: open ? PALETTE.taupeDark : PALETTE.espresso, color: PALETTE.cream, border: "none", borderRadius: 999, padding: "8px 16px", fontFamily: "var(--font-body), sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
          {open ? "× close" : "+ jot a note"}
        </button>
      </div>

      {open && (
        <div style={{ background: PALETTE.paper, borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10, border: `1.5px solid ${PALETTE.taupe}` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 800, color: PALETTE.taupeDark }}>as</span>
            {readers.map((r, i) => {
              const on = who === i;
              return (
                <button key={r.id} type="button" onClick={() => setWho(i)} style={{ display: "flex", alignItems: "center", gap: 6, background: on ? r.color : "transparent", color: on ? "#fff" : PALETTE.espresso, border: `1.5px solid ${on ? r.color : "rgba(45,31,21,.2)"}`, borderRadius: 999, padding: "4px 10px 4px 4px", cursor: "pointer", fontWeight: 800, fontSize: 12 }}>
                  <Avatar reader={r} size={20} />{r.name}
                </button>
              );
            })}
            <input type="number" min={0} value={page} onChange={(e) => setPage(e.target.value)} placeholder="page" style={{ width: 80, marginLeft: "auto", border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 10, padding: "6px 10px", fontFamily: "inherit", fontSize: 13, background: "#fff", color: PALETTE.espresso }} />
          </div>
          {books.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 800, color: PALETTE.taupeDark }}>book</span>
              {books.map((b) => {
                const on = selectedBookId === b.id;
                return (
                  <button key={b.id} type="button" onClick={() => setBookId(b.id)} style={{ display: "flex", alignItems: "center", gap: 6, background: on ? PALETTE.espresso : "transparent", color: on ? PALETTE.cream : PALETTE.espresso, border: `1.5px solid ${on ? PALETTE.espresso : "rgba(45,31,21,.2)"}`, borderRadius: 999, padding: "4px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={b.title}>
                    <span aria-hidden style={{ fontSize: 14 }}>{b.coverGlyph}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</span>
                  </button>
                );
              })}
            </div>
          )}
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="what struck you?" rows={2} style={{ border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 10, padding: "8px 12px", fontFamily: "inherit", fontSize: 13, resize: "vertical", background: "#fff", color: PALETTE.espresso }} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={reset} style={{ background: "transparent", color: PALETTE.taupeDark, border: "1.5px solid rgba(45,31,21,.2)", borderRadius: 999, padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>cancel</button>
            <button type="button" onClick={submit} disabled={!text.trim()} style={{ background: text.trim() ? PALETTE.espresso : "rgba(45,31,21,.3)", color: PALETTE.cream, border: "none", borderRadius: 999, padding: "6px 16px", fontWeight: 800, fontSize: 12, cursor: text.trim() ? "pointer" : "not-allowed" }}>save note</button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <div style={{ background: PALETTE.paper, borderRadius: 14, padding: "24px 18px", textAlign: "center", border: `2px dashed ${PALETTE.taupeDeep}` }}>
          <div className="pbc-hand" style={{ fontSize: 24, color: PALETTE.midBrown }}>no notes yet — first page, fresh page.</div>
          <div style={{ fontSize: 12, color: PALETTE.taupeDark, marginTop: 6 }}>jot something as you read.</div>
        </div>
      ) : (
        notes.map((n) => {
          const r = readers[n.who];
          const b = bookById(n.bookId);
          return (
            <div key={n.id} style={{ background: PALETTE.paper, borderRadius: 14, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start", borderLeft: `4px solid ${r.color}` }}>
              <Avatar reader={r} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: PALETTE.espresso }}>{r.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {b && (
                      <span title={b.title} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: PALETTE.taupeDark, fontWeight: 700, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <span aria-hidden>{b.coverGlyph}</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</span>
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: PALETTE.taupeDark, fontWeight: 700 }}>p. {n.page}</span>
                    <button type="button" onClick={() => onDelete(n.id)} aria-label="delete note" title="delete note" style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 2, opacity: 0.6 }}>×</button>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: PALETTE.midBrown, marginTop: 2, lineHeight: 1.4 }}>{n.text}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ---- VotePanel -------------------------------------------------------------

function VoteChip({ reader, you }: { reader: Reader; you: boolean }) {
  return (
    <span title={`${reader.name} voted${you ? " (you)" : ""}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: reader.color, color: "#fff", borderRadius: 999, padding: "2px 8px 2px 2px", fontSize: 10, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", boxShadow: you ? `0 0 0 2px ${PALETTE.paper}, 0 0 0 3px ${reader.color}` : "none" }}>
      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>{reader.initial}</span>
      ✓
    </span>
  );
}

export function VotePanel({
  topics,
  votingAs,
  setVotingAs,
  onToggle,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  dateLabel,
  wide = false,
}: {
  topics: AppTopic[];
  votingAs: "p" | "l";
  setVotingAs: React.Dispatch<React.SetStateAction<"p" | "l">>;
  onToggle: (topicId: string) => void | Promise<unknown>;
  onAddTopic: (body: { label: string; emoji: string }) => void | Promise<unknown>;
  onUpdateTopic: (id: string, patch: { label?: string; emoji?: string }) => void | Promise<unknown>;
  onDeleteTopic: (id: string) => void | Promise<unknown>;
  dateLabel: string;
  wide?: boolean;
}) {
  const [Pedro, Laura] = readers;
  const [editId, setEditId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmoji, setNewEmoji] = useState("✦");
  const [newLabel, setNewLabel] = useState("");
  // Local draft for in-place edits — committed on blur/done.
  const [draft, setDraft] = useState<{ label: string; emoji: string }>({ label: "", emoji: "" });

  const liveVotesFor = (t: AppTopic) => t.baseVotes + t.voters.length;
  const liveTotal = topics.reduce((s, t) => s + liveVotesFor(t), 0) || 1;
  const yourVoteCount = (v: "p" | "l") =>
    topics.reduce((s, t) => s + (t.voters.includes(v) ? 1 : 0), 0);

  const beginEdit = (t: AppTopic) => {
    setEditId(t.id);
    setDraft({ label: t.label, emoji: t.emoji });
  };
  const commitEdit = async (t: AppTopic) => {
    const patch: { label?: string; emoji?: string } = {};
    if (draft.label !== t.label) patch.label = draft.label;
    if (draft.emoji !== t.emoji) patch.emoji = draft.emoji;
    if (Object.keys(patch).length > 0) await onUpdateTopic(t.id, patch);
    setEditId(null);
  };

  const submitAdd = async () => {
    const label = newLabel.trim();
    if (!label) return;
    await onAddTopic({ label, emoji: (newEmoji || "").trim() || "✦" });
    setNewLabel("");
    setNewEmoji("✦");
    setAddOpen(false);
  };

  return (
    <div style={{ background: PALETTE.cream, borderRadius: 20, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: PALETTE.taupeDark, fontWeight: 800 }}>next-month topic</div>
          <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso, marginTop: -2 }}>cast a vote</div>
          <div style={{ fontSize: 11, color: PALETTE.taupeDark, marginTop: 4, fontStyle: "italic" }}>pick as many as you like — tap to toggle</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 800, color: PALETTE.taupeDark }}>voting as</span>
          <div style={{ display: "flex", background: PALETTE.paper, borderRadius: 999, padding: 4, gap: 2 }}>
            {[Pedro, Laura].map((r) => {
              const v = r.id as "p" | "l";
              const isMe = v === votingAs;
              const count = yourVoteCount(v);
              return (
                <button key={r.id} onClick={() => setVotingAs(v)} style={{ display: "flex", alignItems: "center", gap: 6, background: isMe ? r.color : "transparent", color: isMe ? "#fff" : PALETTE.espresso, border: "none", borderRadius: 999, padding: "4px 12px 4px 4px", cursor: "pointer", fontFamily: "var(--font-body), sans-serif", fontWeight: 800, fontSize: 12, transition: "all .15s" }}>
                  <Avatar reader={r} size={22} />{r.name}
                  <span style={{ background: isMe ? "rgba(255,255,255,.25)" : "rgba(45,31,21,.08)", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 800, marginLeft: 2 }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: wide ? "1fr 1fr" : "1fr", gap: 8 }}>
        {topics.map((t) => {
          const pedroOn = t.voters.includes("p");
          const lauraOn = t.voters.includes("l");
          const liveVotes = liveVotesFor(t);
          const w = (liveVotes / liveTotal) * 100;
          const youVoted = votingAs === "p" ? pedroOn : lauraOn;
          const editing = editId === t.id;

          return (
            <div key={t.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: PALETTE.paper, border: `2px solid ${youVoted ? PALETTE.taupe : "transparent"}` }}>
              <div style={{ position: "absolute", inset: 0, width: `${w}%`, background: youVoted ? "rgba(164,135,113,.35)" : "rgba(164,135,113,.18)", transition: "width .25s" }} />
              {editing ? (
                <div style={{ position: "relative", display: "flex", gap: 8, alignItems: "center", padding: "8px 12px" }}>
                  <input value={draft.emoji} onChange={(e) => setDraft({ ...draft, emoji: e.target.value })} style={{ width: 40, textAlign: "center", border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 6px", background: "#fff", color: PALETTE.espresso, fontSize: 14 }} />
                  <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} autoFocus onKeyDown={(e) => { if (e.key === "Enter") commitEdit(t); }} style={{ flex: 1, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 10px", background: "#fff", color: PALETTE.espresso, fontSize: 14, fontWeight: 700 }} />
                  <button type="button" onClick={() => commitEdit(t)} style={{ background: PALETTE.espresso, color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 12px", fontWeight: 800, fontSize: 11, cursor: "pointer" }}>done</button>
                </div>
              ) : (
                <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 14, gap: 10, padding: "10px 12px 10px 14px" }}>
                  <button type="button" onClick={() => onToggle(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0, color: "inherit", font: "inherit", textAlign: "left" }}>
                    <span style={{ marginRight: 8 }}>{t.emoji}</span>{t.label}
                  </button>
                  <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {pedroOn && <VoteChip reader={Pedro} you={votingAs === "p"} />}
                    {lauraOn && <VoteChip reader={Laura} you={votingAs === "l"} />}
                    <span style={{ fontSize: 11, color: PALETTE.taupeDark, fontWeight: 700, opacity: 0.7, marginLeft: 4 }}>{liveVotes}</span>
                    <button type="button" onClick={() => beginEdit(t)} aria-label="edit topic" title="edit" style={{ background: "transparent", border: "none", cursor: "pointer", color: PALETTE.taupeDark, fontSize: 13, padding: "2px 4px", opacity: 0.6 }}>✎</button>
                    <button type="button" onClick={() => onDeleteTopic(t.id)} aria-label="delete topic" title="delete" style={{ background: "transparent", border: "none", cursor: "pointer", color: PALETTE.taupeDark, fontSize: 14, padding: "2px 4px", opacity: 0.6, lineHeight: 1 }}>×</button>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {addOpen ? (
        <div style={{ marginTop: 10, padding: 12, background: PALETTE.paper, borderRadius: 10, border: `1.5px solid ${PALETTE.taupe}`, display: "flex", gap: 8, alignItems: "center" }}>
          <input value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} style={{ width: 44, textAlign: "center", border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "6px 8px", background: "#fff", color: PALETTE.espresso }} />
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitAdd()} placeholder="new topic…" autoFocus style={{ flex: 1, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "6px 12px", background: "#fff", color: PALETTE.espresso, fontSize: 14 }} />
          <button type="button" onClick={() => { setAddOpen(false); setNewLabel(""); }} style={{ background: "transparent", color: PALETTE.taupeDark, border: "1.5px solid rgba(45,31,21,.2)", borderRadius: 999, padding: "5px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>cancel</button>
          <button type="button" onClick={submitAdd} disabled={!newLabel.trim()} style={{ background: newLabel.trim() ? PALETTE.espresso : "rgba(45,31,21,.3)", color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 14px", fontWeight: 800, fontSize: 12, cursor: newLabel.trim() ? "pointer" : "not-allowed" }}>add</button>
        </div>
      ) : (
        <button type="button" onClick={() => setAddOpen(true)} style={{ marginTop: 10, width: "100%", background: "transparent", color: PALETTE.taupeDark, border: `2px dashed ${PALETTE.taupeDeep}`, borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: ".04em" }}>+ add topic</button>
      )}

      <div style={{ fontSize: 11, color: PALETTE.taupeDark, marginTop: 14, textAlign: "center" }}>winner gets picked on {dateLabel} after discussion</div>
    </div>
  );
}

// ---- ShelfRow / FocusWrap / DiscussionView / ReadersView -------------------

function shortMonthLabel(m: ArchivedMonth): string {
  // Prefer the user-set month name (e.g. "May 2026") so editing the discussion
  // date later doesn't change which month a card represents on the shelf.
  if (m.name && m.name.trim()) return m.name;
  const d = new Date(m.dateISO);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function ShelfRow({ months }: { months: ArchivedMonth[] | undefined }) {
  const list = months ?? [];
  // Newest first: API already returns DESC by num. Display oldest → newest so
  // the user reads the shelf left-to-right chronologically.
  const ordered = [...list].sort((a, b) => a.num - b.num);
  const finished = ordered.filter((m) => m.status === "archived").length;
  const inProgress = ordered.filter((m) => m.status === "current").length;
  const tbdCount = Math.max(0, 5 - ordered.length);

  return (
    <div style={{ background: PALETTE.taupeDeep, borderRadius: 20, padding: 22, color: PALETTE.cream }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(242,234,224,.6)", fontWeight: 800 }}>the shelf</div>
          <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.cream, marginTop: -2 }}>our reading history</div>
        </div>
        <span style={{ fontSize: 13, opacity: 0.8 }}>{finished} finished · {inProgress} in progress · ∞ to go</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        {ordered.map((m) => {
          const isCurrent = m.status === "current";
          return (
            <div
              key={m.id}
              style={{
                background: isCurrent ? PALETTE.cream : PALETTE.paper,
                color: PALETTE.espresso,
                borderRadius: 14,
                padding: 14,
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                boxShadow: isCurrent ? "0 6px 16px rgba(0,0,0,.18)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 800, color: PALETTE.taupeDark }}>{shortMonthLabel(m)}</div>
                {isCurrent && (
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: PALETTE.taupeDeep, background: "rgba(45,31,21,.08)", padding: "2px 6px", borderRadius: 999 }}>now</span>
                )}
              </div>
              <div className="pbc-display" style={{ fontSize: 22, color: PALETTE.espresso, lineHeight: 1, margin: "2px 0" }}>{m.topic}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                {m.books.map((b) => (
                  <div
                    key={b.id}
                    title={`${b.title}${b.author ? ` — ${b.author}` : ""}`}
                    style={{
                      flex: 1,
                      minHeight: 56,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${b.coverHue} 0%, ${b.coverHue} 60%, rgba(0,0,0,.2) 100%)`,
                      color: b.coverAccent,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "6px 8px",
                      boxShadow: "0 4px 10px rgba(45,31,21,.18)",
                    }}
                  >
                    <span style={{ fontSize: 18, opacity: 0.9 }}>{b.coverGlyph}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, lineHeight: 1.1, textTransform: "uppercase", letterSpacing: ".04em" }}>
                      {b.title.slice(0, 30)}
                    </span>
                  </div>
                ))}
              </div>
              {!isCurrent && m.winnerLabel && (
                <div style={{ fontSize: 11, color: PALETTE.midBrown, marginTop: "auto" }}>
                  voted next: <strong>{m.winnerLabel}</strong>
                </div>
              )}
            </div>
          );
        })}
        {Array.from({ length: tbdCount }).map((_, i) => (
          <div
            key={`tbd-${i}`}
            style={{
              background: "rgba(0,0,0,.18)",
              color: "rgba(242,234,224,.5)",
              borderRadius: 14,
              padding: 14,
              border: "2px dashed rgba(242,234,224,.25)",
              minHeight: 160,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="pbc-hand" style={{ fontSize: 22 }}>tbd</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FocusWrap({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div style={{ marginBottom: 22 }}>
        <div className="pbc-hand" style={{ fontSize: 22, color: PALETTE.taupeDeep }}>{eyebrow}</div>
        <h1 className="pbc-display" style={{ fontSize: 56, color: PALETTE.espresso, marginTop: -2, lineHeight: 0.95 }}>{title}</h1>
      </div>
      {children}
    </section>
  );
}

export function DiscussionView({
  days,
  month,
  prompts,
  onUpdateMonth,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
}: {
  days: number;
  month: AppMonth;
  prompts: AppPrompt[];
  onUpdateMonth: (patch: MonthUpdate) => void;
  onAddPrompt: (text: string) => void | Promise<unknown>;
  onUpdatePrompt: (id: string, text: string) => void | Promise<unknown>;
  onDeletePrompt: (id: string) => void | Promise<unknown>;
}) {
  const [editHero, setEditHero] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const updateDate = (value: string) => {
    if (!value) return;
    const d = new Date(value);
    onUpdateMonth({
      dateISO: d.toISOString(),
      dateLabel: formatDateLabel(d),
      timeLabel: formatTimeLabel(d),
    });
  };
  const submitPrompt = async () => {
    const v = newPrompt.trim();
    if (!v) return;
    await onAddPrompt(v);
    setNewPrompt("");
  };
  const beginEdit = (p: AppPrompt) => { setEditId(p.id); setDraft(p.text); };
  const commitEdit = async (p: AppPrompt) => {
    if (draft.trim() && draft !== p.text) await onUpdatePrompt(p.id, draft);
    setEditId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ background: PALETTE.espresso, borderRadius: 24, padding: 32, color: PALETTE.cream, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(212,165,116,.18)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <div className="pbc-hand" style={{ fontSize: 22, color: PALETTE.peach }}>discussion night</div>
          <button type="button" onClick={() => setEditHero((v) => !v)} style={{ background: "rgba(242,234,224,.12)", color: PALETTE.cream, border: "1.5px solid rgba(242,234,224,.18)", borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: ".05em" }}>
            {editHero ? "✓ done" : "✎ edit"}
          </button>
        </div>
        {editHero ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative", marginTop: 10, maxWidth: 420 }}>
            <input type="datetime-local" value={toDateTimeLocalValue(month.dateISO)} onChange={(e) => updateDate(e.target.value)} style={{ border: "1.5px solid rgba(242,234,224,.3)", borderRadius: 10, padding: "8px 12px", background: "rgba(0,0,0,.25)", color: PALETTE.cream, fontSize: 14, fontWeight: 700 }} />
            <input value={month.location} onChange={(e) => onUpdateMonth({ location: e.target.value })} placeholder="location" style={{ border: "1.5px solid rgba(242,234,224,.3)", borderRadius: 10, padding: "8px 12px", background: "rgba(0,0,0,.25)", color: PALETTE.cream, fontSize: 14 }} />
          </div>
        ) : (
          <>
            <div className="pbc-display" style={{ fontSize: 60, color: PALETTE.cream, lineHeight: 0.95, marginTop: 4, position: "relative" }}>{month.dateLabel}</div>
            <div style={{ fontSize: 18, color: PALETTE.peach, marginTop: 6, fontWeight: 600, position: "relative" }}>{month.timeLabel} · {month.location}</div>
          </>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 22, position: "relative", flexWrap: "wrap" }}>
          {["T-" + days + " days", "tea ready", "snacks tbd", "phones away"].map((chip, i) => (
            <span key={i} style={{ background: "rgba(242,234,224,.12)", color: PALETTE.cream, padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, border: "1.5px solid rgba(242,234,224,.18)" }}>{chip}</span>
          ))}
        </div>
      </div>

      <div style={{ background: PALETTE.cream, borderRadius: 20, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: PALETTE.taupeDark, fontWeight: 800 }}>discussion prompts</div>
            <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso, marginTop: -2 }}>things worth pulling on</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
          <input value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitPrompt()} placeholder="add a prompt…" style={{ flex: 1, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 10, padding: "8px 12px", background: "#fff", color: PALETTE.espresso, fontSize: 14 }} />
          <button type="button" onClick={submitPrompt} disabled={!newPrompt.trim()} style={{ background: newPrompt.trim() ? PALETTE.espresso : "rgba(45,31,21,.3)", color: PALETTE.cream, border: "none", borderRadius: 999, padding: "8px 16px", fontWeight: 800, fontSize: 13, cursor: newPrompt.trim() ? "pointer" : "not-allowed" }}>+ add prompt</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {prompts.map((p, i) => {
            const editing = editId === p.id;
            return (
              <div key={p.id} style={{ background: PALETTE.paper, borderRadius: 14, padding: "16px 18px", borderLeft: `4px solid ${PALETTE.peach}`, position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: PALETTE.taupeDark, fontWeight: 800 }}>prompt #{i + 1}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button type="button" onClick={() => editing ? commitEdit(p) : beginEdit(p)} title={editing ? "done" : "edit"} aria-label={editing ? "done editing" : "edit prompt"} style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 12, opacity: 0.6, padding: 2 }}>{editing ? "✓" : "✎"}</button>
                    <button type="button" onClick={() => onDeletePrompt(p.id)} title="delete prompt" aria-label="delete prompt" style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 14, opacity: 0.6, padding: 2, lineHeight: 1 }}>×</button>
                  </div>
                </div>
                {editing ? (
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus rows={3} style={{ width: "100%", fontSize: 14, color: PALETTE.midBrown, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 10, padding: "8px 10px", background: "#fff", resize: "vertical", fontFamily: "inherit" }} />
                ) : (
                  <div style={{ fontSize: 14, color: PALETTE.midBrown, lineHeight: 1.45 }}>{p.text}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ReadersView() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
      {readers.map((r) => (
        <div key={r.id} style={{ background: PALETTE.paper, borderRadius: 20, padding: 26, boxShadow: "0 12px 28px rgba(45,31,21,.14)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar reader={r} size={64} ring />
            <div>
              <div className="pbc-display" style={{ fontSize: 40, color: PALETTE.espresso, lineHeight: 0.95 }}>{r.name}</div>
              <div className="pbc-hand" style={{ fontSize: 18, color: PALETTE.taupeDeep, marginTop: 2 }}>{r.handle}</div>
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 14, background: PALETTE.creamSoft, fontSize: 14, color: PALETTE.midBrown, lineHeight: 1.5 }}>
            picks for <strong>{r.pickedFor}</strong>. trusts {r.pickedFor} to pick well right back.
          </div>
        </div>
      ))}
    </div>
  );
}
