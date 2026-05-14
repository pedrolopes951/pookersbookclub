"use client";
import { useEffect, useState } from "react";
import { PALETTE, readers } from "@/data/books";
import {
  api,
  formatDateLabel,
  formatTimeLabel,
  toDateTimeLocalValue,
  type AppMonth,
  type AppTopic,
} from "@/lib/state";

type BookForm = {
  title: string;
  subtitle: string;
  author: string;
  year: string;
  pages: string;
  coverGlyph: string;
};

const EMPTY_BOOK: BookForm = {
  title: "",
  subtitle: "",
  author: "",
  year: "",
  pages: "",
  coverGlyph: "📖",
};

function nextMonthDefaultISO(currentISO: string): string {
  const d = new Date(currentISO);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

function monthYearName(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ArchiveModal({
  open,
  onClose,
  month,
  topics,
}: {
  open: boolean;
  onClose: () => void;
  month: AppMonth;
  topics: AppTopic[];
}) {
  const winner = (() => {
    if (topics.length === 0) return null;
    let best: AppTopic | null = null;
    let bestVotes = -1;
    for (const t of topics) {
      const v = t.baseVotes + t.voters.length;
      if (v > bestVotes) {
        bestVotes = v;
        best = t;
      }
    }
    return best;
  })();

  const defaultDateISO = nextMonthDefaultISO(month.dateISO);
  const [name, setName] = useState<string>(monthYearName(defaultDateISO));
  const [topic, setTopic] = useState<string>(winner?.label ?? "");
  const [blurb, setBlurb] = useState<string>("");
  const [dateISO, setDateISO] = useState<string>(defaultDateISO);
  const [location, setLocation] = useState<string>(month.location);
  // books[0] = Pedro picked for Laura (readerId='l')
  // books[1] = Laura picked for Pedro (readerId='p')
  const [bookPedroForLaura, setBookPedroForLaura] = useState<BookForm>(EMPTY_BOOK);
  const [bookLauraForPedro, setBookLauraForPedro] = useState<BookForm>(EMPTY_BOOK);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when reopening on a different month
  useEffect(() => {
    if (!open) return;
    const def = nextMonthDefaultISO(month.dateISO);
    setName(monthYearName(def));
    setTopic(winner?.label ?? "");
    setBlurb("");
    setDateISO(def);
    setLocation(month.location);
    setBookPedroForLaura(EMPTY_BOOK);
    setBookLauraForPedro(EMPTY_BOOK);
    setError(null);
    setSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, month.id]);

  if (!open) return null;

  const canSubmit =
    topic.trim().length > 0 &&
    name.trim().length > 0 &&
    bookPedroForLaura.title.trim().length > 0 &&
    bookLauraForPedro.title.trim().length > 0;

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const d = new Date(dateISO);
      await api.archiveMonth({
        next: {
          name: name.trim(),
          topic: topic.trim(),
          topicShort: topic.trim(),
          blurb: blurb.trim(),
          dateISO: d.toISOString(),
          dateLabel: formatDateLabel(d),
          timeLabel: formatTimeLabel(d),
          location: location.trim(),
        },
        books: [
          {
            readerId: "l",
            pickerId: "p",
            title: bookPedroForLaura.title.trim(),
            subtitle: bookPedroForLaura.subtitle.trim(),
            author: bookPedroForLaura.author.trim(),
            year: bookPedroForLaura.year ? parseInt(bookPedroForLaura.year, 10) : null,
            pages: bookPedroForLaura.pages ? parseInt(bookPedroForLaura.pages, 10) : 0,
            coverGlyph: bookPedroForLaura.coverGlyph || "📖",
          },
          {
            readerId: "p",
            pickerId: "l",
            title: bookLauraForPedro.title.trim(),
            subtitle: bookLauraForPedro.subtitle.trim(),
            author: bookLauraForPedro.author.trim(),
            year: bookLauraForPedro.year ? parseInt(bookLauraForPedro.year, 10) : null,
            pages: bookLauraForPedro.pages ? parseInt(bookLauraForPedro.pages, 10) : 0,
            coverGlyph: bookLauraForPedro.coverGlyph || "📖",
          },
        ],
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  };

  const [Pedro, Laura] = readers;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(45,31,21,.55)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 20px",
        zIndex: 50,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: PALETTE.cream,
          borderRadius: 24,
          padding: 28,
          width: "min(720px, 100%)",
          boxShadow: "0 30px 60px rgba(0,0,0,.4)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div
              className="pbc-hand"
              style={{ fontSize: 22, color: PALETTE.taupeDeep }}
            >
              close the chapter
            </div>
            <h2
              className="pbc-display"
              style={{
                fontSize: 36,
                color: PALETTE.espresso,
                margin: "0 0 4px",
                lineHeight: 1,
              }}
            >
              Complete {month.name}
            </h2>
            <div style={{ fontSize: 13, color: PALETTE.taupeDark }}>
              {month.topic} → archives. Set up the next month below.
              {winner && (
                <>
                  {" "}Winning topic: <strong>{winner.label}</strong>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            style={{
              background: "transparent",
              border: "none",
              fontSize: 22,
              color: PALETTE.taupeDark,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <Section title="Next month">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Month name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="June 2026"
                style={inputStyle}
              />
            </Field>
            <Field label="Topic">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Architecture"
                style={inputStyle}
              />
            </Field>
            <Field label="Discussion date + time">
              <input
                type="datetime-local"
                value={toDateTimeLocalValue(dateISO)}
                onChange={(e) => setDateISO(new Date(e.target.value).toISOString())}
                style={inputStyle}
              />
            </Field>
            <Field label="Location">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Living room couch · two mugs of tea"
                style={inputStyle}
              />
            </Field>
          </div>
          <Field label="Blurb (optional)">
            <textarea
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              rows={2}
              placeholder="What's this month about?"
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          </Field>
        </Section>

        <Section title={`${Pedro.name}'s pick for ${Laura.name}`}>
          <BookFields value={bookPedroForLaura} onChange={setBookPedroForLaura} />
        </Section>
        <Section title={`${Laura.name}'s pick for ${Pedro.name}`}>
          <BookFields value={bookLauraForPedro} onChange={setBookLauraForPedro} />
        </Section>

        {error && (
          <div
            style={{
              background: "#fff5f0",
              border: "1.5px solid #C67F62",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#8a3a1a",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              background: "transparent",
              color: PALETTE.taupeDark,
              border: "1.5px solid rgba(45,31,21,.2)",
              borderRadius: 999,
              padding: "8px 18px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit || submitting}
            style={{
              background: canSubmit && !submitting ? PALETTE.espresso : "rgba(45,31,21,.3)",
              color: PALETTE.cream,
              border: "none",
              borderRadius: 999,
              padding: "8px 22px",
              fontWeight: 800,
              fontSize: 13,
              cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "archiving…" : "archive & start new month →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid rgba(45,31,21,.18)",
  borderRadius: 10,
  padding: "8px 12px",
  fontFamily: "inherit",
  fontSize: 14,
  background: "#fff",
  color: PALETTE.espresso,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: PALETTE.paper,
        borderRadius: 14,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          fontWeight: 800,
          color: PALETTE.taupeDark,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 10,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: PALETTE.taupeDark,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function BookFields({
  value,
  onChange,
}: {
  value: BookForm;
  onChange: (v: BookForm) => void;
}) {
  const set = (k: keyof BookForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <Field label="Title *">
        <input value={value.title} onChange={set("title")} placeholder="The Selfish Gene" style={inputStyle} />
      </Field>
      <Field label="Author">
        <input value={value.author} onChange={set("author")} placeholder="Richard Dawkins" style={inputStyle} />
      </Field>
      <Field label="Subtitle">
        <input value={value.subtitle} onChange={set("subtitle")} style={inputStyle} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <Field label="Year">
          <input value={value.year} onChange={set("year")} placeholder="1976" inputMode="numeric" style={inputStyle} />
        </Field>
        <Field label="Pages">
          <input value={value.pages} onChange={set("pages")} placeholder="360" inputMode="numeric" style={inputStyle} />
        </Field>
        <Field label="Glyph">
          <input value={value.coverGlyph} onChange={set("coverGlyph")} placeholder="🧬" style={{ ...inputStyle, textAlign: "center" }} />
        </Field>
      </div>
    </div>
  );
}
