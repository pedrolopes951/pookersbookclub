"use client";
import { useState } from "react";
import { readers, PALETTE } from "@/data/books";
import {
  MonthStrip,
  BookPanel,
  NotesPanel,
  VotePanel,
  ShelfRow,
} from "@/lib/views";
import {
  api,
  daysUntil,
  useAppState,
  useArchives,
  useVotingAs,
} from "@/lib/state";
import ArchiveModal from "@/components/archive-modal";

export default function NowPage() {
  const { data } = useAppState();
  const { months: archives } = useArchives();
  const [votingAs, setVotingAs] = useVotingAs();
  const [archiveOpen, setArchiveOpen] = useState(false);

  if (!data) return <Loading />;

  const { month, books, notes, topics } = data;
  const [Pedro, Laura] = readers;
  const bookForLaura = books.find((b) => b.readerId === "l");
  const bookForPedro = books.find((b) => b.readerId === "p");
  const notesByReader = notes.reduce<{ a: number; b: number }>(
    (acc, n) => {
      if (n.who === 0) acc.b += 1;
      else acc.a += 1;
      return acc;
    },
    { a: 0, b: 0 }
  );
  const days = daysUntil(new Date(month.dateISO));

  return (
    <>
      <MonthStrip days={days} month={month} onUpdate={(p) => api.updateMonth(p)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 28 }}>
        {bookForLaura && (
          <BookPanel
            reader={Laura}
            picker={Pedro}
            book={bookForLaura}
            notesCount={notesByReader.a}
            onUpdate={(cp) => api.updateBookProgress(bookForLaura.id, cp)}
            accent={Pedro.color}
          />
        )}
        {bookForPedro && (
          <BookPanel
            reader={Pedro}
            picker={Laura}
            book={bookForPedro}
            notesCount={notesByReader.b}
            onUpdate={(cp) => api.updateBookProgress(bookForPedro.id, cp)}
            accent={Laura.color}
          />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, marginBottom: 28 }}>
        <NotesPanel
          notes={notes}
          books={books}
          onAdd={(entry) => api.addNote(entry)}
          onDelete={(id) => api.deleteNote(id)}
        />
        <VotePanel
          topics={topics}
          votingAs={votingAs}
          setVotingAs={setVotingAs}
          onToggle={(id) => api.toggleVote(id, votingAs)}
          onAddTopic={(b) => api.addTopic(b)}
          onUpdateTopic={(id, patch) => api.updateTopic(id, patch)}
          onDeleteTopic={(id) => api.deleteTopic(id)}
          dateLabel={month.dateLabel}
        />
      </div>

      <ShelfRow months={archives} />

      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <button
          type="button"
          onClick={() => setArchiveOpen(true)}
          style={{
            background: PALETTE.espresso,
            color: PALETTE.cream,
            border: "none",
            borderRadius: 999,
            padding: "12px 26px",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            letterSpacing: ".04em",
            boxShadow: "0 10px 24px rgba(45,31,21,.22)",
          }}
        >
          ✓ complete {month.name} → start next month
        </button>
      </div>

      <ArchiveModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        month={month}
        topics={topics}
      />
    </>
  );
}

function Loading() {
  return (
    <div style={{ padding: 40, color: "#6F5A4A" }}>
      <div className="pbc-hand" style={{ fontSize: 22 }}>fetching the shelf…</div>
    </div>
  );
}
