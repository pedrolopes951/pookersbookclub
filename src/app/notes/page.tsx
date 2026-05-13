"use client";
import { FocusWrap, NotesPanel } from "@/lib/views";
import { api, useAppState } from "@/lib/state";

export default function NotesPage() {
  const { data } = useAppState();
  return (
    <FocusWrap title="Discussion Notebook" eyebrow="every page worth talking about">
      {data ? (
        <NotesPanel
          notes={data.notes}
          onAdd={(entry) => api.addNote(entry)}
          onDelete={(id) => api.deleteNote(id)}
        />
      ) : (
        <div className="pbc-hand" style={{ fontSize: 22, color: "#6F5A4A" }}>loading…</div>
      )}
    </FocusWrap>
  );
}
