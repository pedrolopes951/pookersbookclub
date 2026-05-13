"use client";
import { useState } from "react";
import type React from "react";
import Image from "next/image";
import {
  PALETTE,
  readers,
  shelfMonths,
  type Book,
  type Reader,
  type NoteEntry,
  type NextTopic,
} from "@/data/books";
import {
  type MonthState,
  type DiscussionState,
  formatDateLabel,
  formatTimeLabel,
  toDateTimeLocalValue,
} from "@/lib/state";

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
  book: Book;
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

export function PhotoHero() {
  return (
    <section
      style={{
        position: "relative",
        marginBottom: 40,
        padding: "32px 36px",
        background: PALETTE.cream,
        borderRadius: 28,
        boxShadow: "0 18px 40px rgba(45,31,21,.18)",
        display: "grid",
        gridTemplateColumns: "minmax(220px, 320px) 1fr",
        gap: 36,
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "14px 14px 56px",
          borderRadius: 6,
          transform: "rotate(-2.5deg)",
          boxShadow: "0 24px 50px rgba(45,31,21,.30), 0 0 0 1px rgba(45,31,21,.08)",
          position: "relative",
          justifySelf: "center",
          width: 280,
        }}
      >
        <div style={{ position: "relative", width: 252, height: 252, borderRadius: 3, overflow: "hidden" }}>
          <Image src="/bookclub.jpeg" alt="Pedro & Laura" fill sizes="280px" priority style={{ objectFit: "cover" }} />
        </div>
        <div className="pbc-hand" style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", fontSize: 26, color: PALETTE.espresso }}>the pooks ♡</div>
        <div style={{ position: "absolute", top: -10, left: "38%", width: 70, height: 22, background: "rgba(212,165,116,.7)", transform: "rotate(-6deg)", boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
      </div>

      <div>
        <div className="pbc-hand" style={{ fontSize: 26, color: PALETTE.taupeDeep, marginBottom: 2 }}>welcome to</div>
        <h1 className="pbc-display" style={{ fontSize: 96, color: PALETTE.espresso, lineHeight: 0.88, margin: 0 }}>
          Pookers<br />bookclub
        </h1>
        <div className="pbc-serif" style={{ fontSize: 18, fontStyle: "italic", color: PALETTE.midBrown, marginTop: 16, maxWidth: 480, lineHeight: 1.45 }}>
          a tiny book club for two. each month we agree on a topic. {readers[0].name} picks a book for {readers[1].name}.
          {" "}{readers[1].name} picks a book for {readers[0].name}. we read, we talk, we rate.
        </div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar reader={readers[0]} size={32} ring />
          <div style={{ marginLeft: -10 }}><Avatar reader={readers[1]} size={32} ring /></div>
          <div style={{ fontSize: 13, fontWeight: 700, color: PALETTE.taupeDark, letterSpacing: ".08em", textTransform: "uppercase" }}>
            {readers[0].name} &amp; {readers[1].name} · since May 2026
          </div>
        </div>
      </div>
    </section>
  );
}

export function CountdownTile({
  days,
  discState,
  setDiscState,
}: {
  days: number;
  discState: DiscussionState;
  setDiscState: React.Dispatch<React.SetStateAction<DiscussionState>>;
}) {
  const [editing, setEditing] = useState(false);
  const onDateChange = (value: string) => {
    if (!value) return;
    const d = new Date(value);
    setDiscState({
      ...discState,
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
            <input type="datetime-local" value={toDateTimeLocalValue(discState.dateISO)} onChange={(e) => onDateChange(e.target.value)} style={{ border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 8px", fontSize: 12, background: "#fff", color: PALETTE.espresso }} />
            <input value={discState.location} onChange={(e) => setDiscState({ ...discState, location: e.target.value })} placeholder="location" style={{ border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 8px", fontSize: 12, background: "#fff", color: PALETTE.espresso }} />
            <button type="button" onClick={() => setEditing(false)} style={{ marginTop: 2, background: PALETTE.espresso, color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 12px", fontWeight: 700, fontSize: 11, cursor: "pointer", alignSelf: "flex-start" }}>done</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: PALETTE.espresso, fontWeight: 700 }}>days · {discState.dateLabel}</div>
            <div style={{ fontSize: 12, color: PALETTE.midBrown }}>{discState.timeLabel}</div>
            <button type="button" onClick={() => setEditing(true)} style={{ marginTop: 6, background: PALETTE.espresso, color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 12px", fontFamily: "var(--font-body), sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer", letterSpacing: ".05em" }}>✎ edit date</button>
          </>
        )}
      </div>
    </div>
  );
}

export function MonthStrip({
  days,
  monthState,
  setMonthState,
  discState,
  setDiscState,
}: {
  days: number;
  monthState: MonthState;
  setMonthState: React.Dispatch<React.SetStateAction<MonthState>>;
  discState: DiscussionState;
  setDiscState: React.Dispatch<React.SetStateAction<DiscussionState>>;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, gap: 24, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 320 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: PALETTE.cream, padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: PALETTE.taupeDark, letterSpacing: ".1em", textTransform: "uppercase" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE.sage }} />
          Month {monthState.monthNum} · in progress
          <button type="button" onClick={() => setEditing((v) => !v)} style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 13, padding: 0, marginLeft: 4, opacity: 0.7 }} aria-label={editing ? "done editing" : "edit month"}>
            {editing ? "✓" : "✎"}
          </button>
        </div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, maxWidth: 580 }}>
            <input value={monthState.topic} onChange={(e) => setMonthState({ ...monthState, topic: e.target.value })} placeholder="month topic" style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 40, color: PALETTE.espresso, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 12, padding: "6px 12px", background: "#fff", lineHeight: 1 }} />
            <textarea value={monthState.blurb} onChange={(e) => setMonthState({ ...monthState, blurb: e.target.value })} rows={3} placeholder="what's this month about?" style={{ fontSize: 15, color: PALETTE.midBrown, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 12, padding: "8px 12px", background: "#fff", resize: "vertical", fontFamily: "inherit" }} />
          </div>
        ) : (
          <>
            <h1 className="pbc-display" style={{ fontSize: 64, color: PALETTE.espresso, margin: "12px 0 4px", lineHeight: 0.95 }}>{monthState.topic}.</h1>
            <div style={{ fontSize: 16, color: PALETTE.midBrown, maxWidth: 580 }}>{monthState.blurb}</div>
          </>
        )}
      </div>
      <CountdownTile days={days} discState={discState} setDiscState={setDiscState} />
    </div>
  );
}

export function BookPanel({
  reader,
  picker,
  book,
  onUpdate,
  accent,
}: {
  reader: Reader;
  picker: Reader;
  book: Book;
  onUpdate: (v: number) => void;
  accent: string;
}) {
  const pct = Math.round((book.current / book.pages) * 100);
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
            <Stat label="read" value={book.current} />
            <Stat label="notes" value={book.notes} />
          </div>
        </div>
        <ProgressRing pct={pct} color={accent} />
      </div>

      <div style={{ color: accent }}>
        <input type="range" min={0} max={book.pages} value={book.current} onChange={(e) => onUpdate(Number(e.target.value))} style={{ width: "100%", accentColor: accent, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: PALETTE.midBrown, marginTop: 2 }}>
          <span>p. {book.current}</span>
          <span>{book.pages - book.current} pages left · ~{Math.ceil((book.pages - book.current) / 30)} sittings</span>
          <span>p. {book.pages}</span>
        </div>
      </div>
    </div>
  );
}

export function NotesPanel({
  notes,
  setNotes,
}: {
  notes: NoteEntry[];
  setNotes: React.Dispatch<React.SetStateAction<NoteEntry[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [who, setWho] = useState<number>(0);
  const [page, setPage] = useState<string>("");
  const [text, setText] = useState<string>("");
  const reset = () => { setPage(""); setText(""); setOpen(false); };
  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const pg = Math.max(0, parseInt(page, 10) || 0);
    setNotes((prev) => [...prev, { who, page: pg, text: trimmed }]);
    reset();
  };
  const removeAt = (i: number) => setNotes((prev) => prev.filter((_, idx) => idx !== i));

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
        notes.map((n, i) => {
          const r = readers[n.who];
          return (
            <div key={i} style={{ background: PALETTE.paper, borderRadius: 14, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start", borderLeft: `4px solid ${r.color}` }}>
              <Avatar reader={r} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: PALETTE.espresso }}>{r.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: PALETTE.taupeDark, fontWeight: 700 }}>p. {n.page}</span>
                    <button type="button" onClick={() => removeAt(i)} aria-label="delete note" title="delete note" style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 2, opacity: 0.6 }}>×</button>
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
  setTopics,
  pedroVotes,
  lauraVotes,
  votingAs,
  setVotingAs,
  onVote,
  dateLabel,
  wide = false,
}: {
  topics: NextTopic[];
  setTopics: React.Dispatch<React.SetStateAction<NextTopic[]>>;
  pedroVotes: string[];
  lauraVotes: string[];
  votingAs: "p" | "l";
  setVotingAs: React.Dispatch<React.SetStateAction<"p" | "l">>;
  onVote: (id: string) => void;
  dateLabel: string;
  wide?: boolean;
}) {
  const [Pedro, Laura] = readers;
  const [editId, setEditId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmoji, setNewEmoji] = useState("✦");
  const [newLabel, setNewLabel] = useState("");

  const baseTotal = topics.reduce((s, t) => s + t.votes, 0);
  const extra = pedroVotes.length + lauraVotes.length;
  const liveTotal = baseTotal + extra || 1;

  const addTopic = () => {
    const label = newLabel.trim();
    if (!label) return;
    const id = "t" + Math.random().toString(36).slice(2, 8);
    setTopics((prev) => [...prev, { id, label, emoji: newEmoji.trim() || "✦", votes: 0 }]);
    setNewLabel("");
    setNewEmoji("✦");
    setAddOpen(false);
  };
  const removeTopic = (id: string) => setTopics((prev) => prev.filter((t) => t.id !== id));
  const updateTopic = (id: string, patch: Partial<NextTopic>) => setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

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
              const isMe = (r.id === "p" ? "p" : "l") === votingAs;
              const count = r.id === "p" ? pedroVotes.length : lauraVotes.length;
              return (
                <button key={r.id} onClick={() => setVotingAs(r.id === "p" ? "p" : "l")} style={{ display: "flex", alignItems: "center", gap: 6, background: isMe ? r.color : "transparent", color: isMe ? "#fff" : PALETTE.espresso, border: "none", borderRadius: 999, padding: "4px 12px 4px 4px", cursor: "pointer", fontFamily: "var(--font-body), sans-serif", fontWeight: 800, fontSize: 12, transition: "all .15s" }}>
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
          const pedroOn = pedroVotes.includes(t.id);
          const lauraOn = lauraVotes.includes(t.id);
          const liveVotes = t.votes + (pedroOn ? 1 : 0) + (lauraOn ? 1 : 0);
          const w = (liveVotes / liveTotal) * 100;
          const youVoted = votingAs === "p" ? pedroOn : lauraOn;
          const editing = editId === t.id;

          return (
            <div key={t.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: PALETTE.paper, border: `2px solid ${youVoted ? PALETTE.taupe : "transparent"}` }}>
              <div style={{ position: "absolute", inset: 0, width: `${w}%`, background: youVoted ? "rgba(164,135,113,.35)" : "rgba(164,135,113,.18)", transition: "width .25s" }} />
              {editing ? (
                <div style={{ position: "relative", display: "flex", gap: 8, alignItems: "center", padding: "8px 12px" }}>
                  <input value={t.emoji} onChange={(e) => updateTopic(t.id, { emoji: e.target.value })} style={{ width: 40, textAlign: "center", border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 6px", background: "#fff", color: PALETTE.espresso, fontSize: 14 }} />
                  <input value={t.label} onChange={(e) => updateTopic(t.id, { label: e.target.value })} autoFocus style={{ flex: 1, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "4px 10px", background: "#fff", color: PALETTE.espresso, fontSize: 14, fontWeight: 700 }} />
                  <button type="button" onClick={() => setEditId(null)} style={{ background: PALETTE.espresso, color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 12px", fontWeight: 800, fontSize: 11, cursor: "pointer" }}>done</button>
                </div>
              ) : (
                <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 14, gap: 10, padding: "10px 12px 10px 14px" }}>
                  <button type="button" onClick={() => onVote(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0, color: "inherit", font: "inherit", textAlign: "left" }}>
                    <span style={{ marginRight: 8 }}>{t.emoji}</span>{t.label}
                  </button>
                  <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {pedroOn && <VoteChip reader={Pedro} you={votingAs === "p"} />}
                    {lauraOn && <VoteChip reader={Laura} you={votingAs === "l"} />}
                    <span style={{ fontSize: 11, color: PALETTE.taupeDark, fontWeight: 700, opacity: 0.7, marginLeft: 4 }}>{liveVotes}</span>
                    <button type="button" onClick={() => setEditId(t.id)} aria-label="edit topic" title="edit" style={{ background: "transparent", border: "none", cursor: "pointer", color: PALETTE.taupeDark, fontSize: 13, padding: "2px 4px", opacity: 0.6 }}>✎</button>
                    <button type="button" onClick={() => removeTopic(t.id)} aria-label="delete topic" title="delete" style={{ background: "transparent", border: "none", cursor: "pointer", color: PALETTE.taupeDark, fontSize: 14, padding: "2px 4px", opacity: 0.6, lineHeight: 1 }}>×</button>
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
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTopic()} placeholder="new topic…" autoFocus style={{ flex: 1, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 8, padding: "6px 12px", background: "#fff", color: PALETTE.espresso, fontSize: 14 }} />
          <button type="button" onClick={() => { setAddOpen(false); setNewLabel(""); }} style={{ background: "transparent", color: PALETTE.taupeDark, border: "1.5px solid rgba(45,31,21,.2)", borderRadius: 999, padding: "5px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>cancel</button>
          <button type="button" onClick={addTopic} disabled={!newLabel.trim()} style={{ background: newLabel.trim() ? PALETTE.espresso : "rgba(45,31,21,.3)", color: PALETTE.cream, border: "none", borderRadius: 999, padding: "5px 14px", fontWeight: 800, fontSize: 12, cursor: newLabel.trim() ? "pointer" : "not-allowed" }}>add</button>
        </div>
      ) : (
        <button type="button" onClick={() => setAddOpen(true)} style={{ marginTop: 10, width: "100%", background: "transparent", color: PALETTE.taupeDark, border: `2px dashed ${PALETTE.taupeDeep}`, borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: ".04em" }}>+ add topic</button>
      )}

      <div style={{ fontSize: 11, color: PALETTE.taupeDark, marginTop: 14, textAlign: "center" }}>winner gets picked on {dateLabel} after discussion</div>
    </div>
  );
}

export function ShelfRow() {
  return (
    <div style={{ background: PALETTE.taupeDeep, borderRadius: 20, padding: 22, color: PALETTE.cream }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(242,234,224,.6)", fontWeight: 800 }}>the shelf</div>
          <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.cream, marginTop: -2 }}>our reading history</div>
        </div>
        <span style={{ fontSize: 13, opacity: 0.8 }}>0 finished · 1 in progress · ∞ to go</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {shelfMonths.map((m, i) => (
          <div key={i} style={{ background: m.filled === "current" ? PALETTE.cream : "rgba(0,0,0,.18)", color: m.filled === "current" ? PALETTE.espresso : "rgba(242,234,224,.5)", borderRadius: 14, padding: 14, border: m.filled ? "none" : "2px dashed rgba(242,234,224,.25)", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 800, opacity: 0.8 }}>{m.label}</div>
            {m.filled === "current" ? (
              <>
                <div className="pbc-display" style={{ fontSize: 20, marginTop: 8, color: PALETTE.espresso }}>{m.topic}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: PALETTE.midBrown }}>currently reading</div>
              </>
            ) : (
              <div className="pbc-hand" style={{ fontSize: 20, marginTop: 12 }}>tbd</div>
            )}
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
  discState,
  setDiscState,
  discPrompts,
  setDiscPrompts,
}: {
  days: number;
  discState: DiscussionState;
  setDiscState: React.Dispatch<React.SetStateAction<DiscussionState>>;
  discPrompts: string[];
  setDiscPrompts: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [editHero, setEditHero] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const updateDate = (value: string) => {
    if (!value) return;
    const d = new Date(value);
    setDiscState({ ...discState, dateISO: d.toISOString(), dateLabel: formatDateLabel(d), timeLabel: formatTimeLabel(d) });
  };
  const addPrompt = () => {
    const v = newPrompt.trim();
    if (!v) return;
    setDiscPrompts((prev) => [...prev, v]);
    setNewPrompt("");
  };
  const updatePrompt = (i: number, v: string) => setDiscPrompts((prev) => prev.map((p, idx) => (idx === i ? v : p)));
  const removePrompt = (i: number) => setDiscPrompts((prev) => prev.filter((_, idx) => idx !== i));

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
            <input type="datetime-local" value={toDateTimeLocalValue(discState.dateISO)} onChange={(e) => updateDate(e.target.value)} style={{ border: "1.5px solid rgba(242,234,224,.3)", borderRadius: 10, padding: "8px 12px", background: "rgba(0,0,0,.25)", color: PALETTE.cream, fontSize: 14, fontWeight: 700 }} />
            <input value={discState.location} onChange={(e) => setDiscState({ ...discState, location: e.target.value })} placeholder="location" style={{ border: "1.5px solid rgba(242,234,224,.3)", borderRadius: 10, padding: "8px 12px", background: "rgba(0,0,0,.25)", color: PALETTE.cream, fontSize: 14 }} />
          </div>
        ) : (
          <>
            <div className="pbc-display" style={{ fontSize: 60, color: PALETTE.cream, lineHeight: 0.95, marginTop: 4, position: "relative" }}>{discState.dateLabel}</div>
            <div style={{ fontSize: 18, color: PALETTE.peach, marginTop: 6, fontWeight: 600, position: "relative" }}>{discState.timeLabel} · {discState.location}</div>
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
          <input value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPrompt()} placeholder="add a prompt…" style={{ flex: 1, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 10, padding: "8px 12px", background: "#fff", color: PALETTE.espresso, fontSize: 14 }} />
          <button type="button" onClick={addPrompt} disabled={!newPrompt.trim()} style={{ background: newPrompt.trim() ? PALETTE.espresso : "rgba(45,31,21,.3)", color: PALETTE.cream, border: "none", borderRadius: 999, padding: "8px 16px", fontWeight: 800, fontSize: 13, cursor: newPrompt.trim() ? "pointer" : "not-allowed" }}>+ add prompt</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {discPrompts.map((q, i) => {
            const editing = editIdx === i;
            return (
              <div key={i} style={{ background: PALETTE.paper, borderRadius: 14, padding: "16px 18px", borderLeft: `4px solid ${PALETTE.peach}`, position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: PALETTE.taupeDark, fontWeight: 800 }}>prompt #{i + 1}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button type="button" onClick={() => setEditIdx(editing ? null : i)} title={editing ? "done" : "edit"} aria-label={editing ? "done editing" : "edit prompt"} style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 12, opacity: 0.6, padding: 2 }}>{editing ? "✓" : "✎"}</button>
                    <button type="button" onClick={() => removePrompt(i)} title="delete prompt" aria-label="delete prompt" style={{ background: "transparent", border: "none", color: PALETTE.taupeDark, cursor: "pointer", fontSize: 14, opacity: 0.6, padding: 2, lineHeight: 1 }}>×</button>
                  </div>
                </div>
                {editing ? (
                  <textarea value={q} onChange={(e) => updatePrompt(i, e.target.value)} autoFocus rows={3} style={{ width: "100%", fontSize: 14, color: PALETTE.midBrown, border: "1.5px solid rgba(45,31,21,.18)", borderRadius: 10, padding: "8px 10px", background: "#fff", resize: "vertical", fontFamily: "inherit" }} />
                ) : (
                  <div style={{ fontSize: 14, color: PALETTE.midBrown, lineHeight: 1.45 }}>{q}</div>
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
